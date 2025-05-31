// Conversation State Manager for user context and expertise tracking
// Phase 2.2 of Conversation Optimization Plan

import { ChatTurn } from './contextManager';
import { TopicManager, TopicRelatedness, ZenRelevanceResult } from './topicManager';
import { SemanticVectorStore } from './semanticVectorStore';

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
  sessionId: string;
  currentTopic: string;
  topicDepth: number;
  flowType: 'learning' | 'problem-solving' | 'exploration' | 'debugging';
  conceptsDiscussed: Set<string>;
  lastActivity: Date;
  // Phase 3: Enhanced topic management
  topicTransitions: Array<{
    from: string;
    to: string;
    relationship: 'same' | 'related' | 'different';
    timestamp: Date;
  }>;
  zenRelevanceHistory: Array<{
    message: string;
    relevance: ZenRelevanceResult;
    timestamp: Date;
  }>;
  // Legacy properties for backward compatibility
  suggestedFollowUps?: string[];
  satisfaction?: number;
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
  private topicManager: TopicManager | null = null;

  constructor(semanticStore?: SemanticVectorStore) {
    if (semanticStore) {
      this.topicManager = new TopicManager(semanticStore);
    }
  }

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
    context.flowType = this.analyzeConversationFlow(message, history);

    // Generate follow-up questions
    context.suggestedFollowUps = this.generateFollowUpQuestions(context);

    // Update user satisfaction estimation
    context.satisfaction = this.estimateUserSatisfaction(message, history);

    this.conversationContexts.set(sessionId, context);
    console.log(`💭 Context updated: ${context.currentTopic} (depth: ${context.topicDepth}), flow: ${context.flowType}`);

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
      satisfactionScore: context.satisfaction || 0.5,
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
      sessionId: '',
      currentTopic: this.identifyMainTopic(initialMessage),
      topicDepth: 1,
      flowType: 'exploration',
      conceptsDiscussed: new Set(),
      lastActivity: new Date(),
      topicTransitions: [],
      zenRelevanceHistory: []
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

    switch (context.flowType) {
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
           context.flowType === 'learning';
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
    switch (context.flowType) {
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
           `Flow: ${context.flowType} | Satisfaction: ${((context.satisfaction || 0.5) * 100).toFixed(0)}%`;
  }

  /**
   * Phase 2.1: Generate older message summary for conversation continuity
   */
  generateOlderMessageSummary(
    olderHistory: ChatTurn[],
    conversationFlow: string,
    conceptsDiscussed: Set<string>
  ): string {
    if (olderHistory.length === 0) {
      return '';
    }

    switch (conversationFlow) {
      case 'learning':
        return this.generateLearningProgressionSummary(conceptsDiscussed, olderHistory);
      case 'problem-solving':
        return this.generateProblemProgressionSummary(olderHistory);
      case 'exploration':
        return this.generateExplorationPathSummary(olderHistory);
      case 'debugging':
        return this.generateDebuggingSessionSummary(olderHistory);
      default:
        return this.generateConceptSummary(conceptsDiscussed);
    }
  }

  /**
   * Generate learning progression summary for educational conversations
   */
  private generateLearningProgressionSummary(
    conceptsDiscussed: Set<string>,
    olderHistory: ChatTurn[]
  ): string {
    const concepts = Array.from(conceptsDiscussed).slice(0, 6); // Limit to most important concepts
    const questionCount = olderHistory.filter(turn => turn.role === 'user').length;
    
    if (concepts.length === 0) return '';
    
    return `Previous learning: Explored ${concepts.slice(0, 4).join(', ')}${concepts.length > 4 ? ` and ${concepts.length - 4} other concepts` : ''} across ${questionCount} questions. Building knowledge progressively.`;
  }

  /**
   * Generate problem-solving progression summary
   */
  private generateProblemProgressionSummary(olderHistory: ChatTurn[]): string {
    const userMessages = olderHistory.filter(turn => turn.role === 'user');
    const assistantMessages = olderHistory.filter(turn => turn.role === 'assistant');
    
    // Look for problem indicators and solutions attempted
    const problems = userMessages.filter(turn => 
      /error|issue|problem|not working|debug|fix|trouble/i.test(turn.content)
    );
    
    const solutions = assistantMessages.filter(turn =>
      /try|solution|fix|check|ensure|modify|change/i.test(turn.content)
    );

    if (problems.length === 0) return '';

    return `Problem-solving context: Addressed ${problems.length} issue${problems.length > 1 ? 's' : ''}, tried ${solutions.length} solution${solutions.length > 1 ? 's' : ''}. Working toward resolution.`;
  }

  /**
   * Generate exploration path summary
   */
  private generateExplorationPathSummary(olderHistory: ChatTurn[]): string {
    const userMessages = olderHistory.filter(turn => turn.role === 'user');
    const topics = new Set<string>();
    
    userMessages.forEach(turn => {
      const extractedTopics = this.extractTopics(turn.content);
      extractedTopics.forEach(topic => topics.add(topic));
    });

    if (topics.size === 0) return '';

    const topicList = Array.from(topics).slice(0, 5);
    return `Exploration journey: Investigated ${topicList.join(', ')}${topics.size > 5 ? ` and ${topics.size - 5} other areas` : ''}. Discovering ZEN capabilities.`;
  }

  /**
   * Generate debugging session summary
   */
  private generateDebuggingSessionSummary(olderHistory: ChatTurn[]): string {
    const userMessages = olderHistory.filter(turn => turn.role === 'user');
    const expressions = userMessages.map(turn => turn.content)
      .filter(content => /\(|\)|filter|map|len|sum|avg/.test(content));

    if (expressions.length === 0) return '';

    return `Debugging session: Worked on ${expressions.length} expression${expressions.length > 1 ? 's' : ''}. Troubleshooting ZEN syntax and logic.`;
  }

  /**
   * Generate concept summary (default flow)
   */
  private generateConceptSummary(conceptsDiscussed: Set<string>): string {
    if (conceptsDiscussed.size === 0) return '';

    const concepts = Array.from(conceptsDiscussed).slice(0, 5);
    return `Previous discussion: Covered ${concepts.join(', ')}${conceptsDiscussed.size > 5 ? ` and ${conceptsDiscussed.size - 5} other topics` : ''}.`;
  }

  /**
   * Phase 2.1: Get recent and older message breakdown for conversation continuity
   */
  splitMessageHistory(
    history: ChatTurn[],
    recentMessageCount: number = 8 // 4-6 exchanges (8-12 turns)
  ): { recentHistory: ChatTurn[], olderHistory: ChatTurn[] } {
    if (history.length <= recentMessageCount) {
      return {
        recentHistory: history,
        olderHistory: []
      };
    }

    const recentHistory = history.slice(-recentMessageCount);
    const olderHistory = history.slice(0, -recentMessageCount);

    console.log(`📂 Split history: Recent ${recentHistory.length} turns, Older ${olderHistory.length} turns`);

    return { recentHistory, olderHistory };
  }

  /**
   * Phase 2.1: Generate comprehensive conversation context for continuity
   */
  generateConversationContinuityContext(
    sessionId: string,
    history: ChatTurn[]
  ): {
    recentHistory: ChatTurn[];
    olderSummary: string;
    conversationFlow: string;
    conceptsDiscussed: Set<string>;
  } {
    const context = this.conversationContexts.get(sessionId);
    const { recentHistory, olderHistory } = this.splitMessageHistory(history);
    
    const conversationFlow = context?.flowType || 'default';
    const conceptsDiscussed = context?.conceptsDiscussed || new Set<string>();
    
    const olderSummary = this.generateOlderMessageSummary(
      olderHistory,
      conversationFlow,
      conceptsDiscussed
    );

    console.log(`🔗 Conversation continuity context prepared: ${olderSummary ? 'Has summary' : 'No summary'}, ${recentHistory.length} recent turns`);

    return {
      recentHistory,
      olderSummary,
      conversationFlow,
      conceptsDiscussed
    };
  }

  /**
   * Phase 3.1: Enhanced topic change detection with semantic similarity
   */
  async updateConversationTopic(
    sessionId: string,
    newMessage: string,
    detectedTopic: string
  ): Promise<{
    topicChanged: boolean;
    relatedness?: TopicRelatedness;
    zenRelevance?: ZenRelevanceResult;
  }> {
    let context = this.conversationContexts.get(sessionId);
    if (!context) {
      context = this.createConversationContext(sessionId);
    }
    const currentTopic = context.currentTopic;

    // Phase 3.1: Use Topic Manager for semantic topic similarity
    let relatedness: TopicRelatedness | undefined;
    if (this.topicManager && currentTopic && currentTopic !== detectedTopic) {
      relatedness = await this.topicManager.detectTopicRelatedness(currentTopic, detectedTopic);
      
      // Record topic transition
      context.topicTransitions.push({
        from: currentTopic,
        to: detectedTopic,
        relationship: relatedness.relationship,
        timestamp: new Date()
      });

      console.log(`🔄 Topic transition: ${currentTopic} → ${detectedTopic} (${relatedness.relationship}, ${(relatedness.similarity * 100).toFixed(1)}% similarity)`);
    }

    // Phase 3.2: ZEN relevance validation
    let zenRelevance: ZenRelevanceResult | undefined;
    if (this.topicManager) {
      zenRelevance = await this.topicManager.validateZenRelevance(newMessage);
      
      // Record ZEN relevance for analytics
      context.zenRelevanceHistory.push({
        message: newMessage,
        relevance: zenRelevance,
        timestamp: new Date()
      });

      console.log(`🎯 ZEN relevance: ${zenRelevance.isZenRelated ? 'YES' : 'NO'} (${(zenRelevance.confidence * 100).toFixed(1)}% confidence)`);
      if (zenRelevance.detectedFunctions.length > 0) {
        console.log(`   Functions detected: ${zenRelevance.detectedFunctions.join(', ')}`);
      }
    }

    // Update topic with enhanced logic
    const topicChanged = this.shouldUpdateTopic(currentTopic, detectedTopic, relatedness);
    
    if (topicChanged) {
      context.currentTopic = detectedTopic;
      this.updateTopicDepth(context, relatedness);
    }

    return {
      topicChanged,
      relatedness,
      zenRelevance
    };
  }

  /**
   * Generate off-topic deflection message using Topic Manager
   */
  async generateOffTopicResponse(
    sessionId: string,
    message: string
  ): Promise<string | null> {
    if (!this.topicManager) {
      return null;
    }

    const zenRelevance = await this.topicManager.validateZenRelevance(message);
    
    if (zenRelevance.isZenRelated) {
      return null; // Message is ZEN-related, no deflection needed
    }

    return this.topicManager.generateOffTopicDeflection(message, zenRelevance);
  }

  /**
   * Enhanced topic similarity analysis for conversation continuity
   */
  async analyzeTopicContinuity(sessionId: string): Promise<{
    hasConsistentFlow: boolean;
    relatedTransitions: number;
    offtopicRate: number;
    zenFocusScore: number;
  }> {
    const context = this.conversationContexts.get(sessionId);
    if (!context) {
      return {
        hasConsistentFlow: false,
        relatedTransitions: 0,
        offtopicRate: 0,
        zenFocusScore: 0
      };
    }

    // Analyze topic transitions
    const transitions = context.topicTransitions;
    const relatedTransitions = transitions.filter(t => 
      t.relationship === 'same' || t.relationship === 'related'
    ).length;
    
    const consistentFlowRate = transitions.length > 0 ? 
      relatedTransitions / transitions.length : 1;

    // Analyze ZEN relevance over conversation
    const relevanceHistory = context.zenRelevanceHistory;
    const zenRelatedMessages = relevanceHistory.filter(r => r.relevance.isZenRelated).length;
    const zenFocusScore = relevanceHistory.length > 0 ? 
      zenRelatedMessages / relevanceHistory.length : 1;

    const offtopicRate = 1 - zenFocusScore;

    return {
      hasConsistentFlow: consistentFlowRate > 0.7,
      relatedTransitions,
      offtopicRate,
      zenFocusScore
    };
  }

  /**
   * Create new conversation context with Phase 3 enhancements
   */
  createConversationContext(sessionId: string): ConversationContext {
    const context: ConversationContext = {
      sessionId,
      currentTopic: 'general',
      topicDepth: 1,
      flowType: 'exploration',
      conceptsDiscussed: new Set(),
      lastActivity: new Date(),
      topicTransitions: [],
      zenRelevanceHistory: []
    };

    this.conversationContexts.set(sessionId, context);
    console.log(`💭 Created new conversation context for session: ${sessionId}`);
    
    return context;
  }

  /**
   * Enhanced topic depth calculation considering semantic relationships
   */
  private updateTopicDepth(
    context: ConversationContext,
    relatedness?: TopicRelatedness
  ): void {
    if (!relatedness) {
      context.topicDepth = 1;
      return;
    }

    switch (relatedness.relationship) {
      case 'same':
        context.topicDepth = Math.min(context.topicDepth + 1, 5);
        break;
      case 'related':
        context.topicDepth = Math.max(context.topicDepth - 1, 1);
        break;
      case 'different':
        context.topicDepth = 1;
        break;
    }
  }

  /**
   * Determine if topic should be updated based on semantic similarity
   */
  private shouldUpdateTopic(
    currentTopic: string,
    newTopic: string,
    relatedness?: TopicRelatedness
  ): boolean {
    if (!currentTopic || currentTopic === 'general') {
      return true;
    }

    if (!relatedness) {
      return currentTopic !== newTopic;
    }

    // Only update if topics are different enough
    return relatedness.relationship === 'different' || 
           (relatedness.relationship === 'related' && relatedness.similarity < 0.7);
  }
} 