import { Example } from './types';

export const type_checkingExamples: Example[] = [
  {
    id: 'type-1',
    title: 'Check Numeric Float',
    expression: 'isNumeric(123.123)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if floating point number is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-2',
    title: 'Check Numeric Integer',
    expression: 'isNumeric(123)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if integer is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-3',
    title: 'Check Numeric String Float',
    expression: 'isNumeric("123.123")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string containing float is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-4',
    title: 'Check Numeric String Integer',
    expression: 'isNumeric("123")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string containing integer is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-5',
    title: 'Check Non-Numeric String',
    expression: 'isNumeric("string")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if text string is numeric (returns false)',
    category: 'type-checking'
  },
  {
    id: 'type-6',
    title: 'Check Boolean Not Numeric',
    expression: 'isNumeric(true)',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if boolean is numeric (returns false)',
    category: 'type-checking'
  },
  {
    id: 'type-7',
    title: 'Detect String Type',
    expression: 'type("hello")',
    sampleInput: '{}',
    expectedOutput: '"string"',
    description: 'Detect type of string value',
    category: 'type-checking'
  },
  {
    id: 'type-8',
    title: 'Detect Number Type',
    expression: 'type(123)',
    sampleInput: '{}',
    expectedOutput: '"number"',
    description: 'Detect type of numeric value',
    category: 'type-checking'
  },
  {
    id: 'type-9',
    title: 'Detect Boolean Type',
    expression: 'type(true)',
    sampleInput: '{}',
    expectedOutput: '"bool"',
    description: 'Detect type of boolean value',
    category: 'type-checking'
  },
  {
    id: 'type-10',
    title: 'Detect Null Type',
    expression: 'type(null)',
    sampleInput: '{}',
    expectedOutput: '"null"',
    description: 'Detect type of null value',
    category: 'type-checking'
  },
  {
    id: 'type-11',
    title: 'Detect Array Type',
    expression: 'type([1, 2, 3])',
    sampleInput: '{}',
    expectedOutput: '"array"',
    description: 'Detect type of array value',
    category: 'type-checking'
  },
  {
    id: 'type-1',
    title: 'Check Numeric Float',
    expression: 'isNumeric(123.123)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if floating point number is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-2',
    title: 'Check Numeric Integer',
    expression: 'isNumeric(123)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if integer is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-3',
    title: 'Check Numeric String Float',
    expression: 'isNumeric("123.123")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string containing float is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-4',
    title: 'Check Numeric String Integer',
    expression: 'isNumeric("123")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string containing integer is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-5',
    title: 'Check Non-Numeric String',
    expression: 'isNumeric("string")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if text string is numeric (returns false)',
    category: 'type-checking'
  },
  {
    id: 'type-6',
    title: 'Check Boolean Not Numeric',
    expression: 'isNumeric(true)',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if boolean is numeric (returns false)',
    category: 'type-checking'
  },
  {
    id: 'type-7',
    title: 'Detect String Type',
    expression: 'type("hello")',
    sampleInput: '{}',
    expectedOutput: '"string"',
    description: 'Detect type of string value',
    category: 'type-checking'
  },
  {
    id: 'type-8',
    title: 'Detect Number Type',
    expression: 'type(123)',
    sampleInput: '{}',
    expectedOutput: '"number"',
    description: 'Detect type of numeric value',
    category: 'type-checking'
  },
  {
    id: 'type-9',
    title: 'Detect Boolean Type',
    expression: 'type(true)',
    sampleInput: '{}',
    expectedOutput: '"bool"',
    description: 'Detect type of boolean value',
    category: 'type-checking'
  },
  {
    id: 'type-10',
    title: 'Detect Null Type',
    expression: 'type(null)',
    sampleInput: '{}',
    expectedOutput: '"null"',
    description: 'Detect type of null value',
    category: 'type-checking'
  },
  {
    id: 'type-11',
    title: 'Detect Array Type',
    expression: 'type([1, 2, 3])',
    sampleInput: '{}',
    expectedOutput: '"array"',
    description: 'Detect type of array value',
    category: 'type-checking'
  },
];
