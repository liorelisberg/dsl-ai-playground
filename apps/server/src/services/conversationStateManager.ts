// Simplified Conversation State Manager - Focus on Essential Context Only
import { ChatTurn } from './contextManager';

export interface UserProfile {
  sessionId: string;
  sessionCount: number;
  totalQueries: number;
  lastActiveDate: Date;
  conversationTopics: string[];
  queryPatterns: string[];
}

export interface ConversationContext {
  sessionId: string;
  currentTopic: string;
  topicDepth: number;
  conceptsDiscussed: Set<string>;
  lastActivity: Date;
  turnCount: number;
  codeExamples: string[];
}

export interface SimpleResponse {
  estimatedUserNeed: string;
  suggestedFollowUps: string[];
}

export class ConversationStateManager {
  private userProfiles = new Map<string, UserProfile>();
  private conversationContexts = new Map<string, ConversationContext>();

  /**
   * Update user profile with simplified tracking
   */
  updateUserProfile(sessionId: string, message: string): UserProfile {
    const profile = this.userProfiles.get(sessionId) || this.createNewProfile(sessionId);
    
    // Simple updates
    profile.totalQueries++;
    profile.lastActiveDate = new Date();
    profile.queryPatterns.push(message.slice(0, 50)); // Keep sample patterns
    
    // Keep only last 10 patterns
    if (profile.queryPatterns.length > 10) {
      profile.queryPatterns = profile.queryPatterns.slice(-10);
    }
    
    this.userProfiles.set(sessionId, profile);
    console.log(`👤 Updated profile: ${profile.totalQueries} queries`);
    
    return profile;
  }

  /**
   * Update conversation context with essential tracking only
   */
  updateConversationContext(sessionId: string, message: string, history: ChatTurn[]): ConversationContext {
    const context = this.conversationContexts.get(sessionId) || this.createNewContext(sessionId);
    
    // Update basic context
    context.turnCount++;
    context.lastActivity = new Date();
    
    // Track concepts mentioned (simple keyword extraction)
    this.extractAndTrackConcepts(message, context);
    
    // Update topic if it has shifted
    const detectedTopic = this.extractTopic(message);
    if (detectedTopic !== context.currentTopic) {
      context.currentTopic = detectedTopic;
      context.topicDepth = 1;
    } else {
      context.topicDepth++;
    }
    
    this.conversationContexts.set(sessionId, context);
    console.log(`💭 Context updated: ${context.currentTopic} (depth: ${context.topicDepth})`);
    
    return context;
  }

  /**
   * Generate simple response guidance
   */
  generateSimpleResponse(sessionId: string, message: string): SimpleResponse {
    const needsEstimation = this.estimateUserNeed(message);
    const suggestions = this.generateFollowUpSuggestions(message);
    
    return {
      estimatedUserNeed: needsEstimation,
      suggestedFollowUps: suggestions
    };
  }

  /**
   * Get complete simple conversation state
   */
  getSimpleConversationState(sessionId: string): {
    simpleResponse: SimpleResponse;
    userProfile: UserProfile | undefined;
    conversationContext: ConversationContext | undefined;
    history: ChatTurn[];
  } {
    const userProfile = this.userProfiles.get(sessionId);
    const conversationContext = this.conversationContexts.get(sessionId);
    
    // Generate simple response with default message for state retrieval
    const simpleResponse = this.generateSimpleResponse(sessionId, '');
    
    // For now, return empty history - this would need integration with session storage
    const history: ChatTurn[] = [];
    
    return {
      simpleResponse,
      userProfile,
      conversationContext,
      history
    };
  }

  /**
   * Simple topic extraction
   */
  private extractTopic(message: string): string {
    const topicKeywords = {
      'arrays': ['array', 'filter', 'map', 'forEach', 'find', 'reduce'],
      'strings': ['string', 'text', 'replace', 'split', 'join', 'length'],
      'objects': ['object', 'property', 'key', 'value', 'nested'],
      'math': ['math', 'number', 'calculate', 'sum', 'average'],
      'dates': ['date', 'time', 'format', 'parse'],
      'validation': ['validate', 'check', 'verify', 'test'],
      'general': ['general', 'help', 'how', 'what', 'why']
    };

    const messageLower = message.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }

  /**
   * Extract and track concepts mentioned
   */
  private extractAndTrackConcepts(message: string, context: ConversationContext): void {
    // Simple concept extraction based on ZEN DSL keywords
    const zenConcepts = [
      'filter', 'map', 'find', 'reduce', 'forEach', 'some', 'every',
      'len', 'contains', 'startsWith', 'endsWith', 'split', 'join',
      'upper', 'lower', 'trim', 'replace', 'matches',
      'keys', 'values', 'has', 'type', 'string', 'number'
    ];

    const messageLower = message.toLowerCase();
    zenConcepts.forEach(concept => {
      if (messageLower.includes(concept)) {
        context.conceptsDiscussed.add(concept);
      }
    });

    // Keep concepts set manageable
    if (context.conceptsDiscussed.size > 20) {
      const conceptsArray = Array.from(context.conceptsDiscussed);
      context.conceptsDiscussed = new Set(conceptsArray.slice(-15));
    }
  }

  /**
   * Simple user need estimation
   */
  private estimateUserNeed(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('example') || messageLower.includes('show')) {
      return 'Needs practical examples';
    }
    if (messageLower.includes('how') || messageLower.includes('tutorial')) {
      return 'Needs step-by-step guidance';  
    }
    if (messageLower.includes('error') || messageLower.includes('debug') || messageLower.includes('wrong')) {
      return 'Needs debugging help';
    }
    if (messageLower.includes('difference') || messageLower.includes('compare')) {
      return 'Needs comparison/explanation';
    }
    
    return 'General DSL guidance';
  }

  /**
   * Generate simple follow-up suggestions
   */
  private generateFollowUpSuggestions(message: string): string[] {
    const messageLower = message.toLowerCase();
    const suggestions: string[] = [];
    
    if (messageLower.includes('array')) {
      suggestions.push('array filtering', 'array transformation', 'array methods');
    }
    if (messageLower.includes('string')) {
      suggestions.push('string manipulation', 'text processing', 'string validation');
    }
    if (messageLower.includes('object')) {
      suggestions.push('property access', 'object validation', 'nested objects');
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  /**
   * Create new user profile
   */
  private createNewProfile(sessionId: string): UserProfile {
    const profile: UserProfile = {
      sessionId,
      sessionCount: 1,
      totalQueries: 0,
      lastActiveDate: new Date(),
      conversationTopics: [],
      queryPatterns: []
    };

    console.log(`👤 Created new user profile for session: ${sessionId}`);
    return profile;
  }

  /**
   * Create new conversation context
   */
  private createNewContext(sessionId: string): ConversationContext {
    const context: ConversationContext = {
      sessionId,
      currentTopic: 'general',
      topicDepth: 1,
      conceptsDiscussed: new Set<string>(),
      lastActivity: new Date(),
      turnCount: 0,
      codeExamples: []
    };

    console.log(`💭 Created new conversation context for session: ${sessionId}`);
    return context;
  }

  /**
   * Get basic learning metrics for session
   */
  getLearningMetrics(sessionId: string): {
    queriesAsked: number;
    topicsExplored: number;
    conceptsLearned: number;
    sessionDuration: number;
  } {
    const profile = this.userProfiles.get(sessionId);
    const context = this.conversationContexts.get(sessionId);
    
    if (!profile || !context) {
      return {
        queriesAsked: 0,
        topicsExplored: 0,
        conceptsLearned: 0,
        sessionDuration: 0
      };
    }
    
    const sessionDuration = Date.now() - context.lastActivity.getTime();
    
    return {
      queriesAsked: profile.totalQueries,
      topicsExplored: profile.conversationTopics.length,
      conceptsLearned: context.conceptsDiscussed.size,
      sessionDuration: Math.round(sessionDuration / 1000) // seconds
    };
  }
} 