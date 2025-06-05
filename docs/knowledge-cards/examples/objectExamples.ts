import { Example } from './types';

export const objectExamples: Example[] = [
  {
    id: 'obj-1',
    title: 'Property Access',
    expression: 'user.address.city',
    sampleInput: '{"user": {"address": {"city": "New York"}}}',
    expectedOutput: '"New York"',
    description: 'Access nested object property',
    category: 'object'
  },
  {
    id: 'obj-2',
    title: 'Array Index Access',
    expression: 'user.contacts[0].phone',
    sampleInput: '{"user": {"contacts": [{"phone": "123-456-7890"}]}}',
    expectedOutput: '"123-456-7890"',
    description: 'Access array element property',
    category: 'object'
  },
  {
    id: 'obj-3',
    title: 'Object Keys',
    expression: 'keys(customer)',
    sampleInput: '{"customer": {"firstName": "John"}}',
    expectedOutput: '["firstName"]',
    description: 'Get object property keys',
    category: 'object'
  },
  {
    id: 'obj-4',
    title: 'Object Values',
    expression: 'values(customer)',
    sampleInput: '{"customer": {"firstName": "John"}}',
    expectedOutput: '["John"]',
    description: 'Get object property values',
    category: 'object'
  },
  {
    id: 'obj-5',
    title: 'Array Index Check',
    expression: 'data.items[0] == "a"',
    sampleInput: '{"data": {"items": ["a", "b", "c"]}}',
    expectedOutput: 'true',
    description: 'Check array element value',
    category: 'object'
  },
  {
    id: 'obj-6',
    title: 'Sum Object Values',
    expression: 'sum(values({a: 1, b: 2, c: 3}))',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Sum all values in an object',
    category: 'object'
  },
  {
    id: 'obj-7',
    title: 'Dynamic Key Creation',
    expression: 'keys({[`dynamic-${"key"}`]: 123})',
    sampleInput: '{}',
    expectedOutput: '["dynamic-key"]',
    description: 'Create object with dynamic key',
    category: 'object'
  },
  {
    id: 'obj-8',
    title: 'Check Values Contains',
    expression: 'contains(values({a: 1, b: 2, c: 3}), 2)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if object values contain a specific value',
    category: 'object'
  }
];
