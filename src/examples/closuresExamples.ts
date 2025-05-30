import { Example } from './types';

export const closuresExamples: Example[] = [
  {
    id: 'closure-1',
    title: 'Map with Multiplication',
    expression: 'map([1, 2, 3], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6]',
    description: 'Map array elements using closure with multiplication',
    category: 'closures'
  },
  {
    id: 'closure-2',
    title: 'Filter Even Numbers',
    expression: 'filter([1, 2, 3, 4, 5], # % 2 == 0)',
    sampleInput: '{}',
    expectedOutput: '[2, 4]',
    description: 'Filter array for even numbers using closure',
    category: 'closures'
  },
  {
    id: 'closure-3',
    title: 'Some Greater Than',
    expression: 'some([1, 2, 3], # > 2)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements are greater than 2',
    category: 'closures'
  },
  {
    id: 'closure-4',
    title: 'All Greater Than Zero',
    expression: 'all([1, 2, 3], # > 0)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all elements are greater than 0',
    category: 'closures'
  },
  {
    id: 'closure-5',
    title: 'Count Specific Value',
    expression: 'count([1, 2, 2, 3, 3, 3], # == 3)',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Count occurrences of specific value using closure',
    category: 'closures'
  },
  {
    id: 'closure-6',
    title: 'One Equals Check',
    expression: 'one([1, 2, 3], # == 2)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if exactly one element equals 2',
    category: 'closures'
  },
  {
    id: 'closure-7',
    title: 'None Greater Than',
    expression: 'none([1, 2, 3], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if no elements are greater than 3',
    category: 'closures'
  },
  {
    id: 'closure-8',
    title: 'Count with Equality',
    expression: 'count([1, 2, 3, 4, 5, 2], # == 2)',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Count occurrences of number 2 in array',
    category: 'closures'
  },
  {
    id: 'closure-9',
    title: 'Filter Greater Than',
    expression: 'filter([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: '[4, 5]',
    description: 'Filter elements greater than 3',
    category: 'closures'
  },
  {
    id: 'closure-10',
    title: 'Map Multiplication',
    expression: 'map([1, 2, 3, 4, 5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8, 10]',
    description: 'Multiply each array element by 2',
    category: 'closures'
  },
  {
    id: 'closure-11',
    title: 'Some with Equality',
    expression: 'some([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements are greater than 3',
    category: 'closures'
  },
  {
    id: 'closure-12',
    title: 'String Array Some',
    expression: 'some(["a", "b", "c"], # == "b")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string array contains specific element',
    category: 'closures'
  },
  {
    id: 'closure-13',
    title: 'String Array All',
    expression: 'all(["a", "b", "c"], # in ["a", "b", "c", "d"])',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all strings are in allowed set',
    category: 'closures'
  },
  {
    id: 'closure-14',
    title: 'Permission Check',
    expression: 'some(user.permissions, # == "edit")',
    sampleInput: '{"user": {"permissions": ["view", "edit", "delete"]}}',
    expectedOutput: 'true',
    description: 'Check if user has specific permission using closure',
    category: 'closures'
  },
  {
    id: 'closure-15',
    title: 'One Equals False Case',
    expression: 'one([1, 2, 3, 4, 5], # == 6)',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if exactly one element equals 6 (false case)',
    category: 'closures'
  },
];
