import { Example } from './types';

export const date_durationExamples: Example[] = [
  {
    id: 'date-dur-1',
    title: 'Add Duration to Date',
    expression: 'date("2023-10-15") + duration("1d")',
    sampleInput: '{}',
    expectedOutput: '1697414400',
    description: 'Add 1 day duration to date (returns timestamp)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-2',
    title: 'Subtract Duration from Date',
    expression: 'date("2023-10-15") - duration("7d")',
    sampleInput: '{}',
    expectedOutput: '1696723200',
    description: 'Subtract 7 days duration from date (returns timestamp)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-3',
    title: 'Date String After Addition',
    expression: 'dateString(date("2023-10-15") + duration("1d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16 00:00:00"',
    description: 'Format date after adding duration as readable string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-4',
    title: 'Date String After Subtraction',
    expression: 'dateString(date("2023-10-15") - duration("7d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-08 00:00:00"',
    description: 'Format date after subtracting duration as readable string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-5',
    title: 'Duration Comparison',
    expression: 'date("2023-10-15") + duration("1d") == date("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare date with duration arithmetic to another date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-6',
    title: 'Hour Duration',
    expression: 'duration("1h 30m")',
    sampleInput: '{}',
    expectedOutput: '5400',
    description: 'Create duration of 1 hour 30 minutes (5400 seconds)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-7',
    title: 'Add Hours to Date',
    expression: 'dateString(date("2023-10-15") + duration("12h"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15 12:00:00"',
    description: 'Add 12 hours to date and format as string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-8',
    title: 'Start of Day',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "day"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get start of day from datetime string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-9',
    title: 'End of Day',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 23:59:59"',
    description: 'Get end of day from datetime string (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-10',
    title: 'Start of Hour',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "hour"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:00:00"',
    description: 'Get start of current hour',
    category: 'date-duration'
  },
  {
    id: 'date-dur-11',
    title: 'End of Hour',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "h"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:59:59"',
    description: 'Get end of current hour (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-12',
    title: 'Start of Minute',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "minute"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:45:00"',
    description: 'Get start of current minute',
    category: 'date-duration'
  },
  {
    id: 'date-dur-13',
    title: 'End of Minute',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "m"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:45:59"',
    description: 'Get end of current minute (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-14',
    title: 'Start of Week',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "week"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-02 00:00:00"',
    description: 'Get start of week (Monday) from given date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-15',
    title: 'End of Week',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "w"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-08 23:59:59"',
    description: 'Get end of week (Sunday) from given date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-16',
    title: 'Start of Month',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "month"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get first day of month',
    category: 'date-duration'
  },
  {
    id: 'date-dur-17',
    title: 'End of Month',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "M"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-31 23:59:59"',
    description: 'Get last moment of month (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-18',
    title: 'Start of Year',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "year"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get first day of year',
    category: 'date-duration'
  },
  {
    id: 'date-dur-19',
    title: 'End of Year',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "y"))',
    sampleInput: '{}',
    expectedOutput: '"2023-12-31 23:59:59"',
    description: 'Get last moment of year (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-1',
    title: 'Add Duration to Date',
    expression: 'date("2023-10-15") + duration("1d")',
    sampleInput: '{}',
    expectedOutput: '1697414400',
    description: 'Add 1 day duration to date (returns timestamp)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-2',
    title: 'Subtract Duration from Date',
    expression: 'date("2023-10-15") - duration("7d")',
    sampleInput: '{}',
    expectedOutput: '1696723200',
    description: 'Subtract 7 days duration from date (returns timestamp)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-3',
    title: 'Date String After Addition',
    expression: 'dateString(date("2023-10-15") + duration("1d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16 00:00:00"',
    description: 'Format date after adding duration as readable string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-4',
    title: 'Date String After Subtraction',
    expression: 'dateString(date("2023-10-15") - duration("7d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-08 00:00:00"',
    description: 'Format date after subtracting duration as readable string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-5',
    title: 'Duration Comparison',
    expression: 'date("2023-10-15") + duration("1d") == date("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare date with duration arithmetic to another date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-6',
    title: 'Hour Duration',
    expression: 'duration("1h 30m")',
    sampleInput: '{}',
    expectedOutput: '5400',
    description: 'Create duration of 1 hour 30 minutes (5400 seconds)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-7',
    title: 'Add Hours to Date',
    expression: 'dateString(date("2023-10-15") + duration("12h"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15 12:00:00"',
    description: 'Add 12 hours to date and format as string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-8',
    title: 'Start of Day',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "day"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get start of day from datetime string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-9',
    title: 'End of Day',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 23:59:59"',
    description: 'Get end of day from datetime string (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-10',
    title: 'Start of Hour',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "hour"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:00:00"',
    description: 'Get start of current hour',
    category: 'date-duration'
  },
  {
    id: 'date-dur-11',
    title: 'End of Hour',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "h"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:59:59"',
    description: 'Get end of current hour (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-12',
    title: 'Start of Minute',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "minute"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:45:00"',
    description: 'Get start of current minute',
    category: 'date-duration'
  },
  {
    id: 'date-dur-13',
    title: 'End of Minute',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "m"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:45:59"',
    description: 'Get end of current minute (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-14',
    title: 'Start of Week',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "week"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-02 00:00:00"',
    description: 'Get start of week (Monday) from given date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-15',
    title: 'End of Week',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "w"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-08 23:59:59"',
    description: 'Get end of week (Sunday) from given date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-16',
    title: 'Start of Month',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "month"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get first day of month',
    category: 'date-duration'
  },
  {
    id: 'date-dur-17',
    title: 'End of Month',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "M"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-31 23:59:59"',
    description: 'Get last moment of month (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-18',
    title: 'Start of Year',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "year"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get first day of year',
    category: 'date-duration'
  },
  {
    id: 'date-dur-19',
    title: 'End of Year',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "y"))',
    sampleInput: '{}',
    expectedOutput: '"2023-12-31 23:59:59"',
    description: 'Get last moment of year (short format)',
    category: 'date-duration'
  },
];
