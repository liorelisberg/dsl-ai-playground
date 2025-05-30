import { Example } from './types';

export const sliceExamples: Example[] = [
  {
    id: 'slice-1',
    title: 'String Slice Start',
    expression: 'string[0:5]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'sample'",
    description: 'Extract substring from start',
    category: 'slice'
  },
  {
    id: 'slice-2',
    title: 'String Slice End',
    expression: 'string[7:12]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'string'",
    description: 'Extract substring from middle to end',
    category: 'slice'
  },
  {
    id: 'slice-3',
    title: 'String Slice From Index',
    expression: 'string[7:]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'string'",
    description: 'Extract substring from index to end',
    category: 'slice'
  },
  {
    id: 'slice-4',
    title: 'String Slice To Index',
    expression: 'string[:5]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'sample'",
    description: 'Extract substring from start to index',
    category: 'slice'
  },
  {
    id: 'slice-5',
    title: 'Unary Slice Start Comparison',
    expression: '$[0:5] == "sample"',
    sampleInput: '{"$": "sample_string"}',
    expectedOutput: 'true',
    description: 'Compare slice result with expected string in unary context',
    category: 'slice'
  },
  {
    id: 'slice-6',
    title: 'Unary Slice End Comparison',
    expression: '$[7:12] == "string"',
    sampleInput: '{"$": "sample_string"}',
    expectedOutput: 'true',
    description: 'Compare slice from middle to end in unary context',
    category: 'slice'
  },
  {
    id: 'slice-7',
    title: 'Unary Slice From Index Comparison',
    expression: '$[7:] == "string"',
    sampleInput: '{"$": "sample_string"}',
    expectedOutput: 'true',
    description: 'Compare slice from index to end in unary context',
    category: 'slice'
  },
  {
    id: 'slice-8',
    title: 'Unary Slice To Index Comparison',
    expression: '$[:5] == "sample"',
    sampleInput: '{"$": "sample_string"}',
    expectedOutput: 'true',
    description: 'Compare slice from start to index in unary context',
    category: 'slice'
  },
];
