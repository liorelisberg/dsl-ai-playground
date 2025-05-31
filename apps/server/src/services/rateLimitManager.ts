export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  minRequestInterval: number; // milliseconds
  maxRetries: number;
  backoffMultiplier: number;
  highTokenThreshold: number;
  globalRateLimit: number; // requests per minute globally
}

export interface RateLimitContext {
  tokens: number;
  isRetry?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export interface RequestHistoryEntry {
  timestamp: number;
  tokens: number;
  success: boolean;
}

export class IntelligentRateLimitManager {
  private requestHistory = new Map<string, RequestHistoryEntry[]>(); // sessionId -> history
  private globalRequestQueue: Array<{ 
    resolve: () => void; 
    reject: (reason?: unknown) => void; 
    timestamp: number;
    sessionId: string;
  }> = [];
  private isProcessingQueue = false;
  private globalRequestHistory: RequestHistoryEntry[] = [];
  private queuedRequests: Map<string, {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
    priority: number;
    tokens: number;
  }[]> = new Map();

  private readonly config: RateLimitConfig = {
    maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '10'),
    minRequestInterval: parseInt(process.env.MIN_REQUEST_INTERVAL || '2000'), // 2 seconds
    maxRetries: parseInt(process.env.MAX_API_RETRIES || '3'),
    backoffMultiplier: parseFloat(process.env.BACKOFF_MULTIPLIER || '2.0'),
    highTokenThreshold: parseInt(process.env.HIGH_TOKEN_THRESHOLD || '3000'),
    globalRateLimit: parseInt(process.env.GLOBAL_RATE_LIMIT || '50') // 50 req/min globally
  };

  /**
   * Execute operation with intelligent rate limiting
   */
  async executeWithRateLimit<T>(
    operation: () => Promise<T>,
    sessionId: string,
    context: RateLimitContext
  ): Promise<T> {
    // Check session-specific rate limits
    await this.enforceSessionRateLimit(sessionId, context);
    
    // Check global rate limits for high-token requests
    if (context.tokens > this.config.highTokenThreshold) {
      await this.enforceGlobalRateLimit(sessionId);
    }

    // Execute with exponential backoff
    return this.executeWithBackoff(operation, sessionId, context, 0);
  }

  /**
   * Enforce per-session rate limiting
   */
  private async enforceSessionRateLimit(sessionId: string, context: RateLimitContext): Promise<void> {
    const now = Date.now();
    const sessionHistory = this.requestHistory.get(sessionId) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = sessionHistory.filter(entry => now - entry.timestamp < 60000);
    
    // Check request count limit
    if (recentRequests.length >= this.config.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...recentRequests.map(r => r.timestamp));
      const waitTime = 60000 - (now - oldestRequest) + 1000; // +1s buffer
      
      console.log(`⏳ Session rate limit for ${sessionId}: waiting ${waitTime}ms`);
      await this.delay(waitTime);
    }

    // Check minimum interval for high-token requests
    if (context.tokens > this.config.highTokenThreshold && recentRequests.length > 0) {
      const lastRequest = Math.max(...recentRequests.map(r => r.timestamp));
      const timeSinceLastRequest = now - lastRequest;
      
      if (timeSinceLastRequest < this.config.minRequestInterval) {
        const waitTime = this.config.minRequestInterval - timeSinceLastRequest;
        console.log(`⏳ Token-based interval for ${sessionId}: waiting ${waitTime}ms`);
        await this.delay(waitTime);
      }
    }

    // Update history
    recentRequests.push({
      timestamp: Date.now(),
      tokens: context.tokens,
      success: true // Will be updated later if it fails
    });
    this.requestHistory.set(sessionId, recentRequests);
  }

  /**
   * Enforce global rate limiting for high-load scenarios
   */
  private async enforceGlobalRateLimit(sessionId: string): Promise<void> {
    const now = Date.now();
    
    // Clean old entries
    this.globalRequestHistory = this.globalRequestHistory.filter(
      entry => now - entry.timestamp < 60000
    );

    if (this.globalRequestHistory.length >= this.config.globalRateLimit) {
      return new Promise((resolve, reject) => {
        this.globalRequestQueue.push({ resolve, reject, timestamp: now, sessionId });
        this.processGlobalQueue();
      });
    }

    this.globalRequestHistory.push({
      timestamp: now,
      tokens: 0, // Will be filled later
      success: true
    });
  }

  /**
   * Process global request queue
   */
  private async processGlobalQueue(): Promise<void> {
    if (this.isProcessingQueue || this.globalRequestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.globalRequestQueue.length > 0) {
      const now = Date.now();
      
      // Clean old entries
      this.globalRequestHistory = this.globalRequestHistory.filter(
        entry => now - entry.timestamp < 60000
      );

      if (this.globalRequestHistory.length < this.config.globalRateLimit) {
        const { resolve, sessionId } = this.globalRequestQueue.shift()!;
        
        this.globalRequestHistory.push({
          timestamp: now,
          tokens: 0,
          success: true
        });

        console.log(`✅ Processing queued request for session ${sessionId}`);
        resolve();
      } else {
        // Wait before checking again
        await this.delay(1000);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Execute operation with exponential backoff
   */
  private async executeWithBackoff<T>(
    operation: () => Promise<T>,
    sessionId: string,
    context: RateLimitContext,
    retryCount: number
  ): Promise<T> {
    try {
      const result = await operation();
      
      // Mark as successful in history
      this.markRequestSuccess(sessionId, true);
      return result;
      
    } catch (error) {
      // Mark as failed in history
      this.markRequestSuccess(sessionId, false);

      if (retryCount >= this.config.maxRetries) {
        console.error(`❌ Max retries (${this.config.maxRetries}) exceeded for session ${sessionId}`);
        throw error;
      }

      if (this.isRetryableError(error)) {
        const backoffTime = Math.pow(this.config.backoffMultiplier, retryCount) * 1000;
        const jitter = Math.random() * 500; // Add jitter to prevent thundering herd
        const totalWaitTime = backoffTime + jitter;
        
        console.log(`🔄 Retrying in ${Math.round(totalWaitTime)}ms (attempt ${retryCount + 1}/${this.config.maxRetries}) for session ${sessionId}`);
        
        await this.delay(totalWaitTime);
        return this.executeWithBackoff(operation, sessionId, context, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Mark request as successful/failed in session history
   */
  private markRequestSuccess(sessionId: string, success: boolean): void {
    const sessionHistory = this.requestHistory.get(sessionId) || [];
    if (sessionHistory.length > 0) {
      sessionHistory[sessionHistory.length - 1].success = success;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    // Check for common retryable HTTP status codes
    const retryableStatuses = [429, 502, 503, 504];
    const statusCode = (error as { status?: number; code?: number })?.status || 
                      (error as { status?: number; code?: number })?.code;
    
    if (statusCode && retryableStatuses.includes(statusCode)) {
      return true;
    }

    // Check for timeout errors
    const message = (error as Error)?.message?.toLowerCase() || '';
    if (message.includes('timeout') || 
        message.includes('network') || 
        message.includes('connection')) {
      return true;
    }

    return false;
  }

  /**
   * Get rate limiting statistics for monitoring
   */
  getStatistics(): {
    activeSessions: number;
    queueLength: number;
    recentErrors: number;
    avgSuccessRate: number;
  } {
    const now = Date.now();
    let totalRequests = 0;
    let successfulRequests = 0;

    for (const [sessionId, history] of this.requestHistory.entries()) {
      const recentHistory = history.filter(entry => now - entry.timestamp < 300000); // 5 minutes
      totalRequests += recentHistory.length;
      successfulRequests += recentHistory.filter(entry => entry.success).length;
    }

    return {
      activeSessions: this.requestHistory.size,
      queueLength: this.globalRequestQueue.length,
      recentErrors: totalRequests - successfulRequests,
      avgSuccessRate: totalRequests > 0 ? successfulRequests / totalRequests : 1.0
    };
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up old session data
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour
    
    for (const [sessionId, history] of this.requestHistory.entries()) {
      const recentHistory = history.filter(entry => now - entry.timestamp < maxAge);
      if (recentHistory.length === 0) {
        this.requestHistory.delete(sessionId);
      } else {
        this.requestHistory.set(sessionId, recentHistory);
      }
    }
  }
} 