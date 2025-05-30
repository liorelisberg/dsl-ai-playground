import { Example } from './types';

export const array_statisticsExamples: Example[] = [
  {
    id: 'array-stats-1',
    title: 'Array Median',
    expression: 'median([4, 2, 7, 5, 3])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find median value in array (middle value when sorted)',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-2',
    title: 'Array Mode',
    expression: 'mode([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find mode (most frequent value) in array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-3',
    title: 'Median of Sorted Array',
    expression: 'median([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Find median of odd-length sorted array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-4',
    title: 'Median of Even Array',
    expression: 'median([1, 2, 3, 4])',
    sampleInput: '{}',
    expectedOutput: '2.5',
    description: 'Find median of even-length array (average of middle two)',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-5',
    title: 'Mode of String Array',
    expression: 'mode(["apple", "banana", "apple", "cherry", "apple"])',
    sampleInput: '{}',
    expectedOutput: '"apple"',
    description: 'Find most frequent string in array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-6',
    title: 'Statistical Comparison',
    expression: 'median([1, 5, 9]) > avg([1, 5, 9])',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Compare median and average of same array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-7',
    title: 'Combined Statistics',
    expression: 'max([median([1, 3, 5]), avg([2, 4, 6])])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find maximum between median of one array and average of another',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-8',
    title: 'Mode Frequency Check',
    expression: 'count([1, 1, 2, 2, 2, 3], # == mode([1, 1, 2, 2, 2, 3]))',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Count occurrences of the mode value',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-9',
    title: 'Range Calculation',
    expression: 'max([1, 3, 7, 2, 9]) - min([1, 3, 7, 2, 9])',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Calculate range (difference between max and min)',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-10',
    title: 'Median Price Calculation',
    expression: 'median(map(products, #.price))',
    sampleInput: '{"products":[{"price":10},{"price":20},{"price":30},{"price":15},{"price":25}]}',
    expectedOutput: '20',
    description: 'Find median price from product array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-1',
    title: 'Array Median',
    expression: 'median([4, 2, 7, 5, 3])',  
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Calculate median of array elements',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-2',
    title: 'Array Mode',
    expression: 'mode([4, 2, 7, 5, 3, 2, 4])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find most frequent element in array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-3',
    title: 'Array Range',
    expression: 'range([10, 20, 30, 40, 50])',
    sampleInput: '{}',
    expectedOutput: '40',
    description: 'Calculate difference between max and min values',
    category: 'array-statistics'
  },
];
