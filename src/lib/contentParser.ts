/**
 * Generic Content Parser System
 * 
 * Enterprise-grade parser that follows SOLID principles:
 * - Single Responsibility: Each processor handles one block type
 * - Open/Closed: New block types can be added without modifying existing code
 * - Liskov Substitution: All processors implement the same interface
 * - Interface Segregation: Minimal, focused interfaces
 * - Dependency Inversion: Depend on abstractions, not concrete implementations
 */

// ============================================================================
// Core Types & Interfaces
// ============================================================================

export interface ContentBlock {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  startIndex: number;
  endIndex: number;
}

export interface BlockMatch {
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  startIndex: number;
  endIndex: number;
  priority: number; // Higher priority processors run first
}

export interface BlockProcessor {
  readonly type: string;
  readonly priority: number;
  readonly patterns: RegExp[];
  
  canProcess(content: string, context: ParseContext): boolean;
  extract(content: string, context: ParseContext): BlockMatch[];
  validate?(block: BlockMatch): boolean;
}

export interface ParseContext {
  globalContent: string;
  currentIndex: number;
  previousBlocks: ContentBlock[];
  metadata: Record<string, unknown>;
}

export interface ParserConfig {
  processors: BlockProcessor[];
  preserveWhitespace?: boolean;
  debugMode?: boolean;
}

// ============================================================================
// Core Parser Engine
// ============================================================================

export class ContentParser {
  private processors: Map<string, BlockProcessor> = new Map();
  private config: ParserConfig;

  constructor(config: ParserConfig) {
    this.config = config;
    
    // Register processors sorted by priority
    config.processors
      .sort((a, b) => b.priority - a.priority)
      .forEach(processor => {
        this.processors.set(processor.type, processor);
      });
  }

  parse(content: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    const matches = this.findAllMatches(content);
    
    // Sort matches by start index
    matches.sort((a, b) => a.startIndex - b.startIndex);
    
    // Remove overlapping matches (higher priority wins)
    const nonOverlappingMatches = this.removeOverlappingMatches(matches);
    
    let lastIndex = 0;
    
    for (const match of nonOverlappingMatches) {
      // Add text content before this match
      if (match.startIndex > lastIndex) {
        const textContent = content.slice(lastIndex, match.startIndex).trim();
        if (textContent) {
          blocks.push(this.createTextBlock(textContent, lastIndex));
        }
      }
      
      // Add the matched block
      blocks.push(this.createBlock(match));
      lastIndex = match.endIndex;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex).trim();
      if (remainingText) {
        blocks.push(this.createTextBlock(remainingText, lastIndex));
      }
    }
    
    return this.postProcess(blocks);
  }

  private findAllMatches(content: string): BlockMatch[] {
    const matches: BlockMatch[] = [];
    const context: ParseContext = {
      globalContent: content,
      currentIndex: 0,
      previousBlocks: [],
      metadata: {}
    };

    for (const processor of this.processors.values()) {
      if (processor.canProcess(content, context)) {
        const processorMatches = processor.extract(content, context);
        matches.push(...processorMatches);
      }
    }

    return matches;
  }

  private removeOverlappingMatches(matches: BlockMatch[]): BlockMatch[] {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 removeOverlappingMatches input:', matches.length, 'matches');
      matches.forEach((match, i) => {
        console.log(`  ${i + 1}. ${match.type} (priority ${match.priority}): ${match.startIndex}-${match.endIndex} "${match.metadata?.title || match.content}"`);
      });
    }
    
    const result: BlockMatch[] = [];
    
    for (const match of matches) {
      // Check if this match overlaps with any existing match
      const overlappingIndexes: number[] = [];
      result.forEach((existing, index) => {
        if (this.doRangesOverlap(match.startIndex, match.endIndex, existing.startIndex, existing.endIndex)) {
          overlappingIndexes.push(index);
        }
      });
      
      if (overlappingIndexes.length === 0) {
        // No overlap, add the match
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Adding ${match.type} (no overlap)`);
        }
        result.push(match);
      } else {
        // Handle overlap - prioritize composite blocks over simple blocks
        const overlappingMatches = overlappingIndexes.map(i => result[i]);
        const allMatches = [...overlappingMatches, match];
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 Overlap detected for ${match.type}:`, allMatches.map(m => m.type));
        }
        
        // Find the best match (composite blocks like dsl-example win over simple blocks like title)
        const bestMatch = this.selectBestMatch(allMatches);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🏆 Best match selected: ${bestMatch.type}`);
        }
        
        // Remove overlapping matches and add the best one
        for (let i = overlappingIndexes.length - 1; i >= 0; i--) {
          result.splice(overlappingIndexes[i], 1);
        }
        result.push(bestMatch);
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 removeOverlappingMatches result:', result.length, 'matches');
      result.forEach((match, i) => {
        console.log(`  ${i + 1}. ${match.type}: "${match.metadata?.title || match.content}"`);
      });
    }
    
    return result.sort((a, b) => a.startIndex - b.startIndex);
  }

  private selectBestMatch(matches: BlockMatch[]): BlockMatch {
    // Priority order: dsl-example > code > title
    // This ensures composite blocks that consume titles win over standalone titles
    const typePreference = {
      'dsl-example': 3,
      'code': 2,
      'title': 1,
      'text': 0
    };
    
    return matches.reduce((best, current) => {
      const bestPreference = typePreference[best.type] || 0;
      const currentPreference = typePreference[current.type] || 0;
      
      if (currentPreference > bestPreference) {
        return current;
      } else if (currentPreference === bestPreference) {
        // Same type preference, use original priority
        return current.priority > best.priority ? current : best;
      } else {
        return best;
      }
    });
  }

  private doRangesOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && start2 < end1;
  }

  private createBlock(match: BlockMatch): ContentBlock {
    return {
      id: this.generateBlockId(),
      type: match.type,
      content: match.content,
      metadata: match.metadata,
      startIndex: match.startIndex,
      endIndex: match.endIndex
    };
  }

  private createTextBlock(content: string, startIndex: number): ContentBlock {
    return {
      id: this.generateBlockId(),
      type: 'text',
      content,
      startIndex,
      endIndex: startIndex + content.length
    };
  }

  private postProcess(blocks: ContentBlock[]): ContentBlock[] {
    // Apply post-processing rules (e.g., merge adjacent text blocks)
    // Don't filter out blocks with metadata even if content is empty (composite blocks)
    return blocks.filter(block => {
      const hasContent = block.content.trim().length > 0;
      const hasMetadata = block.metadata && Object.keys(block.metadata).length > 0;
      return hasContent || hasMetadata;
    });
  }

  private generateBlockId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Plugin system for extending functionality
  addProcessor(processor: BlockProcessor): void {
    this.processors.set(processor.type, processor);
  }

  removeProcessor(type: string): void {
    this.processors.delete(type);
  }
}

// ============================================================================
// Specific Block Processors
// ============================================================================

export class TitleBlockProcessor implements BlockProcessor {
  readonly type = 'title';
  readonly priority = 100;
  readonly patterns = [/\$\{title\}([\s\S]*?)\$\{title\}/g];

  canProcess(content: string): boolean {
    return this.patterns[0].test(content);
  }

  extract(content: string): BlockMatch[] {
    const matches: BlockMatch[] = [];
    const pattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
    let match;

    // Reset regex state
    pattern.lastIndex = 0;

    while ((match = pattern.exec(content)) !== null) {
      matches.push({
        type: this.type,
        content: match[1].trim(),
        metadata: { 
          title: match[1].trim(),
          rawMatch: match[0]
        },
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        priority: this.priority
      });
    }

    return matches;
  }

  validate(block: BlockMatch): boolean {
    return block.content.trim().length > 0;
  }
}

export class DSLExampleProcessor implements BlockProcessor {
  readonly type = 'dsl-example';
  readonly priority = 90;
  readonly patterns = [
    /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g,
    /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g,
    /\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/g
  ];

  canProcess(content: string): boolean {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚨 DSLExampleProcessor.canProcess called');
    }
    return this.patterns.some(pattern => pattern.test(content));
  }

  extract(content: string): BlockMatch[] {
    const matches: BlockMatch[] = [];
    
    // Debug: Log what we're looking for
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 DSLExampleProcessor analyzing content length:', content.length);
    }
    
    // Find all titles first to establish sections
    const titleMatches = content.matchAll(/\$\{title\}([\s\S]*?)\$\{title\}/g);
    const titles = Array.from(titleMatches);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 DSLExampleProcessor found titles:', titles.length);
    }

    for (let i = 0; i < titles.length; i++) {
      const currentTitle = titles[i];
      const nextTitle = titles[i + 1];
      
      // Section boundaries
      const sectionStart = currentTitle.index! + currentTitle[0].length;
      const sectionEnd = nextTitle ? nextTitle.index! : content.length;
      const sectionContent = content.slice(sectionStart, sectionEnd);

      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Section ${i + 1}: "${currentTitle[1].trim()}" (${sectionContent.length} chars)`);
      }

      // Look for DSL blocks in this section
      const inputMatch = sectionContent.match(/\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/);
      const expressionMatch = sectionContent.match(/\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/);
      const resultMatch = sectionContent.match(/\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/);

      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Section ${i + 1} blocks: input=${!!inputMatch}, expression=${!!expressionMatch}, result=${!!resultMatch}`);
      }

      if (inputMatch && expressionMatch) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Creating DSL example for: "${currentTitle[1].trim()}"`);
        }
        
        // Calculate absolute positions
        const lastBlock = resultMatch || expressionMatch;
        const absoluteEnd = sectionStart + sectionContent.indexOf(lastBlock[0]) + lastBlock[0].length;

        matches.push({
          type: this.type,
          content: '', // Composite block
          metadata: {
            title: currentTitle[1].trim(),
            input: inputMatch[1].trim(),
            expression: expressionMatch[1].trim(),
            result: resultMatch ? resultMatch[1].trim() : undefined,
            section: sectionContent
          },
          startIndex: currentTitle.index!,
          endIndex: absoluteEnd,
          priority: this.priority
        });
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`❌ No DSL blocks found in section: "${currentTitle[1].trim()}"`);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 DSLExampleProcessor returning ${matches.length} matches`);
    }
    return matches;
  }

  validate(block: BlockMatch): boolean {
    const { input, expression } = block.metadata || {};
    return !!(typeof input === 'string' && input.trim() && typeof expression === 'string' && expression.trim());
  }
}

export class CodeBlockProcessor implements BlockProcessor {
  readonly type = 'code';
  readonly priority = 80;
  readonly patterns = [/```(\w+)?\n([\s\S]*?)\n```/g];

  canProcess(content: string): boolean {
    return this.patterns[0].test(content);
  }

  extract(content: string): BlockMatch[] {
    const matches: BlockMatch[] = [];
    const pattern = /```(\w+)?\n([\s\S]*?)\n```/g;
    let match;

    pattern.lastIndex = 0;

    while ((match = pattern.exec(content)) !== null) {
      matches.push({
        type: this.type,
        content: match[2],
        metadata: {
          language: match[1] || 'text',
          raw: match[0]
        },
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        priority: this.priority
      });
    }

    return matches;
  }
}

// ============================================================================
// Factory & Configuration
// ============================================================================

export class ParserFactory {
  static createDSLParser(options: Partial<ParserConfig> = {}): ContentParser {
    const defaultProcessors = [
      new TitleBlockProcessor(),
      new DSLExampleProcessor(),
      new CodeBlockProcessor()
    ];

    const config: ParserConfig = {
      processors: defaultProcessors,
      preserveWhitespace: false,
      debugMode: process.env.NODE_ENV === 'development',
      ...options
    };

    return new ContentParser(config);
  }

  static createCustomParser(processors: BlockProcessor[], options: Partial<ParserConfig> = {}): ContentParser {
    const config: ParserConfig = {
      processors,
      preserveWhitespace: false,
      debugMode: false,
      ...options
    };

    return new ContentParser(config);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

export function convertToLegacyFormat(blocks: ContentBlock[]): Array<{
  type: 'text' | 'dsl-example' | 'title';
  content: string;
  title?: string;
  input?: string;
  expression?: string;
  result?: string;
}> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 convertToLegacyFormat input:', blocks.length, 'blocks');
    blocks.forEach((block, i) => {
      console.log(`  ${i + 1}. ${block.type}: "${block.metadata?.title || block.content}"`);
    });
  }

  const result = blocks.map(block => {
    if (block.type === 'dsl-example') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Converting dsl-example: "${block.metadata?.title}"`);
      }
      return {
        type: 'dsl-example' as const,
        content: '',
        title: block.metadata?.title as string,
        input: block.metadata?.input as string,
        expression: block.metadata?.expression as string,
        result: block.metadata?.result as string
      };
    }
    
    if (block.type === 'title') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Converting title: "${block.content}"`);
      }
      return {
        type: 'title' as const,
        content: block.content,
        title: block.content
      };
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Converting text: "${block.content.substring(0, 50)}..."`);
    }
    return {
      type: 'text' as const,
      content: block.content
    };
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 convertToLegacyFormat result:', result.length, 'blocks');
    result.forEach((block, i) => {
      console.log(`  ${i + 1}. ${block.type}: "${block.title || block.content.substring(0, 50)}..."`);
    });
  }

  return result;
}

export default ContentParser; 