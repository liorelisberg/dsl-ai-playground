/**
 * Unit tests for Parser Content Analysis utilities
 */

import {
  analyzeContentSize,
  optimizeContentForChat,
  validateInputSize,
  getInputSizeBytes,
  formatFileSize,
  tryParseJson,
  needsTruncationWarning,
  generateSizeSummary,
  getFlowDescription,
  validateParserContent,
  CONTENT_LIMITS
} from '../parserContentAnalysis';

describe('parserContentAnalysis', () => {
  
  // ============================================================================
  // CONTENT SIZE ANALYSIS TESTS
  // ============================================================================
  
  describe('analyzeContentSize', () => {
    test('should detect when content is within limits', () => {
      const result = analyzeContentSize(
        'short expression',
        'short input',
        'short result'
      );
      
      expect(result.exceedsLimit).toBe(false);
      expect(result.requiresAttachment).toBe(false);
      expect(result.totalSize).toBeLessThan(CONTENT_LIMITS.maxDirectContent);
    });
    
    test('should detect when content exceeds limits', () => {
      const largeInput = 'x'.repeat(2500); // Force over 2000 total
      const result = analyzeContentSize(
        'expression',
        largeInput,
        'result'
      );
      
      expect(result.exceedsLimit).toBe(true);
      expect(result.requiresAttachment).toBe(true);
      expect(result.totalSize).toBeGreaterThan(CONTENT_LIMITS.maxDirectContent);
    });
    
    test('should calculate sizes correctly', () => {
      const expression = 'test expr';
      const input = 'test input';
      const result = 'test result';
      
      const analysis = analyzeContentSize(expression, input, result);
      
      expect(analysis.expressionSize).toBe(expression.length);
      expect(analysis.inputSize).toBe(input.length);
      expect(analysis.resultSize).toBe(result.length);
      expect(analysis.totalSize).toBe(expression.length + input.length + result.length);
    });
    
    test('should handle edge case at exact limit', () => {
      // Create content that is exactly at the 2000 char limit
      const totalTarget = CONTENT_LIMITS.maxDirectContent;
      const expression = 'expr';
      const input = 'input';
      const result = 'x'.repeat(totalTarget - expression.length - input.length);
      
      const analysis = analyzeContentSize(expression, input, result);
      
      expect(analysis.totalSize).toBe(totalTarget);
      expect(analysis.exceedsLimit).toBe(false);
      expect(analysis.requiresAttachment).toBe(false);
    });
    
    test('should handle edge case at limit + 1', () => {
      // Create content that is exactly 1 char over the limit
      const totalTarget = CONTENT_LIMITS.maxDirectContent + 1;
      const expression = 'expr';
      const input = 'input';
      const result = 'x'.repeat(totalTarget - expression.length - input.length);
      
      const analysis = analyzeContentSize(expression, input, result);
      
      expect(analysis.totalSize).toBe(totalTarget);
      expect(analysis.exceedsLimit).toBe(true);
      expect(analysis.requiresAttachment).toBe(true);
    });
    
    test('should estimate tokens correctly', () => {
      const content = 'x'.repeat(100); // 100 chars
      const analysis = analyzeContentSize(content, '', '');
      
      expect(analysis.estimatedTokens).toBe(Math.ceil(100 / 4)); // ~25 tokens
    });
  });
  
  // ============================================================================
  // CONTENT OPTIMIZATION TESTS
  // ============================================================================
  
  describe('optimizeContentForChat', () => {
    test('should not optimize when content is within limits', () => {
      const expression = 'short expression';
      const input = 'short input';
      const result = 'short result';
      
      const optimized = optimizeContentForChat(expression, input, result);
      
      expect(optimized.needsAttachment).toBe(false);
      expect(optimized.expression).toBe(expression);
      expect(optimized.result).toBe(result);
      expect(optimized.attachmentData).toBeUndefined();
    });
    
    test('should optimize when content exceeds limits', () => {
      const expression = 'x'.repeat(1500); // Long expression
      const input = 'x'.repeat(1000);     // Long input  
      const result = 'x'.repeat(500);     // Medium result
      
      const optimized = optimizeContentForChat(expression, input, result);
      
      expect(optimized.needsAttachment).toBe(true);
      expect(optimized.expression.length).toBeLessThanOrEqual(CONTENT_LIMITS.maxExpression);
      expect(optimized.result.length).toBeLessThanOrEqual(CONTENT_LIMITS.maxResult);
      expect(optimized.attachmentData).toBeDefined();
      expect(optimized.attachmentFilename).toMatch(/^parser-input-\d+\.json$/);
    });
    
    test('should truncate expression when too long', () => {
      const longExpression = 'x'.repeat(CONTENT_LIMITS.maxExpression + 100);
      const input = 'x'.repeat(1000);
      const result = 'short';
      
      const optimized = optimizeContentForChat(longExpression, input, result);
      
      expect(optimized.expression).toHaveLength(CONTENT_LIMITS.maxExpression);
      expect(optimized.expression.endsWith('...')).toBe(true);
      expect(optimized.truncationInfo?.expressionTruncated).toBe(true);
    });
    
    test('should truncate result when too long', () => {
      const expression = 'short';
      const input = 'x'.repeat(1000);
      const longResult = 'x'.repeat(CONTENT_LIMITS.maxResult + 100);
      
      const optimized = optimizeContentForChat(expression, input, longResult);
      
      expect(optimized.result).toHaveLength(CONTENT_LIMITS.maxResult);
      expect(optimized.result.endsWith('...')).toBe(true);
      expect(optimized.truncationInfo?.resultTruncated).toBe(true);
    });
    
    test('should handle JSON input data', () => {
      const expression = 'short';
      const input = JSON.stringify({ key: 'value', nested: { data: 'test' } });
      const result = 'x'.repeat(2000); // Make total content > 2000 chars
      
      const optimized = optimizeContentForChat(expression, input, result);
      
      expect(optimized.needsAttachment).toBe(true);
      expect(typeof optimized.attachmentData).toBe('object');
      expect(optimized.attachmentFilename).toMatch(/\.json$/);
    });
    
    test('should handle plain text input data', () => {
      const expression = 'short';
      const input = 'plain text that is not JSON ' + 'x'.repeat(2000); // Make large enough
      const result = 'short';
      
      const optimized = optimizeContentForChat(expression, input, result);
      
      expect(optimized.needsAttachment).toBe(true);
      expect(optimized.attachmentData).toBe(input);
      expect(optimized.attachmentFilename).toMatch(/\.json$/); // Still uses .json extension
    });
  });
  
  // ============================================================================
  // VALIDATION TESTS
  // ============================================================================
  
  describe('validateInputSize', () => {
    test('should accept input within size limits', () => {
      const smallInput = 'x'.repeat(1000); // 1KB
      expect(validateInputSize(smallInput)).toBe(true);
    });
    
    test('should reject input exceeding size limits', () => {
      const largeInput = 'x'.repeat(CONTENT_LIMITS.maxInput + 1000); // >100KB
      expect(validateInputSize(largeInput)).toBe(false);
    });
    
    test('should handle edge case at exact limit', () => {
      // Create input at exactly 100KB (accounting for UTF-8 encoding)
      const limitInput = 'x'.repeat(CONTENT_LIMITS.maxInput);
      expect(validateInputSize(limitInput)).toBe(true);
    });
    
    test('should handle Unicode characters correctly', () => {
      const unicodeInput = '🚀'.repeat(10000); // Unicode characters
      const isValid = validateInputSize(unicodeInput);
      const sizeBytes = getInputSizeBytes(unicodeInput);
      
      expect(typeof isValid).toBe('boolean');
      expect(sizeBytes).toBeGreaterThan(unicodeInput.length); // Unicode chars are multi-byte
    });
  });
  
  describe('getInputSizeBytes', () => {
    test('should calculate byte size correctly for ASCII', () => {
      const asciiText = 'hello world';
      expect(getInputSizeBytes(asciiText)).toBe(asciiText.length);
    });
    
    test('should calculate byte size correctly for Unicode', () => {
      const unicodeText = '🚀🌟'; // 2 emoji characters
      const byteSize = getInputSizeBytes(unicodeText);
      expect(byteSize).toBeGreaterThan(unicodeText.length);
      expect(byteSize).toBe(8); // Each emoji is 4 bytes in UTF-8
    });
  });
  
  // ============================================================================
  // UTILITY FUNCTION TESTS
  // ============================================================================
  
  describe('formatFileSize', () => {
    test('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
    });
    
    test('should handle large numbers', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB'); // 1GB = 1024^3 bytes
    });
  });
  
  describe('tryParseJson', () => {
    test('should parse valid JSON', () => {
      const validJson = '{"key": "value", "number": 42}';
      const result = tryParseJson(validJson);
      
      expect(result).toEqual({ key: 'value', number: 42 });
    });
    
    test('should return null for invalid JSON', () => {
      const invalidJson = 'not json at all';
      const result = tryParseJson(invalidJson);
      
      expect(result).toBeNull();
    });
    
    test('should handle edge cases', () => {
      expect(tryParseJson('')).toBeNull();
      expect(tryParseJson('null')).toBeNull();
      expect(tryParseJson('true')).toBe(true);
      expect(tryParseJson('42')).toBe(42);
      expect(tryParseJson('[]')).toEqual([]);
    });
  });
  
  describe('needsTruncationWarning', () => {
    test('should detect when expression needs truncation', () => {
      const longExpression = 'x'.repeat(CONTENT_LIMITS.maxExpression + 1);
      const shortResult = 'short';
      
      expect(needsTruncationWarning(longExpression, shortResult)).toBe(true);
    });
    
    test('should detect when result needs truncation', () => {
      const shortExpression = 'short';
      const longResult = 'x'.repeat(CONTENT_LIMITS.maxResult + 1);
      
      expect(needsTruncationWarning(shortExpression, longResult)).toBe(true);
    });
    
    test('should return false when no truncation needed', () => {
      const shortExpression = 'short';
      const shortResult = 'short';
      
      expect(needsTruncationWarning(shortExpression, shortResult)).toBe(false);
    });
  });
  
  describe('generateSizeSummary', () => {
    test('should generate readable size summary', () => {
      const analysis = analyzeContentSize(
        'x'.repeat(100),  // 100 B
        'x'.repeat(1024), // 1 KB  
        'x'.repeat(500)   // 500 B
      );
      
      const summary = generateSizeSummary(analysis);
      
      expect(summary).toContain('Expression: 100 B');
      expect(summary).toContain('Input: 1 KB');
      expect(summary).toContain('Result: 500 B');
      expect(summary).toContain('Total: 1.6 KB');
    });
  });
  
  describe('getFlowDescription', () => {
    test('should describe direct flow for small content', () => {
      const analysis = analyzeContentSize('short', 'short', 'short');
      const description = getFlowDescription(analysis);
      
      expect(description).toBe('Content will be sent directly in chat message');
    });
    
    test('should describe attachment flow for large content', () => {
      const largeInput = 'x'.repeat(3000);
      const analysis = analyzeContentSize('expr', largeInput, 'result');
      const description = getFlowDescription(analysis);
      
      expect(description).toContain('Large content will be optimized');
      expect(description).toContain('input attached as file');
      expect(description).toContain('2.9 KB'); // Should include size
    });
  });
  
  // ============================================================================
  // COMPREHENSIVE VALIDATION TESTS
  // ============================================================================
  
  describe('validateParserContent', () => {
    test('should validate correct content', () => {
      const validation = validateParserContent(
        'valid expression',
        'valid input',
        'valid result'
      );
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.analysis).toBeDefined();
    });
    
    test('should detect empty expression', () => {
      const validation = validateParserContent(
        '',
        'input',
        'result'
      );
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Expression cannot be empty');
    });
    
    test('should detect empty result', () => {
      const validation = validateParserContent(
        'expression',
        'input',
        ''
      );
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Result cannot be empty');
    });
    
    test('should detect input size violations', () => {
      const largeInput = 'x'.repeat(CONTENT_LIMITS.maxInput + 1000);
      const validation = validateParserContent(
        'expression',
        largeInput,
        'result'
      );
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.includes('exceeds 100KB limit'))).toBe(true);
    });
    
    test('should generate warnings for large content', () => {
      const largeInput = 'x'.repeat(2500);
      const validation = validateParserContent(
        'expression',
        largeInput,
        'result'
      );
      
      expect(validation.isValid).toBe(true);
      expect(validation.warnings).toContain('Content exceeds 2000 characters - input will be attached as file');
    });
    
    test('should generate truncation warnings', () => {
      const longExpression = 'x'.repeat(CONTENT_LIMITS.maxExpression + 100);
      const longResult = 'x'.repeat(CONTENT_LIMITS.maxResult + 100);
      const largeInput = 'x'.repeat(1000);
      
      const validation = validateParserContent(longExpression, largeInput, longResult);
      
      expect(validation.warnings).toContain('Expression or result will be truncated in chat message');
    });
  });
  
  // ============================================================================
  // CONSTANTS VALIDATION
  // ============================================================================
  
  describe('CONTENT_LIMITS', () => {
    test('should have expected conservative limits', () => {
      expect(CONTENT_LIMITS.maxDirectContent).toBe(2000);
      expect(CONTENT_LIMITS.maxExpression).toBe(1000);
      expect(CONTENT_LIMITS.maxResult).toBe(2000);
      expect(CONTENT_LIMITS.maxInput).toBe(100 * 1024); // 100KB
    });
    
    test('should have logical relationships between limits', () => {
      expect(CONTENT_LIMITS.maxExpression).toBeLessThanOrEqual(CONTENT_LIMITS.maxDirectContent);
      expect(CONTENT_LIMITS.maxResult).toBeLessThanOrEqual(CONTENT_LIMITS.maxInput);
      expect(CONTENT_LIMITS.maxInput).toBeGreaterThan(CONTENT_LIMITS.maxDirectContent);
    });
  });
}); 