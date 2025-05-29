// Mock examples data - replace with actual CSV loading
const mockExamples = [
  {
    id: '1',
    title: 'Get User Name',
    expression: 'user.name',
    sampleInput: '{"user": {"name": "John Doe", "age": 30}}',
    expectedOutput: '"John Doe"',
    description: 'Access a simple property',
    category: 'basic'
  },
  {
    id: '2',
    title: 'Uppercase Name',
    expression: 'upper(user.name)',
    sampleInput: '{"user": {"name": "john doe", "age": 30}}',
    expectedOutput: '"JOHN DOE"',
    description: 'Convert text to uppercase',
    category: 'string'
  },
  {
    id: '3',
    title: 'Lowercase Email',
    expression: 'user.email.toLowerCase()',
    sampleInput: '{"user": {"email": "John.Doe@EXAMPLE.COM", "name": "John"}}',
    expectedOutput: '"john.doe@example.com"',
    description: 'Convert email to lowercase',
    category: 'string'
  },
  {
    id: '4',
    title: 'Nested Property',
    expression: 'user.profile.city',
    sampleInput: '{"user": {"profile": {"city": "New York", "country": "USA"}}}',
    expectedOutput: '"New York"',
    description: 'Access nested object properties',
    category: 'basic'
  },
  {
    id: '5',
    title: 'Trim Whitespace',
    expression: 'user.description.trim()',
    sampleInput: '{"user": {"description": "  A software developer  "}}',
    expectedOutput: '"A software developer"',
    description: 'Remove leading and trailing whitespace',
    category: 'string'
  },
  // New Zen Engine test examples
  {
    id: '6',
    title: 'Array Length',
    expression: 'users.length',
    sampleInput: '{"users": [{"name": "John"}, {"name": "Jane"}, {"name": "Bob"}]}',
    expectedOutput: '3',
    description: 'Get the length of an array',
    category: 'array'
  },
  {
    id: '7',
    title: 'Mathematical Operation',
    expression: 'price * quantity',
    sampleInput: '{"price": 10.50, "quantity": 3}',
    expectedOutput: '31.5',
    description: 'Multiply two numbers',
    category: 'math'
  },
  {
    id: '8',
    title: 'Conditional Expression',
    expression: 'age >= 18',
    sampleInput: '{"age": 25}',
    expectedOutput: 'true',
    description: 'Check if age is 18 or older',
    category: 'conditional'
  },
  {
    id: '9',
    title: 'String Concatenation',
    expression: 'firstName + " " + lastName',
    sampleInput: '{"firstName": "John", "lastName": "Doe"}',
    expectedOutput: '"John Doe"',
    description: 'Concatenate first and last name',
    category: 'string'
  }
];

export const getExamples = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sort by category, then by title
  return mockExamples.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
};
