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
  private readonly BASE_SYSTEM_PROMPT = `You are a specialized ZEN DSL (Domain Specific Language) expert assistant with deep knowledge of the ZEN expression language.

🚨 CRITICAL: ZEN DSL is NOT JavaScript. Use ONLY ZEN syntax:

✅ ZEN SYNTAX (ALWAYS USE):
- String length: len("text") ← NOT text.length
- String case: upper("text"), lower("TEXT") ← NOT .toUpperCase()/.toLowerCase()  
- String operations: contains(), trim(), startsWith(), endsWith(), matches(), split()
- Array operations: filter(array, # > 5), map(array, # * 2), len(array) ← NOT .filter()/.map()
- Boolean logic: and, or, not ← NOT &&, ||, !
- Math functions: round(), sqrt(), floor(), ceil(), abs(), pow(), min(), max()
- Array indexing: array[0], array[-1] (negative indexing supported)
- Type checking: type(value), string(value), number(value)
- Object access: object.property.nested
- Conditionals: condition ? value1 : value2

❌ NEVER USE JavaScript syntax:
- .length, .toUpperCase(), .toLowerCase(), .split(), .filter(), .map()
- &&, ||, ! (use and, or, not instead)
- ** for power (use pow() instead)
- .includes(), .indexOf(), .match(), .test()

🎯 YOUR EXPERTISE: Mathematical operations, Array manipulation with # placeholder, String processing with ZEN functions, Date/time handling, Boolean logic with ZEN operators, Object property access, Type checking with type() function, and Advanced ZEN DSL patterns.

🔗 CONVERSATION CONTINUITY RULES:
- ALWAYS reference previous discussion when conversation history exists
- Use conversation markers like "Building on our discussion of...", "As we explored...", "Continuing from..."
- Connect new concepts to previously covered topics explicitly
- Acknowledge the user's learning progression and previous questions
- Maintain conversation flow and topic threading throughout responses
- Show awareness of the conversation's journey and context

⚡ RESPONSE RULE: ALWAYS provide ZEN DSL syntax examples, never JavaScript equivalents.`;

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

    // Add expertise-level guidance
    if (profile) {
      switch (profile.expertiseLevel) {
        case 'beginner':
          systemPrompt += `\n\nYou are working with a beginner who benefits from clear explanations, step-by-step guidance, and practical ZEN examples. Always explain concepts before diving into implementation details using ZEN syntax.`;
          personalizations.push('beginner-friendly tone');
          break;
        case 'intermediate':
          systemPrompt += `\n\nYou are working with someone who has intermediate ZEN DSL knowledge. They understand basics but appreciate deeper insights, best practices, and when to use different ZEN approaches.`;
          personalizations.push('intermediate-level insights');
          break;
        case 'advanced':
          systemPrompt += `\n\nYou are working with an advanced ZEN user who values efficiency, performance considerations, edge cases, and implementation details. They can handle complex ZEN concepts and appreciate technical depth.`;
          personalizations.push('advanced technical depth');
          break;
      }
    }

    // Add conversation flow awareness
    if (context) {
      switch (context.flowType) {
        case 'learning':
          systemPrompt += `\n\nThe user is in learning mode. Focus on building ZEN understanding, provide educational context, and suggest progressive learning paths using ZEN syntax.`;
          personalizations.push('learning-focused approach');
          break;
        case 'problem-solving':
          systemPrompt += `\n\nThe user is trying to solve a specific problem. Be solution-oriented, provide practical ZEN implementations, and consider edge cases in ZEN DSL.`;
          personalizations.push('solution-oriented responses');
          break;
        case 'debugging':
          systemPrompt += `\n\nThe user is troubleshooting a ZEN DSL issue. Be systematic, help identify root causes, and provide clear debugging steps using correct ZEN syntax.`;
          personalizations.push('debugging assistance');
          break;
        case 'exploration':
          systemPrompt += `\n\nThe user is exploring ZEN DSL capabilities. Provide comprehensive coverage of ZEN functions, suggest related ZEN concepts, and encourage discovery.`;
          personalizations.push('exploratory guidance');
          break;
      }
    }

    // 🎯 BREVITY HANDLING
    if (isBrevityRequest) {
      systemPrompt += `\n\n🎯 BREVITY MODE: The user requested a brief response. Provide:
- Concise, direct answers
- Essential ZEN syntax only 
- Minimal explanations
- Focus on core functionality
- Use bullet points or short lists when appropriate
- Skip verbose examples unless specifically requested`;
      personalizations.push('brevity mode enabled');
    }

    return { content: systemPrompt, personalizations };
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
    let content = '**Response Guidelines:**\n';

    const guidelines: string[] = [];

    // 🔗 CONVERSATION CONTINUITY RULES (Phase 2.2)
    if (hasHistory) {
      guidelines.push('🔗 REFERENCE previous conversation elements explicitly');
      guidelines.push('📚 CONNECT new concepts to topics already discussed');
      guidelines.push('🎯 USE conversation markers: "As we discussed...", "Building on our discussion of...", "Continuing from..."');
      guidelines.push('🧵 ACKNOWLEDGE the user\'s learning progression and previous questions');
      guidelines.push('📈 SHOW awareness of the conversation journey and context');
      adaptations.push('conversation continuity rules applied');
    }

    // 🎯 BREVITY FIRST - Override complexity if brevity requested
    if (isBrevityRequest) {
      guidelines.push('⚡ BRIEF MODE: Keep response concise and direct');
      guidelines.push('📝 Use bullet points or short lists');
      guidelines.push('🔑 Focus on essential ZEN syntax only');
      guidelines.push('⚠️ Skip lengthy explanations');
      adaptations.push('brevity guidelines applied');
    } else {
      // Complexity-based guidelines (only if not brief)
      switch (strategy.complexityLevel) {
        case 'basic':
          guidelines.push('Use simple, clear language with ZEN examples');
          guidelines.push('Explain ZEN concepts step-by-step');
          guidelines.push('Avoid technical jargon');
          adaptations.push('basic complexity guidelines');
          break;
        case 'intermediate':
          guidelines.push('Balance ZEN explanation with implementation');
          guidelines.push('Include ZEN best practices');
          guidelines.push('Mention alternative ZEN approaches');
          adaptations.push('intermediate complexity guidelines');
          break;
        case 'advanced':
          guidelines.push('Focus on ZEN implementation details');
          guidelines.push('Discuss ZEN performance implications');
          guidelines.push('Cover ZEN edge cases');
          adaptations.push('advanced complexity guidelines');
          break;
      }
    }

    // Core ZEN guidelines (always apply)
    guidelines.push('🚫 NEVER use JavaScript syntax (.length, .toUpperCase(), etc.)');
    guidelines.push('✅ ALWAYS use ZEN syntax (len(), upper(), filter(), etc.)');
    guidelines.push('📋 Include ZEN function names in responses');

    // Example inclusion (adjust for brevity)
    if (strategy.includeExamples && !isBrevityRequest) {
      guidelines.push('Include practical ZEN code examples');
      guidelines.push('Show before/after scenarios with ZEN syntax');
      adaptations.push('include ZEN examples guideline');
    } else if (strategy.includeExamples && isBrevityRequest) {
      guidelines.push('Include minimal ZEN syntax examples only');
      adaptations.push('brief ZEN examples only');
    }

    // Background context (skip if brevity requested)
    if (strategy.includeBackground && !isBrevityRequest) {
      guidelines.push('Provide ZEN conceptual background');
      guidelines.push('Explain the "why" behind ZEN solutions');
      adaptations.push('include ZEN background guideline');
    }

    // User interaction style
    if (profile && !isBrevityRequest) {
      switch (profile.interactionStyle) {
        case 'concise':
          guidelines.push('Keep ZEN responses focused and brief');
          adaptations.push('concise style preference');
          break;
        case 'examples-focused':
          guidelines.push('Emphasize practical ZEN examples');
          adaptations.push('ZEN examples-focused style');
          break;
        case 'explanatory':
          guidelines.push('Provide thorough ZEN explanations');
          adaptations.push('explanatory ZEN style preference');
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
                              context?.satisfaction && context.satisfaction < 0.5 ? 'medium' : 'low';

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