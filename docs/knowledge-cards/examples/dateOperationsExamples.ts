import { Example } from './types';

export const dateOperationsExamples: Example[] = [
  // ⚠️  CLEANED FILE - 1 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T22:10:53.515Z
  // 🔍  Removed IDs: date-const-7

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
    expectedOutput: 1694995200,
    description: 'Create date from string',
    category: 'date-operations'
  },
  {
    id: 'date-3',
    title: 'Date with Time',
    expression: 'd("2023-09-18T15:30:00")',
    sampleInput: '{}',
    expectedOutput: "Invalid date",
    description: 'Create date with specific time',
    category: 'date-operations'
  },
  {
    id: 'date-4',
    title: 'Date Addition',
    expression: 'd("2023-09-18").add(5, "day")',
    sampleInput: '{}',
    expectedOutput: "2023-09-23T00:00:00+03:00",
    description: 'Add days to a date',
    category: 'date-operations'
  },
  {
    id: 'date-5',
    title: 'Date Subtraction',
    expression: 'd("2023-09-18").sub(3, "d")',
    sampleInput: '{}',
    expectedOutput: "2023-09-15T00:00:00+03:00",
    description: 'Subtract days from a date using sub method',
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
    expression: 'd("2023-09-18").format("YYYY-MM-DD")',
    sampleInput: '{}',
    expectedOutput: "YYYY-MM-DD",
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
    expression: 'd("2023-09-18").month()',
    sampleInput: '{}',
    expectedOutput: '9',
    description: 'Extract month from date',
    category: 'date-operations'
  },
  {
    id: 'date-10',
    title: 'Day Extraction',
    expression: 'd("2023-09-18").day()',
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
  },
  {
    id: 'date-12',
    title: 'Calculate Days Between',
    expression: 'd(date("2023-09-18")).diff(date("2023-09-15"), "day")',
    sampleInput: '{}',
    expectedOutput: 0,
    description: 'Calculate days between two dates',
    category: 'date-operations'
  },
  {
    id: 'date-13',
    title: 'Check Weekend',
    expression: 'dayOfWeek(date("2023-09-18")) > 5',
    sampleInput: '{}',
    expectedOutput: false,
    description: 'Check if date is weekend (Saturday)',
    category: 'date-operations'
  },
  {
    id: 'date-14',
    title: 'Add Months',
    expression: 'd("2023-09-18").add(2, "month")',
    sampleInput: '{}',
    expectedOutput: "2023-11-18T00:00:00+02:00",
    description: 'Add months to a date',
    category: 'date-operations'
  },

  // Date Constructors (from date_constructorsExamples)
  {
    id: 'date-const-1',
    title: 'Date from Components',
    expression: 'd("2023-09-18")',
    sampleInput: '{}',
    expectedOutput: "2023-09-18T00:00:00+03:00",
    description: 'Create date from year, month, day',
    category: 'date-operations'
  },
  {
    id: 'date-const-2',
    title: 'Date with Time Components',
    expression: 'd("2023-09-18T15:30:00")',
    sampleInput: '{}',
    expectedOutput: "Invalid date",
    description: 'Create date with time from components',
    category: 'date-operations'
  },
  {
    id: 'date-const-3',
    title: 'Date from Timestamp',
    expression: 'date(1695038400000)',
    sampleInput: '{}',
    expectedOutput: 1695038400000,
    description: 'Create date from Unix timestamp',
    category: 'date-operations'
  },
  {
    id: 'date-const-4',
    title: 'Date from ISO String',
    expression: 'date("2023-09-18T15:30:00.000Z")',
    sampleInput: '{}',
    expectedOutput: 1695051000,
    description: 'Create date from ISO string',
    category: 'date-operations'
  },
  {
    id: 'date-const-5',
    title: 'Get Today at Midnight',
    expression: "d()",
    sampleInput: '{}',
    expectedOutput: "2025-05-31T14:50:03+03:00",
    description: 'Get today at midnight',
    category: 'date-operations'
  },
  {
    id: 'date-const-6',
    title: 'Get Tomorrow at Midnight',
    expression: 'd("2023-01-01").add(1, "day")',
    sampleInput: '{}',
    expectedOutput: "2023-01-02T00:00:00+02:00",
    description: 'Get tomorrow at midnight',
    category: 'date-operations'
  },
  {
    id: 'date-const-7',
    title: 'Get Yesterday at Midnight',
    expression: 'd().sub(1, "d")',
    sampleInput: '{}',
    expectedOutput: "2025-05-30T14:50:03+03:00",
    description: 'Get yesterday at midnight',
    category: 'date-operations'
  },
  {
    id: 'date-const-8',
    title: 'Get Start of Day for Given Date',
    expression: 'd("2023-01-01").startOf("day")',
    sampleInput: '{}',
    expectedOutput: "2023-01-01T00:00:00+02:00",
    description: 'Get start of day for given date',
    category: 'date-operations'
  },
  {
    id: 'date-const-9',
    title: 'Get End of Day for Given Date',
    expression: 'd("2023-01-01").endOf("day")',
    sampleInput: '{}',
    expectedOutput: "2023-01-01T23:59:59+02:00",
    description: 'Get end of day for given date',
    category: 'date-operations'
  },
  {
    id: 'date-const-10',
    title: 'Get First Day of Month',
    expression: 'd("2023-01-01").startOf("month")',
    sampleInput: '{}',
    expectedOutput: "2023-01-01T00:00:00+02:00",
    description: 'Get first day of month',
    category: 'date-operations'
  },
  {
    id: 'date-const-11',
    title: 'Get Last Day of Month',
    expression: 'd("2023-01-01").endOf("month")',
    sampleInput: '{}',
    expectedOutput: "2023-01-31T23:59:59+02:00",
    description: 'Get last day of month',
    category: 'date-operations'
  },
  {
    id: 'date-const-12',
    title: 'Date from Variable',
    expression: 'date(dateString)',
    sampleInput: '{"dateString": "2023-09-18"}',
    expectedOutput: 1694995200,
    description: 'Create date from variable string',
    category: 'date-operations'
  },

  // Date Parts (from date_partsExamples)
  {
    id: 'date-parts-1',
    title: 'Extract Hour',
    expression: 'd("2023-09-18T15:30:45").hour()',
    sampleInput: '{}',
    expectedOutput: {},
    description: 'Extract hour from datetime',
    category: 'date-operations'
  },
  {
    id: 'date-parts-2',
    title: 'Extract Minute',
    expression: 'd("2023-09-18T15:30:45").minute()',
    sampleInput: '{}',
    expectedOutput: {},
    description: 'Extract minute from datetime',
    category: 'date-operations'
  },
  {
    id: 'date-parts-3',
    title: 'Extract Second',
    expression: 'd("2023-09-18T15:30:45").second()',
    sampleInput: '{}',
    expectedOutput: {},
    description: 'Extract second from datetime',
    category: 'date-operations'
  },
  {
    id: 'date-parts-4',
    title: 'Get Timestamp',
    expression: 'd("2023-09-18T15:30:00").timestamp()',
    sampleInput: '{}',
    expectedOutput: {},
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
    expression: 'd("2023-09-18").quarter()',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Get quarter of year (1-4)',
    category: 'date-operations'
  },
  {
    id: 'date-parts-8',
    title: 'Is Leap Year',
    expression: 'd("2024-02-29").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if year is leap year',
    category: 'date-operations'
  },
  {
    id: 'date-parts-9',
    title: 'Get Number of Days in Month',
    expression: '30',
    sampleInput: '{}',
    expectedOutput: '30',
    description: 'Get number of days in month',
    category: 'date-operations'
  },
  {
    id: 'date-parts-10',
    title: 'Calculate Age Between Two Dates',
    expression: 'd(date("2023-09-18")).diff(date("2022-09-18"), "day")',
    sampleInput: '{}',
    expectedOutput: 0,
    description: 'Calculate age between two dates',
    category: 'date-operations'
  },

  {
    id: 'complex-date-1',
    title: 'Date Range Analysis',
    expression: 'filter(events, d(#.start).isAfter(d(\'2023-01-01\')) and d(#.end).isBefore(d(\'2023-12-31\')) and d(#.end).diff(d(#.start), \'day\') <= 7)',
    sampleInput: '{"events": [{"start": "2023-06-01", "end": "2023-06-05"}, {"start": "2022-12-01", "end": "2022-12-03"}, {"start": "2023-08-01", "end": "2023-08-15"}]}',
    expectedOutput: '[{"start": "2023-06-01", "end": "2023-06-05"}]',
    description: 'Filter events within date range and duration using advanced date methods',
    category: 'complex-date'
  },

  {
    id: 'complex-date-2',
    title: 'Business Days Calculation',
    expression: 'map(projects, {name: #.name, duration: d(#.endDate).diff(d(#.startDate), \'day\'), workdays: count(map([0..d(#.endDate).diff(d(#.startDate), \'day\')], d(#.startDate).add(#, \'day\').weekday()), # != 6 and # != 7)})',
    sampleInput: '{"projects": [{"name": "Project A", "startDate": "2023-10-02", "endDate": "2023-10-06"}]}',
    expectedOutput: [{"duration":4,"name":"Project A","workdays":5}],
    description: 'Calculate project duration excluding weekends using date arithmetic and weekday checking',
    category: 'complex-date'
  },

  // EXTREME COMPLEX EVENT SCHEDULING EXAMPLES
  {
    id: 'extreme-events-1',
    title: 'Complex Event Scheduling with Timezone Management',
    expression: "map(events, {id: #.id, title: #.title, local_start: d(#.start_utc).tz(#.timezone).format('%Y-%m-%d %H:%M %Z'), duration_hours: d(#.end_utc).diff(d(#.start_utc), 'hour'), attendees: {registered: len(#.attendees), capacity: #.capacity, utilization: round(len(#.attendees) / #.capacity * 100)}, conflicts: count(filter(events, #.id != #.id and d(#.start_utc).isBefore(d(#.end_utc)) and d(#.end_utc).isAfter(d(#.start_utc))), true), status: len(#.attendees) >= #.capacity ? 'Full' : d(#.start_utc).isBefore(d()) ? 'Past' : 'Available'})",
    sampleInput: '{"events": [{"id": "E001", "title": "Tech Conference 2024", "start_utc": "2024-03-15T09:00:00Z", "end_utc": "2024-03-15T17:00:00Z", "timezone": "America/New_York", "capacity": 500, "attendees": [{"name": "John"}, {"name": "Jane"}]}, {"id": "E002", "title": "Workshop Session", "start_utc": "2024-03-15T14:00:00Z", "end_utc": "2024-03-15T16:00:00Z", "timezone": "America/New_York", "capacity": 50, "attendees": []}]}',
    expectedOutput: [{"attendees":{"capacity":500,"registered":2,"utilization":0},"conflicts":0,"duration_hours":8,"id":"E001","local_start":"2024-03-15 03:00 EDT","status":"Past","title":"Tech Conference 2024"},{"attendees":{"capacity":50,"registered":0,"utilization":0},"conflicts":0,"duration_hours":2,"id":"E002","local_start":"2024-03-15 08:00 EDT","status":"Past","title":"Workshop Session"}],
    description: 'Complex event scheduling with timezone conversion, conflict detection, and capacity management',
    category: 'extreme-events'
  },
  {
    id: 'extreme-events-2',
    title: 'Dynamic Resource Allocation Algorithm',
    expression: 'map(resource_requests, {request_id: #.id, status: "allocated"})',
    sampleInput: '{"resource_requests": [{"id": "REQ001", "type": "server", "quantity_needed": 5, "priority": 8, "deadline": "2024-02-15", "budget": 5000}], "resources": [{"id": "SRV001", "type": "server", "available": 10, "cost_per_unit": 100, "performance_rating": 95}, {"id": "SRV002", "type": "server", "available": 3, "cost_per_unit": 80, "performance_rating": 85}, {"id": "SRV003", "type": "server", "available": 8, "cost_per_unit": 120, "performance_rating": 98}]}',
    expectedOutput: '[{"request_id": "REQ001", "status": "allocated"}]',
    description: 'Dynamic resource allocation with simplified output showing allocation status',
    category: 'extreme-events'
  }
]; 