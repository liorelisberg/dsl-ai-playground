import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/environment';

export interface EmbeddingResponse {
  embedding: number[];
  tokensUsed?: number;
}

export interface BatchEmbeddingResponse {
  embeddings: number[][];
  totalTokensUsed?: number;
}

class EmbeddingService {
  private genAI: GoogleGenerativeAI | null = null;
  private embeddingModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;
  private isInitialized = false;

  constructor() {
    // Initialize will be called explicitly
  }

  /**
   * Initialize the embedding service
   */
  async initialize(): Promise<void> {
    try {
      this.validateApiKey();
      
      console.log('Initializing Gemini embedding service...');
      
      this.genAI = new GoogleGenerativeAI(config.gemini.embedKey);
      
      // Use the text embedding model
      this.embeddingModel = this.genAI.getGenerativeModel({ 
        model: 'text-embedding-004' 
      });

      this.isInitialized = true;
      console.log('Gemini embedding service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize embedding service:', error);
      throw new Error(`Embedding service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate API key
   */
  private validateApiKey(): void {
    if (!config.gemini.embedKey) {
      throw new Error('GEMINI_EMBED_KEY environment variable is required');
    }
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized || !this.embeddingModel) {
      throw new Error('EmbeddingService not initialized. Call initialize() first.');
    }
  }

  /**
   * Embed a single text string
   */
  async embedText(text: string): Promise<number[]> {
    this.ensureInitialized();

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    try {
      const result = await this.embeddingModel!.embedContent(text);
      
      if (!result || !result.embedding || !result.embedding.values) {
        throw new Error('Invalid embedding response from Gemini API');
      }

      return result.embedding.values;
    } catch (error) {
      return this.handleEmbeddingError(error, text);
    }
  }

  /**
   * Embed multiple texts in batch
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    this.ensureInitialized();

    if (texts.length === 0) {
      return [];
    }

    const embeddings: number[][] = [];
    const batchSize = 5; // Process in smaller batches to avoid rate limits
    const delay = 1000; // 1 second delay between batches

    console.log(`Processing ${texts.length} texts in batches of ${batchSize}...`);

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);

      // Process each item in the batch
      for (const text of batch) {
        try {
          const embedding = await this.embedText(text);
          embeddings.push(embedding);
          
          // Small delay between individual requests
          await this.sleep(200);
        } catch (error) {
          console.error(`Failed to embed text (length: ${text.length}):`, error);
          // Add a zero vector as fallback
          embeddings.push(new Array(768).fill(0)); // text-embedding-004 produces 768-dimensional vectors
        }
      }

      // Delay between batches
      if (i + batchSize < texts.length) {
        console.log(`Waiting ${delay}ms before next batch...`);
        await this.sleep(delay);
      }
    }

    console.log(`Successfully processed ${embeddings.length} embeddings`);
    return embeddings;
  }

  /**
   * Estimate token count for a text
   */
  estimateTokens(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Handle embedding errors with retries
   */
  private async handleEmbeddingError(error: unknown, text: string): Promise<number[]> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Embedding API Error:', errorMessage);
    console.error('Text length:', text.length);
    console.error('Text preview:', text.substring(0, 100) + '...');

    // Handle specific error types
    if (errorMessage.includes('API_KEY') || errorMessage.includes('authentication')) {
      throw new Error('Invalid API key. Please check GEMINI_EMBED_KEY environment variable.');
    }

    if (errorMessage.includes('RATE_LIMIT') || errorMessage.includes('quota')) {
      console.log('Rate limit hit, retrying after delay...');
      await this.sleep(5000); // Wait 5 seconds
      
      try {
        const result = await this.embeddingModel!.embedContent(text);
        return result.embedding.values;
      } catch (retryError) {
        throw new Error(`Rate limit exceeded and retry failed: ${retryError instanceof Error ? retryError.message : 'Unknown error'}`);
      }
    }

    if (errorMessage.includes('content') || errorMessage.includes('safety')) {
      console.warn('Content filtering applied, using zero vector');
      return new Array(768).fill(0); // Return zero vector for filtered content
    }

    // For other errors, throw them up
    throw new Error(`Embedding failed: ${errorMessage}`);
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check for the embedding service
   */
  async healthCheck(): Promise<{ status: string; error?: string }> {
    try {
      if (!this.isInitialized) {
        return { status: 'not_initialized' };
      }

      // Test with a simple embedding
      const testEmbedding = await this.embedText('test');
      
      if (testEmbedding && testEmbedding.length > 0) {
        return { status: 'healthy' };
      } else {
        return { status: 'error', error: 'Empty embedding response' };
      }
    } catch (error) {
      return { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get embedding model info
   */
  getModelInfo(): { model: string; dimensions: number; provider: string } {
    return {
      model: 'text-embedding-004',
      dimensions: 768,
      provider: 'Google Gemini',
    };
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService(); 