import { Example } from './types';

export const dateExamples: Example[] = [
  {
    id: 'date-1',
    title: 'Date Creation',
    expression: 'd("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Create date from string',
    category: 'date'
  },
  {
    id: 'date-2',
    title: 'Date Addition',
    expression: 'd("2023-10-15").add("1d")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16T00:00:00Z"',
    description: 'Add one day to date',
    category: 'date'
  },
  {
    id: 'date-3',
    title: 'Date Comparison',
    expression: 'd("2023-10-15").isBefore(d("2023-10-16"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare two dates',
    category: 'date'
  },
  {
    id: 'date-4',
    title: 'Date Year',
    expression: 'd("2023-10-15").year()',
    sampleInput: '{}',
    expectedOutput: '2023',
    description: 'Extract year from date',
    category: 'date'
  },
  {
    id: 'date-5',
    title: 'Date Month',
    expression: 'd("2023-10-15").month()',
    sampleInput: '{}',
    expectedOutput: '10',
    description: 'Extract month from date',
    category: 'date'
  },
  {
    id: 'date-6',
    title: 'Date Day',
    expression: 'd("2023-10-15").day()',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Extract day from date',
    category: 'date'
  },
  {
    id: 'date-7',
    title: 'Date Formatting',
    expression: 'd("2023-10-15").format("%Y-%m-%d")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15"',
    description: 'Format date as string',
    category: 'date'
  },
  {
    id: 'date-8',
    title: 'Date Validation - Valid',
    expression: 'd("2023-10-15").isValid()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date string is valid',
    category: 'date'
  },
  {
    id: 'date-9',
    title: 'Date Validation - Invalid',
    expression: 'd("2023-13-01").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check invalid date (month 13)',
    category: 'date'
  },
  {
    id: 'date-10',
    title: 'Date Set Month',
    expression: 'd("2023-10-15").set("month", 5)',
    sampleInput: '{}',
    expectedOutput: '"2023-05-15T00:00:00Z"',
    description: 'Set month of existing date',
    category: 'date'
  },
  {
    id: 'date-11',
    title: 'Start of Month',
    expression: 'd("2023-10-15").startOf("month")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-01T00:00:00Z"',
    description: 'Get first day of month',
    category: 'date'
  },
  {
    id: 'date-12',
    title: 'End of Month',
    expression: 'd("2023-10-15").endOf("month")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-31T23:59:59Z"',
    description: 'Get last moment of month',
    category: 'date'
  },
  {
    id: 'date-13',
    title: 'Date Difference',
    expression: 'd("2023-10-15").diff(d("2023-09-15"), "month")',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Calculate difference between dates in months',
    category: 'date'
  },
  {
    id: 'date-14',
    title: 'Month Comparison',
    expression: 'd("2025-02-15").isSame(d("2025-02-28"), "month")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two dates are in same month',
    category: 'date'
  },
];
