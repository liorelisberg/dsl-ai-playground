/**
 * Parser Content Analysis Utilities
 * Provides content size analysis, optimization, and validation for parser-to-chat attachment feature
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ContentSizeAnalysis {
  totalSize: number;
  expressionSize: number;
  inputSize: number;
  resultSize: number;
  exceedsLimit: boolean;
  requiresAttachment: boolean;
  estimatedTokens?: number;
}

export interface OptimizedContent {
  expression: string;
  result: string;
  needsAttachment: boolean;
  attachmentData?: unknown;
  attachmentFilename?: string;
  truncationInfo?: {
    expressionTruncated: boolean;
    resultTruncated: boolean;
  };
}

export interface ContentLimits {
  maxDirectContent: number;  // 2000 chars for direct messages
  maxExpression: number;     // 1000 chars for expressions  
  maxResult: number;         // 2000 chars for results
  maxInput: number;          // 100KB for input data
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CONTENT_LIMITS: ContentLimits = {
  maxDirectContent: 2000,    // Chat message limit
  maxExpression: 1000,       // 1KB for expressions
  maxResult: 2000,           // 2KB for results
  maxInput: 100 * 1024,      // 100KB for input data
} as const;

// Token estimation: roughly 4 chars per token
const CHARS_PER_TOKEN = 4;

// ============================================================================
// CORE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze content size and determine if attachment is needed
 */
export const analyzeContentSize = (
  expression: string, 
  input: string, 
  result: string
): ContentSizeAnalysis => {
  const expressionSize = expression.length;
  const inputSize = input.length;
  const resultSize = result.length;
  const totalSize = expressionSize + inputSize + resultSize;
  
  const exceedsLimit = totalSize > CONTENT_LIMITS.maxDirectContent;
  const estimatedTokens = Math.ceil(totalSize / CHARS_PER_TOKEN);
  
  return {
    totalSize,
    expressionSize,
    inputSize,
    resultSize,
    exceedsLimit,
    requiresAttachment: exceedsLimit,
    estimatedTokens
  };
};

/**
 * Optimize content for chat with intelligent truncation and attachment handling
 */
export const optimizeContentForChat = (
  expression: string,
  input: string, 
  result: string
): OptimizedContent => {
  const analysis = analyzeContentSize(expression, input, result);
  
  // If content fits within limits, no optimization needed
  if (!analysis.requiresAttachment) {
    return {
      expression,
      result,
      needsAttachment: false
    };
  }
  
  // Attachment flow - optimize content and prepare attachment
  const optimizedExpression = expression.length > CONTENT_LIMITS.maxExpression
    ? expression.substring(0, CONTENT_LIMITS.maxExpression - 3) + "..."
    : expression;
    
  const optimizedResult = result.length > CONTENT_LIMITS.maxResult
    ? result.substring(0, CONTENT_LIMITS.maxResult - 3) + "..."  
    : result;
  
  // Try to parse input as JSON, fallback to plain text
  let attachmentData: unknown;
  try {
    attachmentData = JSON.parse(input);
  } catch {
    // If not valid JSON, treat as plain text
    attachmentData = input;
  }
  
  const timestamp = Date.now();
  const attachmentFilename = `parser-input-${timestamp}.json`;
  
  return {
    expression: optimizedExpression,
    result: optimizedResult,
    needsAttachment: true,
    attachmentData,
    attachmentFilename,
    truncationInfo: {
      expressionTruncated: expression.length > CONTENT_LIMITS.maxExpression,
      resultTruncated: result.length > CONTENT_LIMITS.maxResult
    }
  };
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate if input size is within acceptable limits
 */
export const validateInputSize = (input: string): boolean => {
  const inputSizeBytes = new TextEncoder().encode(input).length;
  return inputSizeBytes <= CONTENT_LIMITS.maxInput;
};

/**
 * Get input size in bytes
 */
export const getInputSizeBytes = (input: string): number => {
  return new TextEncoder().encode(input).length;
};

/**
 * Estimate token usage for content
 */
export const estimateTokenUsage = (content: string): number => {
  return Math.ceil(content.length / CHARS_PER_TOKEN);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Ensure we don't exceed the sizes array
  const sizeIndex = Math.min(i, sizes.length - 1);
  
  return `${Math.round(bytes / Math.pow(k, sizeIndex) * 10) / 10} ${sizes[sizeIndex]}`;
};

/**
 * Try to parse JSON safely
 */
export const tryParseJson = (input: string): unknown | null => {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
};

/**
 * Check if content needs truncation warnings
 */
export const needsTruncationWarning = (
  expression: string,
  result: string
): boolean => {
  return expression.length > CONTENT_LIMITS.maxExpression || 
         result.length > CONTENT_LIMITS.maxResult;
};

/**
 * Generate content size summary for user feedback
 */
export const generateSizeSummary = (analysis: ContentSizeAnalysis): string => {
  const { expressionSize, inputSize, resultSize, totalSize } = analysis;
  
  return [
    `Expression: ${formatFileSize(expressionSize)}`,
    `Input: ${formatFileSize(inputSize)}`,
    `Result: ${formatFileSize(resultSize)}`,
    `Total: ${formatFileSize(totalSize)}`
  ].join(' • ');
};

/**
 * Get user-friendly description of what will happen based on content analysis
 */
export const getFlowDescription = (analysis: ContentSizeAnalysis): string => {
  if (!analysis.requiresAttachment) {
    return "Content will be sent directly in chat message";
  }
  
  return `Large content will be optimized: input attached as file (${formatFileSize(analysis.inputSize)})`;
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Comprehensive validation of parser content before processing
 */
export const validateParserContent = (
  expression: string,
  input: string,
  result: string
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  analysis: ContentSizeAnalysis;
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic validation
  if (!expression.trim()) {
    errors.push("Expression cannot be empty");
  }
  
  if (!result.trim()) {
    errors.push("Result cannot be empty");
  }
  
  // Size validation
  if (!validateInputSize(input)) {
    errors.push(`Input size (${formatFileSize(getInputSizeBytes(input))}) exceeds 100KB limit`);
  }
  
  const analysis = analyzeContentSize(expression, input, result);
  
  // Warnings for large content
  if (analysis.requiresAttachment) {
    warnings.push("Content exceeds 2000 characters - input will be attached as file");
  }
  
  if (needsTruncationWarning(expression, result)) {
    warnings.push("Expression or result will be truncated in chat message");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    analysis
  };
}; 