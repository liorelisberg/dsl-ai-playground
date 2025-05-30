import { ChromaClient, Collection } from 'chromadb';
import { config } from '../config/environment';

// Document interface for embedding
export interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;      // File path
    category: string;    // Rule type (array, string, etc.)
    type: 'rule' | 'example';
    chunkIndex?: number;
    totalChunks?: number;
    tokens?: number;     // Estimated token count
  };
}

// Search result interface
export interface SearchResult {
  id: string;
  content: string;
  metadata: any;
  distance: number;
}

// Collection info interface
export interface CollectionInfo {
  name: string;
  count: number;
  lastUpdate?: Date;
}

// Knowledge card for AI responses
export interface KnowledgeCard {
  id: string;
  content: string;
  source: string;
  category: string;
  relevanceScore: number;
}

class ChromaService {
  private client: ChromaClient | null = null;
  private collection: Collection | null = null;
  private isInitialized = false;

  constructor() {
    // Initialize will be called explicitly
  }

  /**
   * Initialize ChromaDB client and collection
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing ChromaDB service...');
      
      // Create ChromaDB client - using local in-memory database for development
      this.client = new ChromaClient();

      // Check if collection exists, create if not
      try {
        this.collection = await this.client.getCollection({
          name: config.chroma.collectionName,
        });
        console.log(`Connected to existing collection: ${config.chroma.collectionName}`);
      } catch (error) {
        // Collection doesn't exist, create it
        this.collection = await this.client.createCollection({
          name: config.chroma.collectionName,
          metadata: {
            description: 'DSL rules and examples knowledge base',
            created: new Date().toISOString(),
          },
        });
        console.log(`Created new collection: ${config.chroma.collectionName}`);
      }

      this.isInitialized = true;
      console.log('ChromaDB service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ChromaDB service:', error);
      throw new Error(`ChromaDB initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized || !this.collection) {
      throw new Error('ChromaService not initialized. Call initialize() first.');
    }
  }

  /**
   * Upsert documents to the collection
   */
  async upsertDocuments(documents: Document[]): Promise<void> {
    this.ensureInitialized();

    if (documents.length === 0) {
      console.log('No documents to upsert');
      return;
    }

    try {
      const ids = documents.map(doc => doc.id);
      const embeddings = documents.map(doc => doc.content);
      const metadatas = documents.map(doc => doc.metadata);
      const documents_content = documents.map(doc => doc.content);

      await this.collection!.upsert({
        ids,
        documents: documents_content,
        metadatas,
      });

      console.log(`Successfully upserted ${documents.length} documents`);
    } catch (error) {
      console.error('Failed to upsert documents:', error);
      throw new Error(`Document upsert failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for similar documents
   */
  async search(query: string, limit: number = 6): Promise<SearchResult[]> {
    this.ensureInitialized();

    try {
      const results = await this.collection!.query({
        queryTexts: [query],
        nResults: limit,
      });

      // Transform results to SearchResult format
      const searchResults: SearchResult[] = [];
      
      if (results.ids && results.ids[0] && results.documents && results.documents[0] && results.metadatas && results.metadatas[0] && results.distances && results.distances[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          searchResults.push({
            id: results.ids[0][i],
            content: results.documents[0][i] || '',
            metadata: results.metadatas[0][i] || {},
            distance: results.distances[0][i] || 1.0,
          });
        }
      }

      console.log(`Found ${searchResults.length} similar documents for query: "${query.substring(0, 50)}..."`);
      return searchResults;
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
      const count = await this.collection!.count();
      
      return {
        name: config.chroma.collectionName,
        count,
        lastUpdate: new Date(), // Could be stored in metadata
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
      source: result.metadata.source || 'unknown',
      category: result.metadata.category || 'general',
      relevanceScore: 1 - result.distance, // Convert distance to relevance (0-1)
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
   * Reset collection (delete and recreate)
   */
  async resetCollection(): Promise<void> {
    try {
      if (this.client && this.isInitialized) {
        // Delete existing collection
        await this.client.deleteCollection({
          name: config.chroma.collectionName,
        });
        console.log(`Deleted collection: ${config.chroma.collectionName}`);
      }

      // Reinitialize
      this.isInitialized = false;
      await this.initialize();
    } catch (error) {
      console.error('Failed to reset collection:', error);
      throw new Error(`Collection reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const chromaService = new ChromaService(); 