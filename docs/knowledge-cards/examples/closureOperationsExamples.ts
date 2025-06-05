import { Example } from './types';

export const closureOperationsExamples: Example[] = [
  // Basic Closures (from closuresExamples)
  {
    id: 'closure-1',
    title: 'Simple Closure',
    expression: 'map([1, 2, 3], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6]',
    description: 'Simple closure that doubles each element',
    category: 'closure-operations'
  },
  {
    id: 'closure-2',
    title: 'Filter with Closure',
    expression: 'filter([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: '[4, 5]',
    description: 'Filter elements using closure condition',
    category: 'closure-operations'
  },
  {
    id: 'closure-3',
    title: 'Closure with Addition',
    expression: 'map([1, 2, 3], # + 10)',
    sampleInput: '{}',
    expectedOutput: '[11, 12, 13]',
    description: 'Add constant to each element using closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-4',
    title: 'Complex Closure Expression',
    expression: 'map([1, 2, 3], # * # + 1)',
    sampleInput: '{}',
    expectedOutput: '[2, 5, 10]',
    description: 'Closure with complex expression (x² + 1)',
    category: 'closure-operations'
  },
  {
    id: 'closure-5',
    title: 'String Closure',
    expression: 'map(["hello", "world"], upper(#))',
    sampleInput: '{}',
    expectedOutput: '["HELLO", "WORLD"]',
    description: 'Apply string function in closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-6',
    title: 'Closure with Modulo',
    expression: 'filter([1, 2, 3, 4, 5, 6], # % 2 == 0)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6]',
    description: 'Filter even numbers using modulo in closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-7',
    title: 'Closure with String Length',
    expression: 'map(["a", "bb", "ccc"], len(#))',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3]',
    description: 'Get length of each string using closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-8',
    title: 'Closure with Comparison',
    expression: 'some([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements satisfy closure condition',
    category: 'closure-operations'
  },
  {
    id: 'closure-9',
    title: 'Closure with All Check',
    expression: 'all([2, 4, 6, 8], # % 2 == 0)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if all elements satisfy closure condition',
    category: 'closure-operations'
  },
  {
    id: 'closure-10',
    title: 'Closure with Object Property',
    expression: 'map([{x: 1}, {x: 2}, {x: 3}], #.x * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6]',
    description: 'Access object property in closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-11',
    title: 'Closure with Conditional',
    expression: 'map([1, 2, 3, 4], # > 2 ? # * 2 : #)',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 6, 8]',
    description: 'Conditional expression in closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-12',
    title: 'Closure with Power',
    expression: 'map([1, 2, 3, 4], # ^ 2)',
    sampleInput: '{}',
    expectedOutput: '[1, 4, 9, 16]',
    description: 'Square each element using closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-13',
    title: 'Closure with Absolute Value',
    expression: 'map([-1, -2, 3, -4], abs(#))',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3, 4]',
    description: 'Get absolute value using closure',
    category: 'closure-operations'
  },
  {
    id: 'closure-14',
    title: 'Count with Closure',
    expression: 'count([1, 2, 3, 4, 5], # > 2)',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Count elements satisfying closure condition',
    category: 'closure-operations'
  },
  {
    id: 'closure-15',
    title: 'Closure with Variable',
    expression: 'map(numbers, # * multiplier)',
    sampleInput: '{"numbers": [1, 2, 3], "multiplier": 5}',
    expectedOutput: '[5, 10, 15]',
    description: 'Use external variable in closure',
    category: 'closure-operations'
  },

  // Nested Closures (from nested_closuresExamples)
  {
    id: 'nested-1',
    title: 'Nested Map Operations',
    expression: 'map(map([1, 2, 3], # * 2), # + 1)',
    sampleInput: '{}',
    expectedOutput: '[3, 5, 7]',
    description: 'Chain two map operations with closures',
    category: 'closure-operations'
  },
  {
    id: 'nested-2',
    title: 'Filter then Map',
    expression: 'map(filter([1, 2, 3, 4, 5], # > 2), # * 2)',
    sampleInput: '{}',
    expectedOutput: '[6, 8, 10]',
    description: 'Filter elements then transform with map',
    category: 'closure-operations'
  },
  {
    id: 'nested-3',
    title: 'Map then Sum',
    expression: 'sum(map([1, 2, 3, 4], # ^ 2))',
    sampleInput: '{}',
    expectedOutput: '30',
    description: 'Square elements then sum the result',
    category: 'closure-operations'
  },
  {
    id: 'nested-4',
    title: 'Complex Nested Chain',
    expression: 'sum(map(filter([1, 2, 3, 4, 5, 6], # % 2 == 0), # * 3))',
    sampleInput: '{}',
    expectedOutput: '36',
    description: 'Filter even numbers, multiply by 3, then sum',
    category: 'closure-operations'
  },
  {
    id: 'nested-5',
    title: 'Nested Object Processing',
    expression: 'map(filter(items, #.active), #.value * 2)',
    sampleInput: '{"items": [{"active": true, "value": 10}, {"active": false, "value": 20}, {"active": true, "value": 30}]}',
    expectedOutput: '[20, 60]',
    description: 'Filter active items then double their values',
    category: 'closure-operations'
  },
  {
    id: 'nested-6',
    title: 'Average of Filtered Values',
    expression: 'avg(map(filter(data, #.score > 80), #.score))',
    sampleInput: '{"data": [{"score": 75}, {"score": 85}, {"score": 90}, {"score": 70}]}',
    expectedOutput: '87.5',
    description: 'Filter high scores then calculate average',
    category: 'closure-operations'
  },
  {
    id: 'nested-7',
    title: 'Count Filtered Results',
    expression: 'len(filter(map([1, 2, 3, 4, 5], # * 2), # > 5))',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Double numbers, filter > 5, then count results',
    category: 'closure-operations'
  },
  {
    id: 'nested-8',
    title: 'Maximum of Transformed Values',
    expression: 'max(map(filter([1, 2, 3, 4, 5], # % 2 == 1), # ^ 2))',
    sampleInput: '{}',
    expectedOutput: '25',
    description: 'Filter odd numbers, square them, find maximum',
    category: 'closure-operations'
  },
  {
    id: 'nested-9',
    title: 'Complex Business Logic',
    expression: 'sum(map(filter(orders, #.status == "completed"), #.amount * (1 - #.discount)))',
    sampleInput: '{"orders": [{"status": "completed", "amount": 100, "discount": 0.1}, {"status": "pending", "amount": 200, "discount": 0.05}, {"status": "completed", "amount": 150, "discount": 0.2}]}',
    expectedOutput: '210',
    description: 'Calculate total revenue from completed orders with discounts',
    category: 'closure-operations'
  }
]; 