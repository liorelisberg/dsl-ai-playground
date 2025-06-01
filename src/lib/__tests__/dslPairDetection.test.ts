import { 
  extractExpressionPairs, 
  generatePairTitle, 
  hasValidMarkerFormat, 
  getPairStatistics 
} from '../dslPairDetection';

describe('DSL Pair Detection', () => {
  describe('extractExpressionPairs', () => {
    test('should extract single pair with title correctly', () => {
      const content = `
Here's an example:

\${title}
Example 1: Converting name to uppercase
\${title}

\${inputBlock}
{name: "John", age: 30}
\${inputBlock}

\${expressionBlock}
upper(name) + " is " + age + " years old"
\${expressionBlock}

Result: "JOHN is 30 years old"
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(1);
      expect(pairs[0]).toEqual({
        input: '{name: "John", age: 30}',
        expression: 'upper(name) + " is " + age + " years old"',
        title: 'Example 1: Converting name to uppercase',
        index: 0
      });
    });

    test('should extract multiple pairs with titles correctly', () => {
      const content = `
Here are two examples:

\${title}
Example 1: Summing array numbers
\${title}

\${inputBlock}
{numbers: [1, 2, 3]}
\${inputBlock}

\${expressionBlock}
sum(numbers)
\${expressionBlock}

And another:

\${title}
Example 2: Converting text to uppercase
\${title}

\${inputBlock}
{text: "hello world"}
\${inputBlock}

\${expressionBlock}
upper(text)
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(2);
      expect(pairs[0]).toEqual({
        input: '{numbers: [1, 2, 3]}',
        expression: 'sum(numbers)',
        title: 'Example 1: Summing array numbers',
        index: 0
      });
      expect(pairs[1]).toEqual({
        input: '{text: "hello world"}',
        expression: 'upper(text)',
        title: 'Example 2: Converting text to uppercase',
        index: 1
      });
    });

    test('should use fallback titles when titles are missing', () => {
      const content = `
\${inputBlock}
{name: "John"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${inputBlock}
{age: 30}
\${inputBlock}

\${expressionBlock}
age + 1
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(2);
      expect(pairs[0].title).toBe('Try Example 1');
      expect(pairs[1].title).toBe('Try Example 2');
    });

    test('should handle single example fallback correctly', () => {
      const content = `
\${inputBlock}
{name: "John"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(1);
      expect(pairs[0].title).toBe('Try This Example');
    });

    test('should handle mixed titles and missing titles', () => {
      const content = `
\${title}
Filtering users by age
\${title}

\${inputBlock}
{users: [{"name": "John", "age": 25}]}
\${inputBlock}

\${expressionBlock}
filter(users, #.age > 18)
\${expressionBlock}

\${inputBlock}
{name: "Jane"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(2);
      expect(pairs[0].title).toBe('Filtering users by age');
      expect(pairs[1].title).toBe('Try Example 2'); // Fallback for missing title
    });

    test('should handle unbalanced markers gracefully', () => {
      const content = `
\${title}
Test Example
\${title}

\${inputBlock}
{name: "John"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${inputBlock}
{age: 30}
\${inputBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      // Should only extract 1 pair (the minimum of inputs and expressions)
      expect(pairs).toHaveLength(1);
      expect(pairs[0]).toEqual({
        input: '{name: "John"}',
        expression: 'upper(name)',
        title: 'Test Example',
        index: 0
      });
    });

    test('should return empty array when no markers found', () => {
      const content = `
This is just regular markdown content with no DSL markers.
Some code blocks might exist but without the special markers.
      `;

      const pairs = extractExpressionPairs(content);
      expect(pairs).toHaveLength(0);
    });

    test('should handle malformed markers', () => {
      const content = `
\${inputBlock}
{name: "John"}
// Missing closing marker

\${expressionBlock}
upper(name)
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      expect(pairs).toHaveLength(0);
    });
  });

  describe('generatePairTitle', () => {
    test('should return "Try This" for single pair', () => {
      const pairs = [{ expression: 'upper(name)', input: '{}', title: 'Test Example', index: 0 }];
      const title = generatePairTitle(pairs[0], pairs);
      expect(title).toBe('Try This');
    });

    test('should clean up extracted titles for display', () => {
      const pairs = [
        { expression: 'filter(items)', input: '{}', title: 'Example 1: Filtering items by criteria', index: 0 },
        { expression: 'map(users)', input: '{}', title: 'Example 2: Mapping user names', index: 1 }
      ];
      
      expect(generatePairTitle(pairs[0], pairs)).toBe('Filtering items by criteria');
      expect(generatePairTitle(pairs[1], pairs)).toBe('Mapping user names');
    });

    test('should handle long titles by truncating', () => {
      const pairs = [
        { 
          expression: 'filter(items)', 
          input: '{}', 
          title: 'Example 1: This is a very long title that exceeds the maximum length limit and should be truncated', 
          index: 0 
        },
        { expression: 'map(users)', input: '{}', title: 'Example 2: Short title', index: 1 }
      ];
      
      const longTitle = generatePairTitle(pairs[0], pairs);
      expect(longTitle).toBe('This is a very long title that exceed...');
      expect(longTitle.length).toBeLessThanOrEqual(40);
    });

    test('should fallback to generic numbering for empty titles', () => {
      const pairs = [
        { expression: 'name + age', input: '{}', title: '', index: 0 },
        { expression: 'user.email', input: '{}', title: '   ', index: 1 }
      ];
      
      expect(generatePairTitle(pairs[0], pairs)).toBe('Example 1');
      expect(generatePairTitle(pairs[1], pairs)).toBe('Example 2');
    });
  });

  describe('hasValidMarkerFormat', () => {
    test('should detect valid marker format', () => {
      const content = `
      \${inputBlock}
      {}
      \${inputBlock}
      
      \${expressionBlock}
      test
      \${expressionBlock}
      `;
      
      expect(hasValidMarkerFormat(content)).toBe(true);
    });

    test('should detect missing markers', () => {
      const content = 'Just regular content';
      expect(hasValidMarkerFormat(content)).toBe(false);
    });
  });

  describe('getPairStatistics', () => {
    test('should calculate statistics correctly with titles', () => {
      const content = `
      \${title}
      Test Example
      \${title}
      
      \${inputBlock}
      {}
      \${inputBlock}
      
      \${expressionBlock}
      test
      \${expressionBlock}
      `;
      
      const stats = getPairStatistics(content);
      expect(stats).toEqual({
        titleBlocks: 1,
        inputBlocks: 1,
        expressionBlocks: 1,
        hasMarkers: true,
        isBalanced: true
      });
    });
  });
}); 