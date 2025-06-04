// Dynamic Context Manager for optimal token allocation
// Phase 1.1 of Conversation Optimization Plan

export interface ContextBudget {
  staticHeader: number;      // Fixed: 150
  knowledgeCards: number;    // Dynamic: 200-600
  chatHistory: number;       // Dynamic: 0-800  
  jsonContext: number;       // Dynamic: 0-2000
  userMessage: number;       // Actual: measured
  reserve: number;           // Buffer: 200
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ProcessingTimings {
  retrieval: number;
  generation: number;
  total: number;
}

export interface OptimizationMetrics {
  originalTokenEstimate: number;
  optimizedTokenUsage: number;
  efficiency: number; // optimizedTokenUsage / originalTokenEstimate
  knowledgeCardCount: number;
  historyTurnCount: number;
}

export class DynamicContextManager {
  // Phase 2.0: Enhanced Token Budget (2x increase from 8,000 to 16,000)
  private readonly MAX_TOKENS = 16000; // Increased from 8,000 to better utilize Gemini 2.0 Flash capacity
  private readonly STATIC_HEADER_TOKENS = 400; // Increased from 300 to support richer prompts
  private readonly RESERVE_TOKENS = 600; // Increased from 400 for better safety margin

  /**
   * Phase 2.0: Enhanced conversation-flow-aware budget allocation for 16K tokens
   */
  calculateOptimalBudget(
    message: string,
    history: ChatTurn[],
    hasJsonContext: boolean,
    queryComplexity: 'simple' | 'moderate' | 'complex' = 'moderate'
  ): ContextBudget {
    const userTokens = this.estimateTokens(message);
    const availableTokens = this.MAX_TOKENS - this.STATIC_HEADER_TOKENS - userTokens - this.RESERVE_TOKENS;

    const budget: ContextBudget = {
      staticHeader: this.STATIC_HEADER_TOKENS,
      userMessage: userTokens,
      reserve: this.RESERVE_TOKENS,
      knowledgeCards: 0,
      chatHistory: 0,
      jsonContext: 0
    };

    if (availableTokens <= 0) {
      console.warn('⚠️  Token budget exceeded with minimal allocation');
      return budget;
    }

    // Phase 2.0: Enhanced flow-aware allocation strategy for 16K budget
    const conversationFlow = this.detectConversationFlow(message, history);
    
    switch (conversationFlow) {
      case 'learning':
        // Learning flow: prioritize knowledge cards for educational content
        budget.knowledgeCards = Math.min(6000, Math.floor(availableTokens * 0.60)); // 60% for knowledge (was 65%)
        budget.chatHistory = Math.min(3500, Math.floor(availableTokens * 0.25)); // 25% for history
        budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.15) : 0; // 15% for JSON
        console.log(`📚 Learning flow: Knowledge-prioritized allocation (${budget.knowledgeCards} tokens for knowledge)`);
        break;
        
      case 'problem-solving':
        // Problem-solving: prioritize history for solution continuity
        budget.chatHistory = Math.min(6000, Math.floor(availableTokens * 0.45)); // 45% for solution context
        budget.knowledgeCards = Math.min(4500, Math.floor(availableTokens * 0.30)); // 30% for knowledge
        budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.25) : 0; // 25% for data context
        console.log(`🔧 Problem-solving flow: History-prioritized allocation (${budget.chatHistory} tokens for context)`);
        break;
        
      case 'exploration':
        // Exploration: balanced allocation for discovery
        budget.knowledgeCards = Math.min(5000, Math.floor(availableTokens * 0.35)); // 35% for knowledge
        budget.chatHistory = Math.min(5000, Math.floor(availableTokens * 0.35)); // 35% for history
        budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.30) : 0; // 30% for data exploration
        console.log(`🔍 Exploration flow: Balanced allocation (Knowledge: ${budget.knowledgeCards}, History: ${budget.chatHistory})`);
        break;
        
      default:
        // Default: smart allocation based on conversation state
        if (history.length === 0) {
          // New conversation: prioritize knowledge discovery
          budget.knowledgeCards = Math.min(5000, Math.floor(availableTokens * 0.65));
          budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.35) : 0;
          console.log(`🆕 New conversation: Knowledge-focused allocation (${budget.knowledgeCards} tokens for knowledge)`);
        } else {
          // Ongoing conversation: enhanced balanced allocation
          budget.chatHistory = Math.min(4500, Math.floor(availableTokens * 0.35));
          budget.knowledgeCards = Math.min(4500, Math.floor(availableTokens * 0.40));
          budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.25) : 0;
          console.log(`🔄 Ongoing conversation: Enhanced allocation (History: ${budget.chatHistory}, Knowledge: ${budget.knowledgeCards})`);
        }
    }

    // Enhanced complexity adjustments with larger budget
    if (queryComplexity === 'complex') {
      // Complex queries get additional knowledge tokens from reserve
      const extraKnowledge = Math.min(1200, budget.reserve); // Can allocate up to 1200 extra tokens (was 800)
      budget.knowledgeCards += extraKnowledge;
      budget.reserve -= extraKnowledge;
      console.log(`🧠 Complex query boost: +${extraKnowledge} tokens for knowledge`);
    } else if (queryComplexity === 'simple') {
      // Simple queries can use fewer tokens, optimize for speed
      budget.knowledgeCards = Math.min(budget.knowledgeCards, 2000); // Increased from 1200
      budget.chatHistory = Math.min(budget.chatHistory, 1500); // Increased from 800
      console.log(`⚡ Simple query optimization: Reduced allocation for speed`);
    }

    console.log(`💰 Enhanced Token Budget 2.0: Total=${this.MAX_TOKENS}, Available=${availableTokens}, Flow=${conversationFlow}`);
    console.log(`📊 Allocation: Knowledge=${budget.knowledgeCards}, History=${budget.chatHistory}, JSON=${budget.jsonContext}, Reserve=${budget.reserve}`);
    return budget;
  }

  /**
   * Phase 1.2: Detect conversation flow for adaptive allocation
   */
  private detectConversationFlow(message: string, history: ChatTurn[]): 'learning' | 'problem-solving' | 'exploration' | 'default' {
    const messageLower = message.toLowerCase();
    
    // Learning indicators
    const learningIndicators = ['what is', 'how does', 'explain', 'teach me', 'learn', 'understand', 'concept', 'basics', 'introduction'];
    const learningScore = learningIndicators.filter(indicator => messageLower.includes(indicator)).length;
    
    // Problem-solving indicators
    const problemIndicators = ['error', 'fix', 'debug', 'issue', 'problem', 'not working', 'help with', 'troubleshoot', 'solve'];
    const problemScore = problemIndicators.filter(indicator => messageLower.includes(indicator)).length;
    
    // Exploration indicators
    const explorationIndicators = ['try', 'test', 'experiment', 'compare', 'different ways', 'alternatives', 'explore', 'options'];
    const explorationScore = explorationIndicators.filter(indicator => messageLower.includes(indicator)).length;
    
    // Historical context analysis
    if (history.length > 0) {
      const recentMessages = history.slice(-4).map(turn => turn.content.toLowerCase()).join(' ');
      
      if (recentMessages.includes('error') || recentMessages.includes('problem')) {
        return 'problem-solving';
      }
      
      if (recentMessages.includes('what') && recentMessages.includes('how')) {
        return 'learning';
      }
    }
    
    // Score-based detection
    const maxScore = Math.max(learningScore, problemScore, explorationScore);
    
    if (maxScore === 0) return 'default';
    
    if (learningScore === maxScore) return 'learning';
    if (problemScore === maxScore) return 'problem-solving';
    if (explorationScore === maxScore) return 'exploration';
    
    return 'default';
  }

  /**
   * Optimize chat history within token budget
   */
  optimizeHistory(history: ChatTurn[], tokenBudget: number): ChatTurn[] {
    if (tokenBudget <= 0 || history.length === 0) {
      return [];
    }

    let usedTokens = 0;
    const optimizedHistory: ChatTurn[] = [];

    // Include recent messages first, prioritize user questions
    for (let i = history.length - 1; i >= 0; i--) {
      const turn = history[i];
      const turnTokens = this.estimateTokens(turn.content);

      if (usedTokens + turnTokens <= tokenBudget) {
        optimizedHistory.unshift(turn);
        usedTokens += turnTokens;
      } else {
        break;
      }
    }

    console.log(`📜 History optimization: ${history.length} → ${optimizedHistory.length} turns (${usedTokens}/${tokenBudget} tokens)`);
    return optimizedHistory;
  }

  /**
   * Assess query complexity for token allocation
   */
  assessQueryComplexity(message: string): 'simple' | 'moderate' | 'complex' {
    const messageLower = message.toLowerCase();
    
    const complexityIndicators = {
      simple: ['what is', 'how to', 'explain', 'example of'],
      moderate: ['compare', 'difference', 'when to use', 'best way'],
      complex: ['optimize', 'performance', 'edge case', 'implementation', 'architecture', 'multiple', 'combine']
    };

    const scores: Record<'simple' | 'moderate' | 'complex', number> = { simple: 0, moderate: 0, complex: 0 };

    Object.entries(complexityIndicators).forEach(([level, indicators]) => {
      scores[level as keyof typeof scores] = indicators.filter(indicator => messageLower.includes(indicator)).length;
    });

    // Additional complexity factors
    if (message.length > 200) scores.complex += 1;
    if (message.includes('?') && message.includes('and')) scores.complex += 1;
    if (messageLower.includes('@fulljson')) scores.complex += 2;

    const complexity = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0] as 'simple' | 'moderate' | 'complex';

    console.log(`🤔 Query complexity: ${complexity} (scores: ${JSON.stringify(scores)})`);
    return complexity;
  }

  /**
   * Generate optimization metrics for monitoring
   */
  generateOptimizationMetrics(
    originalEstimate: number,
    budget: ContextBudget,
    actualTokens: number
  ): OptimizationMetrics {
    // const totalBudget = Object.values(budget).reduce((sum, val) => sum + val, 0);
    
    return {
      originalTokenEstimate: originalEstimate,
      optimizedTokenUsage: actualTokens,
      efficiency: actualTokens / originalEstimate,
      knowledgeCardCount: Math.floor(budget.knowledgeCards / 80), // Estimate cards
      historyTurnCount: Math.floor(budget.chatHistory / 100) // Estimate turns
    };
  }

  /**
   * Estimate token count for text (rough approximation: 1 token ≈ 4 characters)
   */
  estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate total tokens needed for chat history
   */
  private estimateHistoryTokens(history: ChatTurn[]): number {
    return history.reduce((total, turn) => total + this.estimateTokens(turn.content), 0);
  }

  /**
   * Get budget summary for logging
   */
  getBudgetSummary(budget: ContextBudget): string {
    const total = Object.values(budget).reduce((sum, val) => sum + val, 0);
    const percentages = Object.entries(budget).map(([key, value]) => 
      `${key}: ${value} (${((value/total)*100).toFixed(1)}%)`
    ).join(', ');
    
    return `Total: ${total}/${this.MAX_TOKENS} tokens - ${percentages}`;
  }

  /**
   * Validate budget doesn't exceed limits
   */
  validateBudget(budget: ContextBudget): boolean {
    const total = Object.values(budget).reduce((sum, val) => sum + val, 0);
    const isValid = total <= this.MAX_TOKENS;
    
    if (!isValid) {
      console.error(`❌ Budget validation failed: ${total} > ${this.MAX_TOKENS} tokens`);
    }
    
    return isValid;
  }
} 