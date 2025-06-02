import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { sessionManager, SessionState, getSessionMetrics } from '../services/sessionManager';
import { chatService } from '../services/chatService';

/**
 * Session Context Interface
 */
interface SessionContextType {
  // Session State
  sessionId: string | null;
  sessionState: SessionState | null;
  isSessionValid: boolean;
  
  // Session Metrics
  sessionMetrics: {
    age: number;
    inactivity: number;
    conversationCount: number;
    isValid: boolean;
  };
  
  // Session Controls
  refreshSession: () => void;
  clearSession: () => void;
  updateActivity: () => void;
  
  // Session Status
  isLoading: boolean;
  lastError: string | null;
}

/**
 * Default context value
 */
const defaultContextValue: SessionContextType = {
  sessionId: null,
  sessionState: null,
  isSessionValid: false,
  sessionMetrics: {
    age: 0,
    inactivity: 0,
    conversationCount: 0,
    isValid: false
  },
  refreshSession: () => {},
  clearSession: () => {},
  updateActivity: () => {},
  isLoading: true,
  lastError: null
};

/**
 * Session Context
 */
const SessionContext = createContext<SessionContextType>(defaultContextValue);

/**
 * Session Provider Props
 */
interface SessionProviderProps {
  children: ReactNode;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Session Provider Component
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  /**
   * Refresh session state
   */
  const refreshSession = useCallback(() => {
    try {
      setLastError(null);
      const currentSession = sessionManager.getOrCreateSession();
      setSessionState(currentSession);
      
      console.log(`🔄 Session refreshed: ${currentSession.sessionId}`);
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setLastError(error instanceof Error ? error.message : 'Failed to refresh session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear current session
   */
  const clearSession = useCallback(() => {
    try {
      setLastError(null);
      sessionManager.clearSession();
      chatService.clearSession();
      setSessionState(null);
      
      // Create new session immediately
      const newSession = sessionManager.getOrCreateSession();
      setSessionState(newSession);
      
      console.log(`🧹 Session cleared, new session: ${newSession.sessionId}`);
    } catch (error) {
      console.error('Failed to clear session:', error);
      setLastError(error instanceof Error ? error.message : 'Failed to clear session');
    }
  }, []);

  /**
   * Update session activity
   */
  const updateActivity = useCallback(() => {
    try {
      sessionManager.updateActivity();
      // Refresh state to reflect activity update
      const currentSession = sessionManager.getOrCreateSession();
      setSessionState(currentSession);
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  }, []);

  /**
   * Initialize session on mount
   */
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  /**
   * Auto-refresh session state
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      try {
        const metrics = getSessionMetrics();
        if (!metrics.isValid) {
          console.log('🔄 Session expired, creating new session...');
          refreshSession();
        } else {
          // Just update metrics without full refresh
          const currentSession = sessionManager.getOrCreateSession();
          setSessionState(currentSession);
        }
      } catch (error) {
        console.error('Session auto-refresh error:', error);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshSession]);

  /**
   * Handle page visibility changes
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && sessionState) {
        updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionState, updateActivity]);

  /**
   * Context value
   */
  const contextValue: SessionContextType = {
    // Session State
    sessionId: sessionState?.sessionId || null,
    sessionState,
    isSessionValid: sessionState ? sessionManager.isSessionValid() : false,
    
    // Session Metrics
    sessionMetrics: sessionState ? getSessionMetrics() : defaultContextValue.sessionMetrics,
    
    // Session Controls
    refreshSession,
    clearSession,
    updateActivity,
    
    // Session Status
    isLoading,
    lastError
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Hook to use session context
 */
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  
  if (context === defaultContextValue) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
};

/**
 * Hook for session ID only (lightweight)
 */
export const useSessionId = (): string | null => {
  const { sessionId } = useSession();
  return sessionId;
};

/**
 * Hook for session controls only
 */
export const useSessionControls = () => {
  const { refreshSession, clearSession, updateActivity } = useSession();
  return { refreshSession, clearSession, updateActivity };
}; 