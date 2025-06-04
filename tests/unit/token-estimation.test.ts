/**
 * Token Estimation Unit Tests
 * Testing token estimation accuracy for various input sizes
 */

import { describe, test, expect } from '@jest/globals';

interface TestJsonData {
  metadata: {
    version: string;
    created: string;
    type: string;
  };
  config: {
    settings: {
      debug: boolean;
      timeout: number;
      retries: number;
    };
  };
  data: Array<{
    id: number;
    name: string;
    value: number;
    tags: string[];
    details: {
      description: string;
      properties: {
        weight: number;
        color: string;
        active: boolean;
      };
    };
  }>;
}

describe('Token Estimation', () => {
  
  describe('JSON Token Estimation Accuracy', () => {
    test('should generate test JSON data of expected sizes', () => {
      const testSizes = [1, 10, 50, 100];
      
      testSizes.forEach(targetKB => {
        const testData = generateTestJSON(targetKB);
        const jsonString = JSON.stringify(testData);
        const actualBytes = Buffer.byteLength(jsonString, 'utf8');
        const actualKB = Math.round(actualBytes / 1024);
        
        // Verify the generated JSON is approximately the target size
        expect(actualKB).toBeGreaterThan(targetKB * 0.8); // At least 80% of target
        expect(actualKB).toBeLessThan(targetKB * 1.3);   // No more than 130% of target
        
        // Verify the JSON structure is valid
        expect(testData).toHaveProperty('metadata');
        expect(testData).toHaveProperty('data');
        expect(Array.isArray(testData.data)).toBe(true);
      });
    });

    test('should estimate tokens with reasonable accuracy', () => {
      // Test token estimation formula
      const testCases = [
        { input: 'Hello world', expectedRange: [2, 4] },
        { input: 'A longer sentence with more words to test token estimation', expectedRange: [10, 15] },
        { input: JSON.stringify({ simple: 'object', with: 'some', data: true }), expectedRange: [8, 15] }
      ];

      testCases.forEach(({ input, expectedRange }) => {
        // Use the rough estimation: 4 characters per token
        const estimatedTokens = Math.ceil(input.length / 4);
        
        expect(estimatedTokens).toBeGreaterThanOrEqual(expectedRange[0]);
        expect(estimatedTokens).toBeLessThanOrEqual(expectedRange[1]);
      });
    });
  });

  describe('Performance Characteristics', () => {
    test('should handle large JSON efficiently', () => {
      const largeJSON = generateTestJSON(100); // 100KB
      const jsonString = JSON.stringify(largeJSON);
      
      const startTime = performance.now();
      const tokenEstimate = Math.ceil(jsonString.length / 4);
      const endTime = performance.now();
      
      const processingTime = endTime - startTime;
      
      // Should process quickly (less than 50ms)
      expect(processingTime).toBeLessThan(50);
      expect(tokenEstimate).toBeGreaterThan(0);
    });
  });
});

/**
 * Utility function to generate test JSON data
 */
function generateTestJSON(sizeKB: number): TestJsonData {
  const targetBytes = sizeKB * 1024;
  const baseObject: TestJsonData = {
    metadata: {
      version: "1.0",
      created: new Date().toISOString(),
      type: "test_data"
    },
    config: {
      settings: {
        debug: true,
        timeout: 30000,
        retries: 3
      }
    },
    data: []
  };
  
  let currentSize = JSON.stringify(baseObject).length;
  let counter = 0;
  
  while (currentSize < targetBytes && counter < 5000) {
    const entry = {
      id: counter++,
      name: `item_${counter}`,
      value: Math.random() * 1000,
      tags: [`tag_${counter % 10}`, `category_${counter % 5}`],
      details: {
        description: `This is test item ${counter} with some descriptive text`,
        properties: {
          weight: Math.random() * 100,
          color: ['red', 'blue', 'green', 'yellow'][counter % 4],
          active: counter % 2 === 0
        }
      }
    };
    baseObject.data.push(entry);
    currentSize = JSON.stringify(baseObject).length;
  }
  
  return baseObject;
} 