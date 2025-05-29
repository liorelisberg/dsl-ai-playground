export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  text: string;
  error?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ApiError {
  error: string;
  status?: number;
}
