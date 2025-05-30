import { Example } from './types';

export const complex_mathExamples: Example[] = [
  {
    id: 'complex-math-1',
    title: 'Complex Order of Operations',
    expression: '(10 + 5) * 3 / 2 > 15',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (10 + 5) * 3 / 2 = 22.5 > 15',
    category: 'complex-math'
  },
  {
    id: 'complex-math-2',
    title: 'Division with Parentheses',
    expression: '(100 - 25) / (5 * 2) < 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (100 - 25) / (5 * 2) = 75 / 10 = 7.5 < 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-3',
    title: 'Division and Addition',
    expression: '1000 / (10 - 2) + 50 == 175',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 1000 / 8 + 50 = 125 + 50 = 175',
    category: 'complex-math'
  },
  {
    id: 'complex-math-4',
    title: 'Multiplication of Sums',
    expression: '(3 + 4) * (8 - 6) == 14',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (3 + 4) * (8 - 6) = 7 * 2 = 14',
    category: 'complex-math'
  },
  {
    id: 'complex-math-5',
    title: 'Power Comparison',
    expression: '10^3 != 999',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Power expression: 10³ = 1000 ≠ 999',
    category: 'complex-math'
  },
  {
    id: 'complex-math-6',
    title: 'Power Division',
    expression: '1000 / 10^3 <= 1.1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Power division: 1000 / 1000 = 1.0 ≤ 1.1',
    category: 'complex-math'
  },
  {
    id: 'complex-math-7',
    title: 'Absolute Value Comparison',
    expression: 'abs(-20) > 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Absolute value: |-20| = 20 > 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-8',
    title: 'Modulo Non-Zero',
    expression: '10 % 3 != 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Modulo operation: 10 % 3 = 1 ≠ 0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-9',
    title: 'Negative and Power',
    expression: '-8 + 2^3 == 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Negative and power: -8 + 2³ = -8 + 8 = 0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-10',
    title: 'Double Negative',
    expression: '2 * -(-5) == 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Double negative: 2 * -(-5) = 2 * 5 = 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-11',
    title: 'Division Chain',
    expression: '20 / (5 / 2) == 8.0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Division chain: 20 / (5 / 2) = 20 / 2.5 = 8.0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-12',
    title: 'Multi-Operation Expression',
    expression: '(4 + 2) * 3 - (5 / 2) + 1 < 18',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Multi-operation: (4 + 2) * 3 - (5 / 2) + 1 = 6 * 3 - 2.5 + 1 = 16.5 < 18',
    category: 'complex-math'
  },
  {
    id: 'complex-math-13',
    title: 'Power Plus Multiplication',
    expression: '5^2 + 3 * 4 - 6 / 2 > 20',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 5² + 3 * 4 - 6 / 2 = 25 + 12 - 3 = 34 > 20',
    category: 'complex-math'
  },
  {
    id: 'complex-math-14',
    title: 'Power with Decimal Result',
    expression: '4^3 - 2 * 5 + 7 / 2 == 57.5',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 4³ - 2 * 5 + 7 / 2 = 64 - 10 + 3.5 = 57.5',
    category: 'complex-math'
  },
  {
    id: 'complex-math-15',
    title: 'Absolute Value in Expression',
    expression: 'abs(-7 + 4) * (8 - 6^2) < 34',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: |(-7 + 4)| * (8 - 6²) = |-3| * (8 - 36) = 3 * (-28) = -84 < 34',
    category: 'complex-math'
  },
  {
    id: 'complex-math-16',
    title: 'Range Check Inclusive',
    expression: '5 in [1..10]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if 5 is in inclusive range [1..10]',
    category: 'complex-math'
  },
  {
    id: 'complex-math-17',
    title: 'Range Check Exclusive',
    expression: '5 in (1..10)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if 5 is in exclusive range (1..10)',
    category: 'complex-math'
  },
  {
    id: 'complex-math-1',
    title: 'Complex Order of Operations',
    expression: '(10 + 5) * 3 / 2 > 15',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (10 + 5) * 3 / 2 = 22.5 > 15',
    category: 'complex-math'
  },
  {
    id: 'complex-math-2',
    title: 'Division with Parentheses',
    expression: '(100 - 25) / (5 * 2) < 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (100 - 25) / (5 * 2) = 75 / 10 = 7.5 < 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-3',
    title: 'Division and Addition',
    expression: '1000 / (10 - 2) + 50 == 175',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 1000 / 8 + 50 = 125 + 50 = 175',
    category: 'complex-math'
  },
  {
    id: 'complex-math-4',
    title: 'Multiplication of Sums',
    expression: '(3 + 4) * (8 - 6) == 14',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (3 + 4) * (8 - 6) = 7 * 2 = 14',
    category: 'complex-math'
  },
  {
    id: 'complex-math-5',
    title: 'Power Comparison',
    expression: '10^3 != 999',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Power expression: 10³ = 1000 ≠ 999',
    category: 'complex-math'
  },
  {
    id: 'complex-math-6',
    title: 'Power Division',
    expression: '1000 / 10^3 <= 1.1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Power division: 1000 / 1000 = 1.0 ≤ 1.1',
    category: 'complex-math'
  },
  {
    id: 'complex-math-7',
    title: 'Absolute Value Comparison',
    expression: 'abs(-20) > 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Absolute value: |-20| = 20 > 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-8',
    title: 'Modulo Non-Zero',
    expression: '10 % 3 != 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Modulo operation: 10 % 3 = 1 ≠ 0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-9',
    title: 'Negative and Power',
    expression: '-8 + 2^3 == 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Negative and power: -8 + 2³ = -8 + 8 = 0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-10',
    title: 'Double Negative',
    expression: '2 * -(-5) == 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Double negative: 2 * -(-5) = 2 * 5 = 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-11',
    title: 'Division Chain',
    expression: '20 / (5 / 2) == 8.0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Division chain: 20 / (5 / 2) = 20 / 2.5 = 8.0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-12',
    title: 'Multi-Operation Expression',
    expression: '(4 + 2) * 3 - (5 / 2) + 1 < 18',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Multi-operation: (4 + 2) * 3 - (5 / 2) + 1 = 6 * 3 - 2.5 + 1 = 16.5 < 18',
    category: 'complex-math'
  },
  {
    id: 'complex-math-13',
    title: 'Power Plus Multiplication',
    expression: '5^2 + 3 * 4 - 6 / 2 > 20',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 5² + 3 * 4 - 6 / 2 = 25 + 12 - 3 = 34 > 20',
    category: 'complex-math'
  },
  {
    id: 'complex-math-14',
    title: 'Power with Decimal Result',
    expression: '4^3 - 2 * 5 + 7 / 2 == 57.5',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 4³ - 2 * 5 + 7 / 2 = 64 - 10 + 3.5 = 57.5',
    category: 'complex-math'
  },
  {
    id: 'complex-math-15',
    title: 'Absolute Value in Expression',
    expression: 'abs(-7 + 4) * (8 - 6^2) < 34',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: |(-7 + 4)| * (8 - 6²) = |-3| * (8 - 36) = 3 * (-28) = -84 < 34',
    category: 'complex-math'
  },
  {
    id: 'complex-math-16',
    title: 'Range Check Inclusive',
    expression: '5 in [1..10]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if 5 is in inclusive range [1..10]',
    category: 'complex-math'
  },
  {
    id: 'complex-math-17',
    title: 'Range Check Exclusive',
    expression: '5 in (1..10)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if 5 is in exclusive range (1..10)',
    category: 'complex-math'
  },
];
