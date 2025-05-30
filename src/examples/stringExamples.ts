import { Example } from './types';

export const stringExamples: Example[] = [
  {
    id: 'str-1',
    title: 'String Concatenation',
    expression: "'hello' + \" \" + \"world\"",
    sampleInput: '{}',
    expectedOutput: "'hello world'",
    description: 'Concatenate multiple strings',
    category: 'string'
  },
  {
    id: 'str-2',
    title: 'String Length',
    expression: 'len("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Get length of string',
    category: 'string'
  },
  {
    id: 'str-3',
    title: 'String to Uppercase',
    expression: 'upper("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Convert string to uppercase',
    category: 'string'
  },
  {
    id: 'str-4',
    title: 'String to Lowercase',
    expression: 'lower("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"hello, world!"',
    description: 'Convert string to lowercase',
    category: 'string'
  },
  {
    id: 'str-5',
    title: 'String Trim',
    expression: 'trim("  HELLO, WORLD!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Remove leading and trailing whitespace',
    category: 'string'
  },
  {
    id: 'str-6',
    title: 'String Contains',
    expression: 'contains("Hello, World!", "lo")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string contains substring',
    category: 'string'
  },
  {
    id: 'str-7',
    title: 'String Starts With',
    expression: 'startsWith("Hello, World!", "Hello")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string starts with prefix',
    category: 'string'
  },
  {
    id: 'str-8',
    title: 'String Ends With',
    expression: 'endsWith("Hello, World!", "World!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string ends with suffix',
    category: 'string'
  },
  {
    id: 'str-9',
    title: 'String Pattern Matching',
    expression: 'matches("Hello, World!", "H[a-z]+, W[a-z]+!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string matches regex pattern',
    category: 'string'
  },
  {
    id: 'str-10',
    title: 'Phone Number Validation',
    expression: 'matches("123-456-7890", "[0-9]{3}-[0-9]{3}-[0-9]{4}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate phone number format with regex',
    category: 'string'
  },
  {
    id: 'str-11',
    title: 'Date Extraction',
    expression: 'extract("2022-09-18", "(\\d{4})-(\\d{2})-(\\d{2})")',
    sampleInput: '{}',
    expectedOutput: '["2022-09-18", "2022", "09", "18"]',
    description: 'Extract date parts using regex groups',
    category: 'string'
  },
  {
    id: 'str-12',
    title: 'String Split',
    expression: 'split("hello1,hello2,hello3", ",")',
    sampleInput: '{}',
    expectedOutput: "['hello1', 'hello2', 'hello3']",
    description: 'Split string by delimiter',
    category: 'string'
  },
  {
    id: 'str-13',
    title: 'Split and Convert',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert to numbers',
    category: 'string'
  },
];
