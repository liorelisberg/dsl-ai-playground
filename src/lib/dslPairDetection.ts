/**
 * DSL Expression-Input Pair Detection Utility
 * 
 * This utility extracts DSL expression and input pairs from AI chat responses
 * using explicit markers defined in the system prompt.
 */

export interface ExpressionPair {
  expression: string;
  input: string;
  title: string;
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
export const extractExpressionPairs = (content: string): ExpressionPair[] => {
  const pairs: ExpressionPair[] = [];
  
  try {
    // Find all title blocks using explicit markers
    const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
    const titleMatches = [...content.matchAll(titlePattern)];
    
    // Find all input blocks using explicit markers
    const inputPattern = /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g;
    const inputMatches = [...content.matchAll(inputPattern)];
    
    // Find all expression blocks using explicit markers  
    const expressionPattern = /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g;
    const expressionMatches = [...content.matchAll(expressionPattern)];
    
    // Pair them up in order (no validation - let parser handle errors)
    const minLength = Math.min(inputMatches.length, expressionMatches.length);
    
    for (let i = 0; i < minLength; i++) {
      // Use extracted title if available, otherwise generate fallback
      const extractedTitle = titleMatches[i] ? titleMatches[i][1].trim() : null;
      const fallbackTitle = generateFallbackTitle(i + 1, minLength);
      
      pairs.push({
        input: inputMatches[i][1].trim(),
        expression: expressionMatches[i][1].trim(),
        title: extractedTitle || fallbackTitle,
        index: i
      });
    }
    
    console.log(`🔍 Detected ${pairs.length} expression-input pairs from ${titleMatches.length} titles, ${inputMatches.length} inputs and ${expressionMatches.length} expressions`);
    
  } catch (error) {
    console.error('Error extracting expression pairs:', error);
  }
  
  return pairs;
};

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
  const hasInputMarkers = content.includes('${inputBlock}');
  const hasExpressionMarkers = content.includes('${expressionBlock}');
  
  return hasInputMarkers && hasExpressionMarkers;
};

/**
 * Extract paired content statistics for debugging
 */
export const getPairStatistics = (content: string) => {
  const titleMatches = [...content.matchAll(/\$\{title\}/g)];
  const inputMatches = [...content.matchAll(/\$\{inputBlock\}/g)];
  const expressionMatches = [...content.matchAll(/\$\{expressionBlock\}/g)];
  
  return {
    titleBlocks: titleMatches.length / 2,
    inputBlocks: inputMatches.length / 2, // Each pair has 2 markers
    expressionBlocks: expressionMatches.length / 2,
    hasMarkers: inputMatches.length > 0 || expressionMatches.length > 0,
    isBalanced: inputMatches.length === expressionMatches.length
  };
}; 