import { Example } from './types';

export const stringOperationsExamples: Example[] = [
  // ⚠️  MANUALLY CLEANED - 10 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:41:11.986Z
  // ⚠️  CLEANED FILE - 10 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:40:28.251Z
  // 🔍  Removed IDs: str-adv-1, str-adv-2, str-adv-5, str-adv-6, str-adv-7, str-adv-8, str-adv-9, str-adv-10, str-adv-11, str-adv-12

  // Basic String Operations (from stringExamples)
  {
    id: 'str-1',
    title: 'String Concatenation',
    expression: "'hello' + \" \" + \"world\"",
    sampleInput: '{}',
    expectedOutput: "'hello world'",
    description: 'Concatenate multiple strings',
    category: 'string-operations'
  },
  {
    id: 'str-2',
    title: 'String Length',
    expression: 'len("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Get length of string',
    category: 'string-operations'
  },
  {
    id: 'str-3',
    title: 'String to Uppercase',
    expression: 'upper("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Convert string to uppercase',
    category: 'string-operations'
  },
  {
    id: 'str-4',
    title: 'String to Lowercase',
    expression: 'lower("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"hello, world!"',
    description: 'Convert string to lowercase',
    category: 'string-operations'
  },
  {
    id: 'str-5',
    title: 'String Trim',
    expression: 'trim("  HELLO, WORLD!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Remove leading and trailing whitespace',
    category: 'string-operations'
  },
  {
    id: 'str-6',
    title: 'String Contains',
    expression: 'contains("Hello, World!", "lo")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string contains substring',
    category: 'string-operations'
  },
  {
    id: 'str-7',
    title: 'String Starts With',
    expression: 'startsWith("Hello, World!", "Hello")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string starts with prefix',
    category: 'string-operations'
  },
  {
    id: 'str-8',
    title: 'String Ends With',
    expression: 'endsWith("Hello, World!", "World!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string ends with suffix',
    category: 'string-operations'
  },
  {
    id: 'str-9',
    title: 'String Pattern Matching',
    expression: 'matches("Hello, World!", "H[a-z]+, W[a-z]+!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string matches regex pattern',
    category: 'string-operations'
  },
  {
    id: 'str-10',
    title: 'Phone Number Validation',
    expression: 'matches("123-456-7890", "[0-9]{3}-[0-9]{3}-[0-9]{4}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate phone number format with regex',
    category: 'string-operations'
  },
  {
    id: 'str-11',
    title: 'Date Extraction',
    expression: 'extract("2022-09-18", "(\\d{4})-(\\d{2})-(\\d{2})")',
    sampleInput: '{}',
    expectedOutput: '["2022-09-18", "2022", "09", "18"]',
    description: 'Extract date parts using regex groups',
    category: 'string-operations'
  },
  {
    id: 'str-12',
    title: 'String Split',
    expression: 'split("hello1,hello2,hello3", ",")',
    sampleInput: '{}',
    expectedOutput: "['hello1', 'hello2', 'hello3']",
    description: 'Split string by delimiter',
    category: 'string-operations'
  },
  {
    id: 'str-13',
    title: 'Split and Convert',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert to numbers',
    category: 'string-operations'
  },

  // Advanced String Operations (from string_advancedExamples)',
    expectedOutput: '"Hello DSL"',
    description: 'Replace substring with new value',
    category: 'string-operations'
  },',
    expectedOutput: '"World"',
    description: 'Extract substring from start position with length',
    category: 'string-operations'
  },
  {
    id: 'str-adv-3',
    title: 'Case Sensitive Contains',
    expression: 'contains("Hello World", "hello")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Case-sensitive substring search',
    category: 'string-operations'
  },
  {
    id: 'str-adv-4',
    title: 'Case Insensitive Contains',
    expression: 'contains(lower("Hello World"), lower("HELLO"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Case-insensitive substring search using lowercase',
    category: 'string-operations'
  },',
    expectedOutput: '"00123"',
    description: 'Pad string to left with specified character',
    category: 'string-operations'
  },',
    expectedOutput: '"123**"',
    description: 'Pad string to right with specified character',
    category: 'string-operations'
  },',
    expectedOutput: '4',
    description: 'Find first index of character in string',
    category: 'string-operations'
  },',
    expectedOutput: '7',
    description: 'Find last index of character in string',
    category: 'string-operations'
  },',
    expectedOutput: '"e"',
    description: 'Get character at specific index',
    category: 'string-operations'
  },',
    expectedOutput: '"olleH"',
    description: 'Reverse string character order',
    category: 'string-operations'
  },',
    expectedOutput: '"apple, banana, cherry"',
    description: 'Join array elements into string with separator',
    category: 'string-operations'
  },',
    expectedOutput: '"HELLO_WORLD"',
    description: 'Chain multiple string operations: trim, replace, uppercase',
    category: 'string-operations'
  },

  // String Slicing Operations (from sliceExamples)
  {
    id: 'slice-1',
    title: 'Basic String Slice',
    expression: '"hello world"[0:5]',
    sampleInput: '{}',
    expectedOutput: '"hello"',
    description: 'Extract substring using slice notation',
    category: 'string-operations'
  },
  {
    id: 'slice-2',
    title: 'String Slice from Middle',
    expression: '"hello world"[6:11]',
    sampleInput: '{}',
    expectedOutput: '"world"',
    description: 'Extract substring from middle using slice',
    category: 'string-operations'
  },
  {
    id: 'slice-3',
    title: 'String Slice with Negative Index',
    expression: '"hello world"[-5:-1]',
    sampleInput: '{}',
    expectedOutput: '"worl"',
    description: 'Use negative indices in string slice',
    category: 'string-operations'
  },
  {
    id: 'slice-4',
    title: 'String Slice to End',
    expression: '"hello world"[6:]',
    sampleInput: '{}',
    expectedOutput: '"world"',
    description: 'Slice from index to end of string',
    category: 'string-operations'
  },
  {
    id: 'slice-5',
    title: 'String Slice from Start',
    expression: '"hello world"[:5]',
    sampleInput: '{}',
    expectedOutput: '"hello"',
    description: 'Slice from start to specific index',
    category: 'string-operations'
  },
  {
    id: 'slice-6',
    title: 'Variable String Slice',
    expression: 'text[start:end]',
    sampleInput: '{"text": "programming", "start": 0, "end": 7}',
    expectedOutput: '"program"',
    description: 'Use variables for slice indices',
    category: 'string-operations'
  },
  {
    id: 'slice-7',
    title: 'Single Character Access',
    expression: '"hello"[1]',
    sampleInput: '{}',
    expectedOutput: '"e"',
    description: 'Access single character by index',
    category: 'string-operations'
  },
  {
    id: 'slice-8',
    title: 'Dynamic Slice with Length',
    expression: 'name[0:len(name)-1]',
    sampleInput: '{"name": "Alice"}',
    expectedOutput: '"Alic"',
    description: 'Dynamic slice using string length',
    category: 'string-operations'
  }
]; 