#!/usr/bin/env ts-node

import { vectorStore, Document } from '../services/vectorStore';
import { fileProcessor, ProcessedFile } from '../utils/fileProcessor';

interface EmbeddingProgress {
  totalFiles: number;
  processedFiles: number;
  totalChunks: number;
  processedChunks: number;
  errors: string[];
  startTime: Date;
  estimatedCompletion?: Date;
}

interface ScriptOptions {
  dryRun: boolean;
  reset: boolean;
  rulesDirectory: string;
  verbose: boolean;
}

class EmbeddingScript {
  private progress: EmbeddingProgress = {
    totalFiles: 0,
    processedFiles: 0,
    totalChunks: 0,
    processedChunks: 0,
    errors: [],
    startTime: new Date(),
  };

  async run(options: ScriptOptions): Promise<void> {
    console.log('🚀 DSL Rules Embedding Script');
    console.log('==============================');
    console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
    console.log(`Rules Directory: ${options.rulesDirectory}`);
    console.log(`Reset Collection: ${options.reset}`);
    console.log('');

    try {
      // Step 1: Initialize services
      await this.initializeServices(options);

      // Step 2: Process rule files
      const processedFiles = await this.processFiles(options);
      
      if (processedFiles.length === 0) {
        console.log('❌ No files to process');
        return;
      }

      // Step 3: Convert to documents
      const documents = fileProcessor.processedFilesToDocuments(processedFiles);
      this.progress.totalChunks = documents.length;

      console.log(`📊 Processing Summary:`);
      console.log(`  Files: ${processedFiles.length}`);
      console.log(`  Chunks: ${documents.length}`);
      console.log(`  Estimated time: ${this.estimateProcessingTime(documents.length)} minutes`);
      console.log('');

      if (options.dryRun) {
        console.log('🔍 DRY RUN - Would process:');
        for (const file of processedFiles) {
          console.log(`  ${file.category}: ${file.chunks.length} chunks (${file.totalTokens} tokens)`);
        }
        return;
      }

      // Step 4: Embed and store documents
      await this.embedDocuments(documents, options);

      // Step 5: Verification and reporting
      await this.generateReport();

      console.log('✅ Embedding script completed successfully!');
    } catch (error) {
      console.error('❌ Script failed:', error);
      process.exit(1);
    }
  }

  private async initializeServices(options: ScriptOptions): Promise<void> {
    console.log('🔧 Initializing services...');

    try {
      // Initialize vector store
      console.log('  📚 Initializing vector store...');
      if (options.reset) {
        console.log('  🗑️  Resetting collection...');
        await vectorStore.resetCollection();
      } else {
        await vectorStore.initialize();
      }

      // Health checks
      const vectorStoreHealth = await vectorStore.healthCheck();

      if (vectorStoreHealth.status !== 'healthy') {
        throw new Error(`Vector store not healthy: ${vectorStoreHealth.error}`);
      }

      console.log('✅ All services initialized successfully');
      console.log('');
    } catch (error) {
      throw new Error(`Service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processFiles(options: ScriptOptions): Promise<ProcessedFile[]> {
    console.log('📁 Processing rule files...');

    try {
      const processedFiles = await fileProcessor.readRuleFiles(options.rulesDirectory);
      this.progress.totalFiles = processedFiles.length;

      if (options.verbose) {
        for (const file of processedFiles) {
          console.log(`  📄 ${file.category}:`);
          console.log(`     Path: ${file.filePath}`);
          console.log(`     Chunks: ${file.chunks.length}`);
          console.log(`     Tokens: ${file.totalTokens}`);
          console.log('');
        }
      }

      const stats = fileProcessor.getProcessingStats(processedFiles);
      console.log(`📊 File Processing Stats:`);
      console.log(`  Total files: ${stats.totalFiles}`);
      console.log(`  Total chunks: ${stats.totalChunks}`);
      console.log(`  Total tokens: ${stats.totalTokens}`);
      console.log(`  Avg chunks per file: ${stats.averageChunksPerFile.toFixed(1)}`);
      console.log(`  Avg tokens per chunk: ${stats.averageTokensPerChunk.toFixed(1)}`);
      console.log('');

      return processedFiles;
    } catch (error) {
      throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async embedDocuments(documents: Document[], _options: ScriptOptions): Promise<void> {
    console.log('🧠 Embedding documents...');

    const batchSize = 10; // Process in batches to avoid overwhelming the API
    const batches = this.createBatches(documents, batchSize);

    console.log(`Processing ${documents.length} documents in ${batches.length} batches...`);
    console.log('');

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchProgress = `[${batchIndex + 1}/${batches.length}]`;
      
      console.log(`${batchProgress} Processing batch of ${batch.length} documents...`);

      try {
        // Embed the batch
        const startTime = Date.now();
        await vectorStore.upsertDocuments(batch);
        const endTime = Date.now();

        this.progress.processedChunks += batch.length;
        
        // Update progress
        const progressPercent = ((this.progress.processedChunks / this.progress.totalChunks) * 100).toFixed(1);
        const elapsedMs = endTime - startTime;
        
        console.log(`${batchProgress} ✅ Completed in ${elapsedMs}ms (${progressPercent}% total)`);

        // Progress bar
        this.displayProgressBar();

        // Small delay between batches
        if (batchIndex < batches.length - 1) {
          await this.sleep(500);
        }
      } catch (error) {
        const errorMsg = `Batch ${batchIndex + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`${batchProgress} ❌ ${errorMsg}`);
        this.progress.errors.push(errorMsg);
      }
    }

    console.log('');
    console.log(`✅ Embedding completed: ${this.progress.processedChunks}/${this.progress.totalChunks} documents`);

    if (this.progress.errors.length > 0) {
      console.log(`⚠️  ${this.progress.errors.length} errors occurred:`);
      for (const error of this.progress.errors) {
        console.log(`   - ${error}`);
      }
    }
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private displayProgressBar(): void {
    const progress = this.progress.processedChunks / this.progress.totalChunks;
    const barLength = 40;
    const filledLength = Math.round(barLength * progress);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    const percent = (progress * 100).toFixed(1);
    
    process.stdout.write(`\r   Progress: [${bar}] ${percent}% (${this.progress.processedChunks}/${this.progress.totalChunks})`);
    
    if (progress >= 1) {
      console.log(''); // New line when complete
    }
  }

  private estimateProcessingTime(chunks: number): number {
    // Rough estimate: 1 second per chunk (including API calls and delays)
    return Math.ceil(chunks / 60); // Convert to minutes
  }

  private async generateReport(): Promise<void> {
    console.log('');
    console.log('📊 Final Report');
    console.log('===============');

    try {
      const collectionInfo = await vectorStore.getCollectionInfo();
      const endTime = new Date();
      const totalTime = (endTime.getTime() - this.progress.startTime.getTime()) / 1000; // seconds

      console.log(`Collection: ${collectionInfo.name}`);
      console.log(`Total Documents: ${collectionInfo.count}`);
      console.log(`Processing Time: ${totalTime.toFixed(1)} seconds`);
      console.log(`Success Rate: ${((this.progress.processedChunks / this.progress.totalChunks) * 100).toFixed(1)}%`);
      
      if (this.progress.errors.length > 0) {
        console.log(`Errors: ${this.progress.errors.length}`);
      }

      console.log('');
      console.log('🎯 Next Steps:');
      console.log('  1. Start the server to test knowledge retrieval');
      console.log('  2. Try asking DSL questions in the chat');
      console.log('  3. Verify responses include relevant rule sources');
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  const options: ScriptOptions = {
    dryRun: args.includes('--dry-run'),
    reset: args.includes('--reset'),
    rulesDirectory: args.find(arg => arg.startsWith('--rules='))?.split('=')[1] || './docs/dsl-rules',
    verbose: args.includes('--verbose') || args.includes('-v'),
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log('DSL Rules Embedding Script');
    console.log('');
    console.log('Usage: pnpm run embed [options]');
    console.log('');
    console.log('Options:');
    console.log('  --dry-run         Preview what would be processed without making changes');
    console.log('  --reset           Delete and recreate the vector store collection');
    console.log('  --rules=PATH      Specify custom rules directory (default: ./docs/dsl-rules)');
    console.log('  --verbose, -v     Show detailed processing information');
    console.log('  --help, -h        Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  pnpm run embed                    # Normal processing');
    console.log('  pnpm run embed --dry-run          # Preview mode');
    console.log('  pnpm run embed --reset            # Reset collection');
    console.log('  pnpm run embed --rules=./custom   # Custom rules directory');
    return;
  }

  const script = new EmbeddingScript();
  await script.run(options);
}

// Run the script if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
} 