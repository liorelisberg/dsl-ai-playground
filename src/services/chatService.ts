import { ChatMessage, ChatResponse, ChatRequest, ApiError } from '../types/chat';
import { httpClient } from './httpClient';
import { API_CONFIG } from '../config/api';
import { sessionManager, updateSessionActivity } from './sessionManager';

export class ChatService {
  private retryAttempts = API_CONFIG.RETRY_ATTEMPTS;

  async sendChatMessage(
    message: string, 
    chatHistory: ChatMessage[],
    options: {
      maxTokens?: number;
      jsonContext?: unknown;
      sessionId?: string; // Optional override
    } = {}
  ): Promise<ChatResponse> {
    // Get or create session ID
    const sessionId = options.sessionId || sessionManager.getSessionId();
    
    // Track session activity
    updateSessionActivity();

    const request: ChatRequest = { 
      message,
      sessionId,
      maxTokens: options.maxTokens,
      jsonContext: options.jsonContext
    };

    console.log(`📤 Sending chat message with session: ${sessionId}`);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await httpClient.request<ChatResponse>(
          API_CONFIG.ENDPOINTS.CHAT,
          {
            method: 'POST',
            body: request
          }
        );

        // Validate session consistency
        if (response.sessionId && response.sessionId !== sessionId) {
          console.warn(`⚠️ Session ID mismatch: sent ${sessionId}, received ${response.sessionId}`);
        }

        // Track successful activity
        updateSessionActivity();

        console.log(`✅ Chat response received for session: ${response.sessionId || sessionId}`);
        return response;

      } catch (error) {
        console.error(`Chat API attempt ${attempt} failed:`, error);

        // If this is the last attempt, handle the error
        if (attempt === this.retryAttempts) {
          return this.handleError(error, sessionId);
        }

        // Wait before retrying (exponential backoff)
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    // This should never be reached, but TypeScript requires it
    throw new Error('Unexpected error in chat service');
  }

  private handleError(error: unknown, sessionId: string): ChatResponse {
    console.error('Chat service error:', error);

    const baseResponse: ChatResponse = {
      text: "I encountered an unexpected error. Please try again.",
      error: 'Unknown error',
      sessionId
    };

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return {
          ...baseResponse,
          text: "I'm taking longer than usual to respond. Please try again.",
          error: 'Request timeout'
        };
      }

      if (error.message.includes('Failed to fetch')) {
        return {
          ...baseResponse,
          text: "I'm having trouble connecting. Please check your internet connection and try again.",
          error: 'Network error'
        };
      }

      if (error.message.includes('429')) {
        return {
          ...baseResponse,
          text: "I'm currently experiencing high demand. Please wait a moment and try again.",
          error: 'Rate limit exceeded'
        };
      }

      if (error.message.includes('500')) {
        return {
          ...baseResponse,
          text: "I'm experiencing technical difficulties. Please try again later.",
          error: 'Server error'
        };
      }
    }

    return baseResponse;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async healthCheck(): Promise<boolean> {
    try {
      await httpClient.request(API_CONFIG.ENDPOINTS.HEALTH);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current session metrics
   */
  public getSessionMetrics() {
    return sessionManager.getSessionMetrics();
  }

  /**
   * Clear current session and start fresh
   */
  public clearSession(): void {
    sessionManager.clearSession();
    console.log('🧹 Session cleared by user request');
  }

  /**
   * Get current session ID
   */
  public getCurrentSessionId(): string {
    return sessionManager.getSessionId();
  }
}

// Export singleton instance
export const chatService = new ChatService();

// Keep backward compatibility with updated signature
export const sendChatMessage = (
  message: string, 
  chatHistory: ChatMessage[], 
  options?: {
    maxTokens?: number;
    jsonContext?: unknown;
    sessionId?: string;
  }
): Promise<ChatResponse> => {
  return chatService.sendChatMessage(message, chatHistory, options);
};
