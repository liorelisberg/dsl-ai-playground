import { Example } from './types';

export const array_flatteningExamples: Example[] = [
  {
    id: 'array-flat-1',
    title: 'FlatMap Basic',
    expression: 'flatMap([[1, 2], [3, 4], [5, 6]], #)',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    description: 'Flatten nested arrays into single array',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-2',
    title: 'FlatMap with Transformation',
    expression: 'flatMap([[1, 2], [3, 4]], map(#, # * 2))',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8]',
    description: 'Flatten arrays while transforming elements',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-3',
    title: 'FlatMap Object Properties',
    expression: 'flatMap(groups, #.items)',
    sampleInput: '{"groups":[{"items":[1,2]},{"items":[3,4]},{"items":[5,6]}]}',
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    description: 'Flatten arrays from object properties',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-4',
    title: 'Nested Array Processing',
    expression: 'sum(flatMap(matrix, #))',
    sampleInput: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}',
    expectedOutput: '45',
    description: 'Flatten 2D matrix and calculate sum',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-5',
    title: 'FlatMap with Filter',
    expression: 'flatMap(arrays, filter(#, # > 2))',
    sampleInput: '{"arrays":[[1,2,3],[4,5,6],[1,7,8]]}',
    expectedOutput: '[3, 4, 5, 6, 7, 8]',
    description: 'Flatten arrays after filtering elements greater than 2',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-6',
    title: 'Unique Array Elements',
    expression: 'unique([1, 2, 2, 3, 3, 3, 4])',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3, 4]',
    description: 'Get unique elements from array',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-7',
    title: 'Array Sort Numbers',
    expression: 'sort([3, 1, 4, 1, 5, 9, 2, 6])',
    sampleInput: '{}',
    expectedOutput: '[1, 1, 2, 3, 4, 5, 6, 9]',
    description: 'Sort numerical array in ascending order',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-8',
    title: 'Array Sort Strings',
    expression: 'sort(["banana", "apple", "cherry"])',
    sampleInput: '{}',
    expectedOutput: '["apple", "banana", "cherry"]',
    description: 'Sort string array alphabetically',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-9',
    title: 'Array Reverse',
    expression: 'reverse([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '[5, 4, 3, 2, 1]',
    description: 'Reverse array element order',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-10',
    title: 'Array Reduce Sum',
    expression: 'reduce([1, 2, 3, 4, 5], # + acc, 0)',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Reduce array to sum with accumulator',
    category: 'array-flattening'
  },
  {
    id: 'array-flat-11',
    title: 'Complex Flatten and Process',
    expression: 'avg(flatMap(groups, map(#.values, # * 2)))',
    sampleInput: '{"groups":[{"values":[1,2]},{"values":[3,4]}]}',
    expectedOutput: '5',
    description: 'Flatten nested values, double them, then calculate average',
    category: 'array-flattening'
  },
];
