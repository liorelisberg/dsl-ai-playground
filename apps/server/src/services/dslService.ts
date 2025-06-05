import { ZenEngine } from '@gorules/zen-engine';

export interface DSLEvaluationResult {
  result?: string;
  error?: string;
}

// Initialize Zen Engine instance (singleton)
let zenEngine: ZenEngine | null = null;

const getZenEngine = () => {
  if (!zenEngine) {
    zenEngine = new ZenEngine();
  }
  return zenEngine;
};

export const evaluateExpression = async (
  expression: string,
  data: unknown
): Promise<DSLEvaluationResult> => {
  const cleanExpression = expression.trim();
  
  if (!cleanExpression) {
    return { result: 'No expression provided' };
  }

  try {
    const engine = getZenEngine();
    
    // Create a simple JDM (JSON Decision Model) for expression evaluation
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

    // Create decision from JDM
    const decision = engine.createDecision(jdm);
    
    // Evaluate with the provided data
    const result = await decision.evaluate(data);
    
    // Extract the result value and format as JSON string
    const evaluationResult = result?.result !== undefined ? result.result : result;
    return { result: JSON.stringify(evaluationResult, null, 2) };
    
  } catch (error) {
    console.error('Backend: Zen Engine evaluation failed:', error);
    return { error: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

// Cleanup function to dispose of Zen Engine when needed
export const disposeZenEngine = () => {
  if (zenEngine) {
    zenEngine.dispose();
    zenEngine = null;
  }
}; 