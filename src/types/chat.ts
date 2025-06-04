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
  processingMode?: 'full' | 'compressed';
  contextTokens?: number;
  attachedFile?: {
    filename: string;
    type: 'json';
    mode: 'full' | 'compressed';
    sizeBytes?: number;
    topLevelKeys?: string[];
    complexity?: 'simple' | 'moderate' | 'complex';
    estimatedTokens?: number;
    messageId?: string;
  };
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
