// Conversation State Manager for user context tracking
import { ChatTurn } from './contextManager';
import { TopicManager, TopicRelatedness, ZenRelevanceResult } from './topicManager';
import { SemanticVectorStore } from './semanticVectorStore';

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
  suggestedFollowUps?: string[];
  satisfaction?: number;
  turnCount: number;
  codeExamples: string[];
  complexity: number;
}

export interface AdaptiveResponse {
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
  includeExamples: boolean;
  includeBackground: boolean;
  suggestedFollowUps: string[];
  estimatedUserNeed: string;
}

export interface ConversationLearningMetrics {
  topicsExplored: number;
  avgComplexity: number;
  satisfactionScore: number;
  learningProgression: number;
}

export class ConversationStateManager {
  private userProfiles: Map<string, UserProfile> = new Map();
  private conversationContexts: Map<string, ConversationContext> = new Map();
  private readonly FLOW_INDICATORS = {
    learning: ['explain', 'what is', 'how does', 'tutorial', 'learn', 'understand'],
    'problem-solving': ['help', 'need', 'implement', 'create', 'build', 'solve'],
    debugging: ['error', 'wrong', 'fix', 'debug', 'issue', 'problem', 'not working'],
    exploration: ['show me', 'what can', 'examples', 'possibilities', 'options']
  };
  private topicManager: TopicManager | null = null;

  constructor(semanticStore?: SemanticVectorStore) {
    if (semanticStore) {
      this.topicManager = new TopicManager(semanticStore);
    }
  }

  updateUserProfile(sessionId: string, message: string, responseTime?: number): UserProfile {
    let profile = this.userProfiles.get(sessionId);
    
    if (!profile) {
      profile = this.createNewProfile(sessionId);
      console.log(`👤 Created new user profile for session: ${sessionId}`);
    }

    profile.totalQueries++;
    profile.lastActiveDate = new Date();

    const topics = this.extractTopics(message);
    profile.conversationTopics.push(...topics);
    profile.queryPatterns.push(this.categorizeQuery(message));

    profile.sessionCount++;

    this.userProfiles.set(sessionId, profile);
    console.log(`👤 Updated profile: ${profile.preferredComplexity}`);

    return profile;
  }

  updateConversationContext(
    sessionId: string, 
    message: string, 
    history: ChatTurn[]
  ): ConversationContext {
    let context = this.conversationContexts.get(sessionId);
    
    if (!context) {
      context = this.createNewContext(sessionId, message);
      console.log(`💭 Created new conversation context for session: ${sessionId}`);
    }

    const newTopic = this.identifyMainTopic(message);
    if (newTopic !== context.currentTopic) {
      context.currentTopic = newTopic;
      context.topicDepth = 1;
      console.log(`💭 Topic changed to: ${newTopic}`);
    } else {
      context.topicDepth++;
    }

    const concepts = this.extractConcepts(message);
    concepts.forEach(concept => context.conceptsDiscussed.add(concept));

    context.flowType = this.analyzeConversationFlow(message, history);
    context.suggestedFollowUps = this.generateFollowUpQuestions(context);
    context.satisfaction = this.estimateUserSatisfaction(message, history);
    context.turnCount++;

    this.conversationContexts.set(sessionId, context);
    console.log(`💭 Context updated: ${context.currentTopic} (depth: ${context.topicDepth}), flow: ${context.flowType}`);

    return context;
  }

  generateAdaptiveStrategy(
    sessionId: string, 
    query: string, 
    profile?: UserProfile, 
    context?: ConversationContext
  ): AdaptiveResponse {
    if (!profile || !context) {
      return this.getDefaultStrategy();
    }

    const complexityLevel = this.determineComplexityLevel(profile, context);
    const includeExamples = this.shouldIncludeExamples(profile, context);
    const includeBackground = this.shouldIncludeBackground(profile, context);

    return {
      complexityLevel,
      includeExamples,
      includeBackground,
      suggestedFollowUps: context.suggestedFollowUps || [],
      estimatedUserNeed: this.estimateUserNeed(profile, context, query)
    };
  }

  getTopicFamiliarity(sessionId: string, topic: string): number {
    if (!this.userProfiles.has(sessionId)) return 0;
    
    const profile = this.userProfiles.get(sessionId)!;
    return profile.conversationTopics.filter((t: string) => t === topic).length / Math.max(profile.conversationTopics.length, 1);
  }

  getLearningMetrics(sessionId: string): ConversationLearningMetrics {
    const profile = this.userProfiles.get(sessionId);
    const context = this.conversationContexts.get(sessionId);
    
    if (!profile) return { topicsExplored: 0, avgComplexity: 0, satisfactionScore: 0, learningProgression: 0 };

    const avgComplexity = this.calculateAverageComplexity(profile.preferredComplexity);
    const learningProgression = profile.conversationTopics.length / 10;

    return {
      topicsExplored: profile.conversationTopics.length,
      avgComplexity,
      satisfactionScore: context?.satisfaction || 0.5,
      learningProgression: Math.min(learningProgression, 1.0)
    };
  }

  private createNewProfile(sessionId: string): UserProfile {
    return {
      sessionId,
      sessionCount: 1,
      totalQueries: 0,
      preferredComplexity: 'intermediate',
      lastActiveDate: new Date(),
      conversationTopics: [],
      queryPatterns: []
    };
  }

  private createNewContext(sessionId: string, initialMessage: string): ConversationContext {
    return {
      sessionId,
      currentTopic: this.identifyMainTopic(initialMessage),
      topicDepth: 1,
      flowType: 'exploration',
      conceptsDiscussed: new Set<string>(),
      lastActivity: new Date(),
      turnCount: 0,
      codeExamples: [],
      complexity: 0,
      satisfaction: 0.5
    };
  }

  private determineComplexityLevel(profile: UserProfile, context: ConversationContext): 'basic' | 'intermediate' | 'advanced' {
    if (profile.preferredComplexity === 'advanced') return 'advanced';
    if (profile.preferredComplexity === 'basic') return 'basic';
    
    if (context.flowType === 'debugging' || context.conceptsDiscussed.size > 5) {
      return 'advanced';
    }
    
    return profile.sessionCount <= 2 ? 'basic' : 'intermediate';
  }

  private shouldIncludeExamples(profile: UserProfile, context: ConversationContext): boolean {
    if (context.flowType === 'learning' || context.flowType === 'exploration') {
      return true;
    }
    
    return profile.preferredComplexity === 'basic' || profile.sessionCount <= 1;
  }

  private shouldIncludeBackground(profile: UserProfile, context: ConversationContext): boolean {
    if (profile.preferredComplexity === 'basic') {
      return true;
    }
    
    return context.flowType === 'learning' && context.turnCount <= 3;
  }

  private generateFollowUpQuestions(context: ConversationContext): string[] {
    const followUps: string[] = [];
    const mainTopic = context.currentTopic;
    
    const unexploredTopics = ['arrays', 'strings', 'numbers', 'objects', 'functions']
      .filter(topic => !Array.from(context.conceptsDiscussed).includes(topic));
    
    if (unexploredTopics.length > 0) {
      followUps.push(`Would you like to explore ${unexploredTopics[0]} operations?`);
    }
    
    if (context.topicDepth > 2) {
      followUps.push(`Ready to explore more advanced ${mainTopic} operations?`);
    }
    
    return followUps.slice(0, 3);
  }

  private calculateAverageComplexity(preferredComplexity: 'basic' | 'intermediate' | 'advanced'): number {
    const complexityMap = { basic: 0.3, intermediate: 0.6, advanced: 0.9 };
    return complexityMap[preferredComplexity];
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

    return [...new Set(concepts)];
  }

  private categorizeQuery(query: string): string {
    const messageLower = query.toLowerCase();
    for (const [pattern, keywords] of Object.entries(this.FLOW_INDICATORS)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return pattern;
      }
    }
    return 'other';
  }

  private analyzeConversationFlow(message: string, history: ChatTurn[]): 'learning' | 'problem-solving' | 'exploration' | 'debugging' {
    const messageLower = message.toLowerCase();
    
    for (const [flow, keywords] of Object.entries(this.FLOW_INDICATORS)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return flow as 'learning' | 'problem-solving' | 'exploration' | 'debugging';
      }
    }
    
    return 'exploration';
  }

  private estimateUserSatisfaction(message: string, history: ChatTurn[]): number {
    return 0.7; // Simplified
  }

  private estimateUserNeed(profile: UserProfile, context: ConversationContext, query: string): string {
    if (context.flowType === 'learning') return 'Learning new concepts';
    if (context.flowType === 'debugging') return 'Fixing code issues';
    if (context.flowType === 'problem-solving') return 'Implementing solution';
    return 'Exploring possibilities';
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

  cleanupOldSessions(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [sessionId, profile] of this.userProfiles) {
      if (profile.lastActiveDate < cutoffTime) {
        this.userProfiles.delete(sessionId);
        this.conversationContexts.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} old sessions`);
    }
  }

  getStateSummary(sessionId: string): string {
    const profile = this.userProfiles.get(sessionId);
    const context = this.conversationContexts.get(sessionId);

    if (!profile || !context) {
      return 'No state available';
    }

    return `User: ${profile.preferredComplexity} | Topic: ${context.currentTopic} (depth: ${context.topicDepth}) | ` +
           `Flow: ${context.flowType} | Satisfaction: ${((context.satisfaction || 0.5) * 100).toFixed(0)}%`;
  }
} 