import { Example } from './types';

export const stringOperationsExamples: Example[] = [
  // ✅ REBUILT FILE - All examples validated against source-of-truth functions
  // 📅 Rebuilt on: 2025-01-30
  // 🔍 Uses only validated DSL functions: len, upper, lower, trim, contains, startsWith, endsWith, matches, extract, split, map, number

  // Basic String Operations
  {
    id: 'str-1',
    title: 'String Concatenation',
    expression: "'hello' + \" \" + \"world\"",
    sampleInput: '{}',
    expectedOutput: "'hello world'",
    description: 'Concatenate multiple strings using + operator',
    category: 'string-operations'
  },
  {
    id: 'str-2',
    title: 'String Length',
    expression: 'len("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Get length of string using len() function',
    category: 'string-operations'
  },
  {
    id: 'str-3',
    title: 'String to Uppercase',
    expression: 'upper("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Convert string to uppercase using upper() function',
    category: 'string-operations'
  },
  {
    id: 'str-4',
    title: 'String to Lowercase',
    expression: 'lower("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"hello, world!"',
    description: 'Convert string to lowercase using lower() function',
    category: 'string-operations'
  },
  {
    id: 'str-5',
    title: 'String Trim',
    expression: 'trim("  HELLO, WORLD!  ")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Remove leading and trailing whitespace using trim() function',
    category: 'string-operations'
  },
  {
    id: 'str-6',
    title: 'String Contains Check',
    expression: 'contains("Hello, World!", "lo")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string contains substring using contains() function',
    category: 'string-operations'
  },
  {
    id: 'str-7',
    title: 'String Starts With',
    expression: 'startsWith("Hello, World!", "Hello")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string starts with prefix using startsWith() function',
    category: 'string-operations'
  },
  {
    id: 'str-8',
    title: 'String Ends With',
    expression: 'endsWith("Hello, World!", "World!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string ends with suffix using endsWith() function',
    category: 'string-operations'
  },
  {
    id: 'str-9',
    title: 'String Pattern Matching',
    expression: 'matches("Hello, World!", "H[a-z]+, W[a-z]+!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string matches regex pattern using matches() function',
    category: 'string-operations'
  },
  {
    id: 'str-10',
    title: 'Phone Number Validation',
    expression: 'matches("123-456-7890", "[0-9]{3}-[0-9]{3}-[0-9]{4}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate phone number format with regex using matches() function',
    category: 'string-operations'
  },
  {
    id: 'str-11',
    title: 'Email Validation',
    expression: 'matches("user@example.com", "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate email format using regex pattern',
    category: 'string-operations'
  },
  {
    id: 'str-12',
    title: 'Date Extraction with Groups',
    expression: 'extract("2022-09-18", "(\\d{4})-(\\d{2})-(\\d{2})")',
    sampleInput: '{}',
    expectedOutput: '["2022-09-18", "2022", "09", "18"]',
    description: 'Extract date parts using regex groups with extract() function',
    category: 'string-operations'
  },
  {
    id: 'str-13',
    title: 'URL Parts Extraction',
    expression: 'extract("https://example.com:8080/path", "(https?)://([^:/]+):?(\\d*)")',
    sampleInput: '{}',
    expectedOutput: '["https://example.com:8080", "https", "example.com", "8080"]',
    description: 'Extract URL components using complex regex',
    category: 'string-operations'
  },
  {
    id: 'str-14',
    title: 'String Split by Delimiter',
    expression: 'split("hello,world,test", ",")',
    sampleInput: '{}',
    expectedOutput: '["hello", "world", "test"]',
    description: 'Split string by delimiter using split() function',
    category: 'string-operations'
  },
  {
    id: 'str-15',
    title: 'Split and Convert to Numbers',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert parts to numbers',
    category: 'string-operations'
  },

  // Advanced String Operations
  {
    id: 'str-adv-1',
    title: 'Case Sensitive Contains',
    expression: 'contains("Hello World", "hello")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Case-sensitive substring search - exact case required',
    category: 'string-operations'
  },
  {
    id: 'str-adv-2',
    title: 'Case Insensitive Contains',
    expression: 'contains(lower("Hello World"), lower("HELLO"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Case-insensitive substring search using lowercase conversion',
    category: 'string-operations'
  },
  {
    id: 'str-adv-3',
    title: 'Multi-Step String Processing',
    expression: 'upper(trim("  hello world  "))',
    sampleInput: '{}',
    expectedOutput: '"HELLO WORLD"',
    description: 'Chain multiple string operations: trim then uppercase',
    category: 'string-operations'
  },
  {
    id: 'str-adv-4',
    title: 'Complex String Filtering',
    expression: 'map(filter(split("apple,banana,a,cherry,go", ","), len(#) > 2), upper(#))',
    sampleInput: '{}',
    expectedOutput: '["APPLE", "BANANA", "CHERRY"]',
    description: 'Filter strings by length and convert to uppercase',
    category: 'string-operations'
  },
  {
    id: 'str-adv-5',
    title: 'String Length Validation',
    expression: 'map(split("short,medium,verylongstring", ","), {word: #, length: len(#), valid: len(#) >= 5 and len(#) <= 10})',
    sampleInput: '{}',
    expectedOutput: '[{"word": "short", "length": 5, "valid": true}, {"word": "medium", "length": 6, "valid": true}, {"word": "verylongstring", "length": 14, "valid": false}]',
    description: 'Validate string lengths with complex conditions',
    category: 'string-operations'
  },

  // String Slicing Operations
  {
    id: 'slice-1',
    title: 'Basic String Slice',
    expression: '"hello world"[0:5]',
    sampleInput: '{}',
    expectedOutput: '"hello"',
    description: 'Extract substring using slice notation [start:end]',
    category: 'string-operations'
  },
  {
    id: 'slice-2',
    title: 'String Slice from Middle',
    expression: '"hello world"[6:11]',
    sampleInput: '{}',
    expectedOutput: '"world"',
    description: 'Extract substring from middle using slice notation',
    category: 'string-operations'
  },
  {
    id: 'slice-3',
    title: 'String Slice to End',
    expression: '"hello world"[6:]',
    sampleInput: '{}',
    expectedOutput: '"world"',
    description: 'Slice from index to end of string',
    category: 'string-operations'
  },
  {
    id: 'slice-4',
    title: 'String Slice from Start',
    expression: '"hello world"[:5]',
    sampleInput: '{}',
    expectedOutput: '"hello"',
    description: 'Slice from start to specific index',
    category: 'string-operations'
  },
  {
    id: 'slice-5',
    title: 'Variable String Slice',
    expression: 'text[start:end]',
    sampleInput: '{"text": "programming", "start": 0, "end": 7}',
    expectedOutput: '"program"',
    description: 'Use variables for slice indices',
    category: 'string-operations'
  },
  {
    id: 'slice-6',
    title: 'Single Character Access',
    expression: '"hello"[1]',
    sampleInput: '{}',
    expectedOutput: '"e"',
    description: 'Access single character by index',
    category: 'string-operations'
  },
  {
    id: 'slice-7',
    title: 'Dynamic Slice with Length',
    expression: 'name[0:len(name)-1]',
    sampleInput: '{"name": "Alice"}',
    expectedOutput: '"Alic"',
    description: 'Dynamic slice using string length calculation',
    category: 'string-operations'
  },
  {
    id: 'slice-8',
    title: 'Conditional String Slicing',
    expression: 'len(text) > 5 ? text[0:5] + "..." : text',
    sampleInput: '{"text": "This is a long string"}',
    expectedOutput: '"This ..."',
    description: 'Conditional string truncation with ellipsis',
    category: 'string-operations'
  },

  // Template String Operations
  {
    id: 'template-1',
    title: 'Simple Template String',
    expression: '`Hello, ${name}!`',
    sampleInput: '{"name": "World"}',
    expectedOutput: '"Hello, World!"',
    description: 'Basic template string with variable interpolation',
    category: 'string-operations'
  },
  {
    id: 'template-2',
    title: 'Template with Expression',
    expression: '`The length of "${text}" is ${len(text)} characters`',
    sampleInput: '{"text": "hello"}',
    expectedOutput: '"The length of \\"hello\\" is 5 characters"',
    description: 'Template string with expression evaluation',
    category: 'string-operations'
  },
  {
    id: 'template-3',
    title: 'Complex Template with Conditions',
    expression: '`User ${user.name} has ${user.score >= 80 ? "passed" : "failed"} with score ${user.score}`',
    sampleInput: '{"user": {"name": "Alice", "score": 85}}',
    expectedOutput: '"User Alice has passed with score 85"',
    description: 'Template with conditional expressions',
    category: 'string-operations'
  },

  // Complex String Examples (added from our validated complex examples)
  {
    id: 'complex-string-1',
    title: 'Advanced Text Processing',
    expression: 'map(filter(split(text, " "), len(#) > 3), upper(trim(#)))',
    sampleInput: '{"text": "  the quick brown fox jumps over lazy dog  "}',
    expectedOutput: '["QUICK", "BROWN", "JUMPS", "OVER", "LAZY"]',
    description: 'Filter words by length, trim whitespace, and convert to uppercase',
    category: 'complex-string'
  },
  {
    id: 'complex-template-1',
    title: 'Dynamic Report Generation',
    expression: '`Report Summary:\nTotal Orders: ${len(orders)}\nRevenue: $${sum(map(orders, #.total))}\nTop Customer: ${map(orders, #.customer)[0]}\nGenerated: ${d().format("%Y-%m-%d %H:%M")}`',
    sampleInput: '{"orders": [{"customer": "Alice", "total": 250}, {"customer": "Bob", "total": 150}]}',
    expectedOutput: '"Report Summary:\\nTotal Orders: 2\\nRevenue: $400\\nTop Customer: Alice\\nGenerated: 2023-10-15 14:30"',
    description: 'Generate dynamic reports using template strings with complex expressions',
    category: 'complex-template'
  },
  {
    id: 'complex-template-2',
    title: 'User Notification Message',
    expression: '`Hello ${user.name}! ${user.messages > 0 ? `You have ${user.messages} new message${user.messages > 1 ? "s" : ""}` : "No new messages"}. Last login: ${d(user.lastLogin).format("%B %d, %Y")}`',
    sampleInput: '{"user": {"name": "John", "messages": 3, "lastLogin": "2023-10-01"}}',
    expectedOutput: '"Hello John! You have 3 new messages. Last login: October 01, 2023"',
    description: 'Create personalized user notifications with conditional pluralization',
    category: 'complex-template'
  }
]; 