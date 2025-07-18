// Simple in-memory vector store implementation
// Provides text-based similarity matching for knowledge retrieval

export interface Document {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    source: string;      // File path
    category: string;    // Rule type (array, string, etc.)
    type: 'rule' | 'example';
    chunkIndex?: number;
    totalChunks?: number;
    tokens?: number;     // Estimated token count
    zenSyntax?: boolean; // Flag for ZEN syntax priority
    priority?: 'high' | 'medium' | 'low'; // Priority level
    ruleType?: string;   // Rule type classification
    title?: string;      // Title for examples
    expression?: string; // Expression for examples
  };
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;  // 0-1 similarity score
}

export interface CollectionInfo {
  name: string;
  count: number;
  lastUpdate?: Date;
}

export interface KnowledgeCard {
  id: string;
  content: string;
  source: string;
  category: string;
  relevanceScore: number;
}

class VectorStore {
  private documents: Map<string, Document> = new Map();
  private isInitialized = false;
  private collectionName: string;

  constructor(collectionName: string = 'dsl_knowledge') {
    this.collectionName = collectionName;
  }

  /**
   * Initialize the vector store
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing in-memory vector store...');
      this.isInitialized = true;
      console.log(`Vector store initialized: ${this.collectionName}`);
    } catch (error) {
      console.error('Failed to initialize vector store:', error);
      throw new Error(`Vector store initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('VectorStore not initialized. Call initialize() first.');
    }
  }

  /**
   * Add or update documents in the collection
   */
  async upsertDocuments(documents: Document[]): Promise<void> {
    this.ensureInitialized();

    if (documents.length === 0) {
      console.log('No documents to upsert');
      return;
    }

    try {
      for (const doc of documents) {
        this.documents.set(doc.id, doc);
      }

      console.log(`Successfully upserted ${documents.length} documents`);
    } catch (error) {
      console.error('Failed to upsert documents:', error);
      throw new Error(`Document upsert failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for similar documents using simple text matching
   * This is a basic implementation - in production, use proper vector similarity
   */
  async search(query: string, limit: number = 6): Promise<SearchResult[]> {
    this.ensureInitialized();

    try {
      const results: SearchResult[] = [];
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/);

      // Score documents based on text similarity
      for (const [id, doc] of this.documents) {
        const contentLower = doc.content.toLowerCase();
        
        // Simple scoring based on word matches and category relevance
        let score = 0;
        
        // Exact phrase match (highest score)
        if (contentLower.includes(queryLower)) {
          score += 1.0;
        }
        
        // Individual word matches
        for (const word of queryWords) {
          if (word.length > 2 && contentLower.includes(word)) {
            score += 0.3;
          }
        }
        
        // Category boost if query mentions a category
        for (const word of queryWords) {
          if (doc.metadata.category.toLowerCase().includes(word)) {
            score += 0.5;
          }
        }
        
        // Boost for DSL keywords
        const dslKeywords = ['dsl', 'expression', 'function', 'syntax', 'operator'];
        for (const keyword of dslKeywords) {
          if (queryLower.includes(keyword) && contentLower.includes(keyword)) {
            score += 0.2;
          }
        }

        if (score > 0) {
          results.push({
            id,
            content: doc.content,
            metadata: doc.metadata,
            similarity: Math.min(score, 1.0), // Cap at 1.0
          });
        }
      }

      // Sort by similarity score and limit results
      results.sort((a, b) => b.similarity - a.similarity);
      const limitedResults = results.slice(0, limit);

      console.log(`Found ${limitedResults.length} similar documents for query: "${query.substring(0, 50)}..."`);
      return limitedResults;
    } catch (error) {
      console.error('Failed to search documents:', error);
      throw new Error(`Document search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get collection information
   */
  async getCollectionInfo(): Promise<CollectionInfo> {
    this.ensureInitialized();

    try {
      return {
        name: this.collectionName,
        count: this.documents.size,
        lastUpdate: new Date(),
      };
    } catch (error) {
      console.error('Failed to get collection info:', error);
      throw new Error(`Collection info retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert search results to knowledge cards
   */
  searchResultsToKnowledgeCards(results: SearchResult[]): KnowledgeCard[] {
    return results.map(result => ({
      id: result.id,
      content: result.content,
      source: typeof result.metadata.source === 'string' ? result.metadata.source : 'unknown',
      category: typeof result.metadata.category === 'string' ? result.metadata.category : 'general',
      relevanceScore: result.similarity,
    }));
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{ status: string; error?: string }> {
    try {
      if (!this.isInitialized) {
        return { status: 'not_initialized' };
      }

      const info = await this.getCollectionInfo();
      return { 
        status: 'healthy',
        ...info 
      };
    } catch (error) {
      return { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Reset collection (clear all documents)
   */
  async resetCollection(): Promise<void> {
    try {
      this.documents.clear();
      console.log(`Cleared collection: ${this.collectionName}`);
      
      // Reinitialize
      this.isInitialized = false;
      await this.initialize();
    } catch (error) {
      console.error('Failed to reset collection:', error);
      throw new Error(`Collection reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all documents (for debugging)
   */
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  /**
   * Auto-load DSL rules and examples into the vector store
   */
  async autoLoadKnowledgeBase(): Promise<void> {
    this.ensureInitialized();

    try {
      console.log('🔄 Auto-loading DSL knowledge base...');
      
      // Import required services
      const { fileProcessor } = await import('../utils/fileProcessor');
      
      // Process DSL rule files from the correct directory path
      const rulesDirectory = '../../docs/dsl-rules';
      const processedFiles = await fileProcessor.readRuleFiles(rulesDirectory);
      
      if (processedFiles.length === 0) {
        console.log('⚠️  No DSL rule files found for auto-loading');
        return;
      }

      // Convert to documents
      const documents = fileProcessor.processedFilesToDocuments(processedFiles);
      
      // Upsert documents into vector store
      await this.upsertDocuments(documents);
      
      // Also load ZEN vocabulary
      await this.loadZenVocabulary();
      
      const stats = fileProcessor.getProcessingStats(processedFiles);
      console.log(`✅ Auto-loaded DSL knowledge base:`);
      console.log(`   📄 Files: ${stats.totalFiles}`);
      console.log(`   🧩 Chunks: ${stats.totalChunks}`);
      console.log(`   🔢 Tokens: ${stats.totalTokens}`);
      console.log(`   📚 ZEN Vocabulary: Loaded from zen-vocabulary.json`);
      
    } catch (error) {
      console.error('❌ Failed to auto-load knowledge base:', error);
      console.log('⚠️  Server will continue with empty knowledge base');
      // Don't throw - let server continue without knowledge base
    }
  }

  /**
   * Load ZEN vocabulary from JSON file
   */
  private async loadZenVocabulary(): Promise<void> {
    try {
      const path = await import('path');
      const fs = await import('fs');
      
      const vocabularyPath = path.join(__dirname, '../../../docs/config/zen-vocabulary.json');
      
      if (!fs.existsSync(vocabularyPath)) {
        console.log('⚠️  ZEN vocabulary file not found');
        return;
      }

      const vocabularyContent = fs.readFileSync(vocabularyPath, 'utf-8');
      const vocabulary = JSON.parse(vocabularyContent);
      
      // Create vocabulary document
      const vocabularyDoc: Document = {
        id: 'zen_vocabulary_reference',
        content: `ZEN DSL Vocabulary Reference

Valid Functions (${vocabulary.metadata.total_functions}): ${vocabulary.zen_functions.join(', ')}

Valid Operators (${vocabulary.metadata.total_operators}): ${vocabulary.zen_operators.join(', ')}

Valid Keywords (${vocabulary.metadata.total_keywords}): ${vocabulary.zen_keywords.join(', ')}

Function Categories:
- String: ${vocabulary.function_categories.string_functions.join(', ')}
- Array: ${vocabulary.function_categories.array_functions.join(', ')}
- Math: ${vocabulary.function_categories.mathematical_functions.join(', ')}
- Date: ${vocabulary.function_categories.date_functions.join(', ')}
- Type: ${vocabulary.function_categories.type_functions.join(', ')}
- Object: ${vocabulary.function_categories.object_functions.join(', ')}

NEVER use these (hallucinations): ${vocabulary.validation.hallucinations_removed.join(', ')}

Always use ZEN syntax, not JavaScript equivalents.`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'vocabulary',
          type: 'rule',
          tokens: 150,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary-reference'
        }
      };
      
      await this.upsertDocuments([vocabularyDoc]);
      
    } catch (error) {
      console.error('⚠️  Could not load ZEN vocabulary:', error);
    }
  }
}

// Export singleton instance
export const vectorStore = new VectorStore(); 