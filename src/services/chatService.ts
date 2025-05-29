import { ChatMessage, ChatResponse, ChatRequest, ApiError } from '../types/chat';
import { httpClient } from './httpClient';
import { API_CONFIG } from '../config/api';

export class ChatService {
  private retryAttempts = API_CONFIG.RETRY_ATTEMPTS;

  async sendChatMessage(
    message: string, 
    chatHistory: ChatMessage[]
  ): Promise<ChatResponse> {
    const request: ChatRequest = { message };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await httpClient.request<ChatResponse>(
          API_CONFIG.ENDPOINTS.CHAT,
          {
            method: 'POST',
            body: request
          }
        );

        return response;

      } catch (error) {
        console.error(`Chat API attempt ${attempt} failed:`, error);

        // If this is the last attempt, handle the error
        if (attempt === this.retryAttempts) {
          return this.handleError(error);
        }

        // Wait before retrying (exponential backoff)
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    // This should never be reached, but TypeScript requires it
    throw new Error('Unexpected error in chat service');
  }

  private handleError(error: unknown): ChatResponse {
    console.error('Chat service error:', error);

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return {
          text: "I'm taking longer than usual to respond. Please try again.",
          error: 'Request timeout'
        };
      }

      if (error.message.includes('Failed to fetch')) {
        return {
          text: "I'm having trouble connecting. Please check your internet connection and try again.",
          error: 'Network error'
        };
      }

      if (error.message.includes('429')) {
        return {
          text: "I'm currently experiencing high demand. Please wait a moment and try again.",
          error: 'Rate limit exceeded'
        };
      }

      if (error.message.includes('500')) {
        return {
          text: "I'm experiencing technical difficulties. Please try again later.",
          error: 'Server error'
        };
      }
    }

    return {
      text: "I encountered an unexpected error. Please try again.",
      error: 'Unknown error'
    };
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
}

// Export singleton instance
export const chatService = new ChatService();

// Keep backward compatibility
export const sendChatMessage = chatService.sendChatMessage.bind(chatService);
