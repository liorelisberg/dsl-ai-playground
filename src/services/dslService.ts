import { ZenEngine } from '@gorules/zen-engine';

export interface DSLEvaluationResult {
  result?: string;
  error?: string;
}

// Initialize Zen Engine instance
let zenEngine: ZenEngine | null = null;

const getZenEngine = () => {
  if (!zenEngine) {
    zenEngine = new ZenEngine();
  }
  return zenEngine;
};

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

    // Use Zen Engine for expression evaluation
    const result = await evaluateZenExpression(expression, data);
    return { result: JSON.stringify(result, null, 2) };
  } catch (error) {
    return { error: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

// Test function for Zen Engine (can be removed later)
export const testZenEngine = async () => {
  try {
    console.log('Testing Zen Engine...');
    const result = await evaluateExpression('user.name', '{"user": {"name": "Test User"}}');
    console.log('Zen Engine test result:', result);
    return result;
  } catch (error) {
    console.error('Zen Engine test failed:', error);
    return { error: 'Test failed' };
  }
};

// Zen Engine expression evaluator
async function evaluateZenExpression(expression: string, data: any): Promise<any> {
  // Remove comments and whitespace
  const cleanExpression = expression.replace(/\/\/.*$/gm, '').trim();
  
  if (!cleanExpression) {
    return 'No expression provided';
  }

  console.log('Evaluating with Zen Engine:', cleanExpression, 'Data:', data);

  try {
    const engine = getZenEngine();
    
    // Create a simple JDM (JSON Decision Model) for expression evaluation
    // This wraps our expression in a minimal decision graph
    const jdm = {
      "nodes": [
        {
          "id": "input",
          "name": "Request",
          "type": "inputNode",
          "position": { "x": 0, "y": 0 }
        },
        {
          "id": "expression",
          "name": "Expression",
          "type": "expressionNode",
          "content": {
            "expressions": [
              {
                "id": "result",
                "key": "result",
                "value": cleanExpression
              }
            ]
          },
          "position": { "x": 200, "y": 0 }
        },
        {
          "id": "output",
          "name": "Response",
          "type": "outputNode",
          "position": { "x": 400, "y": 0 }
        }
      ],
      "edges": [
        {
          "id": "edge1",
          "sourceId": "input",
          "targetId": "expression"
        },
        {
          "id": "edge2",
          "sourceId": "expression",
          "targetId": "output"
        }
      ]
    };

    console.log('JDM structure:', JSON.stringify(jdm, null, 2));

    // Create decision from JDM
    const decision = engine.createDecision(jdm);
    
    // Evaluate with the provided data
    const result = await decision.evaluate(data);
    
    console.log('Zen Engine result:', result);
    
    // Extract the result value
    return result?.result !== undefined ? result.result : result;
    
  } catch (error) {
    // Fallback to basic evaluation for simple cases to maintain backward compatibility
    console.warn('Zen Engine evaluation failed, falling back to basic evaluation:', error);
    return evaluateBasicExpression(cleanExpression, data);
  }
}

// Fallback basic expression evaluator for backward compatibility
function evaluateBasicExpression(expression: string, data: any): any {
  try {
    // Handle simple property access
    if (!expression.includes('(') && !expression.includes(')') && !expression.includes(' ')) {
      return getNestedProperty(data, expression);
    }

    // Handle basic string methods
    if (expression.includes('.toUpperCase()')) {
      const prop = expression.replace('.toUpperCase()', '');
      const value = getNestedProperty(data, prop);
      return typeof value === 'string' ? value.toUpperCase() : String(value).toUpperCase();
    }
    
    if (expression.includes('.toLowerCase()')) {
      const prop = expression.replace('.toLowerCase()', '');
      const value = getNestedProperty(data, prop);
      return typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
    }
    
    if (expression.includes('.trim()')) {
      const prop = expression.replace('.trim()', '');
      const value = getNestedProperty(data, prop);
      return typeof value === 'string' ? value.trim() : String(value).trim();
    }

    return 'Expression type not yet supported';
  } catch (error) {
    throw new Error(`Failed to evaluate expression: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : undefined;
  }, obj);
}

// Cleanup function to dispose of Zen Engine when needed
export const disposeZenEngine = () => {
  if (zenEngine) {
    zenEngine.dispose();
    zenEngine = null;
  }
};
