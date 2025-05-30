import { Example } from './types';

export const date_constructorsExamples: Example[] = [
  {
    id: 'date-const-1',
    title: 'Date with Time',
    expression: 'd("2023-10-15 14:30")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:00Z"',
    description: 'Create date with specific time',
    category: 'date-constructors'
  },
  {
    id: 'date-const-2',
    title: 'Date with Seconds',
    expression: 'd("2023-10-15 14:30:45")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:45Z"',
    description: 'Create date with time including seconds',
    category: 'date-constructors'
  },
  {
    id: 'date-const-3',
    title: 'Date with Timezone',
    expression: 'd("2023-10-15", "Europe/Berlin")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00+02:00"',
    description: 'Create date with specific timezone',
    category: 'date-constructors'
  },
  {
    id: 'date-const-4',
    title: 'DateTime with Timezone',
    expression: 'd("2023-10-15 14:30", "Europe/Berlin")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:00+02:00"',
    description: 'Create datetime with timezone specification',
    category: 'date-constructors'
  },
  {
    id: 'date-const-5',
    title: 'Full DateTime with Timezone',
    expression: 'd("2023-10-15 14:30:45", "Europe/Berlin")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:45+02:00"',
    description: 'Create full datetime with timezone and seconds',
    category: 'date-constructors'
  },
  {
    id: 'date-const-6',
    title: 'Add Duration String',
    expression: 'd("2023-10-15").add("1d 5h")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16T05:00:00Z"',
    description: 'Add complex duration string (1 day 5 hours)',
    category: 'date-constructors'
  },
  {
    id: 'date-const-7',
    title: 'Subtract with Units',
    expression: 'd("2023-10-15").sub(1, "M")',
    sampleInput: '{}',
    expectedOutput: '"2023-09-15T00:00:00Z"',
    description: 'Subtract 1 month using unit specification',
    category: 'date-constructors'
  },
  {
    id: 'date-const-8',
    title: 'Is Same Or Before',
    expression: 'd("2023-10-15").isSameOrBefore(d("2023-10-16"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is same or before another date',
    category: 'date-constructors'
  },
  {
    id: 'date-const-9',
    title: 'Is Same Or After',
    expression: 'd("2023-10-15").isSameOrAfter(d("2023-10-14"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is same or after another date',
    category: 'date-constructors'
  },
  {
    id: 'date-const-10',
    title: 'Date Validation Check',
    expression: 'd("Europe/Berlin").isValid() and d("Europe/Berlin").isToday()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate timezone string and check if today (context-dependent)',
    category: 'date-constructors'
  },
  {
    id: 'date-const-11',
    title: 'Is Before Check',
    expression: 'd("2023-10-15").isBefore(d("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date is before same date (returns false)',
    category: 'date-constructors'
  },
  {
    id: 'date-const-12',
    title: 'Is After Check',
    expression: 'd("2023-10-15").isAfter(d("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date is after same date (returns false)',
    category: 'date-constructors'
  },
];
