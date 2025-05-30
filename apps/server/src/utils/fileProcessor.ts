import * as fs from 'fs';
import * as path from 'path';
import { Document } from '../services/vectorStore';

export interface ChunkingOptions {
  maxTokens: number;        // 400 tokens max
  overlapTokens: number;    // 50 tokens overlap
  preserveHeaders: boolean; // Don't split markdown headers
  preserveCodeBlocks: boolean; // Keep code examples intact
}

export interface TextChunk {
  content: string;
  tokens: number;
  startIndex: number;
  endIndex: number;
}

export interface ProcessedFile {
  filePath: string;
  category: string;
  description: string;
  chunks: TextChunk[];
  totalTokens: number;
}

export interface RuleFileMetadata {
  description?: string;
  globs?: string;
  alwaysApply?: boolean;
  [key: string]: any;
}

class FileProcessor {
  private defaultChunkingOptions: ChunkingOptions = {
    maxTokens: 400,
    overlapTokens: 50,
    preserveHeaders: true,
    preserveCodeBlocks: true,
  };

  /**
   * Read all .mdc files from the rules directory
   */
  async readRuleFiles(rulesDirectory: string = './data/rules'): Promise<ProcessedFile[]> {
    const processedFiles: ProcessedFile[] = [];

    try {
      // Check if directory exists
      if (!fs.existsSync(rulesDirectory)) {
        throw new Error(`Rules directory not found: ${rulesDirectory}`);
      }

      const files = fs.readdirSync(rulesDirectory);
      const mdcFiles = files.filter(file => file.endsWith('.mdc'));

      console.log(`Found ${mdcFiles.length} .mdc files in ${rulesDirectory}`);

      for (const file of mdcFiles) {
        const filePath = path.join(rulesDirectory, file);
        try {
          const processedFile = await this.processRuleFile(filePath);
          processedFiles.push(processedFile);
          console.log(`Processed ${file}: ${processedFile.chunks.length} chunks, ${processedFile.totalTokens} tokens`);
        } catch (error) {
          console.error(`Failed to process file ${file}:`, error);
        }
      }

      return processedFiles;
    } catch (error) {
      console.error('Failed to read rule files:', error);
      throw error;
    }
  }

  /**
   * Process a single rule file
   */
  async processRuleFile(filePath: string): Promise<ProcessedFile> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.mdc');
    
    // Parse front matter and content
    const { metadata, mainContent } = this.parseFrontMatter(content);
    
    // Extract category from filename
    const category = this.extractCategory(fileName);
    
    // Chunk the content
    const chunks = this.chunkText(mainContent, this.defaultChunkingOptions);
    
    // Calculate total tokens
    const totalTokens = chunks.reduce((sum, chunk) => sum + chunk.tokens, 0);

    return {
      filePath,
      category,
      description: metadata.description || `DSL rules for ${category}`,
      chunks,
      totalTokens,
    };
  }

  /**
   * Parse front matter from markdown file
   */
  private parseFrontMatter(content: string): { metadata: RuleFileMetadata; mainContent: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
      return {
        metadata: {},
        mainContent: content,
      };
    }

    const frontMatterContent = match[1];
    const mainContent = match[2];
    
    // Simple YAML parsing for front matter
    const metadata: RuleFileMetadata = {};
    const lines = frontMatterContent.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        // Handle boolean values
        if (value === 'true') {
          metadata[key] = true;
        } else if (value === 'false') {
          metadata[key] = false;
        } else {
          metadata[key] = value;
        }
      }
    }

    return { metadata, mainContent };
  }

  /**
   * Extract category from filename
   */
  private extractCategory(fileName: string): string {
    // Remove -rule suffix and convert to readable format
    const category = fileName.replace(/-rule$/, '').replace(/-/g, ' ');
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Chunk text intelligently
   */
  chunkText(content: string, options: ChunkingOptions): TextChunk[] {
    const chunks: TextChunk[] = [];
    
    // Split content into logical sections
    const sections = this.splitIntoSections(content, options);
    
    let currentPosition = 0;
    for (const section of sections) {
      const sectionChunks = this.chunkSection(section, options, currentPosition);
      chunks.push(...sectionChunks);
      currentPosition += section.length;
    }

    return chunks;
  }

  /**
   * Split content into logical sections
   */
  private splitIntoSections(content: string, options: ChunkingOptions): string[] {
    const sections: string[] = [];
    
    if (options.preserveHeaders) {
      // Split by markdown headers (## or ###)
      const headerRegex = /^(#{2,3}\s+.+?)$/gm;
      const parts = content.split(headerRegex);
      
      let currentSection = '';
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (headerRegex.test(part)) {
          // This is a header
          if (currentSection.trim()) {
            sections.push(currentSection.trim());
          }
          currentSection = part + '\n';
        } else {
          // This is content
          currentSection += part;
        }
      }
      
      if (currentSection.trim()) {
        sections.push(currentSection.trim());
      }
    } else {
      sections.push(content);
    }

    return sections.filter(section => section.trim().length > 0);
  }

  /**
   * Chunk a single section
   */
  private chunkSection(section: string, options: ChunkingOptions, startOffset: number): TextChunk[] {
    const chunks: TextChunk[] = [];
    const sectionTokens = this.estimateTokens(section);
    
    if (sectionTokens <= options.maxTokens) {
      // Section fits in one chunk
      chunks.push({
        content: section,
        tokens: sectionTokens,
        startIndex: startOffset,
        endIndex: startOffset + section.length,
      });
    } else {
      // Need to split the section
      const sentences = this.splitIntoSentences(section);
      let currentChunk = '';
      let currentTokens = 0;
      let chunkStartIndex = startOffset;
      
      for (const sentence of sentences) {
        const sentenceTokens = this.estimateTokens(sentence);
        
        if (currentTokens + sentenceTokens > options.maxTokens && currentChunk) {
          // Save current chunk
          chunks.push({
            content: currentChunk.trim(),
            tokens: currentTokens,
            startIndex: chunkStartIndex,
            endIndex: chunkStartIndex + currentChunk.length,
          });
          
          // Start new chunk with overlap
          const overlapContent = this.getOverlapContent(currentChunk, options.overlapTokens);
          currentChunk = overlapContent + sentence;
          currentTokens = this.estimateTokens(currentChunk);
          chunkStartIndex += currentChunk.length - overlapContent.length;
        } else {
          currentChunk += sentence;
          currentTokens += sentenceTokens;
        }
      }
      
      // Add final chunk
      if (currentChunk.trim()) {
        chunks.push({
          content: currentChunk.trim(),
          tokens: currentTokens,
          startIndex: chunkStartIndex,
          endIndex: startOffset + section.length,
        });
      }
    }

    return chunks;
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    // Split by periods, newlines, and other sentence boundaries
    return text.split(/(?<=[.!?])\s+|\n\n+/).filter(sentence => sentence.trim().length > 0);
  }

  /**
   * Get overlap content for continuity
   */
  private getOverlapContent(chunk: string, overlapTokens: number): string {
    const sentences = this.splitIntoSentences(chunk);
    let overlapContent = '';
    let overlapTokenCount = 0;
    
    // Take sentences from the end until we reach the overlap token limit
    for (let i = sentences.length - 1; i >= 0; i--) {
      const sentence = sentences[i];
      const sentenceTokens = this.estimateTokens(sentence);
      
      if (overlapTokenCount + sentenceTokens <= overlapTokens) {
        overlapContent = sentence + ' ' + overlapContent;
        overlapTokenCount += sentenceTokens;
      } else {
        break;
      }
    }
    
    return overlapContent.trim();
  }

  /**
   * Estimate token count for text
   */
  estimateTokens(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Convert processed files to documents for ChromaDB
   */
  processedFilesToDocuments(processedFiles: ProcessedFile[]): Document[] {
    const documents: Document[] = [];

    for (const file of processedFiles) {
      for (let i = 0; i < file.chunks.length; i++) {
        const chunk = file.chunks[i];
        
        documents.push({
          id: `${file.category.toLowerCase()}_chunk_${i}`,
          content: chunk.content,
          metadata: {
            source: file.filePath,
            category: file.category.toLowerCase(),
            type: 'rule',
            chunkIndex: i,
            totalChunks: file.chunks.length,
            tokens: chunk.tokens,
          },
        });
      }
    }

    return documents;
  }

  /**
   * Get processing statistics
   */
  getProcessingStats(processedFiles: ProcessedFile[]): {
    totalFiles: number;
    totalChunks: number;
    totalTokens: number;
    averageChunksPerFile: number;
    averageTokensPerChunk: number;
  } {
    const totalFiles = processedFiles.length;
    const totalChunks = processedFiles.reduce((sum, file) => sum + file.chunks.length, 0);
    const totalTokens = processedFiles.reduce((sum, file) => sum + file.totalTokens, 0);

    return {
      totalFiles,
      totalChunks,
      totalTokens,
      averageChunksPerFile: totalChunks / totalFiles,
      averageTokensPerChunk: totalTokens / totalChunks,
    };
  }
}

// Export singleton instance
export const fileProcessor = new FileProcessor(); 