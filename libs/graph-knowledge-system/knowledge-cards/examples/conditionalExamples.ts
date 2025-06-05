import { Example } from './types';

export const conditionalExamples: Example[] = [
  {
    id: 'cond-1',
    title: 'Simple Ternary',
    expression: 'score > 70 ? "Pass" : "Fail"',
    sampleInput: '{"score": 85}',
    expectedOutput: '"Pass"',
    description: 'Simple conditional expression',
    category: 'conditional'
  },
  {
    id: 'cond-2',
    title: 'Nested Ternary',
    expression: 'score > 90 ? "A" : score > 80 ? "B" : score > 70 ? "C" : "D"',
    sampleInput: '{"score": 85}',
    expectedOutput: '"B"',
    description: 'Nested conditional expression for grading',
    category: 'conditional'
  },
  {
    id: 'cond-3',
    title: 'Age Check',
    expression: 'age >= 18',
    sampleInput: '{"age": 25}',
    expectedOutput: 'true',
    description: 'Check if age meets minimum requirement',
    category: 'conditional'
  },
  {
    id: 'cond-4',
    title: 'Range Check',
    expression: 'x in [1..10]',
    sampleInput: '{"x": 5}',
    expectedOutput: 'true',
    description: 'Check if value is in range (inclusive)',
    category: 'conditional'
  },
  {
    id: 'cond-5',
    title: 'Simple Ternary Fail Case',
    expression: 'score > 70 ? "Pass" : "Fail"',
    sampleInput: '{"score": 60}',
    expectedOutput: '"Fail"',
    description: 'Simple conditional expression with fail result',
    category: 'conditional'
  },
  {
    id: 'cond-6',
    title: 'Complex Boolean Ternary',
    expression: 'true ? 10 == 10 : 20 == 30',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Ternary with boolean expressions on both sides',
    category: 'conditional'
  },
  {
    id: 'cond-7',
    title: 'Nested Complex Ternary',
    expression: 'true ? 10 == 20 : false ? 30 == 40 : true ? 50 == 60 : 70 == 80',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Complex nested ternary with multiple conditions',
    category: 'conditional'
  },
  {
    id: 'cond-8',
    title: 'Template Conditional',
    expression: '`${score > 70 ? "Pass" : "Fail"}`',
    sampleInput: '{"score": 85}',
    expectedOutput: '"Pass"',
    description: 'Conditional expression inside template string',
    category: 'conditional'
  },
  {
    id: 'cond-9',
    title: 'Conditional with Null Coalescing',
    expression: 'false or true ? null ?? "test" : false',
    sampleInput: '{}',
    expectedOutput: '"test"',
    description: 'Complex expression combining conditional and null coalescing',
    category: 'conditional'
  },
  {
    id: 'cond-10',
    title: 'Range Check False',
    expression: 'x in [1..10]',
    sampleInput: '{"x": 0}',
    expectedOutput: 'false',
    description: 'Check if value is in range (false case)',
    category: 'conditional'
  },


  {
    id: 'complex-conditional-1',
    title: 'Multi-Tier Pricing Logic',
    expression: 'map(customers, {name: #.name, tier: #.orders > 100 ? \'platinum\' : #.orders > 50 ? \'gold\' : #.orders > 10 ? \'silver\' : \'bronze\', discount: #.orders > 100 ? 0.15 : #.orders > 50 ? 0.1 : #.orders > 10 ? 0.05 : 0})',
    sampleInput: '{"customers": [{"name": "Alice", "orders": 150}, {"name": "Bob", "orders": 25}, {"name": "Charlie", "orders": 5}]}',
    expectedOutput: '[{"name": "Alice", "tier": "platinum", "discount": 0.15}, {"name": "Bob", "tier": "silver", "discount": 0.05}, {"name": "Charlie", "tier": "bronze", "discount": 0}]',
    description: 'Implement complex multi-tier logic with nested ternary conditions',
    category: 'complex-conditional'
  }
,

  {
    id: 'complex-conditional-2',
    title: 'Inventory Status Logic',
    expression: 'map(inventory, {product: #.name, status: #.quantity <= 0 ? \'out_of_stock\' : #.quantity <= #.reorder_point ? \'low_stock\' : #.quantity >= #.max_capacity ? \'overstocked\' : \'normal\', action: #.quantity <= 0 ? \'urgent_reorder\' : #.quantity <= #.reorder_point ? \'reorder_soon\' : #.quantity >= #.max_capacity ? \'reduce_orders\' : \'none\'})',
    sampleInput: '{"inventory": [{"name": "Widget A", "quantity": 0, "reorder_point": 10, "max_capacity": 100}, {"name": "Widget B", "quantity": 5, "reorder_point": 10, "max_capacity": 100}, {"name": "Widget C", "quantity": 150, "reorder_point": 20, "max_capacity": 100}]}',
    expectedOutput: '[{"product": "Widget A", "status": "out_of_stock", "action": "urgent_reorder"}, {"product": "Widget B", "status": "low_stock", "action": "reorder_soon"}, {"product": "Widget C", "status": "overstocked", "action": "reduce_orders"}]',
    description: 'Complex inventory management logic with multiple conditions and actions',
    category: 'complex-conditional'
  }
];
