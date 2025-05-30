import { Example } from './types';

export const conversionExamples: Example[] = [
  {
    id: 'type-1',
    title: 'Number to String',
    expression: 'string(123)',
    sampleInput: '{}',
    expectedOutput: '"123"',
    description: 'Convert number to string',
    category: 'conversion'
  },
  {
    id: 'type-2',
    title: 'String to Number',
    expression: 'number("123.45")',
    sampleInput: '{}',
    expectedOutput: '123.45',
    description: 'Convert string to number',
    category: 'conversion'
  },
  {
    id: 'type-3',
    title: 'Boolean to Number',
    expression: 'number(true)',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Convert boolean to number',
    category: 'conversion'
  },
  {
    id: 'type-4',
    title: 'String to Boolean',
    expression: 'bool("true")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Convert string to boolean',
    category: 'conversion'
  },
  {
    id: 'type-5',
    title: 'Boolean True to String',
    expression: 'string(true)',
    sampleInput: '{}',
    expectedOutput: '"true"',
    description: 'Convert boolean true to string',
    category: 'conversion'
  },
  {
    id: 'type-6',
    title: 'Boolean False to String',
    expression: 'string(false)',
    sampleInput: '{}',
    expectedOutput: '"false"',
    description: 'Convert boolean false to string',
    category: 'conversion'
  },
  {
    id: 'type-7',
    title: 'Boolean False to Number',
    expression: 'number(false)',
    sampleInput: '{}',
    expectedOutput: '0',
    description: 'Convert boolean false to number',
    category: 'conversion'
  },
  {
    id: 'type-8',
    title: 'String False to Boolean',
    expression: 'bool("false")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Convert string "false" to boolean',
    category: 'conversion'
  },
];
