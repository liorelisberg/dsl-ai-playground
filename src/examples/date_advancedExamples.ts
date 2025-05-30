import { Example } from './types';

export const date_advancedExamples: Example[] = [
  {
    id: 'date-adv-1',
    title: 'Validate Null Date',
    expression: 'd(null).isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if null date is valid (returns false)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-2',
    title: 'Validate Invalid String',
    expression: 'd("foo").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if invalid date string is valid (returns false)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-3',
    title: 'Validate Invalid Month',
    expression: 'd("2023-13-01").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date with invalid month (13) is valid',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-4',
    title: 'Validate Invalid Day',
    expression: 'd("2023-02-30").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date with invalid day (Feb 30) is valid',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-5',
    title: 'Convert to New York Time',
    expression: 'd("2023-10-15T00:00:00Z").tz("America/New_York")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-14T20:00:00-04:00"',
    description: 'Convert UTC time to New York timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-6',
    title: 'Convert to London Time',
    expression: 'd("2023-10-15T00:00:00Z").tz("Europe/London")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T01:00:00+01:00"',
    description: 'Convert UTC time to London timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-7',
    title: 'Convert to UTC',
    expression: 'd("2023-10-15T00:00:00+00:00").tz("UTC")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Convert time to UTC timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-8',
    title: 'Complex Timezone Conversion',
    expression: 'd("2023-10-15T12:00:00+02:00", "Etc/GMT-2").tz("UTC")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:00:00Z"',
    description: 'Convert from specific timezone to UTC',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-9',
    title: 'Check Yesterday',
    expression: 'd().sub(1, "d").isYesterday()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date minus 1 day is yesterday',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-10',
    title: 'Check Tomorrow',
    expression: 'd().add(1, "d").isTomorrow()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date plus 1 day is tomorrow',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-11',
    title: 'Check Is Today',
    expression: 'd("2023-10-15").isToday()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if specific date is today (context-dependent)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-12',
    title: 'Date Equality',
    expression: 'd("2023-10-15") == d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two identical dates are equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-13',
    title: 'Date Inequality',
    expression: 'd("2023-10-15") == d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if two different dates are equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-14',
    title: 'Date Not Equal',
    expression: 'd("2023-10-15") != d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two different dates are not equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-15',
    title: 'Date Less Than',
    expression: 'd("2023-10-15") < d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if first date is before second date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-16',
    title: 'Date Less Than Equal',
    expression: 'd("2023-10-15") <= d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is less than or equal to same date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-17',
    title: 'Date Greater Than',
    expression: 'd("2023-10-16") > d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if first date is after second date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-18',
    title: 'Date Greater Than Equal',
    expression: 'd("2023-10-15") >= d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is greater than or equal to same date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-19',
    title: 'Date Range Check',
    expression: 'd("2023-10-15") in [d("2023-10-01")..d("2023-10-31")]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is within a date range (October 2023)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-20',
    title: 'Same Day Check',
    expression: 'd().isSame(d(), "day")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two dates are the same day',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-21',
    title: 'Start of Day',
    expression: 'd("2023-10-15").startOf("day")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Get start of day (midnight)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-22',
    title: 'Start of Hour',
    expression: 'd("2023-10-15T10:30:45Z").startOf("hour")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:00:00Z"',
    description: 'Get start of current hour',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-23',
    title: 'End of Day',
    expression: 'd("2023-10-15").endOf("day")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T23:59:59Z"',
    description: 'Get end of day (23:59:59)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-24',
    title: 'End of Hour',
    expression: 'd("2023-10-15T10:30:45Z").endOf("hour")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:59:59Z"',
    description: 'Get end of current hour',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-1',
    title: 'Validate Null Date',
    expression: 'd(null).isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if null date is valid (returns false)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-2',
    title: 'Validate Invalid String',
    expression: 'd("foo").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if invalid date string is valid (returns false)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-3',
    title: 'Validate Invalid Month',
    expression: 'd("2023-13-01").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date with invalid month (13) is valid',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-4',
    title: 'Validate Invalid Day',
    expression: 'd("2023-02-30").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date with invalid day (Feb 30) is valid',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-5',
    title: 'Convert to New York Time',
    expression: 'd("2023-10-15T00:00:00Z").tz("America/New_York")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-14T20:00:00-04:00"',
    description: 'Convert UTC time to New York timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-6',
    title: 'Convert to London Time',
    expression: 'd("2023-10-15T00:00:00Z").tz("Europe/London")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T01:00:00+01:00"',
    description: 'Convert UTC time to London timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-7',
    title: 'Convert to UTC',
    expression: 'd("2023-10-15T00:00:00+00:00").tz("UTC")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Convert time to UTC timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-8',
    title: 'Complex Timezone Conversion',
    expression: 'd("2023-10-15T12:00:00+02:00", "Etc/GMT-2").tz("UTC")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:00:00Z"',
    description: 'Convert from specific timezone to UTC',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-9',
    title: 'Check Yesterday',
    expression: 'd().sub(1, "d").isYesterday()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date minus 1 day is yesterday',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-10',
    title: 'Check Tomorrow',
    expression: 'd().add(1, "d").isTomorrow()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date plus 1 day is tomorrow',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-11',
    title: 'Check Is Today',
    expression: 'd("2023-10-15").isToday()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if specific date is today (context-dependent)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-12',
    title: 'Date Equality',
    expression: 'd("2023-10-15") == d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two identical dates are equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-13',
    title: 'Date Inequality',
    expression: 'd("2023-10-15") == d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if two different dates are equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-14',
    title: 'Date Not Equal',
    expression: 'd("2023-10-15") != d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two different dates are not equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-15',
    title: 'Date Less Than',
    expression: 'd("2023-10-15") < d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if first date is before second date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-16',
    title: 'Date Less Than Equal',
    expression: 'd("2023-10-15") <= d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is less than or equal to same date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-17',
    title: 'Date Greater Than',
    expression: 'd("2023-10-16") > d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if first date is after second date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-18',
    title: 'Date Greater Than Equal',
    expression: 'd("2023-10-15") >= d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is greater than or equal to same date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-19',
    title: 'Date Range Check',
    expression: 'd("2023-10-15") in [d("2023-10-01")..d("2023-10-31")]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is within a date range (October 2023)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-20',
    title: 'Same Day Check',
    expression: 'd().isSame(d(), "day")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two dates are the same day',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-21',
    title: 'Start of Day',
    expression: 'd("2023-10-15").startOf("day")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Get start of day (midnight)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-22',
    title: 'Start of Hour',
    expression: 'd("2023-10-15T10:30:45Z").startOf("hour")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:00:00Z"',
    description: 'Get start of current hour',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-23',
    title: 'End of Day',
    expression: 'd("2023-10-15").endOf("day")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T23:59:59Z"',
    description: 'Get end of day (23:59:59)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-24',
    title: 'End of Hour',
    expression: 'd("2023-10-15T10:30:45Z").endOf("hour")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:59:59Z"',
    description: 'Get end of current hour',
    category: 'date-advanced'
  },
];
