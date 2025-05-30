import { Example } from './types';

export const nullExamples: Example[] = [
  {
    id: 'null-1',
    title: 'Nullish Coalescing',
    expression: 'null ?? "hello"',
    sampleInput: '{}',
    expectedOutput: '"hello"',
    description: 'Return right side if left is null',
    category: 'null'
  },
  {
    id: 'null-2',
    title: 'User Name Default',
    expression: 'user.name ?? "Guest"',
    sampleInput: '{"user": {"name": "John"}}',
    expectedOutput: '"John"',
    description: 'Use existing value or default',
    category: 'null'
  },
  {
    id: 'null-3',
    title: 'Missing Property Default',
    expression: 'user.name ?? "Guest"',
    sampleInput: '{"user": {}}',
    expectedOutput: '"Guest"',
    description: 'Use default when property missing',
    category: 'null'
  },
  {
    id: 'null-4',
    title: 'Chained Null Coalescing',
    expression: 'null ?? 123 ?? 321',
    sampleInput: '{}',
    expectedOutput: '123',
    description: 'Chain multiple null coalescing operators',
    category: 'null'
  },
  {
    id: 'null-5',
    title: 'Multiple Null Chain',
    expression: 'null ?? null ?? 321',
    sampleInput: '{}',
    expectedOutput: '321',
    description: 'Multiple null values in chain',
    category: 'null'
  },
  {
    id: 'null-6',
    title: 'Nested Property with Default',
    expression: '(user.address.city) ?? "Unknown"',
    sampleInput: '{"user": {"address": {"city": "New York"}}}',
    expectedOutput: '"New York"',
    description: 'Nested property access with null coalescing',
    category: 'null'
  },
  {
    id: 'null-7',
    title: 'Missing Nested Property Default',
    expression: '(user.address.city) ?? "Unknown"',
    sampleInput: '{"user": {}}',
    expectedOutput: '"Unknown"',
    description: 'Default for missing nested property',
    category: 'null'
  },
  {
    id: 'null-8',
    title: 'Conditional Null Coalescing',
    expression: 'false or true ? null ?? "test" : false',
    sampleInput: '{}',
    expectedOutput: '"test"',
    description: 'Null coalescing within conditional expression',
    category: 'null'
  },
];
