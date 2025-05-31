import { Example } from './types';

export const rangeExamples: Example[] = [
  {
    id: 'range-1',
    title: 'Range Mapping',
    expression: 'map([0..3], #)',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2, 3]',
    description: 'Map over inclusive range',
    category: 'range'
  },
  {
    id: 'range-2',
    title: 'Exclusive Range Start',
    expression: 'map((0..3], #)',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3]',
    description: 'Map over range excluding start',
    category: 'range'
  },
  {
    id: 'range-3',
    title: 'Exclusive Range End',
    expression: 'map([0..3), #)',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2]',
    description: 'Map over range excluding end',
    category: 'range'
  },
  {
    id: 'range-4',
    title: 'Range Multiplication',
    expression: 'map([0..5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[0, 2, 4, 6, 8, 10]',
    description: 'Multiply each number in range by 2',
    category: 'range'
  },
  {
    id: 'range-5',
    title: 'Range Check True',
    expression: 'x in [1..10]',
    sampleInput: '{"x": 5}',
    expectedOutput: 'true',
    description: 'Check if value is in inclusive range (true case)',
    category: 'range'
  },
  {
    id: 'range-6',
    title: 'Range Check False',
    expression: 'x in [1..10]',
    sampleInput: '{"x": 0}',
    expectedOutput: 'false',
    description: 'Check if value is in inclusive range (false case)',
    category: 'range'
  },
  {
    id: 'range-7',
    title: 'Exclusive Range Check',
    expression: 'x in (1..10)',
    sampleInput: '{"x": 1}',
    expectedOutput: 'false',
    description: 'Check if value is in exclusive range (boundary case)',
    category: 'range'
  },
  {
    id: 'range-8',
    title: 'Range Filter Even Numbers',
    expression: 'filter([0..10], # % 2 == 0)',
    sampleInput: '{}',
    expectedOutput: '[0, 2, 4, 6, 8, 10]',
    description: 'Filter even numbers from range',
    category: 'range'
  }
];
