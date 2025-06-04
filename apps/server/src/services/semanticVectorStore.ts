// Semantic Vector Store with Real Gemini Embeddings
// Phase 2.1 of Conversation Optimization Plan

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/environment';
import { Document, KnowledgeCard, SearchResult } from './vectorStore';

export interface SemanticDocument extends Document {
  embedding: number[];       // Gemini embedding vector
  semanticTags: string[];    // Extracted concepts
  complexity: 'basic' | 'intermediate' | 'advanced';
  lastAccessed: Date;
  accessCount: number;
}

export interface SemanticSearchResult extends SearchResult {
  similarity: number;        // Cosine similarity score
  semanticTags: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  reasoningPath: string;     // Why this was selected
}

export interface EmbeddingStats {
  totalDocuments: number;
  avgEmbeddingTime: number;
  cacheHitRate: number;
  lastUpdated: Date;
}

export class SemanticVectorStore {
  private embedModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;
  private documents: Map<string, SemanticDocument> = new Map();
  private embeddingCache: Map<string, number[]> = new Map();
  private embeddingStats: EmbeddingStats;
  private isInitialized = false;

  constructor() {
    if (config.gemini.embedKey) {
      const genAI = new GoogleGenerativeAI(config.gemini.embedKey);
      this.embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    }
    
    this.embeddingStats = {
      totalDocuments: 0,
      avgEmbeddingTime: 0,
      cacheHitRate: 0,
      lastUpdated: new Date()
    };
  }

  /**
   * Initialize the semantic vector store
   */
  async initialize(): Promise<void> {
    if (!this.embedModel) {
      console.warn('⚠️  Gemini embedding model not available, falling back to text matching');
      return;
    }

    console.log('🧠 Initializing Semantic Vector Store...');
    this.isInitialized = true;
    console.log('✅ Semantic Vector Store initialized');
  }

  /**
   * Generate embedding for text with caching
   */
  async embedText(text: string): Promise<number[]> {
    if (!this.embedModel) {
      throw new Error('Embedding model not available');
    }

    // Check cache first
    const cacheKey = this.hashText(text);
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!;
    }

    const startTime = Date.now();
    
    try {
      const result = await this.embedModel.embedContent(text);
      const embedding = result.embedding.values;
      
      // Cache the result
      this.embeddingCache.set(cacheKey, embedding);
      
      // Update stats
      const duration = Date.now() - startTime;
      this.updateEmbeddingStats(duration);
      
      console.log(`🔢 Generated embedding: ${embedding.length} dimensions (${duration}ms)`);
      return embedding;
      
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process and store documents with semantic enhancement
   */
  async upsertDocuments(documents: Document[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log(`🔄 Generating semantic embeddings for ${documents.length} documents...`);
    
    const batchSize = 5; // Conservative rate limit
    const batches = this.createBatches(documents, batchSize);
    let processedCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} documents)...`);
      
      try {
        // Process batch with rate limiting
        const enhancedDocs = await this.processBatch(batch);
        
        // Store enhanced documents
        enhancedDocs.forEach(doc => {
          this.documents.set(doc.id, doc);
          processedCount++;
        });
        
        console.log(`✅ Batch ${i + 1} complete: ${processedCount}/${documents.length} documents processed`);
        
        // Rate limiting delay between batches
        if (i < batches.length - 1) {
          console.log('⏳ Rate limiting delay...');
          await this.delay(2000); // 2 seconds between batches
        }
        
      } catch (error) {
        console.error(`❌ Batch ${i + 1} failed:`, error);
        // Continue with next batch instead of failing completely
      }
    }
    
    this.embeddingStats.totalDocuments = this.documents.size;
    this.embeddingStats.lastUpdated = new Date();
    
    console.log(`🎉 Semantic processing complete: ${processedCount}/${documents.length} documents enhanced`);
  }

  /**
   * Semantic search with cosine similarity
   */
  async search(query: string, limit: number = 6): Promise<SemanticSearchResult[]> {
    if (this.documents.size === 0) {
      console.warn('⚠️  No documents in semantic store');
      return [];
    }

    console.log(`🔍 Semantic search: "${query}" (limit: ${limit})`);
    
    let queryEmbedding: number[];
    
    try {
      queryEmbedding = await this.embedText(query);
    } catch (error) {
      console.warn('⚠️  Embedding failed, falling back to text search:', error);
      return this.fallbackTextSearch(query, limit);
    }

    const results: SemanticSearchResult[] = [];
    const searchStartTime = Date.now();

    // Calculate similarities
    for (const [id, doc] of this.documents) {
      if (!doc.embedding) continue;
      
      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
      
      if (similarity > 0.2) { // Minimum similarity threshold
        const reasoning = this.generateReasoning(query, doc, similarity);
        
        results.push({
          id,
          content: doc.content,
          metadata: doc.metadata,
          similarity,
          semanticTags: doc.semanticTags,
          complexity: doc.complexity,
          reasoningPath: reasoning
        });
        
        // Update access stats
        doc.lastAccessed = new Date();
        doc.accessCount++;
      }
    }

    // Sort by similarity and apply diversity filter
    const rankedResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit * 2); // Get more candidates for diversity

    const finalResults = this.applySemanticDiversityFilter(rankedResults, limit);
    
    const searchTime = Date.now() - searchStartTime;
    console.log(`🎯 Semantic search complete: ${finalResults.length} results in ${searchTime}ms`);
    console.log(`📊 Top result: ${finalResults[0]?.similarity.toFixed(3)} similarity`);

    return finalResults;
  }

  /**
   * Process a batch of documents with semantic enhancement
   */
  private async processBatch(documents: Document[]): Promise<SemanticDocument[]> {
    const enhanced: SemanticDocument[] = [];

    for (const doc of documents) {
      try {
        // Generate embedding
        const embedding = await this.embedText(doc.content);
        
        // Extract semantic information
        const semanticTags = this.extractSemanticTags(doc.content);
        const complexity = this.assessComplexity(doc.content);
        
        const enhancedDoc: SemanticDocument = {
          ...doc,
          embedding,
          semanticTags,
          complexity,
          lastAccessed: new Date(),
          accessCount: 0
        };
        
        enhanced.push(enhancedDoc);
        
      } catch (error) {
        console.error(`❌ Failed to enhance document ${doc.id}:`, error);
        // Create fallback document without embedding
        enhanced.push({
          ...doc,
          embedding: [],
          semanticTags: [],
          complexity: 'basic',
          lastAccessed: new Date(),
          accessCount: 0
        });
      }
    }

    return enhanced;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * Apply diversity filter with semantic awareness
   */
  private applySemanticDiversityFilter(
    results: SemanticSearchResult[], 
    limit: number
  ): SemanticSearchResult[] {
    const selected: SemanticSearchResult[] = [];
    const usedCategories = new Set<string>();
    const usedSemanticClusters = new Set<string>();

    // First pass: select highest scoring from each category/cluster
    for (const result of results) {
      if (selected.length >= limit) break;
      
      const category = typeof result.metadata.category === 'string' ? result.metadata.category : 'general';
      const semanticCluster = this.getSemanticCluster(result.semanticTags);
      
      if (!usedCategories.has(category) || !usedSemanticClusters.has(semanticCluster)) {
        selected.push(result);
        usedCategories.add(category);
        usedSemanticClusters.add(semanticCluster);
      }
    }

    // Second pass: fill remaining slots with highest similarity
    for (const result of results) {
      if (selected.length >= limit) break;
      if (!selected.includes(result)) {
        selected.push(result);
      }
    }

    return selected;
  }

  /**
   * Extract semantic tags from content
   */
  private extractSemanticTags(content: string): string[] {
    const contentLower = content.toLowerCase();
    const tags: string[] = [];

    // DSL operation patterns
    const operationPatterns = {
      'array-operations': ['filter', 'map', 'reduce', 'sort', 'array'],
      'string-operations': ['upper', 'lower', 'trim', 'contains', 'split', 'extract', 'matches', 'startsWith', 'endsWith', 'fuzzyMatch'],
      'math-operations': ['math', 'calculation', 'number', 'arithmetic'],
      'date-operations': ['date', 'time', 'format', 'parse'],
      'boolean-logic': ['boolean', 'condition', 'if', 'logic'],
      'object-access': ['object', 'property', 'dot', 'notation'],
      'control-flow': ['loop', 'iteration', 'conditional'],
      'data-types': ['type', 'typeof', 'instanceof']
    };

    Object.entries(operationPatterns).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        tags.push(tag);
      }
    });

    // Complexity indicators
    if (contentLower.includes('advanced') || contentLower.includes('complex')) {
      tags.push('advanced-concept');
    }
    if (contentLower.includes('basic') || contentLower.includes('simple')) {
      tags.push('basic-concept');
    }

    return tags;
  }

  /**
   * Assess content complexity
   */
  private assessComplexity(content: string): 'basic' | 'intermediate' | 'advanced' {
    const contentLower = content.toLowerCase();
    let complexityScore = 0;

    // Complexity indicators
    if (contentLower.includes('advanced') || contentLower.includes('performance')) complexityScore += 3;
    if (contentLower.includes('optimization') || contentLower.includes('edge case')) complexityScore += 2;
    if (contentLower.includes('example') || contentLower.includes('basic')) complexityScore -= 1;
    if (content.split('.').length > 10) complexityScore += 1; // Long content
    if (content.includes('```')) complexityScore += 1; // Has code examples

    if (complexityScore >= 3) return 'advanced';
    if (complexityScore >= 1) return 'intermediate';
    return 'basic';
  }

  /**
   * Generate reasoning for why a document was selected
   */
  private generateReasoning(query: string, doc: SemanticDocument, similarity: number): string {
    const reasons: string[] = [];
    
    reasons.push(`${(similarity * 100).toFixed(1)}% semantic similarity`);
    
    if (doc.semanticTags.length > 0) {
      reasons.push(`semantic tags: ${doc.semanticTags.slice(0, 2).join(', ')}`);
    }
    
    if (doc.accessCount > 0) {
      reasons.push(`${doc.accessCount} previous accesses`);
    }
    
    return reasons.join(' | ');
  }

  /**
   * Get semantic cluster for tags
   */
  private getSemanticCluster(tags: string[]): string {
    if (tags.some(tag => tag.includes('array'))) return 'data-structures';
    if (tags.some(tag => tag.includes('string'))) return 'text-processing';
    if (tags.some(tag => tag.includes('math'))) return 'numerical';
    if (tags.some(tag => tag.includes('date'))) return 'temporal';
    if (tags.some(tag => tag.includes('boolean'))) return 'logical';
    return 'general';
  }

  /**
   * Fallback text search when embeddings fail
   */
  private fallbackTextSearch(query: string, limit: number): SemanticSearchResult[] {
    console.log('🔙 Using fallback text search');
    
    const queryLower = query.toLowerCase();
    const results: SemanticSearchResult[] = [];

    for (const [id, doc] of this.documents) {
      const contentLower = doc.content.toLowerCase();
      let score = 0;

      if (contentLower.includes(queryLower)) score += 1.0;
      
      const queryWords = queryLower.split(/\s+/);
      for (const word of queryWords) {
        if (contentLower.includes(word)) score += 0.3;
      }

      if (score > 0) {
        results.push({
          id,
          content: doc.content,
          metadata: doc.metadata,
          similarity: score / 2, // Normalize for consistency
          semanticTags: doc.semanticTags,
          complexity: doc.complexity,
          reasoningPath: 'text-based fallback'
        });
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Utility methods
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private hashText(text: string): string {
    // Simple hash for caching (in production, use a proper hash function)
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private updateEmbeddingStats(duration: number): void {
    const currentAvg = this.embeddingStats.avgEmbeddingTime;
    const count = this.embeddingCache.size;
    this.embeddingStats.avgEmbeddingTime = (currentAvg * (count - 1) + duration) / count;
  }

  /**
   * Public methods for monitoring and management
   */
  public getStats(): EmbeddingStats {
    return { ...this.embeddingStats };
  }

  public getCollectionInfo(): { count: number; hasEmbeddings: boolean } {
    const withEmbeddings = Array.from(this.documents.values())
      .filter(doc => doc.embedding.length > 0).length;
    
    return {
      count: this.documents.size,
      hasEmbeddings: withEmbeddings > 0
    };
  }

  public clearCache(): void {
    this.embeddingCache.clear();
    console.log('🧹 Embedding cache cleared');
  }

  /**
   * Convert to KnowledgeCard format for compatibility
   */
  public searchResultsToKnowledgeCards(results: SemanticSearchResult[]): KnowledgeCard[] {
    return results.map(result => ({
      id: result.id,
      content: result.content,
      source: typeof result.metadata.source === 'string' ? result.metadata.source : 'unknown',
      category: typeof result.metadata.category === 'string' ? result.metadata.category : 'general',
      relevanceScore: result.similarity
    }));
  }
} 