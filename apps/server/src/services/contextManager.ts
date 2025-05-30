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
  private readonly MAX_TOKENS = 2000; // Budget limit
  private readonly STATIC_HEADER_TOKENS = 150;
  private readonly RESERVE_TOKENS = 200;

  /**
   * Calculate optimal token budget allocation based on conversation context
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

    // Smart allocation based on conversation state
    if (history.length === 0) {
      // New conversation: prioritize knowledge discovery
      budget.knowledgeCards = Math.min(600, Math.floor(availableTokens * 0.8));
      budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.2) : 0;
      
      console.log(`🆕 New conversation: Knowledge-focused allocation (${budget.knowledgeCards} tokens for knowledge)`);
    } else {
      // Ongoing conversation: balance history + knowledge
      const estimatedHistoryTokens = this.estimateHistoryTokens(history);
      const historyBudget = Math.min(estimatedHistoryTokens, Math.floor(availableTokens * 0.4));
      
      budget.chatHistory = historyBudget;
      budget.knowledgeCards = Math.min(400, Math.floor(availableTokens * 0.4));
      budget.jsonContext = hasJsonContext ? Math.floor(availableTokens * 0.2) : 0;
      
      console.log(`🔄 Ongoing conversation: Balanced allocation (History: ${budget.chatHistory}, Knowledge: ${budget.knowledgeCards})`);
    }

    // Complexity adjustments
    if (queryComplexity === 'complex') {
      // Complex queries need more knowledge
      const extraKnowledge = Math.min(200, budget.reserve);
      budget.knowledgeCards += extraKnowledge;
      budget.reserve -= extraKnowledge;
    }

    console.log(`💰 Token Budget: Total=${this.MAX_TOKENS}, Available=${availableTokens}, Allocation=${JSON.stringify(budget)}`);
    return budget;
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
    actualUsage: number
  ): OptimizationMetrics {
    const totalBudget = Object.values(budget).reduce((sum, val) => sum + val, 0);
    
    return {
      originalTokenEstimate: originalEstimate,
      optimizedTokenUsage: actualUsage,
      efficiency: actualUsage / originalEstimate,
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