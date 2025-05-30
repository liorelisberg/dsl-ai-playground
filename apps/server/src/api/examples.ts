import { Router, Request, Response } from 'express';

const router: Router = Router();

// Example interface matching the frontend
interface Example {
  id: string;
  title: string;
  expression: string;
  input: unknown;
  output: unknown;
  description: string;
  category: string;
}

// Sample examples data (in a real implementation, this would come from a database or files)
const examples: Example[] = [
  {
    id: 'basic-property',
    title: 'Basic Property Access',
    expression: 'user.name',
    input: { user: { name: 'John Doe', age: 30 } },
    output: 'John Doe',
    description: 'Access a simple property from an object',
    category: 'Basic Operations'
  },
  {
    id: 'nested-property',
    title: 'Nested Property Access',
    expression: 'user.profile.city',
    input: { user: { profile: { city: 'New York', country: 'USA' } } },
    output: 'New York',
    description: 'Access nested properties using dot notation',
    category: 'Basic Operations'
  },
  {
    id: 'math-operation',
    title: 'Mathematical Operation',
    expression: 'price * quantity',
    input: { price: 10.5, quantity: 3 },
    output: 31.5,
    description: 'Perform basic mathematical calculations',
    category: 'Mathematical Operations'
  },
  {
    id: 'string-uppercase',
    title: 'String Transformation',
    expression: 'user.name.toUpperCase()',
    input: { user: { name: 'john doe' } },
    output: 'JOHN DOE',
    description: 'Transform strings using built-in methods',
    category: 'String Operations'
  },
  {
    id: 'array-access',
    title: 'Array Element Access',
    expression: 'users[0].name',
    input: { users: [{ name: 'Alice' }, { name: 'Bob' }] },
    output: 'Alice',
    description: 'Access elements from arrays using index notation',
    category: 'Array Operations'
  },
  {
    id: 'conditional-ternary',
    title: 'Conditional Expression',
    expression: 'age >= 18 ? "Adult" : "Minor"',
    input: { age: 25 },
    output: 'Adult',
    description: 'Use ternary operators for conditional logic',
    category: 'Conditional Expressions'
  },
  {
    id: 'string-concatenation',
    title: 'String Concatenation',
    expression: 'firstName + " " + lastName',
    input: { firstName: 'John', lastName: 'Doe' },
    output: 'John Doe',
    description: 'Combine strings using the + operator',
    category: 'String Operations'
  },
  {
    id: 'comparison',
    title: 'Comparison Operation',
    expression: 'score > threshold',
    input: { score: 85, threshold: 80 },
    output: true,
    description: 'Compare values using comparison operators',
    category: 'Boolean Operations'
  }
];

const getExamplesHandler = (req: Request, res: Response): void => {
  try {
    // Optional category filter
    const { category, search } = req.query;
    
    let filteredExamples = examples;
    
    // Filter by category if provided
    if (category && typeof category === 'string') {
      filteredExamples = filteredExamples.filter(
        example => example.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search term if provided
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredExamples = filteredExamples.filter(
        example => 
          example.title.toLowerCase().includes(searchTerm) ||
          example.description.toLowerCase().includes(searchTerm) ||
          example.expression.toLowerCase().includes(searchTerm)
      );
    }
    
    // Group by category
    const groupedExamples = filteredExamples.reduce((acc, example) => {
      if (!acc[example.category]) {
        acc[example.category] = [];
      }
      acc[example.category].push(example);
      return acc;
    }, {} as Record<string, Example[]>);
    
    // Sort categories alphabetically and examples within each category
    const sortedCategories = Object.keys(groupedExamples).sort();
    const result = sortedCategories.reduce((acc, category) => {
      acc[category] = groupedExamples[category].sort((a, b) => a.title.localeCompare(b.title));
      return acc;
    }, {} as Record<string, Example[]>);
    
    res.json({
      examples: result,
      totalCount: filteredExamples.length,
      categories: sortedCategories
    });
  } catch (error) {
    console.error('Examples API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all available categories
const getCategoriesHandler = (req: Request, res: Response): void => {
  try {
    const categories = [...new Set(examples.map(example => example.category))].sort();
    res.json({ categories });
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
router.get('/examples', getExamplesHandler);
router.get('/examples/categories', getCategoriesHandler);

export default router; 