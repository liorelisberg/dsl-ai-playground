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
  // Parser attachment support (Phase 1 integration)
  parserAttachment?: {
    filename: string;
    sizeBytes: number;
    type: 'json' | 'text';
    messageId: string;
    isParserGenerated: boolean;
  };
  // Content analysis from parser-to-chat flow
  contentAnalysis?: {
    totalSize: number;
    requiresAttachment: boolean;
    estimatedTokens: number;
    flowType?: 'direct' | 'attachment';
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
