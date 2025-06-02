// Smart Knowledge Card Selection for optimal relevance
// Phase 1.2 of Conversation Optimization Plan

import { KnowledgeCard } from './vectorStore';
import { ChatTurn } from './contextManager';

export interface ScoredKnowledgeCard extends KnowledgeCard {
  semanticScore: number;     // 0-1: Query relevance
  contextualScore: number;   // 0-1: Conversation relevance  
  recencyScore: number;      // 0-1: Recent mention boost
  tokenCost: number;         // Actual token count
  efficiency: number;        // score / tokenCost ratio
}

export interface SelectionMetrics {
  totalCandidates: number;
  selectedCards: number;
  tokenBudget: number;
  tokensUsed: number;
  averageRelevance: number;
  diversityScore: number;
}

export class KnowledgeOptimizer {
  private readonly DEFAULT_CARD_TOKENS = 80; // Average knowledge card size

  /**
   * Select optimal knowledge cards within token budget
   */
  selectOptimalCards(
    candidates: KnowledgeCard[],
    query: string,
    history: ChatTurn[],
    tokenBudget: number
  ): { cards: ScoredKnowledgeCard[], metrics: SelectionMetrics } {
    
    console.log(`🎯 Selecting optimal knowledge cards from ${candidates.length} candidates with ${tokenBudget} token budget`);

    if (candidates.length === 0 || tokenBudget <= 0) {
      return { 
        cards: [], 
        metrics: this.createEmptyMetrics(candidates.length, tokenBudget)
      };
    }

    // Score all candidates
    const scoredCards = candidates.map(card => this.scoreCard(card, query, history));
    
    // Sort by efficiency (score per token)
    scoredCards.sort((a, b) => b.efficiency - a.efficiency);

    // Apply greedy selection within budget with diversity filter
    const selectedCards = this.greedySelectionWithDiversity(scoredCards, tokenBudget);

    const metrics = this.calculateSelectionMetrics(
      candidates.length,
      selectedCards,
      tokenBudget
    );

    console.log(`📊 Knowledge selection: ${selectedCards.length}/${candidates.length} cards, ${metrics.tokensUsed}/${tokenBudget} tokens, avg relevance: ${(metrics.averageRelevance * 100).toFixed(1)}%`);

    return { cards: selectedCards, metrics };
  }

  /**
   * Score individual knowledge card for relevance and efficiency
   */
  private scoreCard(
    card: KnowledgeCard, 
    query: string, 
    history: ChatTurn[]
  ): ScoredKnowledgeCard {
    const semanticScore = this.calculateSemanticRelevance(card.content, query);
    const contextualScore = this.calculateContextualRelevance(card, history);
    const recencyScore = this.calculateRecencyBoost(card, history);
    const tokenCost = this.estimateTokens(card.content);

    const combinedScore = (
      semanticScore * 0.6 + 
      contextualScore * 0.3 + 
      recencyScore * 0.1
    );

    const efficiency = tokenCost > 0 ? combinedScore / tokenCost : 0;

    return {
      ...card,
      semanticScore,
      contextualScore,
      recencyScore,
      tokenCost,
      efficiency
    };
  }

  /**
   * Calculate semantic relevance between card content and query
   */
  private calculateSemanticRelevance(content: string, query: string): number {
    const contentLower = content.toLowerCase();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

    let score = 0;
    let maxScore = 0;

    // Exact phrase match (highest score)
    if (contentLower.includes(queryLower)) {
      score += 1.0;
    }
    maxScore += 1.0;

    // Individual word matches
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        score += 0.3;
      }
      maxScore += 0.3;
    }

    // Conceptual relevance (DSL-specific keywords)
    const dslConcepts = this.extractDSLConcepts(queryLower);
    const contentConcepts = this.extractDSLConcepts(contentLower);
    
    const conceptOverlap = dslConcepts.filter(concept => 
      contentConcepts.includes(concept)
    ).length;
    
    if (dslConcepts.length > 0) {
      score += (conceptOverlap / dslConcepts.length) * 0.4;
      maxScore += 0.4;
    }

    return maxScore > 0 ? Math.min(score / maxScore, 1.0) : 0;
  }

  /**
   * Calculate contextual relevance based on conversation history
   */
  private calculateContextualRelevance(card: KnowledgeCard, history: ChatTurn[]): number {
    if (history.length === 0) return 0;

    const recentMessages = history.slice(-4); // Last 4 messages
    const historyText = recentMessages.map(turn => turn.content).join(' ').toLowerCase();
    const cardCategory = card.category.toLowerCase();
    const cardContent = card.content.toLowerCase();

    let score = 0;

    // Category mentioned in recent conversation
    if (historyText.includes(cardCategory)) {
      score += 0.6;
    }

    // Content keywords in recent conversation
    const cardKeywords = this.extractKeywords(cardContent);
    const historyKeywords = this.extractKeywords(historyText);
    
    const keywordOverlap = cardKeywords.filter(keyword => 
      historyKeywords.includes(keyword)
    ).length;

    if (cardKeywords.length > 0) {
      score += (keywordOverlap / cardKeywords.length) * 0.4;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate recency boost for recently discussed topics
   */
  private calculateRecencyBoost(card: KnowledgeCard, history: ChatTurn[]): number {
    if (history.length === 0) return 0;

    const now = new Date();
    const cardCategory = card.category.toLowerCase();
    
    // Check if card's topic was mentioned in recent messages
    for (let i = history.length - 1; i >= 0; i--) {
      const turn = history[i];
      const messageAge = (now.getTime() - turn.timestamp.getTime()) / (1000 * 60); // minutes ago
      
      if (turn.content.toLowerCase().includes(cardCategory)) {
        // More recent mentions get higher boost
        const recencyMultiplier = Math.max(0, 1 - (messageAge / 60)); // Decay over 1 hour
        return 0.8 * recencyMultiplier;
      }
    }

    return 0;
  }

  /**
   * Greedy selection with diversity filter to avoid redundant content
   */
  private greedySelectionWithDiversity(
    scoredCards: ScoredKnowledgeCard[],
    tokenBudget: number
  ): ScoredKnowledgeCard[] {
    const selected: ScoredKnowledgeCard[] = [];
    const usedCategories = new Set<string>();
    let usedTokens = 0;

    // First pass: select highest scoring from each category
    for (const card of scoredCards) {
      if (usedTokens + card.tokenCost <= tokenBudget && 
          !usedCategories.has(card.category)) {
        selected.push(card);
        usedCategories.add(card.category);
        usedTokens += card.tokenCost;
      }
    }

    // Second pass: fill remaining budget with highest efficiency cards
    for (const card of scoredCards) {
      if (usedTokens + card.tokenCost <= tokenBudget && 
          !selected.includes(card)) {
        selected.push(card);
        usedTokens += card.tokenCost;
      }
    }

    return selected;
  }

  /**
   * Extract DSL-specific concepts from text
   */
  private extractDSLConcepts(text: string): string[] {
    const dslConcepts = [
      'array', 'filter', 'map', 'reduce', 'sort',
      'string', 'upper', 'lower', 'trim', 'contains', 'split', 'extract', 'matches', 'startsWith', 'endsWith',
      'number', 'math', 'calculation', 'operation',
      'date', 'time', 'format', 'parse',
      'boolean', 'condition', 'logic', 'if',
      'object', 'property', 'access', 'dot notation',
      'function', 'expression', 'syntax', 'dsl'
    ];

    return dslConcepts.filter(concept => text.includes(concept));
  }

  /**
   * Extract important keywords from text
   */
  private extractKeywords(text: string): string[] {
    const words = text.split(/\s+/)
      .map(word => word.replace(/[^\w]/g, '').toLowerCase())
      .filter(word => word.length > 3);

    // Remove common stop words
    const stopWords = new Set(['this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were']);
    
    return words.filter(word => !stopWords.has(word));
  }

  /**
   * Estimate token count for text
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate selection metrics for monitoring
   */
  private calculateSelectionMetrics(
    totalCandidates: number,
    selectedCards: ScoredKnowledgeCard[],
    tokenBudget: number
  ): SelectionMetrics {
    const tokensUsed = selectedCards.reduce((sum, card) => sum + card.tokenCost, 0);
    const averageRelevance = selectedCards.length > 0 
      ? selectedCards.reduce((sum, card) => sum + card.efficiency, 0) / selectedCards.length
      : 0;

    // Calculate diversity (number of unique categories)
    const categories = new Set(selectedCards.map(card => card.category));
    const diversityScore = selectedCards.length > 0 ? categories.size / selectedCards.length : 0;

    return {
      totalCandidates,
      selectedCards: selectedCards.length,
      tokenBudget,
      tokensUsed,
      averageRelevance,
      diversityScore
    };
  }

  /**
   * Create empty metrics for edge cases
   */
  private createEmptyMetrics(totalCandidates: number, tokenBudget: number): SelectionMetrics {
    return {
      totalCandidates,
      selectedCards: 0,
      tokenBudget,
      tokensUsed: 0,
      averageRelevance: 0,
      diversityScore: 0
    };
  }

  /**
   * Get detailed scoring breakdown for debugging
   */
  getCardScoreBreakdown(card: ScoredKnowledgeCard): string {
    return `Card: ${card.category} | Semantic: ${(card.semanticScore * 100).toFixed(1)}% | ` +
           `Contextual: ${(card.contextualScore * 100).toFixed(1)}% | ` +
           `Recency: ${(card.recencyScore * 100).toFixed(1)}% | ` +
           `Efficiency: ${card.efficiency.toFixed(3)} | Tokens: ${card.tokenCost}`;
  }
} 