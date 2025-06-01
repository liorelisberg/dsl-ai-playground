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
        result: null,
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
        result: null,
        title: 'Example 1: Summing array numbers',
        index: 0
      });
      expect(pairs[1]).toEqual({
        input: '{text: "hello world"}',
        expression: 'upper(text)',
        result: null,
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
        result: null,
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

    test('should extract result blocks when present', () => {
      const content = `
\${title}
Example with result
\${title}

\${inputBlock}
{name: "John"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${resultBlock}
"JOHN"
\${resultBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(1);
      expect(pairs[0]).toEqual({
        input: '{name: "John"}',
        expression: 'upper(name)',
        result: '"JOHN"',
        title: 'Example with result',
        index: 0
      });
    });

    test('should handle mixed examples with and without results', () => {
      const content = `
\${title}
Example with result
\${title}

\${inputBlock}
{name: "John"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${resultBlock}
"JOHN"
\${resultBlock}

\${title}
Example without result
\${title}

\${inputBlock}
{age: 30}
\${inputBlock}

\${expressionBlock}
age + 1
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(2);
      expect(pairs[0].result).toBe('"JOHN"');
      expect(pairs[1].result).toBe(null);
    });
  });

  describe('generatePairTitle', () => {
    test('should return "Try This" for single pair', () => {
      const pairs = [{ expression: 'upper(name)', input: '{}', result: null, title: 'Test Example', index: 0 }];
      const title = generatePairTitle(pairs[0], pairs);
      expect(title).toBe('Try This');
    });

    test('should clean up extracted titles for display', () => {
      const pairs = [
        { expression: 'filter(items)', input: '{}', result: null, title: 'Example 1: Filtering items by criteria', index: 0 },
        { expression: 'map(users)', input: '{}', result: null, title: 'Example 2: Mapping user names', index: 1 }
      ];
      
      expect(generatePairTitle(pairs[0], pairs)).toBe('Filtering items by criteria');
      expect(generatePairTitle(pairs[1], pairs)).toBe('Mapping user names');
    });

    test('should handle long titles by truncating', () => {
      const pairs = [
        { 
          expression: 'filter(items)', 
          input: '{}', 
          result: null,
          title: 'Example 1: This is a very long title that exceeds the maximum length limit and should be truncated', 
          index: 0 
        },
        { expression: 'map(users)', input: '{}', result: null, title: 'Example 2: Short title', index: 1 }
      ];
      
      const longTitle = generatePairTitle(pairs[0], pairs);
      expect(longTitle).toBe('This is a very long title that exceed...');
      expect(longTitle.length).toBeLessThanOrEqual(40);
    });

    test('should fallback to generic numbering for empty titles', () => {
      const pairs = [
        { expression: 'name + age', input: '{}', result: null, title: '', index: 0 },
        { expression: 'user.email', input: '{}', result: null, title: '   ', index: 1 }
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
        resultBlocks: 0,
        hasMarkers: true,
        isBalanced: true
      });
    });
  });

  describe('Educational Question Scenarios', () => {
    test('should handle educational content without DSL markers', () => {
      const educationalContent = `
# ZEN String Functions

ZEN provides several built-in string functions for text manipulation:

## Core String Functions

**upper(string)** - Converts text to uppercase
- Example: upper("hello") returns "HELLO"

**lower(string)** - Converts text to lowercase  
- Example: lower("WORLD") returns "world"

**len(string)** - Returns the length of a string
- Example: len("test") returns 4

**contains(string, substring)** - Checks if string contains substring
- Example: contains("hello world", "world") returns true

**startsWith(string, prefix)** - Checks if string starts with prefix
- Example: startsWith("hello", "he") returns true

**endsWith(string, suffix)** - Checks if string ends with suffix
- Example: endsWith("hello", "lo") returns true

## Advanced Functions

**trim(string)** - Removes whitespace from both ends
**split(string, delimiter)** - Splits string into array
**replace(string, old, new)** - Replaces occurrences

These functions can be combined for complex text processing operations.
      `;

      const pairs = extractExpressionPairs(educationalContent);
      const stats = getPairStatistics(educationalContent);
      
      // Educational content typically has no DSL markers
      expect(pairs).toHaveLength(0);
      expect(stats.hasMarkers).toBe(false);
      expect(stats.inputBlocks).toBe(0);
      expect(stats.expressionBlocks).toBe(0);
      expect(stats.resultBlocks).toBe(0);
    });

    test('should handle mixed educational content with some DSL examples', () => {
      const mixedContent = `
# String Functions Explanation

ZEN provides powerful string manipulation functions:

## The upper() function
Converts text to uppercase. Here's how it works:

\${title}
Converting name to uppercase
\${title}

\${inputBlock}
{name: "john doe"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${resultBlock}
"JOHN DOE"
\${resultBlock}

## The len() function
Returns the length of a string. Very useful for validation.

## The contains() function
Checks if a string contains a substring. Case-sensitive by default.

You can combine these functions for more complex operations.
      `;

      const pairs = extractExpressionPairs(mixedContent);
      const stats = getPairStatistics(mixedContent);
      
      // Should extract the one DSL example from educational content
      expect(pairs).toHaveLength(1);
      expect(pairs[0]).toEqual({
        input: '{name: "john doe"}',
        expression: 'upper(name)',
        result: '"JOHN DOE"',
        title: 'Converting name to uppercase',
        index: 0
      });
      expect(stats.hasMarkers).toBe(true);
      expect(stats.inputBlocks).toBe(1);
      expect(stats.expressionBlocks).toBe(1);
      expect(stats.resultBlocks).toBe(1);
    });

    test('should handle "Explain ALL string functions" scenario', () => {
      // Simulate typical AI response to "Explain ALL string functions in ZEN"
      const allStringFunctionsResponse = `
# Complete Guide to ZEN String Functions

ZEN DSL provides comprehensive string manipulation capabilities. Here are ALL the string functions available:

## Basic String Operations

### upper(string)
Converts text to uppercase.
- Returns: String in uppercase
- Example: upper("hello") → "HELLO"

### lower(string) 
Converts text to lowercase.
- Returns: String in lowercase
- Example: lower("WORLD") → "world"

### len(string)
Returns the length/character count of a string.
- Returns: Number
- Example: len("test") → 4

## String Testing Functions

### contains(string, substring)
Checks if a string contains another string.
- Returns: Boolean
- Case-sensitive
- Example: contains("hello world", "world") → true

### startsWith(string, prefix)
Tests if string begins with specified prefix.
- Returns: Boolean
- Example: startsWith("hello", "he") → true

### endsWith(string, suffix)
Tests if string ends with specified suffix.
- Returns: Boolean  
- Example: endsWith("hello", "lo") → true

## String Modification Functions

### trim(string)
Removes whitespace from both ends of string.
- Returns: Trimmed string
- Example: trim("  hello  ") → "hello"

### replace(string, oldValue, newValue)
Replaces all occurrences of oldValue with newValue.
- Returns: Modified string
- Example: replace("hello world", "world", "ZEN") → "hello ZEN"

### split(string, delimiter)
Splits string into array using delimiter.
- Returns: Array of strings
- Example: split("a,b,c", ",") → ["a", "b", "c"]

## String Extraction Functions

### substring(string, start, end?)
Extracts portion of string between start and end positions.
- Returns: Substring
- Example: substring("hello", 1, 4) → "ell"

## Usage Notes

- All string functions are case-sensitive unless noted
- String positions are 0-indexed
- Functions can be chained for complex operations
- Use with conditional expressions for powerful text processing

For practical examples with real data, ask me to "show string function examples" and I'll provide working code samples.
      `;

      const pairs = extractExpressionPairs(allStringFunctionsResponse);
      const stats = getPairStatistics(allStringFunctionsResponse);
      
      // Pure educational content - no DSL markers expected
      expect(pairs).toHaveLength(0);
      expect(stats.hasMarkers).toBe(false);
      expect(stats.inputBlocks).toBe(0);
      expect(stats.expressionBlocks).toBe(0);
      expect(stats.resultBlocks).toBe(0);
    });

    test('should handle educational content that mentions markers but does not use them', () => {
      const contentWithMarkerMentions = `
# How to Use DSL Examples

When I provide DSL examples, I use special markers:

- I wrap titles with \${title} markers
- Input data goes in \${inputBlock} markers  
- Expressions use \${expressionBlock} markers
- Results are shown in \${resultBlock} markers

However, this is just documentation - not actual examples.
For real examples, ask me to "show me string operations" instead.
      `;

      const pairs = extractExpressionPairs(contentWithMarkerMentions);
      const stats = getPairStatistics(contentWithMarkerMentions);
      
      // Should not extract pairs from documentation about markers
      expect(pairs).toHaveLength(0);
      expect(stats.hasMarkers).toBe(false);
    });
  });
}); 