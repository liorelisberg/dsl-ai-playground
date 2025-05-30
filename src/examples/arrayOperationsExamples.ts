import { Example } from './types';

export const arrayOperationsExamples: Example[] = [
  // ⚠️  MANUALLY CLEANED - 5 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:41:11.963Z
  // ⚠️  CLEANED FILE - 5 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:40:28.248Z
  // 🔍  Removed IDs: array-flat-6, array-flat-7, array-flat-8, array-flat-9, array-flat-10

  // Basic Array Operations (from arrayExamples)
  {
    id: 'array-1',
    title: 'Array Length',
    expression: 'len([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Get length of array',
    category: 'array-operations'
  },
  {
    id: 'array-2',
    title: 'Array Sum',
    expression: 'sum([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Calculate sum of array elements',
    category: 'array-operations'
  },
  {
    id: 'array-3',
    title: 'Array Average',
    expression: 'avg([10, 20, 30])',
    sampleInput: '{}',
    expectedOutput: '20',
    description: 'Calculate average of array elements',
    category: 'array-operations'
  },
  {
    id: 'array-4',
    title: 'Array Minimum',
    expression: 'min([5, 8, 2, 11, 7])',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Find minimum value in array',
    category: 'array-operations'
  },
  {
    id: 'array-5',
    title: 'Array Maximum',
    expression: 'max([5, 8, 2, 11, 7])',
    sampleInput: '{}',
    expectedOutput: '11',
    description: 'Find maximum value in array',
    category: 'array-operations'
  },
  {
    id: 'array-6',
    title: 'Array Contains',
    expression: 'contains([1, 2, 3, 4, 5], 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if array contains element',
    category: 'array-operations'
  },
  {
    id: 'array-7',
    title: 'Array Filter',
    expression: 'filter([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: '[4, 5]',
    description: 'Filter array elements by condition',
    category: 'array-operations'
  },
  {
    id: 'array-8',
    title: 'Array Map',
    expression: 'map([1, 2, 3, 4, 5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8, 10]',
    description: 'Transform each array element',
    category: 'array-operations'
  },
  {
    id: 'array-9',
    title: 'Array Some',
    expression: 'some([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements match condition',
    category: 'array-operations'
  },
  {
    id: 'array-10',
    title: 'Array Count',
    expression: 'count([1, 2, 3, 4, 5, 2], # == 2)',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Count elements matching condition',
    category: 'array-operations'
  },
  {
    id: 'array-11',
    title: 'Array Keys',
    expression: 'keys([10, 11, 12])',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2]',
    description: 'Get array indices as keys',
    category: 'array-operations'
  },

  // Advanced Array Methods (from array_advancedExamples - avoiding duplicates)
  {
    id: 'array-adv-4',
    title: 'Array All Check',
    expression: 'all([1, 2, 3], # > 0)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all elements match condition',
    category: 'array-operations'
  },
  {
    id: 'array-adv-5',
    title: 'FlatMap Operation',
    expression: 'flatMap([[1, 2], [3, 4], [5, 6]], #)',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    description: 'Flatten nested arrays into single array',
    category: 'array-operations'
  },
  {
    id: 'array-adv-6',
    title: 'String Array Transformation',
    expression: "map(['a', 'b', 'c'], # + '!')",
    sampleInput: '{}',
    expectedOutput: "['a!', 'b!', 'c!']",
    description: 'Transform string array elements',
    category: 'array-operations'
  },
  {
    id: 'array-adv-7',
    title: 'String Array Filter',
    expression: "filter(['a', 'b', 'c', 'd'], # in ['a', 'c'])",
    sampleInput: '{}',
    expectedOutput: "['a', 'c']",
    description: 'Filter strings by inclusion check',
    category: 'array-operations'
  },
  {
    id: 'array-adv-8',
    title: 'String Array Some Check',
    expression: "some(['a', 'b', 'c'], # == 'b')",
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some strings match condition',
    category: 'array-operations'
  },
  {
    id: 'array-adv-9',
    title: 'String Array All Check',
    expression: "all(['a', 'b', 'c'], # in ['a', 'b', 'c', 'd'])",
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all strings are in allowed set',
    category: 'array-operations'
  },
  {
    id: 'array-adv-10',
    title: 'Chained Filter and Map',
    expression: 'map(filter([1, 2, 3, 4, 5], # > 2), # * 2)',
    sampleInput: '{}',
    expectedOutput: '[6, 8, 10]',
    description: 'Chain filter and map operations',
    category: 'array-operations'
  },
  {
    id: 'array-adv-11',
    title: 'Filter with Length Count',
    expression: 'len(filter([1, 2, 3, 4, 5], # % 2 == 0))',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Count filtered elements using length',
    category: 'array-operations'
  },
  {
    id: 'array-adv-12',
    title: 'Filter with Sum',
    expression: 'sum(filter([1, 2, 3, 4, 5], # % 2 == 0))',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Sum filtered even numbers',
    category: 'array-operations'
  },
  {
    id: 'array-adv-13',
    title: 'Complex Chained Operations',
    expression: 'sum(map(filter([1, 2, 3, 4, 5], # > 3), # ^ 2))',
    sampleInput: '{}',
    expectedOutput: '41',
    description: 'Filter, map to squares, then sum (4²+5² = 16+25 = 41)',
    category: 'array-operations'
  },
  {
    id: 'array-adv-14',
    title: 'Some with Map Result',
    expression: 'some(map([1, 2, 3], # * 2), # > 5)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some mapped results match condition',
    category: 'array-operations'
  },
  {
    id: 'array-adv-15',
    title: 'All with Map Result',
    expression: 'all(map([1, 2, 3], # + 2), # > 2)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all mapped results match condition',
    category: 'array-operations'
  },
  {
    id: 'array-adv-16',
    title: 'Contains with Map Result',
    expression: 'contains(map([1, 2, 3], # * 2), 6)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if mapped array contains specific value',
    category: 'array-operations'
  },
  {
    id: 'array-adv-17',
    title: 'Object Array Map to IDs',
    expression: 'map([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id)',
    sampleInput: '{}',
    expectedOutput: '[1, 2]',
    description: 'Extract property from object array using map',
    category: 'array-operations'
  },
  {
    id: 'array-adv-18',
    title: 'Object Array Filter',
    expression: 'filter([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id > 1)',
    sampleInput: '{}',
    expectedOutput: '[{id: 2, name: "Jane"}]',
    description: 'Filter object array by property condition',
    category: 'array-operations'
  },
  {
    id: 'array-adv-19',
    title: 'Object Array Filter and Map Names',
    expression: 'map(filter([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id > 1), #.name)',
    sampleInput: '{}',
    expectedOutput: '["Jane"]',
    description: 'Filter objects then extract names',
    category: 'array-operations'
  },
  {
    id: 'array-adv-20',
    title: 'Object Transformation',
    expression: 'map(items, {id: #.id, fullName: #.firstName + " " + #.lastName})',
    sampleInput: '{"items": [{"id": 1, "firstName": "John", "lastName": "Doe"}, {"id": 2, "firstName": "Jane", "lastName": "Smith"}]}',
    expectedOutput: '[{"id": 1, "fullName": "John Doe"}, {"id": 2, "fullName": "Jane Smith"}]',
    description: 'Transform object array to new structure',
    category: 'array-operations'
  },
  {
    id: 'array-adv-21',
    title: 'Complex Object Filter Sum',
    expression: 'sum(map(filter([{id: 1, val: 10}, {id: 2, val: 20}, {id: 3, val: 30}], #.id > 1), #.val))',
    sampleInput: '{}',
    expectedOutput: '50',
    description: 'Filter objects, extract values, then sum',
    category: 'array-operations'
  },
  {
    id: 'array-adv-22',
    title: 'Permission Check',
    expression: 'some(user.permissions, # == "edit")',
    sampleInput: '{"user": {"permissions": ["view", "edit", "delete"]}}',
    expectedOutput: 'true',
    description: 'Check if user has specific permission',
    category: 'array-operations'
  },
  {
    id: 'array-adv-23',
    title: 'Price Validation All',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items": [{"price": 15}, {"price": 20}, {"price": 25}]}',
    expectedOutput: 'true',
    description: 'Check if all items meet price condition',
    category: 'array-operations'
  },
  {
    id: 'array-adv-24',
    title: 'Price Validation Some Fail',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items": [{"price": 15}, {"price": 5}, {"price": 25}]}',
    expectedOutput: 'false',
    description: 'Check price condition with some items failing',
    category: 'array-operations'
  },
  {
    id: 'array-adv-25',
    title: 'Average Price Calculation',
    expression: 'avg(map(items, #.price))',
    sampleInput: '{"items": [{"price": 10}, {"price": 20}, {"price": 30}]}',
    expectedOutput: '20',
    description: 'Calculate average price from object array',
    category: 'array-operations'
  },
  {
    id: 'array-adv-26',
    title: 'Maximum Value Calculation',
    expression: 'max(map(items, #.qty * #.price))',
    sampleInput: '{"items": [{"qty": 2, "price": 10}, {"qty": 1, "price": 20}, {"qty": 3, "price": 15}]}',
    expectedOutput: '45',
    description: 'Find maximum total value (qty × price)',
    category: 'array-operations'
  },
  {
    id: 'array-adv-27',
    title: 'Split String to Numbers',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert each part to number',
    category: 'array-operations'
  },
  {
    id: 'array-adv-28',
    title: 'Range Filter Even Numbers',
    expression: 'filter([0..10], # % 2 == 0)',
    sampleInput: '{}',
    expectedOutput: '[0, 2, 4, 6, 8, 10]',
    description: 'Filter even numbers from range',
    category: 'array-operations'
  },

  // Array Flattening & Transformations (from array_flatteningExamples)
  {
    id: 'array-flat-2',
    title: 'FlatMap with Transformation',
    expression: 'flatMap([[1, 2], [3, 4]], map(#, # * 2))',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8]',
    description: 'Flatten arrays while transforming elements',
    category: 'array-operations'
  },
  {
    id: 'array-flat-3',
    title: 'FlatMap Object Properties',
    expression: 'flatMap(groups, #.items)',
    sampleInput: '{"groups":[{"items":[1,2]},{"items":[3,4]},{"items":[5,6]}]}',
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    description: 'Flatten arrays from object properties',
    category: 'array-operations'
  },
  {
    id: 'array-flat-4',
    title: 'Nested Array Processing',
    expression: 'sum(flatMap(matrix, #))',
    sampleInput: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}',
    expectedOutput: '45',
    description: 'Flatten 2D matrix and calculate sum',
    category: 'array-operations'
  },
  {
    id: 'array-flat-5',
    title: 'FlatMap with Filter',
    expression: 'flatMap(arrays, filter(#, # > 2))',
    sampleInput: '{"arrays":[[1,2,3],[4,5,6],[1,7,8]]}',
    expectedOutput: '[3, 4, 5, 6, 7, 8]',
    description: 'Flatten arrays after filtering elements greater than 2',
    category: 'array-operations'
  },',
    expectedOutput: '[1, 2, 3, 4]',
    description: 'Get unique elements from array',
    category: 'array-operations'
  },',
    expectedOutput: '[1, 1, 2, 3, 4, 5, 6, 9]',
    description: 'Sort numerical array in ascending order',
    category: 'array-operations'
  },',
    expectedOutput: '["apple", "banana", "cherry"]',
    description: 'Sort string array alphabetically',
    category: 'array-operations'
  },',
    expectedOutput: '[5, 4, 3, 2, 1]',
    description: 'Reverse array element order',
    category: 'array-operations'
  },',
    expectedOutput: '15',
    description: 'Reduce array to sum with accumulator',
    category: 'array-operations'
  },
  {
    id: 'array-flat-11',
    title: 'Complex Flatten and Process',
    expression: 'avg(flatMap(groups, map(#.values, # * 2)))',
    sampleInput: '{"groups":[{"values":[1,2]},{"values":[3,4]}]}',
    expectedOutput: '5',
    description: 'Flatten nested values, double them, then calculate average',
    category: 'array-operations'
  },

  // Array Statistics (from array_statisticsExamples)
  {
    id: 'array-stats-1',
    title: 'Array Median',
    expression: 'median([4, 2, 7, 5, 3])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find median value in array (middle value when sorted)',
    category: 'array-operations'
  },
  {
    id: 'array-stats-2',
    title: 'Array Mode',
    expression: 'mode([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find mode (most frequent value) in array',
    category: 'array-operations'
  },
  {
    id: 'array-stats-3',
    title: 'Median of Sorted Array',
    expression: 'median([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Find median of odd-length sorted array',
    category: 'array-operations'
  },
  {
    id: 'array-stats-4',
    title: 'Median of Even Array',
    expression: 'median([1, 2, 3, 4])',
    sampleInput: '{}',
    expectedOutput: '2.5',
    description: 'Find median of even-length array (average of middle two)',
    category: 'array-operations'
  },
  {
    id: 'array-stats-5',
    title: 'Mode of String Array',
    expression: 'mode(["apple", "banana", "apple", "cherry", "apple"])',
    sampleInput: '{}',
    expectedOutput: '"apple"',
    description: 'Find most frequent string in array',
    category: 'array-operations'
  },
  {
    id: 'array-stats-6',
    title: 'Statistical Comparison',
    expression: 'median([1, 5, 9]) > avg([1, 5, 9])',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Compare median and average of same array',
    category: 'array-operations'
  },
  {
    id: 'array-stats-7',
    title: 'Combined Statistics',
    expression: 'max([median([1, 3, 5]), avg([2, 4, 6])])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find maximum between median of one array and average of another',
    category: 'array-operations'
  },
  {
    id: 'array-stats-8',
    title: 'Mode Frequency Check',
    expression: 'count([1, 1, 2, 2, 2, 3], # == mode([1, 1, 2, 2, 2, 3]))',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Count occurrences of the mode value',
    category: 'array-operations'
  },
  {
    id: 'array-stats-9',
    title: 'Range Calculation',
    expression: 'max([1, 3, 7, 2, 9]) - min([1, 3, 7, 2, 9])',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Calculate range (difference between max and min)',
    category: 'array-operations'
  },
  {
    id: 'array-stats-10',
    title: 'Median Price Calculation',
    expression: 'median(map(products, #.price))',
    sampleInput: '{"products":[{"price":10},{"price":20},{"price":30},{"price":15},{"price":25}]}',
    expectedOutput: '20',
    description: 'Find median price from product array',
    category: 'array-operations'
  }
]; 