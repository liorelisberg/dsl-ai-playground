import { Example } from './types';

export const booleanExamples: Example[] = [
  {
    id: 'bool-1',
    title: 'Boolean AND Operation',
    expression: 'true and false',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Boolean AND logic operation',
    category: 'boolean'
  },
  {
    id: 'bool-2', 
    title: 'Boolean OR Operation',
    expression: 'true or false',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Boolean OR logic operation',
    category: 'boolean'
  },
  {
    id: 'bool-3',
    title: 'Boolean NOT Operation',
    expression: 'not true',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Boolean NOT logic operation',
    category: 'boolean'
  },
  {
    id: 'bool-4',
    title: 'Variable Boolean Check',
    expression: 'x == true',
    sampleInput: '{ "x": true }',
    expectedOutput: 'true',
    description: 'Check if variable equals true',
    category: 'boolean'
  },
  {
    id: 'bool-5',
    title: 'Variable Boolean False Check',
    expression: 'x == false',
    sampleInput: '{ "x": false }',
    expectedOutput: 'true',
    description: 'Check if variable equals false',
    category: 'boolean'
  },
  {
    id: 'bool-6',
    title: 'Variable AND True',
    expression: 'x and true',
    sampleInput: '{ "x": false }',
    expectedOutput: 'false',
    description: 'Variable AND with true literal',
    category: 'boolean'
  },
  {
    id: 'bool-7',
    title: 'Variable OR True',
    expression: 'x or true',
    sampleInput: '{ "x": false }',
    expectedOutput: 'true',
    description: 'Variable OR with true literal',
    category: 'boolean'
  },
  {
    id: 'bool-8',
    title: 'NOT Variable',
    expression: 'not x',
    sampleInput: '{ "x": true }',
    expectedOutput: 'false',
    description: 'NOT operation on variable',
    category: 'boolean'
  },
  {
    id: 'bool-9',
    title: 'Complex Boolean AND NOT',
    expression: 'true and not x',
    sampleInput: '{ "x": true }',
    expectedOutput: 'false',
    description: 'True AND NOT variable combination',
    category: 'boolean'
  },
  {
    id: 'bool-10',
    title: 'Complex Boolean OR NOT',
    expression: 'false or not x',
    sampleInput: '{ "x": true }',
    expectedOutput: 'false',
    description: 'False OR NOT variable combination',
    category: 'boolean'
  }
];
