export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  timestamp?: string;
}

export interface ChatResponse {
  text: string;
  error?: string;
  metadata?: {
    timestamp?: string;
  };
}

export interface ChatRequest {
  message: string;
}

export interface ApiError {
  error: string;
  status?: number;
}
