import { Example } from './types';

export const array_advancedExamples: Example[] = [
  {
    id: 'array-adv-1',
    title: 'Array Map Transformation',
    expression: 'map([1, 2, 3, 4, 5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8, 10]',
    description: 'Transform each array element using map',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-2',
    title: 'Array Filter Operation',
    expression: 'filter([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: '[4, 5]',
    description: 'Filter array elements by condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-3',
    title: 'Array Some Check',
    expression: 'some([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements match condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-4',
    title: 'Array All Check',
    expression: 'all([1, 2, 3], # > 0)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all elements match condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-5',
    title: 'FlatMap Operation',
    expression: 'flatMap([[1, 2], [3, 4], [5, 6]], #)',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    description: 'Flatten nested arrays into single array',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-6',
    title: 'String Array Transformation',
    expression: "map(['a', 'b', 'c'], # + '!')",
    sampleInput: '{}',
    expectedOutput: "['a!', 'b!', 'c!']",
    description: 'Transform string array elements',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-7',
    title: 'String Array Filter',
    expression: "filter(['a', 'b', 'c', 'd'], # in ['a', 'c'])",
    sampleInput: '{}',
    expectedOutput: "['a', 'c']",
    description: 'Filter strings by inclusion check',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-8',
    title: 'String Array Some Check',
    expression: "some(['a', 'b', 'c'], # == 'b')",
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some strings match condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-9',
    title: 'String Array All Check',
    expression: "all(['a', 'b', 'c'], # in ['a', 'b', 'c', 'd'])",
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all strings are in allowed set',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-10',
    title: 'Chained Filter and Map',
    expression: 'map(filter([1, 2, 3, 4, 5], # > 2), # * 2)',
    sampleInput: '{}',
    expectedOutput: '[6, 8, 10]',
    description: 'Chain filter and map operations',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-11',
    title: 'Filter with Length Count',
    expression: 'len(filter([1, 2, 3, 4, 5], # % 2 == 0))',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Count filtered elements using length',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-12',
    title: 'Filter with Sum',
    expression: 'sum(filter([1, 2, 3, 4, 5], # % 2 == 0))',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Sum filtered even numbers',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-13',
    title: 'Complex Chained Operations',
    expression: 'sum(map(filter([1, 2, 3, 4, 5], # > 3), # ^ 2))',
    sampleInput: '{}',
    expectedOutput: '41',
    description: 'Filter, map to squares, then sum (4²+5² = 16+25 = 41)',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-14',
    title: 'Some with Map Result',
    expression: 'some(map([1, 2, 3], # * 2), # > 5)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some mapped results match condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-15',
    title: 'All with Map Result',
    expression: 'all(map([1, 2, 3], # + 2), # > 2)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all mapped results match condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-16',
    title: 'Contains with Map Result',
    expression: 'contains(map([1, 2, 3], # * 2), 6)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if mapped array contains specific value',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-17',
    title: 'Object Array Map to IDs',
    expression: 'map([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id)',
    sampleInput: '{}',
    expectedOutput: '[1, 2]',
    description: 'Extract property from object array using map',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-18',
    title: 'Object Array Filter',
    expression: 'filter([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id > 1)',
    sampleInput: '{}',
    expectedOutput: '[{id: 2, name: "Jane"}]',
    description: 'Filter object array by property condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-19',
    title: 'Object Array Filter and Map Names',
    expression: 'map(filter([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id > 1), #.name)',
    sampleInput: '{}',
    expectedOutput: '["Jane"]',
    description: 'Filter objects then extract names',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-20',
    title: 'Object Transformation',
    expression: 'map(items, {id: #.id, fullName: #.firstName + " " + #.lastName})',
    sampleInput: '{"items": [{"id": 1, "firstName": "John", "lastName": "Doe"}, {"id": 2, "firstName": "Jane", "lastName": "Smith"}]}',
    expectedOutput: '[{"id": 1, "fullName": "John Doe"}, {"id": 2, "fullName": "Jane Smith"}]',
    description: 'Transform object array to new structure',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-21',
    title: 'Complex Object Filter Sum',
    expression: 'sum(map(filter([{id: 1, val: 10}, {id: 2, val: 20}, {id: 3, val: 30}], #.id > 1), #.val))',
    sampleInput: '{}',
    expectedOutput: '50',
    description: 'Filter objects, extract values, then sum',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-22',
    title: 'Permission Check',
    expression: 'some(user.permissions, # == "edit")',
    sampleInput: '{"user": {"permissions": ["view", "edit", "delete"]}}',
    expectedOutput: 'true',
    description: 'Check if user has specific permission',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-23',
    title: 'Price Validation All',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items": [{"price": 15}, {"price": 20}, {"price": 25}]}',
    expectedOutput: 'true',
    description: 'Check if all items meet price condition',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-24',
    title: 'Price Validation Some Fail',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items": [{"price": 15}, {"price": 5}, {"price": 25}]}',
    expectedOutput: 'false',
    description: 'Check price condition with some items failing',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-25',
    title: 'Average Price Calculation',
    expression: 'avg(map(items, #.price))',
    sampleInput: '{"items": [{"price": 10}, {"price": 20}, {"price": 30}]}',
    expectedOutput: '20',
    description: 'Calculate average price from object array',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-26',
    title: 'Maximum Value Calculation',
    expression: 'max(map(items, #.qty * #.price))',
    sampleInput: '{"items": [{"qty": 2, "price": 10}, {"qty": 1, "price": 20}, {"qty": 3, "price": 15}]}',
    expectedOutput: '45',
    description: 'Find maximum total value (qty × price)',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-27',
    title: 'Split String to Numbers',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert each part to number',
    category: 'array-advanced'
  },
  {
    id: 'array-adv-28',
    title: 'Range Filter Even Numbers',
    expression: 'filter([0..10], # % 2 == 0)',
    sampleInput: '{}',
    expectedOutput: '[0, 2, 4, 6, 8, 10]',
    description: 'Filter even numbers from range',
    category: 'array-advanced'
  },
];
