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

/**
 * Extract expression-input-title triplets from message content using explicit markers
 * 
 * Expected format:
 * ${title}
 * Example 1: Converting text to uppercase
 * ${title}
 * 
 * ${inputBlock}
 * {name:"hello", id: "world"}
 * ${inputBlock}
 * 
 * ${expressionBlock}
 * upper(name + " " + id)
 * ${expressionBlock}
 */
export function extractExpressionPairs(content: string): ExpressionPair[] {
  const pairs: ExpressionPair[] = [];
  
  try {
    // Find all title blocks
    const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
    const titleMatches = [...content.matchAll(titlePattern)];
    
    const inputPattern = /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g;
    const inputMatches = [...content.matchAll(inputPattern)];
    
    const expressionPattern = /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g;
    const expressionMatches = [...content.matchAll(expressionPattern)];
    
    const resultPattern = /\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/g;
    const resultMatches = [...content.matchAll(resultPattern)];
    
    const minLength = Math.min(inputMatches.length, expressionMatches.length);
    
    for (let i = 0; i < minLength; i++) {
      const extractedTitle = titleMatches[i] ? titleMatches[i][1].trim() : null;
      const extractedResult = resultMatches[i] ? resultMatches[i][1].trim() : null;
      const fallbackTitle = minLength === 1 ? "Try This Example" : `Try Example ${i + 1}`;
      
      pairs.push({
        input: inputMatches[i][1].trim(),
        expression: expressionMatches[i][1].trim(),
        result: extractedResult,
        title: extractedTitle || fallbackTitle,
        index: i
      });
    }
    
    console.log(`🔍 Detected ${pairs.length} expression-input pairs from ${titleMatches.length} titles, ${inputMatches.length} inputs and ${expressionMatches.length} expressions`);
    
  } catch (error) {
    console.error('Error extracting expression pairs:', error);
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