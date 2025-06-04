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

### split(string, delimiter)
Splits string into array using delimiter.
- Returns: Array of strings
- Example: split("a,b,c", ",") → ["a", "b", "c"]

## String Extraction Functions

### extract(string, pattern)
Extracts content from string using pattern matching.
- Returns: Extracted content
- Example: extract("hello world", "[a-z]+") → "hello"

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

  describe('Proximity-Based Pairing Algorithm', () => {
    test('should handle extract method scenario with mixed educational and example titles', () => {
      const content = `
\${title}
Explanation of the extract Method in ZEN DSL
\${title}

The extract method is used to extract parts of strings using regular expressions.

\${title}
Example 1: Extracting a Number from a String
\${title}

\${inputBlock}
{"text": "Order ID: 12345"}
\${inputBlock}

\${expressionBlock}
extract(text, "[0-9]+")
\${expressionBlock}

\${resultBlock}
"12345"
\${resultBlock}

\${title}
Example 2: Extracting a Word from a String
\${title}

\${inputBlock}
{"text": "Hello World!"}
\${inputBlock}

\${expressionBlock}
extract(text, "[A-Za-z]+")
\${expressionBlock}

\${resultBlock}
"Hello"
\${resultBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(2);
      
      // First example should get the correct title (not the educational one)
      expect(pairs[0]).toEqual({
        input: '{"text": "Order ID: 12345"}',
        expression: 'extract(text, "[0-9]+")',
        result: '"12345"',
        title: 'Example 1: Extracting a Number from a String',
        index: 0
      });
      
      // Second example should get its correct title
      expect(pairs[1]).toEqual({
        input: '{"text": "Hello World!"}',
        expression: 'extract(text, "[A-Za-z]+")',
        result: '"Hello"',
        title: 'Example 2: Extracting a Word from a String',
        index: 1
      });
    });

    test('should handle titles very far from examples', () => {
      const content = `
\${title}
Educational Title
\${title}

This is a lot of educational content that goes on for many lines and creates
distance between the title and the actual examples. This should be treated
as educational content and not paired with the examples below.

\${title}
Close Example Title
\${title}

\${inputBlock}
{"test": "data"}
\${inputBlock}

\${expressionBlock}
test
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(1);
      expect(pairs[0].title).toBe('Close Example Title');
    });

    test('should handle examples without preceding titles', () => {
      const content = `
Some educational content without title markers.

\${inputBlock}
{"name": "John"}
\${inputBlock}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${inputBlock}
{"age": 30}
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

    test('should handle malformed pairs with large distances', () => {
      const content = `
\${inputBlock}
{"test": "data"}
\${inputBlock}

${'x'.repeat(3000)} // Large gap

\${expressionBlock}
test
\${expressionBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      // Should skip this pair due to large distance
      expect(pairs).toHaveLength(0);
    });

    test('should match results to closest expressions', () => {
      const content = `
\${title}
Example 1
\${title}

\${inputBlock}
{"a": 1}
\${inputBlock}

\${expressionBlock}
a + 1
\${expressionBlock}

\${resultBlock}
2
\${resultBlock}

\${title}
Example 2  
\${title}

\${inputBlock}
{"b": 2}
\${inputBlock}

\${expressionBlock}
b * 2
\${expressionBlock}

\${resultBlock}
4
\${resultBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(2);
      expect(pairs[0].result).toBe('2');
      expect(pairs[1].result).toBe('4');
    });

    test('should handle mixed order with proper proximity detection', () => {
      const content = `
\${title}
First Title
\${title}

\${expressionBlock}
upper(name)
\${expressionBlock}

\${inputBlock}
{"name": "john"}
\${inputBlock}

\${resultBlock}
"JOHN"
\${resultBlock}
      `;

      const pairs = extractExpressionPairs(content);
      
      expect(pairs).toHaveLength(1);
      expect(pairs[0]).toEqual({
        input: '{"name": "john"}',
        expression: 'upper(name)',
        result: '"JOHN"',
        title: 'First Title',
        index: 0
      });
    });

    test('should handle comprehensive string functions response with mixed educational and example content', () => {
      const stringFunctionsResponse = `
\${title}
String Functions in ZEN DSL
\${title}

ZEN DSL provides several built-in functions for manipulating strings. Here are some of the most common ones, along with examples:

1.  **\`len(string)\`:** Returns the length of a string.

\${title}
Example: Getting the length of a string
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
len("Hello, World!")
\${expressionBlock}

\${resultBlock}
13
\${resultBlock}

2.  **\`contains(string, substring)\`:** Checks if a string contains a specific substring.

\${title}
Example: Checking if a string contains a substring
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
contains("Hello World", "World")
\${expressionBlock}

\${resultBlock}
true
\${resultBlock}

3.  **\`trim(string)\`:** Removes leading and trailing whitespace from a string.

\${title}
Example: Trimming whitespace from a string
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
trim("  hello world  ")
\${expressionBlock}

\${resultBlock}
"hello world"
\${resultBlock}

4.  **\`upper(string)\`:** Converts a string to uppercase.

\${title}
Example: Converting a string to uppercase
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
upper("hello")
\${expressionBlock}

\${resultBlock}
"HELLO"
\${resultBlock}

5.  **\`lower(string)\`:** Converts a string to lowercase.

\${title}
Example: Converting a string to lowercase
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
lower("WORLD")
\${expressionBlock}

\${resultBlock}
"world"
\${resultBlock}

6. **\`startsWith(string, prefix)\`:** Checks if a string starts with a specific prefix.

\${title}
Example: Checking if a string starts with a prefix
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
startsWith("hello", "he")
\${expressionBlock}

\${resultBlock}
true
\${resultBlock}

7. **\`endsWith(string, suffix)\`:** Checks if a string ends with a specific suffix.

\${title}
Example: Checking if a string ends with a suffix
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
endsWith("world", "ld")
\${expressionBlock}

\${resultBlock}
true
\${resultBlock}

8. **\`string(value)\`:** Converts a value to a string. This is useful when you need to concatenate a number or boolean with a string.

\${title}
Example: Converting a number to a string
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
"The answer is: " + string(42)
\${expressionBlock}

\${resultBlock}
"The answer is: 42"
\${resultBlock}

These functions are essential for string manipulation within ZEN DSL and can be combined to perform more complex operations. Remember to always use the ZEN DSL functions directly, and avoid using JavaScript string methods.
      `;

      const pairs = extractExpressionPairs(stringFunctionsResponse);
      const stats = getPairStatistics(stringFunctionsResponse);
      
      // Should extract 8 functional examples, educational title should create separate cluster
      expect(pairs).toHaveLength(8);
      
      // Verify first example (educational title should NOT be paired)
      expect(pairs[0]).toEqual({
        input: '{}',
        expression: 'len("Hello, World!")',
        result: '13',
        title: 'Example: Getting the length of a string',
        index: 0
      });
      
      // Verify second example
      expect(pairs[1]).toEqual({
        input: '{}',
        expression: 'contains("Hello World", "World")',
        result: 'true',
        title: 'Example: Checking if a string contains a substring',
        index: 1
      });
      
      // Verify all examples have proper titles (none should use the educational title)
      pairs.forEach((pair, index) => {
        expect(pair.title).not.toBe('String Functions in ZEN DSL');
        expect(pair.title).toContain('Example:');
        expect(pair.result).not.toBeNull();
      });
    });

    test('should handle user raw response with sequential clustering correctly', () => {
      const userRawResponse = `
\${title}
ZEN String Functions Overview
\${title}

Here's an overview of common string functions available in ZEN DSL, along with examples:

1.  \`len(string)\`: Returns the length of a string.

\${title}
Example 1: Getting the length of a string
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
len("Hello, World!")
\${expressionBlock}

\${resultBlock}
13
\${resultBlock}

2.  \`contains(string, substring)\`: Checks if a string contains a specific substring.

\${title}
Example 2: Checking if a string contains a substring
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
contains("Hello World", "World")
\${expressionBlock}

\${resultBlock}
true
\${resultBlock}

3.  \`trim(string)\`: Removes leading and trailing whitespace from a string.

\${title}
Example 3: Trimming whitespace from a string
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
trim("  hello world  ")
\${expressionBlock}

\${resultBlock}
"hello world"
\${resultBlock}

4.  \`upper(string)\`: Converts a string to uppercase.

\${title}
Example 4: Converting a string to uppercase
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
upper("hello")
\${expressionBlock}

\${resultBlock}
"HELLO"
\${resultBlock}

5.  \`lower(string)\`: Converts a string to lowercase.

\${title}
Example 5: Converting a string to lowercase
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
lower("WORLD")
\${expressionBlock}

\${resultBlock}
"world"
\${resultBlock}

6.  \`split(string, delimiter)\`: Splits a string into an array of substrings based on a delimiter.

\${title}
Example 6: Splitting a string into an array
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
split("apple,banana,cherry", ",")
\${expressionBlock}

\${resultBlock}
["apple", "banana", "cherry"]
\${resultBlock}

7.  \`matches(string, regex)\`: Checks if a string matches a regular expression.

\${title}
Example 7: Matching a string against a regular expression
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
matches("test123", "[a-z]+[0-9]+")
\${expressionBlock}

\${resultBlock}
true
\${resultBlock}

8. \`startsWith(string, prefix)\`: Checks if a string starts with a specific prefix.

\${title}
Example 8: Checking if a string starts with a prefix
\${title}

\${inputBlock}
{}
\${inputBlock}

\${expressionBlock}
startsWith("Hello World", "Hello")
\${expressionBlock}

\${resultBlock}
true
\${resultBlock}

These functions enable you to perform a variety of string manipulations and checks within ZEN DSL expressions. Remember to always use the ZEN DSL function names (e.g., \`len\`, \`upper\`, \`filter\`) and not their JavaScript equivalents.
      `;

      const pairs = extractExpressionPairs(userRawResponse);
      
      // Should extract 8 examples, NOT pairing educational title with first example
      expect(pairs).toHaveLength(8);
      
      // Critical test: First example should NOT have educational title
      expect(pairs[0].title).toBe('Example 1: Getting the length of a string');
      expect(pairs[0].title).not.toBe('ZEN String Functions Overview');
      
      // Verify each example has its own proper title
      expect(pairs[0].title).toBe('Example 1: Getting the length of a string');
      expect(pairs[1].title).toBe('Example 2: Checking if a string contains a substring');
      expect(pairs[2].title).toBe('Example 3: Trimming whitespace from a string');
      expect(pairs[3].title).toBe('Example 4: Converting a string to uppercase');
      expect(pairs[4].title).toBe('Example 5: Converting a string to lowercase');
      expect(pairs[5].title).toBe('Example 6: Splitting a string into an array');
      expect(pairs[6].title).toBe('Example 7: Matching a string against a regular expression');
      expect(pairs[7].title).toBe('Example 8: Checking if a string starts with a prefix');
      
      // Verify input/expression/result consistency
      pairs.forEach((pair, index) => {
        expect(pair.input).toBe('{}');
        expect(pair.expression).toBeTruthy();
        expect(pair.result).toBeTruthy();
        expect(pair.index).toBe(index);
      });
    });
  });
}); 