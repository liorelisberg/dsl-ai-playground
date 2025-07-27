import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResponse {
  text: string;
  model: string;
  wasFallback: boolean;
}

export interface FallbackMetrics {
  count: number;
  sessions: Set<string>;
  lastError?: string;
  lastFallbackTime?: number;
}

export class ResilientGeminiService {
  private gemini20Flash: GenerativeModel;
  private gemini15Flash: GenerativeModel;
  private fallbackMetrics: FallbackMetrics = { count: 0, sessions: new Set() };

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Primary model: Gemini 2.0 Flash
    this.gemini20Flash = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    // Fallback model: Gemini 1.5 Flash
    this.gemini15Flash = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Generate content with automatic fallback to Gemini 1.5 Flash
   */
  async generateContentWithFallback(
    prompt: string, 
    sessionId: string
  ): Promise<GeminiResponse> {
    try {
      // Primary: Gemini 2.0 Flash
      console.log(`🚀 Using Gemini 2.0 Flash for session ${sessionId}`);
      const result = await this.gemini20Flash.generateContent(prompt);
      return { 
        text: result.response.text(), 
        model: 'gemini-2.0-flash', 
        wasFallback: false 
      };
    } catch (error) {
      // Check if fallback is appropriate
      if (this.shouldFallback(error)) {
        console.log(`🔄 Falling back to Gemini 1.5 Flash for session ${sessionId}: ${this.getErrorMessage(error)}`);
        
        try {
          const fallbackResult = await this.gemini15Flash.generateContent(prompt);
          this.trackFallback(sessionId, error);
          
          return { 
            text: fallbackResult.response.text(), 
            model: 'gemini-1.5-flash', 
            wasFallback: true 
          };
        } catch (fallbackError) {
          console.error('❌ Both models failed:', { 
            primary: this.getErrorMessage(error), 
            fallback: this.getErrorMessage(fallbackError) 
          });
          throw new Error('All AI models temporarily unavailable. Please try again in a moment.');
        }
      }
      
      // Re-throw if not fallback-appropriate
      throw error;
    }
  }

  /**
   * Determine if error is appropriate for fallback
   */
  private shouldFallback(error: unknown): boolean {
    const errorObj = error as { status?: number; message?: string };
    return errorObj.status === 503 ||  // Service Unavailable
           errorObj.status === 429 ||  // Too Many Requests
           errorObj.status === 500 ||  // Internal Server Error
           (errorObj.message?.includes('overloaded') ?? false) ||
           (errorObj.message?.includes('capacity') ?? false) ||
           (errorObj.message?.includes('quota') ?? false) ||
           (errorObj.message?.includes('rate limit') ?? false);
  }

  /**
   * Track fallback events for analytics
   */
  private trackFallback(sessionId: string, error: unknown): void {
    this.fallbackMetrics.count++;
    this.fallbackMetrics.sessions.add(sessionId);
    this.fallbackMetrics.lastError = this.getErrorMessage(error);
    this.fallbackMetrics.lastFallbackTime = Date.now();
    
    console.log(`📊 Fallback metrics: ${this.fallbackMetrics.count} events, ${this.fallbackMetrics.sessions.size} unique sessions`);
  }

  /**
   * Get fallback metrics for monitoring
   */
  getFallbackMetrics(): FallbackMetrics {
    return {
      count: this.fallbackMetrics.count,
      sessions: new Set(this.fallbackMetrics.sessions), // Copy to prevent mutation
      lastError: this.fallbackMetrics.lastError,
      lastFallbackTime: this.fallbackMetrics.lastFallbackTime
    };
  }

  /**
   * Reset fallback metrics (for testing/monitoring)
   */
  resetFallbackMetrics(): void {
    this.fallbackMetrics = { count: 0, sessions: new Set() };
  }

  /**
   * Extract readable error message from error object
   */
  private getErrorMessage(error: unknown): string {
    const errorObj = error as { message?: string; statusText?: string; status?: number };
    if (errorObj.message) return errorObj.message;
    if (errorObj.statusText) return errorObj.statusText;
    if (errorObj.status) return `HTTP ${errorObj.status}`;
    return String(error);
  }
} 