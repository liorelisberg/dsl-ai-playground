
export interface DSLEvaluationResult {
  result?: string;
  error?: string;
}

export const evaluateExpression = async (
  expression: string,
  sampleInput: string
): Promise<DSLEvaluationResult> => {
  try {
    // Parse the sample input
    let data;
    try {
      data = JSON.parse(sampleInput);
    } catch (e) {
      return { error: 'Invalid JSON input' };
    }

    // Basic DSL evaluation - replace with actual DSL parser
    const result = evaluateBasicExpression(expression, data);
    return { result: JSON.stringify(result, null, 2) };
  } catch (error) {
    return { error: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

// Simple expression evaluator - replace with proper DSL parser
function evaluateBasicExpression(expression: string, data: any): any {
  // Remove comments and whitespace
  const cleanExpression = expression.replace(/\/\/.*$/gm, '').trim();
  
  if (!cleanExpression) {
    return 'No expression provided';
  }

  // Basic property access and method calls
  try {
    // Create a safe evaluation context
    const context = {
      ...data,
      // Add safe string methods
      String: {
        prototype: {
          toUpperCase: function() { return this.toString().toUpperCase(); },
          toLowerCase: function() { return this.toString().toLowerCase(); },
          trim: function() { return this.toString().trim(); }
        }
      }
    };

    // Very basic evaluation - in a real implementation, use a proper DSL parser
    // This is just for demonstration
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

    // Simple property access
    if (!cleanExpression.includes('(') && !cleanExpression.includes(')')) {
      return getNestedProperty(data, cleanExpression);
    }

    return 'Expression type not yet supported in this demo';
  } catch (error) {
    throw new Error(`Failed to evaluate expression: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : undefined;
  }, obj);
}
