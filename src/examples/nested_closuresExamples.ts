import { Example } from './types';

export const nested_closuresExamples: Example[] = [
  {
    id: 'nested-closure-1',
    title: 'Filter After Map',
    expression: 'filter(map([1, 2, 3, 4], # * 2), # > 5)',
    sampleInput: '{}',
    expectedOutput: '[6, 8]',
    description: 'Map then filter: double values then keep those > 5',
    category: 'nested-closures'
  },
  {
    id: 'nested-closure-2',
    title: 'Map After Filter',
    expression: 'map(filter([1, 2, 3, 4], # % 2 == 0), # * 3)',
    sampleInput: '{}',
    expectedOutput: '[6, 12]',
    description: 'Filter then map: keep even numbers then multiply by 3',
    category: 'nested-closures'
  },
  {
    id: 'nested-closure-3',
    title: 'Complex Filter Map Chain',
    expression: 'map(filter([1, 2, 3, 4, 5], # > 2), # * 2)',
    sampleInput: '{}',
    expectedOutput: '[6, 8, 10]',
    description: 'Filter numbers > 2, then double them',
    category: 'nested-closures'
  },
  {
    id: 'nested-closure-4',
    title: 'Sum of Squared Filtered',
    expression: 'sum(map(filter([1, 2, 3, 4, 5], # > 3), # ^ 2))',
    sampleInput: '{}',
    expectedOutput: '41',
    description: 'Filter > 3, square them, then sum: (4² + 5² = 16 + 25 = 41)',
    category: 'nested-closures'
  },
  {
    id: 'nested-closure-5',
    title: 'Object Filter Map Names',
    expression: 'map(filter([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id > 1), #.name)',
    sampleInput: '{}',
    expectedOutput: '["Jane"]',
    description: 'Filter objects by ID > 1, then extract names',
    category: 'nested-closures'
  },
  {
    id: 'nested-closure-6',
    title: 'Length of Filtered Mapped',
    expression: 'len(filter(map([1, 2, 3, 4, 5], # * 2), # > 5))',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Map to double, filter > 5, then count results',
    category: 'nested-closures'
  },
  {
    id: 'nested-closure-7',
    title: 'Object Filter Map Sum',
    expression: 'sum(map(filter([{id: 1, val: 10}, {id: 2, val: 20}, {id: 3, val: 30}], #.id > 1), #.val))',
    sampleInput: '{}',
    expectedOutput: '50',
    description: 'Filter objects by ID > 1, extract values, then sum (20 + 30 = 50)',
    category: 'nested-closures'
  },
];
