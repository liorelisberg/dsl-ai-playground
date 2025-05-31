import { Example } from './types';

export const unary_operationsExamples: Example[] = [
  {
    id: 'unary-1',
    title: 'Boolean Context True',
    expression: 'true',
    sampleInput: '{ "$": true }',
    expectedOutput: 'true',
    description: 'Boolean literal evaluation in true context',
    category: 'unary-operations'
  },
  {
    id: 'unary-2',
    title: 'Boolean Context False',
    expression: 'true',
    sampleInput: '{ "$": false }',
    expectedOutput: 'false',
    description: 'Boolean literal evaluation in false context',
    category: 'unary-operations'
  },
  {
    id: 'unary-3',
    title: 'Greater Than Comparison',
    expression: '> 5',
    sampleInput: '{"$": 10}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is greater than 5',
    category: 'unary-operations'
  },
  {
    id: 'unary-4',
    title: 'Less Than Comparison',
    expression: '< 10',
    sampleInput: '{"$": 5}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is less than 10',
    category: 'unary-operations'
  },
  {
    id: 'unary-5',
    title: 'Greater Than or Equal',
    expression: '>= 10',
    sampleInput: '{"$": 10}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is greater than or equal to 10',
    category: 'unary-operations'
  },
  {
    id: 'unary-6',
    title: 'Less Than or Equal',
    expression: '<= 5',
    sampleInput: '{"$": 5}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is less than or equal to 5',
    category: 'unary-operations'
  },
  {
    id: 'unary-7',
    title: 'Range Check Inclusive',
    expression: '[-10..0]',
    sampleInput: '{"$": 0}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is in inclusive range [-10..0]',
    category: 'unary-operations'
  },
  {
    id: 'unary-8',
    title: 'Range Check Exclusive Start',
    expression: '(-10..0]',
    sampleInput: '{"$": -10}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is in range excluding start (-10..0]',
    category: 'unary-operations'
  },
  {
    id: 'unary-9',
    title: 'Range Check Exclusive End',
    expression: '[-10..0)',
    sampleInput: '{"$": -10}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is in range excluding end [-10..0)',
    category: 'unary-operations'
  },
  {
    id: 'unary-10',
    title: 'Range Check Both Exclusive',
    expression: '(-10..0)',
    sampleInput: '{"$": 0}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is in range excluding both ends (-10..0)',
    category: 'unary-operations'
  },
  {
    id: 'unary-11',
    title: 'Complex Range Check',
    expression: '[-15..-5]',
    sampleInput: '{"$": -4.99}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is in decimal range [-15..-5]',
    category: 'unary-operations'
  },
  {
    id: 'unary-12',
    title: 'Combined Comparison',
    expression: '> 5 and < 10',
    sampleInput: '{"$": 5}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is greater than 5 AND less than 10',
    category: 'unary-operations'
  },
  {
    id: 'unary-13',
    title: 'Range and Comparison',
    expression: '[-10..0] and > -5',
    sampleInput: '{"$": -4.99}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is in range AND greater than -5',
    category: 'unary-operations'
  },
  {
    id: 'unary-14',
    title: 'String Set Check',
    expression: '["GB", "US"]',
    sampleInput: '{"$": "US"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) matches one of the values',
    category: 'unary-operations'
  },
  {
    id: 'unary-15',
    title: 'String Length Check',
    expression: 'len($) == 13',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) length equals 13',
    category: 'unary-operations'
  },
  {
    id: 'unary-16',
    title: 'String Starts With',
    expression: 'startsWith($, "Hello")',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) starts with "Hello"',
    category: 'unary-operations'
  },
  {
    id: 'unary-17',
    title: 'String Ends With',
    expression: 'endsWith($, "World!")',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) ends with "World!"',
    category: 'unary-operations'
  },
  {
    id: 'unary-18',
    title: 'String Contains',
    expression: 'contains($, "lo")',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) contains "lo"',
    category: 'unary-operations'
  },
  {
    id: 'unary-19',
    title: 'String Slice Check',
    expression: '$[0:5] == "sample"',
    sampleInput: '{"$": "sample_string"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) slice [0:5] equals "sample"',
    category: 'unary-operations'
  },
];
