// Topic Manager for Phase 3: Topic Management & Intelligence Layer
// Implements semantic topic similarity detection and ZEN relevance validation

import { SemanticVectorStore } from './semanticVectorStore';
import * as fs from 'fs';
import * as path from 'path';

export interface TopicRelatedness {
  similarity: number;
  relationship: 'same' | 'related' | 'different';
  confidence: number;
}

export interface ZenRelevanceResult {
  isZenRelated: boolean;
  confidence: number;
  zenConcepts: string[];
  detectedFunctions: string[];
  relevanceScore: number;
}

export interface ZenVocabulary {
  zen_functions: string[];
  zen_operators: string[];
  zen_concepts: string[];
  removed_hallucinations?: {
    never_found_in_source: string[];
    explanation: string;
  };
}

export class TopicManager {
  private zenVocabulary: ZenVocabulary | null = null;
  private semanticStore: SemanticVectorStore;

  constructor(semanticStore: SemanticVectorStore) {
    this.semanticStore = semanticStore;
  }

  /**
   * Phase 3.1: Detect topic relatedness using semantic embeddings
   */
  async detectTopicRelatedness(
    currentTopic: string,
    newTopic: string
  ): Promise<TopicRelatedness> {
    try {
      // Generate embeddings for both topics
      const currentEmbedding = await this.semanticStore.embedText(currentTopic);
      const newEmbedding = await this.semanticStore.embedText(newTopic);
      
      // Calculate cosine similarity
      const similarity = this.cosineSimilarity(currentEmbedding, newEmbedding);
      
      // Enhanced relationship determination with stricter thresholds
      let relationship: 'same' | 'related' | 'different';
      let confidence: number;
      
      if (similarity > 0.90) {
        relationship = 'same';
        confidence = similarity;
      } else if (similarity > 0.75) {
        relationship = 'related';
        confidence = similarity * 0.85; // Lower confidence for related topics
      } else {
        relationship = 'different';
        confidence = Math.max(0.1, 1 - similarity); // Ensure minimum confidence
      }
      
      // Additional semantic context check for ZEN-specific topics
      const zenContextBonus = await this.calculateZenContextBonus(currentTopic, newTopic);
      if (zenContextBonus > 0.8 && relationship === 'different') {
        relationship = 'related';
        confidence = Math.min(0.85, confidence + zenContextBonus * 0.3);
      }
      
      return {
        similarity,
        relationship,
        confidence
      };
      
    } catch (error) {
      console.error('Topic relatedness detection failed:', error);
      // Fallback to text-based similarity
      return this.fallbackTopicComparison(currentTopic, newTopic);
    }
  }

  /**
   * Phase 3.2: Enhanced ZEN relevance validation with negative indicators
   */
  async validateZenRelevance(message: string): Promise<ZenRelevanceResult> {
    // Load ZEN vocabulary if not already loaded
    if (!this.zenVocabulary) {
      await this.loadZenVocabulary();
    }

    if (!this.zenVocabulary) {
      console.warn('ZEN vocabulary not available, using fallback validation');
      return this.fallbackZenValidation(message);
    }

    const messageLower = message.toLowerCase();
    
    // STEP 1: Check for strong negative indicators (clearly off-topic)
    const negativeScore = this.calculateNegativeIndicators(messageLower);
    if (negativeScore > 0.8) { // Increased threshold to be less aggressive
      return {
        isZenRelated: false,
        confidence: 1 - negativeScore,
        zenConcepts: [],
        detectedFunctions: [],
        relevanceScore: 0.1
      };
    }
    
    // STEP 2: Find direct ZEN function/operator matches
    const directMatches = this.findDirectMatches(messageLower, this.zenVocabulary);
    
    // STEP 3: Calculate semantic relevance against ZEN concepts
    const semanticScore = await this.calculateSemanticRelevance(message);
    
    // STEP 4: Calculate context relevance (programming/data processing terms)
    const contextScore = this.calculateEnhancedContextRelevance(messageLower);
    
    // STEP 5: Combine scores with negative penalty
    const combinedScore = this.combineRelevanceScores(
      directMatches.score,
      semanticScore,
      contextScore
    );
    
    // Apply negative penalty (but less aggressively)
    const finalConfidence = Math.max(0.05, combinedScore - (negativeScore * 0.3)); // Reduced penalty
    
    return {
      isZenRelated: finalConfidence > 0.5, // Lowered threshold from 0.65 to 0.5
      confidence: finalConfidence,
      zenConcepts: directMatches.concepts,
      detectedFunctions: directMatches.functions,
      relevanceScore: finalConfidence
    };
  }

  /**
   * Enhanced off-topic deflection with better detection
   */
  generateOffTopicDeflection(
    message: string,
    zenRelevance: ZenRelevanceResult
  ): string | null {
    if (zenRelevance.isZenRelated) {
      return null; // No deflection needed
    }

    // Additional check: if we have ZEN functions detected but low overall confidence,
    // don't deflect (might be a borderline ZEN question)
    if (zenRelevance.detectedFunctions.length > 0 && zenRelevance.confidence > 0.3) {
      return null;
    }

    // For very low confidence, provide clear redirect
    if (zenRelevance.confidence < 0.2) { // Lowered from 0.3
      const topic = this.extractTopicFromMessage(message);
      return `I'm specialized in ZEN DSL (Domain Specific Language) for data processing and transformation. ` +
             `For questions about ${topic}, I'd recommend consulting specialized resources. ` +
             `However, if you have data processing needs, I'd be happy to show you how ZEN DSL can help!`;
    }

    // Try to find a ZEN bridge for borderline topics
    const bridge = this.findZenBridge(message, zenRelevance.confidence);
    
    if (bridge) {
      return `I understand you're asking about ${bridge.topic}. While that's outside ZEN DSL's core scope, here's how you might approach similar data processing tasks using ZEN: ${bridge.suggestion}`;
    }

    // Default soft redirect - only for truly off-topic content
    return `That's not directly related to ZEN DSL functionality. I specialize in ZEN's data processing, filtering, and transformation capabilities. ` +
           `Is there a specific data manipulation task I can help you solve with ZEN?`;
  }

  /**
   * Load comprehensive ZEN vocabulary from corrected vocabulary file
   */
  private async loadZenVocabulary(): Promise<void> {
    try {
      // Try to load corrected vocabulary first, fallback to original
      const vocabularyPaths = [
        path.join(process.cwd(), 'config/zen-vocabulary-corrected.json'),
        path.join(__dirname, '../../config/zen-vocabulary-corrected.json'),
        path.join(__dirname, '../../../config/zen-vocabulary-corrected.json'),
        path.join(__dirname, '../../../../config/zen-vocabulary-corrected.json')
      ];

      for (const vocabularyPath of vocabularyPaths) {
        if (fs.existsSync(vocabularyPath)) {
          const vocabularyContent = fs.readFileSync(vocabularyPath, 'utf8');
          this.zenVocabulary = JSON.parse(vocabularyContent);
          
          const stats = {
            functions: this.zenVocabulary?.zen_functions?.length || 0,
            operators: this.zenVocabulary?.zen_operators?.length || 0,
            concepts: this.zenVocabulary?.zen_concepts?.length || 0
          };
          
          console.log(`📚 ZEN vocabulary loaded: ${stats.functions} functions, ${stats.operators} operators, ${stats.concepts} concepts`);
          return;
        }
      }

      console.warn('ZEN vocabulary file not found, using fallback');
      this.zenVocabulary = this.createFallbackVocabulary();
      
    } catch (error) {
      console.error('Failed to load ZEN vocabulary:', error);
      this.zenVocabulary = this.createFallbackVocabulary();
    }
  }

  /**
   * Find direct matches for ZEN functions and concepts
   */
  private findDirectMatches(
    messageLower: string,
    vocabulary: ZenVocabulary
  ): { score: number; concepts: string[]; functions: string[] } {
    const foundFunctions: string[] = [];
    const foundConcepts: string[] = [];
    
    // Check if message explicitly mentions ZEN
    const hasZenKeyword = messageLower.includes('zen');
    
    // Check for ZEN functions
    vocabulary.zen_functions.forEach(func => {
      if (messageLower.includes(func.toLowerCase())) {
        foundFunctions.push(func);
      }
    });

    // Check for ZEN operators
    vocabulary.zen_operators.forEach(op => {
      if (messageLower.includes(op.toLowerCase())) {
        foundConcepts.push(op);
      }
    });

    // Check for ZEN concepts
    vocabulary.zen_concepts.forEach(concept => {
      if (messageLower.includes(concept.toLowerCase())) {
        foundConcepts.push(concept);
      }
    });

    // Calculate score based on matches with improved weighting
    const functionScore = foundFunctions.length * 0.6; // Increased again from 0.5
    const conceptScore = foundConcepts.length * 0.3; // Increased from 0.25
    const totalMatches = foundFunctions.length + foundConcepts.length;
    
    // Bonus for multiple matches (indicates deeper ZEN context)
    const bonusScore = totalMatches > 1 ? 0.3 : 0;
    
    // Major bonus if ZEN is explicitly mentioned with functions/concepts
    const zenKeywordBonus = hasZenKeyword && totalMatches > 0 ? 0.4 : 0;
    
    // Additional bonus for function-focused questions (contains "function", "what is", etc.)
    const functionQuestionBonus = this.isFunctionQuestion(messageLower, foundFunctions) ? 0.25 : 0;
    
    const totalScore = functionScore + conceptScore + bonusScore + zenKeywordBonus + functionQuestionBonus;
    
    return {
      score: Math.min(totalScore, 1.0),
      concepts: foundConcepts,
      functions: foundFunctions
    };
  }

  /**
   * Check if message is asking about a specific function
   */
  private isFunctionQuestion(messageLower: string, foundFunctions: string[]): boolean {
    if (foundFunctions.length === 0) return false;
    
    const questionIndicators = [
      'what is', 'how do', 'how to', 'function', 'use the', 'about the'
    ];
    
    return questionIndicators.some(indicator => messageLower.includes(indicator));
  }

  /**
   * Calculate semantic relevance using embeddings
   */
  private async calculateSemanticRelevance(message: string): Promise<number> {
    try {
      // Enhanced ZEN context with more comprehensive keywords
      const zenContext = "ZEN DSL data processing filtering mapping transformation array string date operations functions programming expression evaluation";
      const messageEmbedding = await this.semanticStore.embedText(message);
      const zenEmbedding = await this.semanticStore.embedText(zenContext);
      
      const similarity = this.cosineSimilarity(messageEmbedding, zenEmbedding);
      
      // Boost semantic score if message contains programming concepts
      const programmingBoost = this.calculateProgrammingBoost(message.toLowerCase());
      
      return Math.min(similarity + programmingBoost, 1.0);
    } catch (error) {
      console.warn('Semantic relevance calculation failed:', error);
      return 0.3; // Neutral score
    }
  }

  /**
   * Calculate programming context boost
   */
  private calculateProgrammingBoost(messageLower: string): number {
    const programmingTerms = [
      'function', 'array', 'string', 'data', 'process', 'filter', 'map', 
      'transform', 'operation', 'expression', 'dsl', 'programming'
    ];
    
    const matches = programmingTerms.filter(term => messageLower.includes(term)).length;
    return Math.min(matches * 0.08, 0.3); // Up to 0.3 boost
  }

  /**
   * Combine multiple relevance scores into final confidence
   */
  private combineRelevanceScores(
    directScore: number,
    semanticScore: number,
    contextScore: number
  ): number {
    // More conservative weights - direct matches are crucial
    const weights = {
      direct: 0.6,    // Increased from 0.5
      semantic: 0.25, // Decreased from 0.3
      context: 0.15   // Decreased from 0.2
    };

    const combined = (
      directScore * weights.direct +
      semanticScore * weights.semantic +
      contextScore * weights.context
    );

    // Apply stricter scaling - require stronger evidence
    return Math.pow(combined, 1.2); // Makes lower scores even lower
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Fallback topic comparison using text similarity
   */
  private fallbackTopicComparison(
    currentTopic: string,
    newTopic: string
  ): TopicRelatedness {
    const current = currentTopic.toLowerCase();
    const newTop = newTopic.toLowerCase();
    
    // Simple word overlap calculation
    const currentWords = current.split(/\s+/);
    const newWords = newTop.split(/\s+/);
    
    const overlap = currentWords.filter(word => 
      newWords.includes(word) && word.length > 2
    ).length;
    
    const maxWords = Math.max(currentWords.length, newWords.length);
    const similarity = maxWords > 0 ? overlap / maxWords : 0;
    
    let relationship: 'same' | 'related' | 'different';
    if (similarity > 0.7) relationship = 'same';
    else if (similarity > 0.3) relationship = 'related';
    else relationship = 'different';
    
    return {
      similarity,
      relationship,
      confidence: similarity
    };
  }

  /**
   * Fallback ZEN validation using basic keywords
   */
  private fallbackZenValidation(message: string): ZenRelevanceResult {
    const basicZenTerms = [
      'zen', 'dsl', 'filter', 'map', 'array', 'string', 'date',
      'function', 'expression', 'len', 'contains', 'sum', 'avg'
    ];

    const messageLower = message.toLowerCase();
    const foundTerms = basicZenTerms.filter(term => 
      messageLower.includes(term)
    );

    const confidence = Math.min(foundTerms.length * 0.3, 0.9);

    return {
      isZenRelated: confidence > 0.6,
      confidence,
      zenConcepts: foundTerms,
      detectedFunctions: foundTerms.filter(term => 
        ['filter', 'map', 'len', 'contains', 'sum', 'avg'].includes(term)
      ),
      relevanceScore: confidence
    };
  }

  /**
   * Find ZEN bridge for borderline topics
   */
  private findZenBridge(
    message: string,
    confidence: number
  ): { topic: string; suggestion: string } | null {
    if (confidence < 0.3) {
      return null; // Too far off-topic for bridging
    }

    const messageLower = message.toLowerCase();
    
    // Common bridges to ZEN capabilities
    const bridges = [
      {
        keywords: ['database', 'sql', 'query'],
        topic: 'database queries',
        suggestion: 'Use ZEN DSL to filter and transform your data results with functions like filter() and map().'
      },
      {
        keywords: ['excel', 'spreadsheet', 'csv'],
        topic: 'spreadsheet operations',
        suggestion: 'ZEN DSL excels at processing tabular data with array operations and mathematical functions.'
      },
      {
        keywords: ['json', 'api', 'data'],
        topic: 'data processing',
        suggestion: 'ZEN DSL can parse and transform JSON data using object property access and array operations.'
      },
      {
        keywords: ['text', 'parsing', 'format'],
        topic: 'text processing',
        suggestion: 'ZEN DSL offers powerful string manipulation functions like contains(), substring(), and pattern matching.'
      }
    ];

    for (const bridge of bridges) {
      if (bridge.keywords.some(keyword => messageLower.includes(keyword))) {
        return {
          topic: bridge.topic,
          suggestion: bridge.suggestion
        };
      }
    }

    return null;
  }

  /**
   * Extract topic from user message for deflection
   */
  private extractTopicFromMessage(message: string): string {
    // Simple topic extraction - could be enhanced with NLP
    const words = message.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'is', 'are', 'and', 'or', 'but', 'how', 'what', 'where', 'when', 'why'];
    const meaningfulWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    return meaningfulWords.slice(0, 2).join(' ') || 'that topic';
  }

  /**
   * Create minimal fallback vocabulary
   */
  private createFallbackVocabulary(): ZenVocabulary {
    return {
      zen_functions: [
        'filter', 'map', 'len', 'contains', 'sum', 'avg', 'max', 'min',
        'substring', 'trim', 'upper', 'lower', 'round', 'floor', 'ceil'
      ],
      zen_operators: [
        '>', '<', '>=', '<=', '==', '!=', '&&', '||', '!', '+', '-', '*', '/', '%'
      ],
      zen_concepts: [
        'arrays', 'strings', 'numbers', 'dates', 'filtering', 'mapping',
        'aggregation', 'transformation', 'conditional logic', 'expressions'
      ]
    };
  }

  /**
   * Calculate ZEN context bonus for topic relatedness
   */
  private async calculateZenContextBonus(topic1: string, topic2: string): Promise<number> {
    const zenTerms = ['array', 'filter', 'map', 'string', 'data', 'function', 'dsl'];
    const combined = `${topic1} ${topic2}`.toLowerCase();
    
    const zenMatches = zenTerms.filter(term => combined.includes(term)).length;
    return Math.min(zenMatches * 0.2, 1.0);
  }

  /**
   * Calculate negative indicators for clearly off-topic content
   */
  private calculateNegativeIndicators(messageLower: string): number {
    const negativeIndicators = [
      // Cooking/Food
      { terms: ['cook', 'recipe', 'pasta', 'food', 'kitchen', 'ingredient', 'meal'], weight: 0.9 },
      
      // Other Programming Languages
      { terms: ['python', 'java', 'javascript', 'c++', 'ruby', 'php'], weight: 0.8 },
      
      // Database/SQL (unless combined with data processing)
      { terms: ['sql', 'mysql', 'database', 'table'], weight: 0.6 },
      
      // Machine Learning (unless data processing context)
      { terms: ['machine learning', 'neural network', 'deep learning', 'ai model'], weight: 0.7 },
      
      // Hardware/System Admin
      { terms: ['server', 'hardware', 'network', 'router', 'cpu'], weight: 0.8 },
      
      // Personal/Life Questions
      { terms: ['relationship', 'career', 'health', 'travel', 'advice'], weight: 0.9 },
      
      // Gaming/Entertainment
      { terms: ['game', 'video', 'movie', 'entertainment', 'sports'], weight: 0.8 }
    ];

    let maxNegativeScore = 0;
    let totalMatches = 0;

    for (const indicator of negativeIndicators) {
      const matches = indicator.terms.filter(term => messageLower.includes(term)).length;
      if (matches > 0) {
        totalMatches += matches;
        maxNegativeScore = Math.max(maxNegativeScore, indicator.weight);
      }
    }

    // Boost negative score if multiple categories match
    const categoryBonus = totalMatches > 2 ? 0.2 : 0;
    return Math.min(maxNegativeScore + categoryBonus, 1.0);
  }

  /**
   * Enhanced context relevance with stricter scoring
   */
  private calculateEnhancedContextRelevance(messageLower: string): number {
    // ZEN-specific programming terms (higher weight)
    const zenTerms = [
      'filter', 'map', 'array', 'string', 'len', 'contains', 'expression',
      'dsl', 'zen', 'data processing', 'transformation'
    ];

    // General programming terms (lower weight)
    const generalTerms = [
      'function', 'variable', 'value', 'result', 'condition', 'logic', 'operation'
    ];

    const zenMatches = zenTerms.filter(term => messageLower.includes(term)).length;
    const generalMatches = generalTerms.filter(term => messageLower.includes(term)).length;

    // ZEN terms get higher weight, general terms get much lower weight
    const zenScore = Math.min(zenMatches * 0.25, 0.6);
    const generalScore = Math.min(generalMatches * 0.08, 0.2);

    return zenScore + generalScore;
  }
} 