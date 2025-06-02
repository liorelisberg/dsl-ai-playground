/**
 * Session Manager Service
 * Handles session lifecycle, persistence, and validation for AI chat
 */

export interface SessionState {
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  conversationCount: number;
  isActive: boolean;
  metadata?: {
    userAgent?: string;
    timezone?: string;
    initialUrl?: string;
  };
}

export interface SessionConfig {
  ttl: number; // Time to live in milliseconds
  maxInactivity: number; // Max inactivity before session expires
  storageKey: string;
  autoCleanup: boolean;
}

const DEFAULT_CONFIG: SessionConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxInactivity: 2 * 60 * 60 * 1000, // 2 hours
  storageKey: 'dsl_ai_session',
  autoCleanup: true
};

/**
 * Singleton Session Manager
 * Provides session management with localStorage persistence
 */
export class SessionManager {
  private static instance: SessionManager | null = null;
  private sessionState: SessionState | null = null;
  private config: SessionConfig;
  private activityTimer: NodeJS.Timeout | null = null;

  private constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeSession();
    this.setupActivityTracking();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<SessionConfig>): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }

  /**
   * Get current session or create new one
   */
  public getOrCreateSession(): SessionState {
    if (!this.sessionState || !this.isSessionValid()) {
      this.createNewSession();
    }
    
    this.updateActivity();
    return this.sessionState!;
  }

  /**
   * Get current session ID
   */
  public getSessionId(): string {
    return this.getOrCreateSession().sessionId;
  }

  /**
   * Update session activity
   */
  public updateActivity(): void {
    if (this.sessionState) {
      this.sessionState.lastActivity = Date.now();
      this.sessionState.conversationCount += 1;
      this.saveToStorage();
    }
  }

  /**
   * Clear current session
   */
  public clearSession(): void {
    this.sessionState = null;
    this.removeFromStorage();
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Check if current session is valid
   */
  public isSessionValid(): boolean {
    if (!this.sessionState) return false;

    const now = Date.now();
    const age = now - this.sessionState.createdAt;
    const inactive = now - this.sessionState.lastActivity;

    return (
      this.sessionState.isActive &&
      age < this.config.ttl &&
      inactive < this.config.maxInactivity
    );
  }

  /**
   * Get session metrics
   */
  public getSessionMetrics(): {
    age: number;
    inactivity: number;
    conversationCount: number;
    isValid: boolean;
  } {
    if (!this.sessionState) {
      return {
        age: 0,
        inactivity: 0,
        conversationCount: 0,
        isValid: false
      };
    }

    const now = Date.now();
    return {
      age: now - this.sessionState.createdAt,
      inactivity: now - this.sessionState.lastActivity,
      conversationCount: this.sessionState.conversationCount,
      isValid: this.isSessionValid()
    };
  }

  /**
   * Initialize session from storage or create new
   */
  private initializeSession(): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const parsedSession: SessionState = JSON.parse(stored);
        
        // Validate stored session
        if (this.isStoredSessionValid(parsedSession)) {
          this.sessionState = parsedSession;
          console.log(`🔄 Restored session: ${parsedSession.sessionId}`);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to restore session from storage:', error);
    }

    // Create new session if none exists or invalid
    this.createNewSession();
  }

  /**
   * Create a new session
   */
  private createNewSession(): void {
    const sessionId = this.generateSessionId();
    const now = Date.now();

    this.sessionState = {
      sessionId,
      createdAt: now,
      lastActivity: now,
      conversationCount: 0,
      isActive: true,
      metadata: {
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        initialUrl: window.location.href
      }
    };

    this.saveToStorage();
    console.log(`🆕 Created new session: ${sessionId}`);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const userHash = this.getUserHash();
    return `dsl_${timestamp}_${userHash}_${random}`;
  }

  /**
   * Get user hash for session uniqueness
   */
  private getUserHash(): string {
    const userString = navigator.userAgent + navigator.language;
    let hash = 0;
    for (let i = 0; i < userString.length; i++) {
      const char = userString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  }

  /**
   * Validate stored session
   */
  private isStoredSessionValid(session: SessionState): boolean {
    const now = Date.now();
    const age = now - session.createdAt;
    const inactive = now - session.lastActivity;

    return (
      session.sessionId &&
      session.isActive &&
      age < this.config.ttl &&
      inactive < this.config.maxInactivity
    );
  }

  /**
   * Save session to localStorage
   */
  private saveToStorage(): void {
    try {
      if (this.sessionState) {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.sessionState));
      }
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  }

  /**
   * Remove session from localStorage
   */
  private removeFromStorage(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('Failed to remove session from storage:', error);
    }
  }

  /**
   * Setup automatic activity tracking and cleanup
   */
  private setupActivityTracking(): void {
    if (this.config.autoCleanup) {
      // Check session validity every 5 minutes
      this.activityTimer = setInterval(() => {
        if (!this.isSessionValid()) {
          console.log('🧹 Session expired, cleaning up...');
          this.clearSession();
        }
      }, 5 * 60 * 1000);
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.sessionState) {
        this.updateActivity();
      }
    });

    // Track beforeunload for final activity update
    window.addEventListener('beforeunload', () => {
      if (this.sessionState) {
        this.updateActivity();
      }
    });
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

// Export utility functions
export const getSessionId = (): string => sessionManager.getSessionId();
export const updateSessionActivity = (): void => sessionManager.updateActivity();
export const clearSession = (): void => sessionManager.clearSession();
export const getSessionMetrics = () => sessionManager.getSessionMetrics(); 