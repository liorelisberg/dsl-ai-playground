import { Example } from './types';

export const templateExamples: Example[] = [
  {
    id: 'template-1',
    title: 'Simple Template',
    expression: '`simple template`',
    sampleInput: '{}',
    expectedOutput: "'simple template'",
    description: 'Simple template string literal',
    category: 'template'
  },
  {
    id: 'template-2',
    title: 'Template with Expression',
    expression: '`sum of numbers ${sum([1, 2, 3])}`',
    sampleInput: '{}',
    expectedOutput: "'sum of numbers 6'",
    description: 'Template string with embedded expression',
    category: 'template'
  },
  {
    id: 'template-3',
    title: 'Template with Variable',
    expression: '`reference env: ${a}`',
    sampleInput: '{"a": "example"}',
    expectedOutput: "'reference env: example'",
    description: 'Template string with variable substitution',
    category: 'template'
  },
  {
    id: 'template-4',
    title: 'User Information Template',
    expression: '`User ${user.name} is ${user.age} years old`',
    sampleInput: '{"user": {"name": "John", "age": 30}}',
    expectedOutput: "'User John is 30 years old'",
    description: 'Template string with object properties',
    category: 'template'
  },
  {
    id: 'template-5',
    title: 'Uppercase Function Template',
    expression: '`uppercase inner ${upper("string")}`',
    sampleInput: '{}',
    expectedOutput: "'uppercase inner STRING'",
    description: 'Template string with function call',
    category: 'template'
  },
  {
    id: 'template-6',
    title: 'Sum Total Template',
    expression: '`Total: ${sum([1, 2, 3])}`',
    sampleInput: '{}',
    expectedOutput: "'Total: 6'",
    description: 'Template string with array sum calculation',
    category: 'template'
  },
  {
    id: 'template-7',
    title: 'Conditional Template',
    expression: '`${score > 70 ? "Pass" : "Fail"}`',
    sampleInput: '{"score": 85}',
    expectedOutput: '"Pass"',
    description: 'Template string with conditional expression',
    category: 'template'
  },
  {
    id: 'template-8',
    title: 'Unary Context Template',
    expression: '`simple template`',
    sampleInput: '{"$": "simple template"}',
    expectedOutput: 'true',
    description: 'Template string in unary context comparison',
    category: 'template'
  },
  {
    id: 'template-9',
    title: 'Unary Sum Template',
    expression: '`sum of numbers ${sum([1, 2, 3])}`',
    sampleInput: '{"$": "sum of numbers 6"}',
    expectedOutput: 'true',
    description: 'Template with calculation in unary context',
    category: 'template'
  },
  {
    id: 'template-10',
    title: 'Unary Variable Template',
    expression: '`reference env: ${a}`',
    sampleInput: '{"$": "reference env: example", "a": "example"}',
    expectedOutput: 'true',
    description: 'Template with variable in unary context',
    category: 'template'
  },
];
