import { Example } from './types';

export const decimal_precisionExamples: Example[] = [
  {
    id: 'decimal-1',
    title: 'Decimal Addition Equality',
    expression: '0.1 + 0.2 == 0.3',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal addition comparison',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-2',
    title: 'Decimal Addition Result',
    expression: '0.1 + 0.2',
    sampleInput: '{}',
    expectedOutput: '0.3',
    description: 'Precise decimal addition result',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-3',
    title: 'Decimal Multiplication Equality',
    expression: '0.1 * 0.2 == 0.02',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal multiplication comparison',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-4',
    title: 'Decimal Multiplication Result',
    expression: '0.1 * 0.2',
    sampleInput: '{}',
    expectedOutput: '0.02',
    description: 'Precise decimal multiplication result',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-5',
    title: 'Decimal Subtraction Equality',
    expression: '0.3 - 0.1 == 0.2',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal subtraction comparison',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-6',
    title: 'Decimal Subtraction Result',
    expression: '0.3 - 0.1',
    sampleInput: '{}',
    expectedOutput: '0.2',
    description: 'Precise decimal subtraction result',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-7',
    title: 'Decimal Division Equality',
    expression: '0.3 / 0.1 == 3.0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal division comparison',
    category: 'decimal-precision'
  },
  {
    id: 'decimal-8',
    title: 'Decimal Division Result',
    expression: '0.3 / 0.1',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Precise decimal division result',
    category: 'decimal-precision'
  },
];
