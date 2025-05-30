// Enhanced Prompt Builder with adaptive context construction
// Phase 2.3 of Conversation Optimization Plan

import { ChatTurn } from './contextManager';
import { AdaptiveResponse, UserProfile, ConversationContext } from './conversationStateManager';
import { KnowledgeCard } from './vectorStore';

export interface PromptSection {
  name: string;
  content: string;
  tokenEstimate: number;
  priority: 'high' | 'medium' | 'low';
}

export interface EnhancedPromptResult {
  prompt: string;
  sections: PromptSection[];
  totalTokens: number;
  adaptations: string[];
  personalizations: string[];
}

export interface PromptPersonalization {
  greetingStyle: string;
  explanationDepth: 'minimal' | 'standard' | 'comprehensive';
  exampleCount: number;
  technicalLevel: 'simplified' | 'standard' | 'technical';
  encouragementLevel: 'low' | 'medium' | 'high';
}

export class EnhancedPromptBuilder {
  private readonly BASE_SYSTEM_PROMPT = `You are a specialized DSL (Domain Specific Language) expert assistant with deep knowledge of JavaScript-like expression languages.

Your expertise covers: Mathematical operations, Array manipulation, String processing, Date/time handling, Boolean logic, Object property access, Type checking, and Advanced DSL patterns.`;

  /**
   * Build an adaptive prompt based on user context and strategy
   */
  buildAdaptivePrompt(
    userMessage: string,
    knowledgeCards: KnowledgeCard[],
    history: ChatTurn[],
    adaptiveStrategy: AdaptiveResponse,
    userProfile?: UserProfile,
    conversationContext?: ConversationContext,
    jsonContext?: string
  ): EnhancedPromptResult {
    
    console.log(`🎨 Building adaptive prompt for ${adaptiveStrategy.complexityLevel} user with ${adaptiveStrategy.includeExamples ? 'examples' : 'no examples'}`);

    const sections: PromptSection[] = [];
    const adaptations: string[] = [];
    const personalizations: string[] = [];

    // 1. System prompt with personalization
    const personalizedSystem = this.buildPersonalizedSystemPrompt(
      adaptiveStrategy, 
      userProfile, 
      conversationContext
    );
    sections.push({
      name: 'system',
      content: personalizedSystem.content,
      tokenEstimate: this.estimateTokens(personalizedSystem.content),
      priority: 'high'
    });
    personalizations.push(...personalizedSystem.personalizations);

    // 2. Knowledge cards with adaptive selection
    if (knowledgeCards.length > 0) {
      const knowledgeSection = this.buildAdaptiveKnowledgeSection(
        knowledgeCards,
        adaptiveStrategy,
        conversationContext
      );
      sections.push({
        name: 'knowledge',
        content: knowledgeSection.content,
        tokenEstimate: this.estimateTokens(knowledgeSection.content),
        priority: 'high'
      });
      adaptations.push(...knowledgeSection.adaptations);
    }

    // 3. Conversation history with context awareness
    if (history.length > 0) {
      const historySection = this.buildContextAwareHistory(
        history,
        adaptiveStrategy,
        conversationContext
      );
      sections.push({
        name: 'history',
        content: historySection.content,
        tokenEstimate: this.estimateTokens(historySection.content),
        priority: 'medium'
      });
      adaptations.push(...historySection.adaptations);
    }

    // 4. JSON context (if available)
    if (jsonContext) {
      sections.push({
        name: 'data',
        content: `**Available Data Context:**\n${jsonContext}`,
        tokenEstimate: this.estimateTokens(jsonContext),
        priority: 'medium'
      });
    }

    // 5. User message with context enrichment
    const enrichedMessage = this.enrichUserMessage(
      userMessage,
      adaptiveStrategy,
      conversationContext
    );
    sections.push({
      name: 'query',
      content: enrichedMessage.content,
      tokenEstimate: this.estimateTokens(enrichedMessage.content),
      priority: 'high'
    });
    adaptations.push(...enrichedMessage.adaptations);

    // 6. Response guidelines based on strategy
    const guidelines = this.buildResponseGuidelines(adaptiveStrategy, userProfile);
    sections.push({
      name: 'guidelines',
      content: guidelines.content,
      tokenEstimate: this.estimateTokens(guidelines.content),
      priority: 'medium'
    });
    adaptations.push(...guidelines.adaptations);

    // Assemble final prompt
    const prompt = sections.map(section => section.content).join('\n\n');
    const totalTokens = sections.reduce((sum, section) => sum + section.tokenEstimate, 0);

    console.log(`🎨 Prompt built: ${sections.length} sections, ${totalTokens} tokens, ${adaptations.length} adaptations`);

    return {
      prompt,
      sections,
      totalTokens,
      adaptations,
      personalizations
    };
  }

  /**
   * Build personalized system prompt
   */
  private buildPersonalizedSystemPrompt(
    strategy: AdaptiveResponse,
    profile?: UserProfile,
    context?: ConversationContext
  ): { content: string; personalizations: string[] } {
    
    const personalizations: string[] = [];
    let systemPrompt = this.BASE_SYSTEM_PROMPT;

    // Add expertise-level guidance
    if (profile) {
      switch (profile.expertiseLevel) {
        case 'beginner':
          systemPrompt += `\n\nYou are working with a beginner who benefits from clear explanations, step-by-step guidance, and practical examples. Always explain concepts before diving into implementation details.`;
          personalizations.push('beginner-friendly tone');
          break;
        case 'intermediate':
          systemPrompt += `\n\nYou are working with someone who has intermediate DSL knowledge. They understand basics but appreciate deeper insights, best practices, and when to use different approaches.`;
          personalizations.push('intermediate-level insights');
          break;
        case 'advanced':
          systemPrompt += `\n\nYou are working with an advanced user who values efficiency, performance considerations, edge cases, and implementation details. They can handle complex concepts and appreciate technical depth.`;
          personalizations.push('advanced technical depth');
          break;
      }
    }

    // Add conversation flow awareness
    if (context) {
      switch (context.conversationFlow) {
        case 'learning':
          systemPrompt += `\n\nThe user is in learning mode. Focus on building understanding, provide educational context, and suggest progressive learning paths.`;
          personalizations.push('learning-focused approach');
          break;
        case 'problem-solving':
          systemPrompt += `\n\nThe user is trying to solve a specific problem. Be solution-oriented, provide practical implementations, and consider edge cases.`;
          personalizations.push('solution-oriented responses');
          break;
        case 'debugging':
          systemPrompt += `\n\nThe user is troubleshooting an issue. Be systematic, help identify root causes, and provide clear debugging steps.`;
          personalizations.push('debugging assistance');
          break;
        case 'exploration':
          systemPrompt += `\n\nThe user is exploring DSL capabilities. Provide comprehensive coverage, suggest related concepts, and encourage discovery.`;
          personalizations.push('exploratory guidance');
          break;
      }
    }

    return { content: systemPrompt, personalizations };
  }

  /**
   * Build adaptive knowledge section
   */
  private buildAdaptiveKnowledgeSection(
    knowledgeCards: KnowledgeCard[],
    strategy: AdaptiveResponse,
    context?: ConversationContext
  ): { content: string; adaptations: string[] } {
    
    const adaptations: string[] = [];
    let content = '**Relevant DSL Knowledge:**\n\n';

    // Sort by relevance and apply strategy filters
    const sortedCards = [...knowledgeCards]
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Adaptive filtering based on complexity level
    let filteredCards = sortedCards;
    if (strategy.complexityLevel === 'basic') {
      // Prefer simpler, foundational content
      filteredCards = sortedCards.filter(card => 
        !card.content.toLowerCase().includes('advanced') &&
        !card.content.toLowerCase().includes('performance')
      ).slice(0, 4);
      adaptations.push('filtered for basic complexity');
    } else if (strategy.complexityLevel === 'advanced') {
      // Include more complex content
      filteredCards = sortedCards.slice(0, 6);
      adaptations.push('included advanced content');
    } else {
      filteredCards = sortedCards.slice(0, 5);
    }

    // Build knowledge content with adaptive formatting
    filteredCards.forEach((card, index) => {
      const priority = index < 2 ? '⭐' : '';
      content += `${index + 1}. ${priority}**${this.capitalizeCategory(card.category)}** (${card.source}):\n`;
      
      if (strategy.includeBackground && index === 0) {
        content += `   *Primary concept for your current question*\n`;
        adaptations.push('added background context');
      }
      
      content += `   ${card.content}\n\n`;
    });

    // Add topic continuity for ongoing conversations
    if (context && context.topicDepth > 1) {
      content += `*Note: This continues your ${context.currentTopic} exploration (depth level ${context.topicDepth})*\n`;
      adaptations.push('added topic continuity');
    }

    return { content, adaptations };
  }

  /**
   * Build context-aware conversation history
   */
  private buildContextAwareHistory(
    history: ChatTurn[],
    strategy: AdaptiveResponse,
    context?: ConversationContext
  ): { content: string; adaptations: string[] } {
    
    const adaptations: string[] = [];
    let content = '**Conversation History:**\n\n';

    // Adaptive history length based on strategy
    const maxTurns = strategy.complexityLevel === 'basic' ? 4 : 
                     strategy.complexityLevel === 'intermediate' ? 6 : 8;
    
    const recentHistory = history.slice(-maxTurns);
    adaptations.push(`limited to ${maxTurns} recent turns`);

    // Add context summary for longer conversations
    if (history.length > maxTurns && context) {
      content += `*Previous conversation covered: ${Array.from(context.conceptsDiscussed).slice(0, 3).join(', ')}*\n\n`;
      adaptations.push('added conversation summary');
    }

    // Format history with role clarity
    recentHistory.forEach((turn, index) => {
      const roleEmoji = turn.role === 'user' ? '🗣️' : '🤖';
      const timestamp = turn.timestamp ? ` (${this.formatRelativeTime(turn.timestamp)})` : '';
      
      content += `${roleEmoji} **${turn.role.toUpperCase()}${timestamp}:**\n`;
      content += `${turn.content}\n\n`;
    });

    return { content, adaptations };
  }

  /**
   * Enrich user message with context
   */
  private enrichUserMessage(
    message: string,
    strategy: AdaptiveResponse,
    context?: ConversationContext
  ): { content: string; adaptations: string[] } {
    
    const adaptations: string[] = [];
    let content = '**Current Question:**\n';

    // Add context enrichment
    if (context && context.topicDepth > 1) {
      content += `*Continuing ${context.currentTopic} discussion (depth ${context.topicDepth})*\n`;
      adaptations.push('added topic context');
    }

    if (strategy.estimatedUserNeed !== 'General DSL guidance') {
      content += `*Estimated need: ${strategy.estimatedUserNeed}*\n`;
      adaptations.push('added need estimation');
    }

    content += `\n${message}`;

    // Add follow-up suggestions if available
    if (strategy.suggestedFollowUps.length > 0 && context?.conversationFlow === 'exploration') {
      content += `\n\n*Related questions you might have: ${strategy.suggestedFollowUps.join(', ')}*`;
      adaptations.push('added follow-up suggestions');
    }

    return { content, adaptations };
  }

  /**
   * Build response guidelines
   */
  private buildResponseGuidelines(
    strategy: AdaptiveResponse,
    profile?: UserProfile
  ): { content: string; adaptations: string[] } {
    
    const adaptations: string[] = [];
    let content = '**Response Guidelines:**\n';

    const guidelines: string[] = [];

    // Complexity-based guidelines
    switch (strategy.complexityLevel) {
      case 'basic':
        guidelines.push('Use simple, clear language');
        guidelines.push('Explain concepts step-by-step');
        guidelines.push('Avoid technical jargon');
        adaptations.push('basic complexity guidelines');
        break;
      case 'intermediate':
        guidelines.push('Balance explanation with implementation');
        guidelines.push('Include best practices');
        guidelines.push('Mention alternative approaches');
        adaptations.push('intermediate complexity guidelines');
        break;
      case 'advanced':
        guidelines.push('Focus on implementation details');
        guidelines.push('Discuss performance implications');
        guidelines.push('Cover edge cases');
        adaptations.push('advanced complexity guidelines');
        break;
    }

    // Example inclusion
    if (strategy.includeExamples) {
      guidelines.push('Include practical code examples');
      guidelines.push('Show before/after scenarios');
      adaptations.push('include examples guideline');
    }

    // Background context
    if (strategy.includeBackground) {
      guidelines.push('Provide conceptual background');
      guidelines.push('Explain the "why" behind solutions');
      adaptations.push('include background guideline');
    }

    // User interaction style
    if (profile) {
      switch (profile.interactionStyle) {
        case 'concise':
          guidelines.push('Keep responses focused and brief');
          adaptations.push('concise style preference');
          break;
        case 'examples-focused':
          guidelines.push('Emphasize practical examples');
          adaptations.push('examples-focused style');
          break;
        case 'explanatory':
          guidelines.push('Provide thorough explanations');
          adaptations.push('explanatory style preference');
          break;
      }
    }

    content += guidelines.map(guideline => `- ${guideline}`).join('\n');

    return { content, adaptations };
  }

  /**
   * Utility methods
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private capitalizeCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  private formatRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  /**
   * Get prompt personalization summary
   */
  getPersonalization(
    strategy: AdaptiveResponse,
    profile?: UserProfile,
    context?: ConversationContext
  ): PromptPersonalization {
    
    const greetingStyle = profile?.expertiseLevel === 'beginner' ? 'encouraging' :
                         profile?.expertiseLevel === 'advanced' ? 'professional' : 'friendly';

    const explanationDepth = strategy.complexityLevel === 'basic' ? 'comprehensive' :
                            strategy.complexityLevel === 'advanced' ? 'minimal' : 'standard';

    const exampleCount = strategy.includeExamples ? 
                        (strategy.complexityLevel === 'basic' ? 3 : 2) : 1;

    const technicalLevel = strategy.complexityLevel === 'basic' ? 'simplified' :
                          strategy.complexityLevel === 'advanced' ? 'technical' : 'standard';

    const encouragementLevel = profile?.expertiseLevel === 'beginner' ? 'high' :
                              context?.userSatisfaction && context.userSatisfaction < 0.5 ? 'medium' : 'low';

    return {
      greetingStyle,
      explanationDepth,
      exampleCount,
      technicalLevel,
      encouragementLevel
    };
  }

  /**
   * Validate prompt for token limits and quality
   */
  validatePrompt(promptResult: EnhancedPromptResult, maxTokens: number): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Token limit check
    if (promptResult.totalTokens > maxTokens) {
      issues.push(`Prompt exceeds token limit: ${promptResult.totalTokens} > ${maxTokens}`);
      suggestions.push('Reduce history length or knowledge cards');
    }

    // Section balance check
    const systemSection = promptResult.sections.find(s => s.name === 'system');
    const knowledgeSection = promptResult.sections.find(s => s.name === 'knowledge');
    
    if (systemSection && knowledgeSection) {
      const ratio = knowledgeSection.tokenEstimate / systemSection.tokenEstimate;
      if (ratio > 3) {
        issues.push('Knowledge section disproportionately large');
        suggestions.push('Filter knowledge cards more aggressively');
      }
    }

    // Quality checks
    if (promptResult.adaptations.length === 0) {
      issues.push('No adaptations applied - may not be personalized');
      suggestions.push('Ensure user profile and context are available');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
} 