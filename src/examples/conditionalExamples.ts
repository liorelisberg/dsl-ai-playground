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
];
