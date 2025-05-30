import { Example } from './types';

export const arrayExamples: Example[] = [
  {
    id: 'array-1',
    title: 'Array Length',
    expression: 'len([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Get length of array',
    category: 'array'
  },
  {
    id: 'array-2',
    title: 'Array Sum',
    expression: 'sum([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Calculate sum of array elements',
    category: 'array'
  },
  {
    id: 'array-3',
    title: 'Array Average',
    expression: 'avg([10, 20, 30])',
    sampleInput: '{}',
    expectedOutput: '20',
    description: 'Calculate average of array elements',
    category: 'array'
  },
  {
    id: 'array-4',
    title: 'Array Minimum',
    expression: 'min([5, 8, 2, 11, 7])',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Find minimum value in array',
    category: 'array'
  },
  {
    id: 'array-5',
    title: 'Array Maximum',
    expression: 'max([5, 8, 2, 11, 7])',
    sampleInput: '{}',
    expectedOutput: '11',
    description: 'Find maximum value in array',
    category: 'array'
  },
  {
    id: 'array-6',
    title: 'Array Contains',
    expression: 'contains([1, 2, 3, 4, 5], 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if array contains element',
    category: 'array'
  },
  {
    id: 'array-7',
    title: 'Array Filter',
    expression: 'filter([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: '[4, 5]',
    description: 'Filter array elements by condition',
    category: 'array'
  },
  {
    id: 'array-8',
    title: 'Array Map',
    expression: 'map([1, 2, 3, 4, 5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8, 10]',
    description: 'Transform each array element',
    category: 'array'
  },
  {
    id: 'array-9',
    title: 'Array Some',
    expression: 'some([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements match condition',
    category: 'array'
  },
  {
    id: 'array-10',
    title: 'Array Count',
    expression: 'count([1, 2, 3, 4, 5, 2], # == 2)',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Count elements matching condition',
    category: 'array'
  },
  {
    id: 'array-11',
    title: 'Array Keys',
    expression: 'keys([10, 11, 12])',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2]',
    description: 'Get array indices as keys',
    category: 'array'
  },
];
