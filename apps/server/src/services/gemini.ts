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

interface KnowledgeCard {
  id: string;
  content: string;
  source: string;
  category: string;
  relevanceScore: number;
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
      model: 'gemini-2.0-flash',
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

  /**
   * Generate response with knowledge context (NEW)
   */
  async generateContextualResponse(
    message: string, 
    history: ChatTurn[] = [], 
    knowledgeCards: KnowledgeCard[] = [],
    jsonContext?: unknown
  ): Promise<GeminiResponse> {
    try {
      // Build enhanced prompt with DSL context
      const enhancedPrompt = this.buildEnhancedPrompt(message, history, knowledgeCards, jsonContext);
      
      // Convert to Gemini format
      const contents = this.formatChatHistory(history, enhancedPrompt);

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
      
      // Handle specific error types (same as existing method)
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

  /**
   * Build enhanced prompt with DSL knowledge context
   */
  private buildEnhancedPrompt(
    message: string, 
    history: ChatTurn[], 
    knowledgeCards: KnowledgeCard[],
    jsonContext?: unknown
  ): string {
    const sections: string[] = [];

    // 1. Static DSL Header
    sections.push(`You are a DSL (Domain Specific Language) expert assistant. You help users learn and use a JavaScript-like expression language with advanced features.

Key capabilities:
- Math operations and functions
- Array manipulation and filtering  
- String operations and formatting
- Date/time calculations
- Boolean logic and conditions
- Object property access
- Type checking and validation

Always provide clear explanations and practical examples.`);

    // 2. Knowledge Cards (if available)
    if (knowledgeCards.length > 0) {
      sections.push('\n**Relevant DSL Documentation:**');
      
      knowledgeCards.forEach((card, index) => {
        sections.push(`\n${index + 1}. **${card.category}** (${card.source}):`);
        sections.push(card.content);
      });
    }

    // 3. JSON Context (if available)
    if (jsonContext) {
      sections.push('\n**Available JSON Data Context:**');
      
      // Provide a schema snippet instead of full JSON to save tokens
      const jsonSchema = this.generateJsonSchema(jsonContext);
      sections.push(`Data structure available for expressions:\n\`\`\`json\n${jsonSchema}\n\`\`\``);
      
      // Check if user wants full JSON (this would trigger TPM guard)
      if (message.includes('@fulljson') || message.includes('Include full JSON')) {
        sections.push('\n**Full JSON Data:**');
        sections.push(`\`\`\`json\n${JSON.stringify(jsonContext, null, 2)}\n\`\`\``);
      }
    }

    // 4. Current User Message
    sections.push(`\n**Current Question:**\n${message}`);

    return sections.join('\n');
  }

  /**
   * Generate a compact JSON schema representation
   */
  private generateJsonSchema(obj: unknown, maxDepth: number = 2, currentDepth: number = 0): string {
    if (currentDepth >= maxDepth) return '...';
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return `[${this.generateJsonSchema(obj[0], maxDepth, currentDepth + 1)}, ...]`;
    }
    
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj).slice(0, 5); // Limit to first 5 keys
      const schemaObj: Record<string, unknown> = {};
      
      for (const key of keys) {
        schemaObj[key] = this.generateJsonSchema((obj as Record<string, unknown>)[key], maxDepth, currentDepth + 1);
      }
      
      if (Object.keys(obj).length > 5) {
        schemaObj['...'] = 'more properties';
      }
      
      return JSON.stringify(schemaObj, null, 2);
    }
    
    return typeof obj;
  }
}

export const geminiService = new GeminiService();