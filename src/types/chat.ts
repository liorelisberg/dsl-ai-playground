export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  timestamp?: string;
  sessionId?: string;
  processingTime?: number;
  tokensUsed?: number;
}

export interface ChatResponse {
  text: string;
  error?: string;
  sessionId?: string;
  metadata?: {
    timestamp?: string;
    sessionId?: string;
    processingTime?: number;
    tokensUsed?: number;
    knowledgeCardsUsed?: number;
  };
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  maxTokens?: number;
  jsonContext?: unknown;
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface SessionAwareRequest extends ChatRequest {
  sessionId: string; // Required for session-aware requests
}
