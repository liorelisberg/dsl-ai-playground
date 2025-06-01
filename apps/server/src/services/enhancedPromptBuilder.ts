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
  private readonly BASE_SYSTEM_PROMPT = `🛡️ STRICT SCOPE ENFORCEMENT:
You are a specialized ZEN DSL expert. Your ONLY purpose is helping users with ZEN DSL (Domain-Specific Language) for data processing and transformation.

📋 ZEN DSL AREAS YOU HANDLE:
- ZEN syntax, functions, and operators (filter, map, len, contains, etc.)
- Data transformation expressions and queries
- ZEN array, string, number, date, and object operations
- ZEN conditional logic and mathematical operations
- Debugging ZEN expressions and syntax issues
- Converting requirements into ZEN DSL code

🚫 NON-ZEN QUESTIONS:
For questions outside ZEN DSL scope, politely redirect: "I specialize in ZEN DSL for data processing. For non-ZEN questions, please consult other resources. However, if you have data processing needs, I'd be happy to show you ZEN solutions!"

🔧 CORE PRINCIPLE:
ALWAYS provide ZEN DSL solutions. NEVER suggest JavaScript, SQL, Python, or other languages. 
For data processing tasks, show the ZEN way exclusively.

🎯 RESPONSE STYLE:
- Start directly with ZEN solutions for valid questions
- Include practical examples using user's data
- Explain ZEN syntax clearly and accurately
- Offer multiple ZEN approaches when relevant
- Maintain professional focus on ZEN DSL capabilities.`;

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
    
    // 🔍 DETECT BREVITY REQUESTS
    const brevityKeywords = ['brief', 'briefly', 'few words', 'short', 'concise', 'quick', 'list', 'summary'];
    const isBrevityRequest = brevityKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    console.log(`🎨 Building adaptive prompt for ${adaptiveStrategy.complexityLevel} user with ${adaptiveStrategy.includeExamples ? 'examples' : 'no examples'}${isBrevityRequest ? ' (BREVITY REQUESTED)' : ''}`);

    const sections: PromptSection[] = [];
    const adaptations: string[] = [];
    const personalizations: string[] = [];

    // 1. System prompt with personalization AND brevity handling
    const personalizedSystem = this.buildPersonalizedSystemPrompt(
      adaptiveStrategy, 
      userProfile, 
      conversationContext,
      isBrevityRequest
    );
    sections.push({
      name: 'system',
      content: personalizedSystem.content,
      tokenEstimate: this.estimateTokens(personalizedSystem.content),
      priority: 'high'
    });
    personalizations.push(...personalizedSystem.personalizations);
    
    if (isBrevityRequest) {
      adaptations.push('brevity mode enabled');
    }

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
    const guidelines = this.buildResponseGuidelines(adaptiveStrategy, userProfile, isBrevityRequest, history.length > 0);
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
    context?: ConversationContext,
    isBrevityRequest: boolean = false
  ): { content: string; personalizations: string[] } {
    
    const personalizations: string[] = [];
    let systemPrompt = this.BASE_SYSTEM_PROMPT;

    // Add context-aware system guidance
    systemPrompt += this.buildContextualGuidance(strategy, profile, context);

    return { content: systemPrompt, personalizations };
  }

  private buildContextualGuidance(
    strategy: AdaptiveResponse,
    profile?: UserProfile,
    context?: ConversationContext
  ): string {
    let guidance = '\n\n**Response Guidelines:**\n';
    
    // Complexity-based guidance
    switch (strategy.complexityLevel) {
      case 'basic':
        guidance += '- Provide clear, step-by-step explanations\n';
        guidance += '- Include simple examples\n';
        guidance += '- Avoid complex technical details\n';
        break;
      case 'intermediate':
        guidance += '- Balance explanation with practical examples\n';
        guidance += '- Include some technical context\n';
        guidance += '- Show alternative approaches when relevant\n';
        break;
      case 'advanced':
        guidance += '- Focus on efficiency and best practices\n';
        guidance += '- Include performance considerations\n';
        guidance += '- Discuss edge cases and alternatives\n';
        break;
    }

    // Context-specific guidance
    if (context?.flowType) {
      guidance += `\n**Conversation Context:** ${context.flowType}\n`;
      
      switch (context.flowType) {
        case 'learning':
          guidance += '- Prioritize educational value\n';
          guidance += '- Build on previous concepts\n';
          break;
        case 'debugging':
          guidance += '- Focus on problem identification\n';
          guidance += '- Provide troubleshooting steps\n';
          break;
        case 'problem-solving':
          guidance += '- Offer practical solutions\n';
          guidance += '- Consider implementation details\n';
          break;
        case 'exploration':
          guidance += '- Show diverse possibilities\n';
          guidance += '- Encourage experimentation\n';
          break;
      }
    }

    return guidance;
  }

  /**
   * Build adaptive knowledge section with ZEN priority
   */
  private buildAdaptiveKnowledgeSection(
    knowledgeCards: KnowledgeCard[],
    strategy: AdaptiveResponse,
    context?: ConversationContext
  ): { content: string; adaptations: string[] } {
    
    const adaptations: string[] = [];
    let content = '**Relevant ZEN DSL Knowledge:**\n\n';

    // Sort by relevance and ZEN syntax priority
    const sortedCards = [...knowledgeCards]
      .sort((a, b) => {
        // Prioritize ZEN examples over general rules
        const aIsZenExample = a.source.includes('example') || a.content.includes('ZEN');
        const bIsZenExample = b.source.includes('example') || b.content.includes('ZEN');
        
        if (aIsZenExample && !bIsZenExample) return -1;
        if (!aIsZenExample && bIsZenExample) return 1;
        
        // Then sort by relevance score
        return b.relevanceScore - a.relevanceScore;
      });

    // Adaptive filtering based on complexity level with ZEN focus
    let filteredCards = sortedCards;
    if (strategy.complexityLevel === 'basic') {
      // Prefer ZEN examples and simpler foundational content
      filteredCards = sortedCards.filter(card => {
        const isZenExample = card.source.includes('example') || card.content.includes('ZEN');
        const isBasic = !card.content.toLowerCase().includes('advanced') &&
                       !card.content.toLowerCase().includes('performance');
        return isZenExample || isBasic;
      }).slice(0, 5);
      adaptations.push('filtered for basic complexity with ZEN priority');
    } else if (strategy.complexityLevel === 'advanced') {
      // Include more complex content but still prioritize ZEN
      filteredCards = sortedCards.slice(0, 7);
      adaptations.push('included advanced ZEN content');
    } else {
      filteredCards = sortedCards.slice(0, 6);
      adaptations.push('balanced ZEN knowledge selection');
    }

    // Build knowledge content with ZEN emphasis
    filteredCards.forEach((card, index) => {
      const isZenExample = card.source.includes('example') || card.content.includes('ZEN');
      const priority = index < 2 ? '⭐' : '';
      const zenFlag = isZenExample ? '🔧 ZEN SYNTAX' : '📋 DSL RULE';
      
      content += `${index + 1}. ${priority}**${zenFlag}: ${this.capitalizeCategory(card.category)}** (${card.source}):\n`;
      
      if (strategy.includeBackground && index === 0) {
        content += `   *Primary ZEN concept for your current question*\n`;
        adaptations.push('added ZEN background context');
      }
      
      // Enhance ZEN examples with additional emphasis
      if (isZenExample) {
        content += `   ${card.content}\n`;
        content += `   🎯 Remember: Use ZEN syntax exactly as shown above.\n\n`;
      } else {
        content += `   ${card.content}\n\n`;
      }
    });

    // Add ZEN syntax reminder
    content += `💡 **ZEN SYNTAX REMINDER**: Always use ZEN functions like len(), upper(), filter(), map() with # placeholder - never JavaScript equivalents.\n`;

    // Add topic continuity for ongoing conversations
    if (context && context.topicDepth > 1) {
      content += `\n*Note: This continues your ${context.currentTopic} exploration (depth level ${context.topicDepth}) using ZEN DSL.*\n`;
      adaptations.push('added ZEN topic continuity');
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
    if (strategy.suggestedFollowUps.length > 0 && context?.flowType === 'exploration') {
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
    profile?: UserProfile,
    isBrevityRequest: boolean = false,
    hasHistory: boolean = false
  ): { content: string; adaptations: string[] } {
    const adaptations: string[] = [];
    let content = '\n**Response Guidelines:**\n';

    // Complexity-specific guidelines  
    if (strategy.complexityLevel === 'basic') {
      content += '- Provide step-by-step explanations\n';
      content += '- Use simple language and clear examples\n';
      content += '- Focus on core concepts before details\n';
      adaptations.push('simplified for basic level');
    } else if (strategy.complexityLevel === 'advanced') {
      content += '- Include technical depth and edge cases\n';
      content += '- Show optimization opportunities\n';
      content += '- Discuss implementation considerations\n';
      adaptations.push('enhanced for advanced level');
    } else {
      content += '- Balance explanation with practical examples\n';
      content += '- Include relevant context and alternatives\n';
      adaptations.push('balanced for intermediate level');
    }

    // Context-aware guidelines
    if (hasHistory) {
      content += '- Build on previous conversation context\n';
      content += '- Reference earlier examples when relevant\n';
      adaptations.push('conversation-aware guidelines');
    }

    // Brevity handling
    if (isBrevityRequest) {
      content += '\n🎯 **BREVITY MODE**: Provide concise, direct answers with essential information only.\n';
      adaptations.push('brevity mode enabled');
    }

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
    
    const greetingStyle = profile?.preferredComplexity === 'basic' ? 'encouraging' :
                         profile?.preferredComplexity === 'advanced' ? 'professional' : 'friendly';
    
    const explanationDepth = strategy.complexityLevel === 'basic' ? 'minimal' :
                            strategy.complexityLevel === 'advanced' ? 'comprehensive' : 'standard';
    
    const exampleCount = strategy.includeExamples ? 
                        (strategy.complexityLevel === 'advanced' ? 3 : 2) : 1;
    
    const technicalLevel = strategy.complexityLevel === 'basic' ? 'simplified' :
                          strategy.complexityLevel === 'advanced' ? 'technical' : 'standard';
    
    const encouragementLevel = profile?.preferredComplexity === 'basic' ? 'high' :
                              strategy.includeBackground ? 'medium' : 'low';

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