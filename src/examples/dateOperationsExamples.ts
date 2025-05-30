import { Example } from './types';

export const dateOperationsExamples: Example[] = [
  // ⚠️  MANUALLY CLEANED - 11 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:41:11.968Z
  // ⚠️  CLEANED FILE - 12 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:40:28.250Z
  // 🔍  Removed IDs: date-1, date-12, date-13, date-const-5, date-const-6, date-const-7, date-const-8, date-const-9, date-const-10, date-const-11, date-parts-9, date-parts-10

  // Basic Date Operations (from dateExamples)
  {
    id: 'date-2',
    title: 'Date Creation',
    expression: 'date("2023-09-18")',
    sampleInput: '{}',
    expectedOutput: '2023-09-18T00:00:00Z',
    description: 'Create date from string',
    category: 'date-operations'
  },
  {
    id: 'date-3',
    title: 'Date with Time',
    expression: 'date("2023-09-18T15:30:00")',
    sampleInput: '{}',
    expectedOutput: '2023-09-18T15:30:00Z',
    description: 'Create date with specific time',
    category: 'date-operations'
  },
  {
    id: 'date-4',
    title: 'Date Addition',
    expression: 'date("2023-09-18") + days(5)',
    sampleInput: '{}',
    expectedOutput: '2023-09-23T00:00:00Z',
    description: 'Add days to a date',
    category: 'date-operations'
  },
  {
    id: 'date-5',
    title: 'Date Subtraction',
    expression: 'date("2023-09-18") - days(3)',
    sampleInput: '{}',
    expectedOutput: '2023-09-15T00:00:00Z',
    description: 'Subtract days from a date',
    category: 'date-operations'
  },
  {
    id: 'date-6',
    title: 'Date Comparison',
    expression: 'date("2023-09-18") > date("2023-09-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare two dates',
    category: 'date-operations'
  },
  {
    id: 'date-7',
    title: 'Date Formatting',
    expression: 'format(date("2023-09-18"), "YYYY-MM-DD")',
    sampleInput: '{}',
    expectedOutput: '"2023-09-18"',
    description: 'Format date as string',
    category: 'date-operations'
  },
  {
    id: 'date-8',
    title: 'Year Extraction',
    expression: 'year(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '2023',
    description: 'Extract year from date',
    category: 'date-operations'
  },
  {
    id: 'date-9',
    title: 'Month Extraction',
    expression: 'month(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '9',
    description: 'Extract month from date',
    category: 'date-operations'
  },
  {
    id: 'date-10',
    title: 'Day Extraction',
    expression: 'day(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '18',
    description: 'Extract day from date',
    category: 'date-operations'
  },
  {
    id: 'date-11',
    title: 'Day of Week',
    expression: 'dayOfWeek(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Get day of week (Monday = 1)',
    category: 'date-operations'
  },',
    expectedOutput: '7',
    description: 'Calculate days between two dates',
    category: 'date-operations'
  },',
    expectedOutput: 'true',
    description: 'Check if date is weekend (Saturday)',
    category: 'date-operations'
  },
  {
    id: 'date-14',
    title: 'Add Months',
    expression: 'date("2023-09-18") + months(2)',
    sampleInput: '{}',
    expectedOutput: '2023-11-18T00:00:00Z',
    description: 'Add months to a date',
    category: 'date-operations'
  },

  // Date Constructors (from date_constructorsExamples)
  {
    id: 'date-const-1',
    title: 'Date from Components',
    expression: 'date(2023, 9, 18)',
    sampleInput: '{}',
    expectedOutput: '2023-09-18T00:00:00Z',
    description: 'Create date from year, month, day',
    category: 'date-operations'
  },
  {
    id: 'date-const-2',
    title: 'Date with Time Components',
    expression: 'date(2023, 9, 18, 15, 30, 0)',
    sampleInput: '{}',
    expectedOutput: '2023-09-18T15:30:00Z',
    description: 'Create date with time from components',
    category: 'date-operations'
  },
  {
    id: 'date-const-3',
    title: 'Date from Timestamp',
    expression: 'date(1695038400000)',
    sampleInput: '{}',
    expectedOutput: '2023-09-18T14:00:00Z',
    description: 'Create date from Unix timestamp',
    category: 'date-operations'
  },
  {
    id: 'date-const-4',
    title: 'Date from ISO String',
    expression: 'date("2023-09-18T15:30:00.000Z")',
    sampleInput: '{}',
    expectedOutput: '2023-09-18T15:30:00Z',
    description: 'Create date from ISO string',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-18T00:00:00Z',
    description: 'Get today at midnight',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-19T00:00:00Z',
    description: 'Get tomorrow at midnight',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-17T00:00:00Z',
    description: 'Get yesterday at midnight',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-18T00:00:00Z',
    description: 'Get start of day for given date',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-18T23:59:59Z',
    description: 'Get end of day for given date',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-01T00:00:00Z',
    description: 'Get first day of month',
    category: 'date-operations'
  },',
    expectedOutput: '2023-09-30T23:59:59Z',
    description: 'Get last day of month',
    category: 'date-operations'
  },
  {
    id: 'date-const-12',
    title: 'Date from Variable',
    expression: 'date(dateString)',
    sampleInput: '{"dateString": "2023-09-18"}',
    expectedOutput: '2023-09-18T00:00:00Z',
    description: 'Create date from variable string',
    category: 'date-operations'
  },

  // Date Parts (from date_partsExamples)
  {
    id: 'date-parts-1',
    title: 'Extract Hour',
    expression: 'hour(date("2023-09-18T15:30:45"))',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Extract hour from datetime',
    category: 'date-operations'
  },
  {
    id: 'date-parts-2',
    title: 'Extract Minute',
    expression: 'minute(date("2023-09-18T15:30:45"))',
    sampleInput: '{}',
    expectedOutput: '30',
    description: 'Extract minute from datetime',
    category: 'date-operations'
  },
  {
    id: 'date-parts-3',
    title: 'Extract Second',
    expression: 'second(date("2023-09-18T15:30:45"))',
    sampleInput: '{}',
    expectedOutput: '45',
    description: 'Extract second from datetime',
    category: 'date-operations'
  },
  {
    id: 'date-parts-4',
    title: 'Get Timestamp',
    expression: 'timestamp(date("2023-09-18T15:30:00"))',
    sampleInput: '{}',
    expectedOutput: '1695043800000',
    description: 'Get Unix timestamp from date',
    category: 'date-operations'
  },
  {
    id: 'date-parts-5',
    title: 'Day of Year',
    expression: 'dayOfYear(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '261',
    description: 'Get day number in year (1-366)',
    category: 'date-operations'
  },
  {
    id: 'date-parts-6',
    title: 'Week of Year',
    expression: 'weekOfYear(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '38',
    description: 'Get week number in year',
    category: 'date-operations'
  },
  {
    id: 'date-parts-7',
    title: 'Quarter of Year',
    expression: 'quarter(date("2023-09-18"))',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Get quarter of year (1-4)',
    category: 'date-operations'
  },
  {
    id: 'date-parts-8',
    title: 'Is Leap Year',
    expression: 'isLeapYear(date("2024-02-29"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if year is leap year',
    category: 'date-operations'
  },',
    expectedOutput: '28',
    description: 'Get number of days in month',
    category: 'date-operations'
  },',
    expectedOutput: '33',
    description: 'Calculate age between two dates',
    category: 'date-operations'
  }
]; 