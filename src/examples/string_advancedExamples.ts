import { Example } from './types';

export const string_advancedExamples: Example[] = [
  {
    id: 'str-adv-1',
    title: 'Multi-String Concatenation',
    expression: '"Hello" + " " + "World" + "!"',
    sampleInput: '{}',
    expectedOutput: '"Hello World!"',
    description: 'Concatenate multiple strings with spaces and punctuation',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-2',
    title: 'User Data Concatenation',
    expression: '"User: " + user.name',
    sampleInput: '{"user":{"name":"John"}}',
    expectedOutput: '"User: John"',
    description: 'Concatenate static text with user property',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-3',
    title: 'Template vs Concatenation',
    expression: 'user.firstName + " " + user.lastName',
    sampleInput: '{"user":{"firstName":"John","lastName":"Doe"}}',
    expectedOutput: '"John Doe"',
    description: 'Build full name by concatenating first and last name',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-4',
    title: 'Array Join Operation',
    expression: 'join(["apple", "banana", "cherry"], ", ")',
    sampleInput: '{}',
    expectedOutput: '"apple, banana, cherry"',
    description: 'Join array elements into comma-separated string',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-5',
    title: 'Array Join with Separator',
    expression: 'join(map(items, #.name), " | ")',
    sampleInput: '{"items":[{"name":"John"},{"name":"Jane"},{"name":"Bob"}]}',
    expectedOutput: '"John | Jane | Bob"',
    description: 'Extract names and join with pipe separator',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-6',
    title: 'String Repeat Operation',
    expression: 'repeat("*", 5)',
    sampleInput: '{}',
    expectedOutput: '"*****"',
    description: 'Repeat character multiple times',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-7',
    title: 'String Reverse',
    expression: 'reverse("hello")',
    sampleInput: '{}',
    expectedOutput: '"olleh"',
    description: 'Reverse string character order',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-8',
    title: 'Character At Index',
    expression: 'charAt("hello", 0)',
    sampleInput: '{}',
    expectedOutput: '"h"',
    description: 'Get character at specific index',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-9',
    title: 'Find Index Of',
    expression: 'indexOf("hello world", "world")',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Find index of substring within string',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-10',
    title: 'Substring Extraction',
    expression: 'substring("hello world", 6, 5)',
    sampleInput: '{}',
    expectedOutput: '"world"',
    description: 'Extract substring from start index with length',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-11',
    title: 'String Builder Pattern',
    expression: '"(" + user.id + ") " + user.name + " - " + user.status',
    sampleInput: '{"user":{"id":"123","name":"John","status":"active"}}',
    expectedOutput: '"(123) John - active"',
    description: 'Build complex string from multiple properties',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-12',
    title: 'Conditional Concatenation',
    expression: 'user.title ? user.title + " " + user.name : user.name',
    sampleInput: '{"user":{"title":"Dr.","name":"Smith"}}',
    expectedOutput: '"Dr. Smith"',
    description: 'Conditionally include title in name concatenation',
    category: 'string-advanced'
  },
];
