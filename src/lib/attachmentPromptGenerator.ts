/**
 * Attachment Prompt Generator
 * Enhanced prompt generation for parser-to-chat communication
 * Supports both direct and attachment-based flows
 */

import { formatFileSize } from '@/lib/parserContentAnalysis';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PromptContext {
  expression: string;
  result: string;
  isSuccess: boolean;
  isEmpty?: boolean;
  attachmentFilename?: string;
  truncationInfo?: {
    expressionTruncated: boolean;
    resultTruncated: boolean;
  };
}

export interface DirectPromptContext {
  expression: string;
  input: string;
  result: string;
  isSuccess: boolean;
  isEmpty?: boolean;
}

export interface PromptMetadata {
  type: 'direct' | 'attachment';
  hasAttachment: boolean;
  hasTruncation: boolean;
  estimatedLength: number;
}

// ============================================================================
// ATTACHMENT-BASED PROMPT GENERATION
// ============================================================================

/**
 * Generate prompt for attachment-based flow (large content)
 */
export const generateAttachmentPrompt = (context: PromptContext): string => {
  const { 
    expression, 
    result, 
    isSuccess, 
    isEmpty, 
    attachmentFilename,
    truncationInfo 
  } = context;
  
  // Build attachment notice
  const attachmentNotice = attachmentFilename 
    ? `\n\n📎 Input data attached as: ${attachmentFilename}`
    : "";
  
  // Build truncation notice if needed
  const truncationNotice = buildTruncationNotice(truncationInfo);
  
  // Generate context-appropriate prompt
  if (!isSuccess) {
    return `I have a failing expression, explain why it fails.

Expression: ${expression}

Error: ${result}${attachmentNotice}${truncationNotice}`;
  }
  
  if (isEmpty) {
    return `I have an expression that runs successfully but returns an empty result. Please explain why the result is empty and how to fix it.

Expression: ${expression}

Result: ${result}${attachmentNotice}${truncationNotice}`;
  }
  
  return `I have a working expression, explain how it works.

Expression: ${expression}

Result: ${result}${attachmentNotice}${truncationNotice}`;
};

/**
 * Generate prompt for direct flow (small content)
 */
export const generateDirectPrompt = (
  expression: string,
  input: string,
  result: string,
  isSuccess: boolean,
  isEmpty?: boolean
): string => {
  const context: DirectPromptContext = {
    expression,
    input,
    result,
    isSuccess,
    isEmpty
  };
  
  if (!isSuccess) {
    return `I have a failing expression, explain why it fails.

Expression: ${context.expression}

Input: ${context.input}

Error: ${context.result}`;
  }
  
  if (isEmpty) {
    return `I have an expression that runs successfully but returns an empty result. Please explain why the result is empty and how to fix it.

Expression: ${context.expression}

Input: ${context.input}

Result: ${context.result}

The expression executes without errors but produces no output. Help me understand what might be causing this and how to get the expected results.`;
  }
  
  return `I have a working expression, explain how it works.

Expression: ${context.expression}

Input: ${context.input}

Result: ${context.result}

Please walk me through how this expression processes the input to produce this result.`;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Add attachment notice to existing prompt
 */
export const addAttachmentNotice = (prompt: string, filename: string): string => {
  return `${prompt}\n\n📎 Input data attached as: ${filename}`;
};

/**
 * Add truncation notice to prompt
 */
export const addTruncationNotice = (prompt: string, truncationInfo?: {
  expressionTruncated: boolean;
  resultTruncated: boolean;
}): string => {
  if (!truncationInfo || (!truncationInfo.expressionTruncated && !truncationInfo.resultTruncated)) {
    return prompt;
  }
  
  const truncationMessage = buildTruncationNotice(truncationInfo);
  return `${prompt}${truncationMessage}`;
};

/**
 * Build truncation notice based on what was truncated
 */
const buildTruncationNotice = (truncationInfo?: {
  expressionTruncated: boolean;
  resultTruncated: boolean;
}): string => {
  if (!truncationInfo) return "";
  
  const { expressionTruncated, resultTruncated } = truncationInfo;
  
  if (!expressionTruncated && !resultTruncated) return "";
  
  const truncatedParts: string[] = [];
  if (expressionTruncated) truncatedParts.push("expression");
  if (resultTruncated) truncatedParts.push("result");
  
  const truncatedText = truncatedParts.length === 1 
    ? truncatedParts[0]
    : `${truncatedParts.slice(0, -1).join(", ")} and ${truncatedParts[truncatedParts.length - 1]}`;
  
  return `\n\n💡 *Note: The ${truncatedText} was truncated for chat display. Full content is available in the Expression Workbench.*`;
};

// ============================================================================
// PROMPT ANALYSIS & METADATA
// ============================================================================

/**
 * Analyze prompt and generate metadata
 */
export const analyzePrompt = (prompt: string, hasAttachment: boolean): PromptMetadata => {
  const hasTruncation = prompt.includes("*Note: The");
  const estimatedLength = prompt.length;
  
  return {
    type: hasAttachment ? 'attachment' : 'direct',
    hasAttachment,
    hasTruncation,
    estimatedLength
  };
};

/**
 * Validate prompt meets requirements
 */
export const validatePrompt = (prompt: string): {
  isValid: boolean;
  issues: string[];
  estimatedTokens: number;
} => {
  const issues: string[] = [];
  const estimatedTokens = Math.ceil(prompt.length / 4); // ~4 chars per token
  
  // Check minimum content
  if (prompt.length < 50) {
    issues.push("Prompt is too short to be meaningful");
  }
  
  // Check maximum reasonable length for chat
  if (prompt.length > 3000) {
    issues.push("Prompt may be too long for optimal chat experience");
  }
  
  // Check for required components
  if (!prompt.includes("Expression:")) {
    issues.push("Prompt missing expression section");
  }
  
  // Check for clear instruction
  const hasInstruction = prompt.includes("explain") || prompt.includes("debug") || prompt.includes("help");
  if (!hasInstruction) {
    issues.push("Prompt missing clear instruction for AI");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    estimatedTokens
  };
};

// ============================================================================
// SPECIALIZED PROMPT GENERATORS
// ============================================================================

/**
 * Generate debugging prompt for failed expressions
 */
export const generateDebugPrompt = (
  expression: string,
  error: string,
  attachmentFilename?: string
): string => {
  const attachmentNotice = attachmentFilename 
    ? `\n\n📎 Input data attached as: ${attachmentFilename}`
    : "";
  
  return `I have a DSL expression that's failing and need help debugging it.

Expression: ${expression}

Error: ${error}${attachmentNotice}

Please analyze what's wrong and suggest how to fix it. If the error is related to the input data, please examine the attached data for clues.`;
};

/**
 * Generate explanation prompt for working expressions
 */
export const generateExplanationPrompt = (
  expression: string,
  result: string,
  attachmentFilename?: string,
  resultTruncated?: boolean
): string => {
  const attachmentNotice = attachmentFilename 
    ? `\n\n📎 Input data attached as: ${attachmentFilename}`
    : "";
  
  const truncationNotice = resultTruncated
    ? "\n\n💡 *Note: The result was truncated for chat display. Full output is available in the Expression Workbench.*"
    : "";
  
  return `I have a working DSL expression and would like to understand how it works.

Expression: ${expression}

Result: ${result}${attachmentNotice}${truncationNotice}

Please explain step-by-step how this expression processes the input data to produce this result. Include any key concepts or patterns I should understand.`;
};

/**
 * Generate empty result investigation prompt
 */
export const generateEmptyResultPrompt = (
  expression: string,
  attachmentFilename?: string
): string => {
  const attachmentNotice = attachmentFilename 
    ? `\n\n📎 Input data attached as: ${attachmentFilename}`
    : "";
  
  return `I have a DSL expression that runs without errors but returns an empty result.

Expression: ${expression}

Result: (empty)${attachmentNotice}

The expression executes successfully but produces no output. Please help me understand:
1. Why the result might be empty
2. What could be wrong with my expression or input data  
3. How to modify the expression to get meaningful results

Please examine the input data to see if there are any obvious issues.`;
};

// ============================================================================
// PROMPT FORMATTING UTILITIES
// ============================================================================

/**
 * Format expression for display in prompts
 */
export const formatExpression = (expression: string, maxLength = 1000): string => {
  if (expression.length <= maxLength) {
    return expression;
  }
  
  return `${expression.substring(0, maxLength - 3)}...`;
};

/**
 * Format result for display in prompts
 */
export const formatResult = (result: string, maxLength = 2000): string => {
  if (result.length <= maxLength) {
    return result;
  }
  
  return `${result.substring(0, maxLength - 3)}...`;
};

/**
 * Generate user-friendly prompt preview
 */
export const generatePromptPreview = (
  type: 'success' | 'error' | 'empty',
  hasAttachment: boolean,
  inputSize?: number
): string => {
  const attachmentText = hasAttachment && inputSize
    ? ` with ${formatFileSize(inputSize)} input attachment`
    : "";
  
  switch (type) {
    case 'error':
      return `Ask AI to debug failing expression${attachmentText}`;
    case 'empty':
      return `Ask AI why expression returns empty result${attachmentText}`;
    case 'success':
    default:
      return `Ask AI to explain working expression${attachmentText}`;
  }
}; 