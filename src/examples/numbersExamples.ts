import { Example } from './types';

export const numbersExamples: Example[] = [
  {
    id: 'num-1',
    title: 'Number Equality',
    expression: '1 == 1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if numbers are equal',
    category: 'numbers'
  },
  {
    id: 'num-2',
    title: 'Number Addition',
    expression: '1 + 2 == 3',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Add two numbers and check result',
    category: 'numbers'
  },
  {
    id: 'num-3',
    title: 'Mathematical Expression',
    expression: '3 + 4 * 2',
    sampleInput: '{}',
    expectedOutput: '11',
    description: 'Complex mathematical expression with order of operations',
    category: 'numbers'
  },
  {
    id: 'num-4',
    title: 'Absolute Value',
    expression: 'abs(-5)',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Get absolute value of negative number',
    category: 'numbers'
  },
  {
    id: 'num-5',
    title: 'Power Operation',
    expression: '2 ^ 3 == 8',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Raise number to power and check result',
    category: 'numbers'
  },
  {
    id: 'num-6',
    title: 'Modulo Operation',
    expression: '5 % 2 == 1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Get remainder from division',
    category: 'numbers'
  },
];
