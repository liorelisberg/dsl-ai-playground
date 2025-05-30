// Frontend DSL Service - calls backend API for evaluation
// Note: Zen Engine is a Node.js native module and cannot run in browsers
import { httpClient } from './httpClient';

export interface DSLEvaluationResult {
  result?: string;
  error?: string;
}

export const evaluateExpression = async (
  expression: string,
  sampleInput: string
): Promise<DSLEvaluationResult> => {
  try {
    // Parse the sample input to validate it
    let data;
    try {
      data = JSON.parse(sampleInput);
    } catch (e) {
      return { error: 'Invalid JSON input' };
    }

    // Call backend API for DSL evaluation using Zen Engine
    const response = await httpClient.request<DSLEvaluationResult>('/api/evaluate-dsl', {
      method: 'POST',
      body: {
        expression: expression.replace(/\/\/.*$/gm, '').trim(),
        data: data
      }
    });

    return response;
  } catch (error) {
    console.error('DSL evaluation error:', error);
    
    // Fallback to basic evaluation for offline/error scenarios
    try {
      const result = evaluateBasicExpression(expression, JSON.parse(sampleInput));
      return { result: JSON.stringify(result, null, 2) };
    } catch (fallbackError) {
      return { error: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
};

// Fallback basic expression evaluator for offline/error scenarios
function evaluateBasicExpression(expression: string, data: unknown): unknown {
  const cleanExpression = expression.replace(/\/\/.*$/gm, '').trim();
  
  if (!cleanExpression) {
    return 'No expression provided';
  }

  try {
    // Handle simple property access
    if (!cleanExpression.includes('(') && !cleanExpression.includes(')') && !cleanExpression.includes(' ')) {
      return getNestedProperty(data, cleanExpression);
    }

    // Handle basic string methods
    if (cleanExpression.includes('.toUpperCase()')) {
      const prop = cleanExpression.replace('.toUpperCase()', '');
      const value = getNestedProperty(data, prop);
      return typeof value === 'string' ? value.toUpperCase() : String(value).toUpperCase();
    }
    
    if (cleanExpression.includes('.toLowerCase()')) {
      const prop = cleanExpression.replace('.toLowerCase()', '');
      const value = getNestedProperty(data, prop);
      return typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
    }
    
    if (cleanExpression.includes('.trim()')) {
      const prop = cleanExpression.replace('.trim()', '');
      const value = getNestedProperty(data, prop);
      return typeof value === 'string' ? value.trim() : String(value).trim();
    }

    return 'Expression type not yet supported - please connect to backend';
  } catch (error) {
    throw new Error(`Failed to evaluate expression: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getNestedProperty(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, prop: string) => {
    return current && typeof current === 'object' && current !== null && prop in current 
      ? (current as Record<string, unknown>)[prop] 
      : undefined;
  }, obj);
}
