export interface UserProfile {
  sessionId: string;
  sessionCount: number;
  totalQueries: number;
  preferredComplexity: 'basic' | 'intermediate' | 'advanced';
  lastActiveDate: Date;
  conversationTopics: string[];
  queryPatterns: string[];
}

export interface ConversationContext {
  sessionId: string;
  currentTopic: string;
  topicDepth: number;
  flowType: 'learning' | 'problem-solving' | 'exploration' | 'debugging';
  conceptsDiscussed: Set<string>;
  lastActivity: Date;
  turnCount: number;
  codeExamples: string[];
  complexity: number;
  satisfaction: number;
  suggestedFollowUps?: string[];
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
} 