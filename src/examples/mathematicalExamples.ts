import { Example } from './types';

export const mathematicalExamples: Example[] = [
  {
    id: 'math-1',
    title: 'Floor Function',
    expression: 'floor(4.8)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Round down to nearest integer',
    category: 'mathematical'
  },
  {
    id: 'math-2',
    title: 'Ceiling Function', 
    expression: 'ceil(4.1)',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Round up to nearest integer',
    category: 'mathematical'
  },
  {
    id: 'math-3',
    title: 'Basic Rounding',
    expression: 'round(3.5)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Round to nearest integer',
    category: 'mathematical'
  },
  {
    id: 'math-4',
    title: 'Floor Comparison',
    expression: 'floor(8.9) == 8',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Floor function in comparison',
    category: 'mathematical'
  },
  {
    id: 'math-5',
    title: 'Ceiling Comparison',
    expression: 'ceil(8.1) == 9',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Ceiling function in comparison',
    category: 'mathematical'
  },
  {
    id: 'math-6',
    title: 'Round Comparison',
    expression: 'round(7.6) == 8',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Rounding function in comparison',
    category: 'mathematical'
  },
  {
    id: 'math-7',
    title: 'Round Down',
    expression: 'round(7.4)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Round 7.4 down to 7',
    category: 'mathematical'
  },
  {
    id: 'math-8',
    title: 'Round Up',
    expression: 'round(7.5)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Round 7.5 up to 8 (half-up rounding)',
    category: 'mathematical'
  },
  {
    id: 'math-9',
    title: 'Round Up High',
    expression: 'round(7.6)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Round 7.6 up to 8',
    category: 'mathematical'
  },
  {
    id: 'math-10',
    title: 'Round Negative Down',
    expression: 'round(-7.4)',
    sampleInput: '{}',
    expectedOutput: '-7',
    description: 'Round negative number toward zero',
    category: 'mathematical'
  },
  {
    id: 'math-11',
    title: 'Round Negative Half',
    expression: 'round(-7.5)',
    sampleInput: '{}',
    expectedOutput: '-8',
    description: 'Round negative half away from zero',
    category: 'mathematical'
  },
  {
    id: 'math-12',
    title: 'Round Negative Up',
    expression: 'round(-7.6)',
    sampleInput: '{}',
    expectedOutput: '-8',
    description: 'Round negative number away from zero',
    category: 'mathematical'
  },
  {
    id: 'math-13',
    title: 'Round with Zero Precision',
    expression: 'round(7.444, 0)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Round to integer (0 decimal places)',
    category: 'mathematical'
  },
  {
    id: 'math-14',
    title: 'Round to 1 Decimal',
    expression: 'round(7.444, 1)',
    sampleInput: '{}',
    expectedOutput: '7.4',
    description: 'Round to 1 decimal place',
    category: 'mathematical'
  },
  {
    id: 'math-15',
    title: 'Round to 2 Decimals',
    expression: 'round(7.444, 2)',
    sampleInput: '{}',
    expectedOutput: '7.44',
    description: 'Round to 2 decimal places',
    category: 'mathematical'
  },
  {
    id: 'math-16',
    title: 'Round Up with Precision',
    expression: 'round(7.555, 1)',
    sampleInput: '{}',
    expectedOutput: '7.6',
    description: 'Round up to 1 decimal place',
    category: 'mathematical'
  },
  {
    id: 'math-17',
    title: 'Round Up to 2 Decimals',
    expression: 'round(7.555, 2)',
    sampleInput: '{}',
    expectedOutput: '7.56',
    description: 'Round up to 2 decimal places',
    category: 'mathematical'
  },
  {
    id: 'math-18',
    title: 'Round Negative with Precision',
    expression: 'round(-7.444, 2)',
    sampleInput: '{}',
    expectedOutput: '-7.44',
    description: 'Round negative number to 2 decimal places',
    category: 'mathematical'
  },
  {
    id: 'math-19',
    title: 'Complex Mathematical Expression',
    expression: 'floor(8.9) + ceil(4.1) * 2',
    sampleInput: '{}',
    expectedOutput: '18',
    description: 'Complex expression: floor(8.9) + ceil(4.1) * 2 = 8 + 5 * 2 = 18',
    category: 'mathematical'
  },
  {
    id: 'math-20',
    title: 'Decimal Addition Precision',
    expression: '0.1 + 0.2 == 0.3',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal addition (0.1 + 0.2 = 0.3)',
    category: 'mathematical'
  },
  {
    id: 'math-21',
    title: 'Decimal Addition Result',
    expression: '0.1 + 0.2',
    sampleInput: '{}',
    expectedOutput: '0.3',
    description: 'Precise decimal addition result',
    category: 'mathematical'
  },
  {
    id: 'math-22',
    title: 'Decimal Multiplication Precision',
    expression: '0.1 * 0.2 == 0.02',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal multiplication',
    category: 'mathematical'
  },
  {
    id: 'math-23',
    title: 'Decimal Multiplication Result',
    expression: '0.1 * 0.2',
    sampleInput: '{}',
    expectedOutput: '0.02',
    description: 'Precise decimal multiplication result',
    category: 'mathematical'
  },
  {
    id: 'math-24',
    title: 'Decimal Subtraction Precision',
    expression: '0.3 - 0.1 == 0.2',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal subtraction',
    category: 'mathematical'
  },
  {
    id: 'math-25',
    title: 'Decimal Subtraction Result',
    expression: '0.3 - 0.1',
    sampleInput: '{}',
    expectedOutput: '0.2',
    description: 'Precise decimal subtraction result',
    category: 'mathematical'
  },
  {
    id: 'math-26',
    title: 'Decimal Division Precision',
    expression: '0.3 / 0.1 == 3.0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal division',
    category: 'mathematical'
  },
  {
    id: 'math-27',
    title: 'Decimal Division Result',
    expression: '0.3 / 0.1',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Precise decimal division result',
    category: 'mathematical'
  },
];
