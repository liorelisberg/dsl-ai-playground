import { Example } from './types';

export const utility_functionsExamples: Example[] = [
  {
    id: 'util-1',
    title: 'Fuzzy Match Exact',
    expression: 'fuzzyMatch("hello", "hello")',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Fuzzy string matching with exact match (returns 1.0)',
    category: 'utility-functions'
  },
  {
    id: 'util-2',
    title: 'Fuzzy Match Partial',
    expression: 'fuzzyMatch("world", "hello")',
    sampleInput: '{}',
    expectedOutput: '0.2',
    description: 'Fuzzy string matching with low similarity',
    category: 'utility-functions'
  },
  {
    id: 'util-3',
    title: 'Fuzzy Match Array',
    expression: 'fuzzyMatch(["hello", "world"], "hello")',
    sampleInput: '{}',
    expectedOutput: '[1, 0.2]',
    description: 'Fuzzy match string against array of strings',
    category: 'utility-functions'
  },
  {
    id: 'util-4',
    title: 'Date Offset Name Berlin',
    expression: 'd("2023-10-15", "Europe/Berlin").offsetName()',
    sampleInput: '{}',
    expectedOutput: '"Europe/Berlin"',
    description: 'Get timezone offset name from date',
    category: 'utility-functions'
  },
  {
    id: 'util-5',
    title: 'Date Offset Name LA',
    expression: 'd("2023-10-15", "America/Los_Angeles").offsetName()',
    sampleInput: '{}',
    expectedOutput: '"America/Los_Angeles"',
    description: 'Get timezone offset name for Los Angeles',
    category: 'utility-functions'
  },
  {
    id: 'util-6',
    title: 'Leap Year Check False',
    expression: 'd("2023-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if year 2023 is a leap year (false)',
    category: 'utility-functions'
  },
  {
    id: 'util-7',
    title: 'Leap Year Check True',
    expression: 'd("2024-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if year 2024 is a leap year (true)',
    category: 'utility-functions'
  },
  {
    id: 'util-8',
    title: 'Century Leap Year',
    expression: 'd("2000-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check leap year for century year 2000 (true)',
    category: 'utility-functions'
  },
  {
    id: 'util-9',
    title: 'Century Non-Leap Year',
    expression: 'd("1900-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check leap year for century year 1900 (false)',
    category: 'utility-functions'
  },
  {
    id: 'util-10',
    title: 'Date Set Year',
    expression: 'd("2023-10-15").set("year", 2024)',
    sampleInput: '{}',
    expectedOutput: '"2024-10-15T00:00:00Z"',
    description: 'Set year component of date to 2024',
    category: 'utility-functions'
  },
  {
    id: 'util-11',
    title: 'Date Set Month',
    expression: 'd("2023-10-15").set("month", 5)',
    sampleInput: '{}',
    expectedOutput: '"2023-05-15T00:00:00Z"',
    description: 'Set month component of date to May (5)',
    category: 'utility-functions'
  },
  {
    id: 'util-12',
    title: 'Date Set Day',
    expression: 'd("2023-10-15").set("day", 20)',
    sampleInput: '{}',
    expectedOutput: '"2023-10-20T00:00:00Z"',
    description: 'Set day component of date to 20th',
    category: 'utility-functions'
  },
  {
    id: 'util-13',
    title: 'Date Set Hour',
    expression: 'd("2023-10-15T10:30:00Z").set("hour", 15)',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T15:30:00Z"',
    description: 'Set hour component of datetime to 15 (3 PM)',
    category: 'utility-functions'
  },
  {
    id: 'util-14',
    title: 'Date Set Minute',
    expression: 'd("2023-10-15T10:30:00Z").set("minute", 45)',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:45:00Z"',
    description: 'Set minute component of datetime to 45',
    category: 'utility-functions'
  },
];
