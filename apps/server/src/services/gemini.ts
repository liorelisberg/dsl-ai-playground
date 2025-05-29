import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GeminiResponse {
  text: string;
  error?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-preview-05-20',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });
  }

  async generateResponse(message: string, history: ChatTurn[] = []): Promise<GeminiResponse> {
    try {
      // Convert chat history to Gemini format
      const contents = this.formatChatHistory(history, message);

      const result = await this.model.generateContent({
        contents,
      });

      const response = await result.response;
      const text = response.text();

      if (!text) {
        return {
          text: "I apologize, but I couldn't generate a response. Please try again.",
          error: "Empty response from Gemini API"
        };
      }

      return { text };

    } catch (error: unknown) {
      console.error('Gemini API Error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Handle specific error types
      if (errorMessage.includes('API_KEY')) {
        return {
          text: "I'm experiencing configuration issues. Please contact support.",
          error: "Invalid API key"
        };
      }

      if (errorMessage.includes('RATE_LIMIT')) {
        return {
          text: "I'm currently experiencing high demand. Please try again in a moment.",
          error: "Rate limit exceeded"
        };
      }

      if (errorMessage.includes('SAFETY')) {
        return {
          text: "I can't provide a response to that request. Please try rephrasing your question.",
          error: "Content filtered by safety settings"
        };
      }

      return {
        text: "I'm experiencing technical difficulties. Please try again later.",
        error: errorMessage
      };
    }
  }

  private formatChatHistory(history: ChatTurn[], currentMessage: string) {
    const contents: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = [];

    // Add chat history
    for (const turn of history) {
      contents.push({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.content }]
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    return contents;
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Hello' }]
          }
        ]
      });
      
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService(); 