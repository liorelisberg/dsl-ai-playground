/**
 * DSL Expression-Input Pair Detection Utility
 * 
 * This utility extracts DSL expression and input pairs from AI chat responses
 * using explicit markers defined in the system prompt.
 */

export interface ExpressionPair {
  input: string;
  expression: string;
  result?: string;
  title?: string;
  index: number;
}

interface Block {
  type: 'title' | 'input' | 'expression' | 'result';
  content: string;
  start: number;
  end: number;
}

interface BlockCluster {
  blocks: Block[];
  title?: string;
  input?: string;
  expression?: string;
  result?: string;
}

/**
 * Extract expression-input-title triplets from message content using sequential clustering
 * 
 * This approach groups only truly adjacent blocks and respects content flow,
 * avoiding forced pairing of distant educational titles with unrelated examples.
 */
export function extractExpressionPairs(content: string): ExpressionPair[] {
  const pairs: ExpressionPair[] = [];
  
  try {
    // 1. Find all blocks with positions and types
    const blocks = findAllBlocks(content);
    
    // 2. Group consecutive blocks (no big text gaps)
    const clusters = groupConsecutiveBlocks(blocks, content);
    
    // 3. Extract all possible pairs from each cluster
    clusters.forEach(cluster => {
      const clusterPairs = extractPairsFromCluster(cluster);
      pairs.push(...clusterPairs);
    });
    
    // 4. Fix indices after combining all pairs
    pairs.forEach((pair, index) => {
      pair.index = index;
    });
    
    console.log(`🔍 Detected ${pairs.length} expression-input pairs from ${clusters.length} block clusters`);
    
  } catch (error) {
    console.error('Error extracting expression pairs:', error);
  }
  
  return pairs;
}

/**
 * Find all blocks with their positions and types
 */
function findAllBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  
  const patterns = [
    { type: 'title' as const, pattern: /\$\{title\}([\s\S]*?)\$\{title\}/g },
    { type: 'input' as const, pattern: /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g },
    { type: 'expression' as const, pattern: /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g },
    { type: 'result' as const, pattern: /\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/g }
  ];
  
  patterns.forEach(({ type, pattern }) => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach(match => {
      blocks.push({
        type,
        content: match[1].trim(),
        start: match.index!,
        end: match.index! + match[0].length
      });
    });
  });
  
  // Sort blocks by position
  return blocks.sort((a, b) => a.start - b.start);
}

/**
 * Group consecutive blocks with minimal gaps
 */
function groupConsecutiveBlocks(blocks: Block[], content: string): BlockCluster[] {
  const clusters: BlockCluster[] = [];
  let currentCluster: Block[] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const prevBlock = blocks[i - 1];
    
    // Check if there's significant content between blocks
    if (prevBlock && hasSignificantGap(prevBlock, block, content)) {
      // Finish current cluster
      if (currentCluster.length > 0) {
        clusters.push(createClusterFromBlocks(currentCluster));
      }
      // Start new cluster
      currentCluster = [block];
    } else {
      // Add to current cluster
      currentCluster.push(block);
    }
  }
  
  // Add final cluster
  if (currentCluster.length > 0) {
    clusters.push(createClusterFromBlocks(currentCluster));
  }
  
  return clusters;
}

/**
 * Check if there's significant content gap between blocks
 */
function hasSignificantGap(prevBlock: Block, currentBlock: Block, content: string): boolean {
  const gapContent = content.slice(prevBlock.end, currentBlock.start);
  const trimmedGap = gapContent.trim();
  
  // No gap at all - keep together
  if (trimmedGap.length === 0) {
    return false;
  }
  
  // Very permissive - only break on substantial educational content
  // Allow short phrases like "And another:", numbered items, brief descriptions
  const lines = trimmedGap.split('\n').filter(line => line.trim().length > 0);
  
  // Only consider it a significant gap if there's a lot of content
  // This handles the user's case where educational content is substantial
  if (lines.length > 5) {
    return true; // Multiple lines of content
  }
  
  // Or if there's one very long explanatory paragraph
  if (lines.length === 1 && lines[0].length > 200) {
    return true; // Long single paragraph
  }
  
  // For multiple lines, check if it looks like substantial explanation
  if (lines.length > 2) {
    const totalLength = lines.join('').length;
    if (totalLength > 150) {
      return true; // Substantial multi-line content
    }
  }
  
  // Allow everything else (short connectors, numbered lists, brief notes)
  return false;
}

/**
 * Create a cluster object from a group of blocks
 */
function createClusterFromBlocks(blocks: Block[]): BlockCluster {
  const cluster: BlockCluster = { blocks: [] };
  
  blocks.forEach(block => {
    cluster.blocks.push(block);
    
    // For multiple blocks of the same type, use the last one (most recent)
    // This handles cases where there are multiple titles before an example
    switch (block.type) {
      case 'title':
        cluster.title = block.content;
        break;
      case 'input':
        cluster.input = block.content;
        break;
      case 'expression':
        cluster.expression = block.content;
        break;
      case 'result':
        cluster.result = block.content;
        break;
    }
  });
  
  return cluster;
}

/**
 * Extract multiple pairs from a single cluster by matching inputs with expressions
 */
function extractPairsFromCluster(cluster: BlockCluster): ExpressionPair[] {
  const pairs: ExpressionPair[] = [];
  
  // Get all blocks of each type in order
  const titleBlocks = cluster.blocks.filter(b => b.type === 'title');
  const inputBlocks = cluster.blocks.filter(b => b.type === 'input');
  const expressionBlocks = cluster.blocks.filter(b => b.type === 'expression');
  const resultBlocks = cluster.blocks.filter(b => b.type === 'result');
  
  // Match input and expression blocks by position
  const exampleCount = Math.min(inputBlocks.length, expressionBlocks.length);
  const usedTitles = new Set<number>(); // Track which titles have been used
  
  for (let i = 0; i < exampleCount; i++) {
    const inputBlock = inputBlocks[i];
    const expressionBlock = expressionBlocks[i];
    
    // Find the closest preceding title for this example that hasn't been used
    let bestTitle: string | null = null;
    let bestTitleDistance = Infinity;
    let bestTitleIndex = -1;
    
    for (let titleIndex = 0; titleIndex < titleBlocks.length; titleIndex++) {
      const titleBlock = titleBlocks[titleIndex];
      
      // Skip if this title has already been used
      if (usedTitles.has(titleIndex)) {
        continue;
      }
      
      // Only consider titles that come before this input/expression pair
      const exampleStart = Math.min(inputBlock.start, expressionBlock.start);
      if (titleBlock.start < exampleStart) {
        const distance = exampleStart - titleBlock.end;
        if (distance < bestTitleDistance) {
          bestTitleDistance = distance;
          bestTitle = titleBlock.content;
          bestTitleIndex = titleIndex;
        }
      }
    }
    
    // Mark this title as used if we found one
    if (bestTitleIndex >= 0) {
      usedTitles.add(bestTitleIndex);
    }
    
    // Find the closest following result for this example
    let bestResult: string | null = null;
    let bestResultDistance = Infinity;
    
    for (const resultBlock of resultBlocks) {
      // Only consider results that come after this expression
      if (resultBlock.start > expressionBlock.end) {
        const distance = resultBlock.start - expressionBlock.end;
        if (distance < bestResultDistance) {
          bestResultDistance = distance;
          bestResult = resultBlock.content;
        }
      }
    }
    
    // Generate fallback title
    const fallbackTitle = exampleCount === 1 ? "Try This Example" : `Try Example ${i + 1}`;
    
    pairs.push({
      input: inputBlock.content,
      expression: expressionBlock.content,
      result: bestResult,
      title: bestTitle || fallbackTitle,
      index: i // Will be fixed later
    });
  }
  
  return pairs;
}

/**
 * Generate a fallback title when none is provided
 */
const generateFallbackTitle = (index: number, total: number): string => {
  if (total === 1) {
    return "Try This Example";
  }
  return `Try Example ${index}`;
};

/**
 * Generate a display title for an expression pair (now uses extracted titles)
 */
export const generatePairTitle = (pair: ExpressionPair, allPairs: ExpressionPair[]): string => {
  // For single examples, always show "Try This" for simplicity
  if (allPairs.length === 1) {
    return "Try This";
  }
  
  // For multiple examples, use the extracted/fallback title
  // Remove common prefixes like "Example 1:", "Example:", etc. for cleaner display
  let cleanTitle = pair.title
    .replace(/^Example\s*\d*:\s*/i, '')
    .replace(/^Try\s*/i, '')
    .trim();
  
  // If title is too long, truncate it
  if (cleanTitle.length > 40) {
    cleanTitle = cleanTitle.substring(0, 37) + '...';
  }
  
  return cleanTitle || `Example ${pair.index + 1}`;
};

/**
 * Validate if content has the expected marker format
 * This helps detect if the AI is following the format correctly
 */
export const hasValidMarkerFormat = (content: string): boolean => {
  // Check for properly paired markers (opening and closing)
  const inputPattern = /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g;
  const expressionPattern = /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g;
  
  const inputMatches = [...content.matchAll(inputPattern)];
  const expressionMatches = [...content.matchAll(expressionPattern)];
  
  return inputMatches.length > 0 && expressionMatches.length > 0;
};

/**
 * Extract paired content statistics for debugging
 */
export function getPairStatistics(content: string): {
  hasMarkers: boolean;
  inputBlocks: number;
  expressionBlocks: number;
  resultBlocks: number;
  titleBlocks: number;
  isBalanced: boolean;
} {
  // Use proper pattern matching to detect only valid paired markers
  const inputPattern = /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g;
  const expressionPattern = /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g;
  const resultPattern = /\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/g;
  const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
  
  const inputMatches = [...content.matchAll(inputPattern)];
  const expressionMatches = [...content.matchAll(expressionPattern)];
  const resultMatches = [...content.matchAll(resultPattern)];
  const titleMatches = [...content.matchAll(titlePattern)];
  
  const inputBlocks = inputMatches.length;
  const expressionBlocks = expressionMatches.length;
  const resultBlocks = resultMatches.length;
  const titleBlocks = titleMatches.length;
  
  return {
    hasMarkers: inputBlocks > 0 || expressionBlocks > 0 || resultBlocks > 0 || titleBlocks > 0,
    inputBlocks,
    expressionBlocks,
    resultBlocks,
    titleBlocks,
    isBalanced: inputBlocks === expressionBlocks && inputBlocks > 0
  };
} 