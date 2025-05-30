import { Example } from './types';

export const roundingExamples: Example[] = [
  {
    id: 'round-1',
    title: 'Round Down Basic',
    expression: 'round(7.4)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Round 7.4 down to nearest integer',
    category: 'rounding'
  },
  {
    id: 'round-2',
    title: 'Round Up Half',
    expression: 'round(7.5)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Round 7.5 up (half-up rounding)',
    category: 'rounding'
  },
  {
    id: 'round-3',
    title: 'Round Up Basic',
    expression: 'round(7.6)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Round 7.6 up to nearest integer',
    category: 'rounding'
  },
  {
    id: 'round-4',
    title: 'Round Negative Down',
    expression: 'round(-7.4)',
    sampleInput: '{}',
    expectedOutput: '-7',
    description: 'Round negative number toward zero',
    category: 'rounding'
  },
  {
    id: 'round-5',
    title: 'Round Negative Half',
    expression: 'round(-7.5)',
    sampleInput: '{}',
    expectedOutput: '-8',
    description: 'Round negative half away from zero',
    category: 'rounding'
  },
  {
    id: 'round-6',
    title: 'Round Negative Up',
    expression: 'round(-7.6)',
    sampleInput: '{}',
    expectedOutput: '-8',
    description: 'Round negative number away from zero',
    category: 'rounding'
  },
  {
    id: 'round-7',
    title: 'Round with Zero Precision',
    expression: 'round(7.444, 0)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Round to integer (0 decimal places)',
    category: 'rounding'
  },
  {
    id: 'round-8',
    title: 'Round to 1 Decimal',
    expression: 'round(7.444, 1)',
    sampleInput: '{}',
    expectedOutput: '7.4',
    description: 'Round to 1 decimal place',
    category: 'rounding'
  },
  {
    id: 'round-9',
    title: 'Round to 2 Decimals',
    expression: 'round(7.444, 2)',
    sampleInput: '{}',
    expectedOutput: '7.44',
    description: 'Round to 2 decimal places',
    category: 'rounding'
  },
  {
    id: 'round-10',
    title: 'Round Up with Precision',
    expression: 'round(7.555, 2)',
    sampleInput: '{}',
    expectedOutput: '7.56',
    description: 'Round up to 2 decimal places',
    category: 'rounding'
  },
];
