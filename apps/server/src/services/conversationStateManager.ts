// Conversation State Manager for user context and expertise tracking
// Phase 2.2 of Conversation Optimization Plan

import { ChatTurn } from './contextManager';

export interface UserProfile {
  sessionId: string;
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredComplexity: 'simple' | 'detailed' | 'comprehensive';
  topicFamiliarity: Map<string, number>; // 0-1 familiarity with DSL topics
  interactionStyle: 'concise' | 'explanatory' | 'examples-focused';
  lastSeen: Date;
  sessionCount: number;
  avgResponseTime: number; // Milliseconds user takes to respond
}

export interface ConversationContext {
  currentTopic: string;
  topicDepth: number; // How deep into the topic we've gone
  followUpQuestions: string[];
  conceptsDiscussed: Set<string>;
  pendingClarifications: string[];
  userSatisfaction: number; // 0-1 estimated satisfaction
  conversationFlow: 'exploration' | 'problem-solving' | 'learning' | 'debugging';
}

export interface AdaptiveResponse {
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
  includeExamples: boolean;
  includeBackground: boolean;
  suggestedFollowUps: string[];
  estimatedUserNeed: string;
}

export interface SessionMetrics {
  totalQuestions: number;
  topicsExplored: number;
  avgComplexity: number;
  satisfactionScore: number;
  learningProgression: number; // How much user has learned
}

export class ConversationStateManager {
  private userProfiles: Map<string, UserProfile> = new Map();
  private conversationContexts: Map<string, ConversationContext> = new Map();
  private readonly EXPERTISE_INDICATORS = {
    beginner: ['what is', 'how to', 'explain', 'basic', 'simple', 'help me understand'],
    intermediate: ['difference between', 'when to use', 'best practice', 'compare', 'optimize'],
    advanced: ['performance', 'edge case', 'implementation details', 'architecture', 'scalability']
  };

  /**
   * Initialize or update user profile based on interaction patterns
   */
  updateUserProfile(sessionId: string, message: string, responseTime?: number): UserProfile {
    let profile = this.userProfiles.get(sessionId);
    
    if (!profile) {
      profile = this.createNewProfile(sessionId);
      console.log(`👤 Created new user profile for session: ${sessionId}`);
    }

    // Update expertise level based on query complexity
    const detectedExpertise = this.assessExpertiseFromQuery(message);
    profile.expertiseLevel = this.blendExpertise(profile.expertiseLevel, detectedExpertise);

    // Update topic familiarity
    const topics = this.extractTopics(message);
    topics.forEach(topic => {
      const currentFamiliarity = profile.topicFamiliarity.get(topic) || 0;
      profile.topicFamiliarity.set(topic, Math.min(currentFamiliarity + 0.1, 1.0));
    });

    // Update interaction patterns
    if (responseTime) {
      profile.avgResponseTime = (profile.avgResponseTime + responseTime) / 2;
    }

    profile.lastSeen = new Date();
    profile.sessionCount++;

    this.userProfiles.set(sessionId, profile);
    console.log(`👤 Updated profile: ${profile.expertiseLevel} expertise, ${profile.topicFamiliarity.size} known topics`);

    return profile;
  }

  /**
   * Update conversation context for session continuity
   */
  updateConversationContext(
    sessionId: string, 
    message: string, 
    history: ChatTurn[]
  ): ConversationContext {
    let context = this.conversationContexts.get(sessionId);
    
    if (!context) {
      context = this.createNewContext(message);
      console.log(`💭 Created new conversation context for session: ${sessionId}`);
    }

    // Update current topic and depth
    const newTopic = this.identifyMainTopic(message);
    if (newTopic !== context.currentTopic) {
      context.currentTopic = newTopic;
      context.topicDepth = 1;
      console.log(`💭 Topic changed to: ${newTopic}`);
    } else {
      context.topicDepth++;
    }

    // Extract concepts discussed
    const concepts = this.extractConcepts(message);
    concepts.forEach(concept => context.conceptsDiscussed.add(concept));

    // Analyze conversation flow
    context.conversationFlow = this.analyzeConversationFlow(message, history);

    // Generate follow-up questions
    context.followUpQuestions = this.generateFollowUpQuestions(context);

    // Update user satisfaction estimation
    context.userSatisfaction = this.estimateUserSatisfaction(message, history);

    this.conversationContexts.set(sessionId, context);
    console.log(`💭 Context updated: ${context.currentTopic} (depth: ${context.topicDepth}), flow: ${context.conversationFlow}`);

    return context;
  }

  /**
   * Generate adaptive response strategy based on user profile and context
   */
  generateAdaptiveStrategy(
    sessionId: string, 
    query: string
  ): AdaptiveResponse {
    const profile = this.userProfiles.get(sessionId);
    const context = this.conversationContexts.get(sessionId);

    if (!profile || !context) {
      // Default strategy for new users
      return this.getDefaultStrategy();
    }

    const complexityLevel = this.determineResponseComplexity(profile, context, query);
    const includeExamples = this.shouldIncludeExamples(profile, context);
    const includeBackground = this.shouldIncludeBackground(profile, context);
    const suggestedFollowUps = this.generatePersonalizedFollowUps(profile, context, query);
    const estimatedUserNeed = this.estimateUserNeed(profile, context, query);

    console.log(`🎯 Adaptive strategy: ${complexityLevel} complexity, examples: ${includeExamples}, background: ${includeBackground}`);

    return {
      complexityLevel,
      includeExamples,
      includeBackground,
      suggestedFollowUps,
      estimatedUserNeed
    };
  }

  /**
   * Get user expertise level for a specific topic
   */
  getTopicExpertise(sessionId: string, topic: string): number {
    const profile = this.userProfiles.get(sessionId);
    if (!profile) return 0;

    return profile.topicFamiliarity.get(topic) || 0;
  }

  /**
   * Get session metrics for monitoring
   */
  getSessionMetrics(sessionId: string): SessionMetrics {
    const profile = this.userProfiles.get(sessionId);
    const context = this.conversationContexts.get(sessionId);

    if (!profile || !context) {
      return {
        totalQuestions: 0,
        topicsExplored: 0,
        avgComplexity: 0,
        satisfactionScore: 0,
        learningProgression: 0
      };
    }

    const avgComplexity = this.calculateAverageComplexity(profile.expertiseLevel);
    const learningProgression = profile.topicFamiliarity.size / 10; // Normalize to 0-1

    return {
      totalQuestions: profile.sessionCount,
      topicsExplored: context.conceptsDiscussed.size,
      avgComplexity,
      satisfactionScore: context.userSatisfaction,
      learningProgression: Math.min(learningProgression, 1.0)
    };
  }

  /**
   * Private helper methods
   */
  private createNewProfile(sessionId: string): UserProfile {
    return {
      sessionId,
      expertiseLevel: 'beginner', // Default to beginner
      preferredComplexity: 'detailed',
      topicFamiliarity: new Map(),
      interactionStyle: 'explanatory',
      lastSeen: new Date(),
      sessionCount: 0,
      avgResponseTime: 5000 // 5 seconds default
    };
  }

  private createNewContext(initialMessage: string): ConversationContext {
    return {
      currentTopic: this.identifyMainTopic(initialMessage),
      topicDepth: 1,
      followUpQuestions: [],
      conceptsDiscussed: new Set(),
      pendingClarifications: [],
      userSatisfaction: 0.5, // Neutral start
      conversationFlow: 'exploration'
    };
  }

  private assessExpertiseFromQuery(message: string): 'beginner' | 'intermediate' | 'advanced' {
    const messageLower = message.toLowerCase();
    
    const scores = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    Object.entries(this.EXPERTISE_INDICATORS).forEach(([level, indicators]) => {
      indicators.forEach(indicator => {
        if (messageLower.includes(indicator)) {
          scores[level as keyof typeof scores]++;
        }
      });
    });

    // Additional complexity indicators
    if (message.length > 200) scores.advanced++;
    if (messageLower.includes('performance') || messageLower.includes('optimization')) scores.advanced += 2;
    if (messageLower.includes('example') || messageLower.includes('show me')) scores.beginner++;

    const maxScore = Math.max(scores.beginner, scores.intermediate, scores.advanced);
    if (maxScore === 0) return 'beginner'; // Default

    return Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as 'beginner' | 'intermediate' | 'advanced' || 'beginner';
  }

  private blendExpertise(
    current: 'beginner' | 'intermediate' | 'advanced', 
    detected: 'beginner' | 'intermediate' | 'advanced'
  ): 'beginner' | 'intermediate' | 'advanced' {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const currentScore = levels[current];
    const detectedScore = levels[detected];
    
    // Weighted average (70% current, 30% detected)
    const blended = Math.round(currentScore * 0.7 + detectedScore * 0.3);
    
    const levelMap = { 1: 'beginner', 2: 'intermediate', 3: 'advanced' } as const;
    return levelMap[blended as keyof typeof levelMap] || 'beginner';
  }

  private extractTopics(message: string): string[] {
    const topicKeywords = {
      'arrays': ['array', 'filter', 'map', 'reduce', 'sort'],
      'strings': ['string', 'text', 'substring', 'uppercase', 'lowercase'],
      'numbers': ['number', 'math', 'calculation', 'arithmetic'],
      'dates': ['date', 'time', 'format', 'parse'],
      'objects': ['object', 'property', 'dot notation'],
      'conditionals': ['if', 'condition', 'boolean', 'logic'],
      'functions': ['function', 'expression', 'syntax']
    };

    const messageLower = message.toLowerCase();
    const topics: string[] = [];

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  private identifyMainTopic(message: string): string {
    const topics = this.extractTopics(message);
    return topics[0] || 'general';
  }

  private extractConcepts(message: string): string[] {
    const conceptPatterns = [
      /\b(filter|map|reduce|sort)\b/gi,
      /\b(substring|uppercase|lowercase|split)\b/gi,
      /\b(addition|subtraction|multiplication|division)\b/gi,
      /\b(property|method|function|variable)\b/gi
    ];

    const concepts: string[] = [];
    conceptPatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) {
        concepts.push(...matches.map(match => match.toLowerCase()));
      }
    });

    return [...new Set(concepts)]; // Remove duplicates
  }

  private analyzeConversationFlow(
    message: string, 
    history: ChatTurn[]
  ): 'exploration' | 'problem-solving' | 'learning' | 'debugging' {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('error') || messageLower.includes('not working') || messageLower.includes('debug')) {
      return 'debugging';
    }
    
    if (messageLower.includes('how to') || messageLower.includes('implement') || messageLower.includes('solution')) {
      return 'problem-solving';
    }
    
    if (messageLower.includes('explain') || messageLower.includes('learn') || messageLower.includes('understand')) {
      return 'learning';
    }

    // If user is asking follow-up questions, likely exploration
    if (history.length > 2 && messageLower.includes('what about') || messageLower.includes('also')) {
      return 'exploration';
    }

    return 'exploration'; // Default
  }

  private generateFollowUpQuestions(context: ConversationContext): string[] {
    const followUps: string[] = [];

    switch (context.conversationFlow) {
      case 'learning':
        followUps.push(`Would you like to see more examples of ${context.currentTopic}?`);
        followUps.push(`Are there specific use cases you're wondering about?`);
        break;
      case 'problem-solving':
        followUps.push(`Would you like help with edge cases?`);
        followUps.push(`Need information about performance considerations?`);
        break;
      case 'debugging':
        followUps.push(`Can you share the specific error you're seeing?`);
        followUps.push(`Would you like help with troubleshooting steps?`);
        break;
      default:
        followUps.push(`What would you like to explore next?`);
    }

    return followUps.slice(0, 2); // Limit to 2 follow-ups
  }

  private estimateUserSatisfaction(message: string, history: ChatTurn[]): number {
    const messageLower = message.toLowerCase();
    
    // Positive indicators
    if (messageLower.includes('thanks') || messageLower.includes('great') || messageLower.includes('helpful')) {
      return 0.9;
    }
    
    // Neutral indicators
    if (messageLower.includes('more') || messageLower.includes('another') || messageLower.includes('what about')) {
      return 0.7;
    }
    
    // Negative indicators
    if (messageLower.includes('confused') || messageLower.includes('don\'t understand') || messageLower.includes('not clear')) {
      return 0.3;
    }

    return 0.6; // Default neutral
  }

  private determineResponseComplexity(
    profile: UserProfile, 
    context: ConversationContext, 
    query: string
  ): 'basic' | 'intermediate' | 'advanced' {
    // Base on user expertise level
    if (profile.expertiseLevel === 'advanced') return 'advanced';
    if (profile.expertiseLevel === 'beginner') return 'basic';
    
    // Consider topic familiarity
    const mainTopic = this.identifyMainTopic(query);
    const topicFamiliarity = profile.topicFamiliarity.get(mainTopic) || 0;
    
    if (topicFamiliarity > 0.7) return 'advanced';
    if (topicFamiliarity > 0.3) return 'intermediate';
    
    return 'basic';
  }

  private shouldIncludeExamples(profile: UserProfile, context: ConversationContext): boolean {
    return profile.expertiseLevel === 'beginner' || 
           profile.interactionStyle === 'examples-focused' ||
           context.conversationFlow === 'learning';
  }

  private shouldIncludeBackground(profile: UserProfile, context: ConversationContext): boolean {
    const mainTopic = context.currentTopic;
    const familiarity = profile.topicFamiliarity.get(mainTopic) || 0;
    
    return familiarity < 0.5 || context.topicDepth === 1;
  }

  private generatePersonalizedFollowUps(
    profile: UserProfile, 
    context: ConversationContext, 
    query: string
  ): string[] {
    const followUps: string[] = [];
    const mainTopic = this.identifyMainTopic(query);
    
    // Suggest related topics they haven't explored
    const unexploredTopics = ['arrays', 'strings', 'numbers', 'objects', 'functions']
      .filter(topic => (profile.topicFamiliarity.get(topic) || 0) < 0.3);
    
    if (unexploredTopics.length > 0) {
      followUps.push(`Would you like to learn about ${unexploredTopics[0]} next?`);
    }
    
    // Complexity progression
    if (profile.expertiseLevel === 'beginner' && context.topicDepth > 2) {
      followUps.push(`Ready to explore more advanced ${mainTopic} operations?`);
    }

    return followUps.slice(0, 2);
  }

  private estimateUserNeed(
    profile: UserProfile, 
    context: ConversationContext, 
    query: string
  ): string {
    switch (context.conversationFlow) {
      case 'learning': return `Understanding ${context.currentTopic} fundamentals`;
      case 'problem-solving': return `Implementing ${context.currentTopic} solution`;
      case 'debugging': return `Fixing ${context.currentTopic} issues`;
      case 'exploration': return `Exploring ${context.currentTopic} capabilities`;
      default: return 'General DSL guidance';
    }
  }

  private getDefaultStrategy(): AdaptiveResponse {
    return {
      complexityLevel: 'basic',
      includeExamples: true,
      includeBackground: true,
      suggestedFollowUps: ['What would you like to learn next?'],
      estimatedUserNeed: 'Getting started with DSL'
    };
  }

  private calculateAverageComplexity(expertiseLevel: 'beginner' | 'intermediate' | 'advanced'): number {
    const complexityMap = { beginner: 0.3, intermediate: 0.6, advanced: 0.9 };
    return complexityMap[expertiseLevel];
  }

  /**
   * Cleanup old sessions (call periodically)
   */
  cleanupOldSessions(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [sessionId, profile] of this.userProfiles) {
      if (profile.lastSeen < cutoffTime) {
        this.userProfiles.delete(sessionId);
        this.conversationContexts.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} old sessions`);
    }
  }

  /**
   * Get conversation state summary for debugging
   */
  getStateSummary(sessionId: string): string {
    const profile = this.userProfiles.get(sessionId);
    const context = this.conversationContexts.get(sessionId);

    if (!profile || !context) {
      return 'No state available';
    }

    return `User: ${profile.expertiseLevel} | Topic: ${context.currentTopic} (depth: ${context.topicDepth}) | ` +
           `Flow: ${context.conversationFlow} | Satisfaction: ${(context.userSatisfaction * 100).toFixed(0)}%`;
  }
} 