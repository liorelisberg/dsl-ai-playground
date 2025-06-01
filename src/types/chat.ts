export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  tokenCount?: number;
  semanticMatches?: number;
  conversationFlow?: string;
  semanticSimilarity?: number;
  processingTime?: number;
  contextUsed?: boolean;
}

export interface ChatResponse {
  text: string;
  error?: string;
  metadata?: {
    semanticMatches?: number;
    conversationFlow?: string;
    semanticSimilarity?: number;
    processingTime?: number;
    contextUsed?: boolean;
  };
}

export interface ChatRequest {
  message: string;
}

export interface ApiError {
  error: string;
  status?: number;
}
