import { Example } from './types';

export const date_partsExamples: Example[] = [
  {
    id: 'date-parts-1',
    title: 'Extract Year Function',
    expression: 'year(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '2023',
    description: 'Extract year using year() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-2',
    title: 'Extract Month of Year',
    expression: 'monthOfYear(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '10',
    description: 'Extract month number using monthOfYear() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-3',
    title: 'Extract Day of Month',
    expression: 'dayOfMonth(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Extract day of month using dayOfMonth() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-4',
    title: 'Extract Day of Week',
    expression: 'dayOfWeek(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Extract day of week (1=Monday, 7=Sunday) using dayOfWeek() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-5',
    title: 'Extract Week of Year',
    expression: 'weekOfYear(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '41',
    description: 'Extract week number of year using weekOfYear() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-6',
    title: 'Date Parts Comparison',
    expression: 'monthOfYear(date("2023-10-15")) == 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare extracted month with expected value',
    category: 'date-parts'
  },
  {
    id: 'date-parts-7',
    title: 'Weekend Check',
    expression: 'dayOfWeek(date("2023-10-15")) in [6, 7]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date falls on weekend (Saturday=6, Sunday=7)',
    category: 'date-parts'
  },
  {
    id: 'date-parts-8',
    title: 'Year Range Check',
    expression: 'year(date("2023-10-15")) in [2020..2025]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if year is within specific range',
    category: 'date-parts'
  },
  {
    id: 'date-parts-9',
    title: 'Quarter Calculation',
    expression: 'ceil(monthOfYear(date("2023-10-15")) / 3)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Calculate quarter from month (Q4 for October)',
    category: 'date-parts'
  },
  {
    id: 'date-parts-10',
    title: 'Week Progress',
    expression: 'weekOfYear(date("2023-10-15")) / 52.0',
    sampleInput: '{}',
    expectedOutput: '0.7884615384615384',
    description: 'Calculate year progress as decimal (week 41 of 52)',
    category: 'date-parts'
  },
];
