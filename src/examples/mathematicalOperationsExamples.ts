import { Example } from './types';

export const mathematicalOperationsExamples: Example[] = [
  // ⚠️  CLEANED FILE - 11 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T22:10:53.518Z
  // 🔍  Removed IDs: math-7, math-8, math-23, complex-math-3, complex-math-9, complex-math-13, complex-math-22, complex-math-26, complex-math-30, complex-math-33, round-10

  // ⚠️  MANUALLY CLEANED - 17 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:41:11.979Z
  // ⚠️  CLEANED FILE - 17 hallucinated examples removed
  // 📅  Cleaned on: 2025-05-30T21:40:28.251Z
  // 🔍  Removed IDs: math-8, math-23, complex-math-3, complex-math-9, complex-math-13, complex-math-22, complex-math-26, complex-math-29, complex-math-31, complex-math-32, complex-math-34, decimal-2, decimal-4, decimal-6, decimal-7, decimal-8, round-10

  // Basic Numbers (from numbersExamples)
  {
    id: 'num-1',
    title: 'Number Equality',
    expression: '1 == 1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if numbers are equal',
    category: 'mathematical-operations'
  },
  {
    id: 'num-2',
    title: 'Number Addition',
    expression: '1 + 2 == 3',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Add two numbers and check result',
    category: 'mathematical-operations'
  },
  {
    id: 'num-3',
    title: 'Mathematical Expression',
    expression: '3 + 4 * 2',
    sampleInput: '{}',
    expectedOutput: '11',
    description: 'Complex mathematical expression with order of operations',
    category: 'mathematical-operations'
  },
  {
    id: 'num-4',
    title: 'Absolute Value',
    expression: 'abs(-5)',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Get absolute value of negative number',
    category: 'mathematical-operations'
  },
  {
    id: 'num-5',
    title: 'Power Operation',
    expression: '2 ^ 3',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Calculate power (2 to the power of 3)',
    category: 'mathematical-operations'
  },
  {
    id: 'num-6',
    title: 'Modulo Operation',
    expression: '10 % 3',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Calculate remainder using modulo operator',
    category: 'mathematical-operations'
  },

  // Mathematical Operations (from mathematicalExamples)
  {
    id: 'math-1',
    title: 'Simple Addition',
    expression: '5 + 3',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Add two numbers',
    category: 'mathematical-operations'
  },
  {
    id: 'math-2',
    title: 'Simple Subtraction',
    expression: '10 - 4',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Subtract two numbers',
    category: 'mathematical-operations'
  },
  {
    id: 'math-3',
    title: 'Simple Multiplication',
    expression: '6 * 7',
    sampleInput: '{}',
    expectedOutput: '42',
    description: 'Multiply two numbers',
    category: 'mathematical-operations'
  },
  {
    id: 'math-4',
    title: 'Simple Division',
    expression: '15 / 3',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Divide two numbers',
    category: 'mathematical-operations'
  },
  {
    id: 'math-5',
    title: 'Variable Addition',
    expression: 'a + b',
    sampleInput: '{"a": 8, "b": 12}',
    expectedOutput: '20',
    description: 'Add two variables',
    category: 'mathematical-operations'
  },
  {
    id: 'math-6',
    title: 'Variable Multiplication',
    expression: 'x * y',
    sampleInput: '{"x": 4, "y": 9}',
    expectedOutput: '36',
    description: 'Multiply two variables',
    category: 'mathematical-operations'
  },
  {
    id: 'math-7',
    title: 'Square Root',
    expression: "(16) ^ 0.5",
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Calculate square root of 16',
    category: 'mathematical-operations'
  },
  {
    id: 'math-8',
    title: 'Power Operation',
    expression: "(3) ^ (2)",
    sampleInput: '{}',
    expectedOutput: '9',
    description: 'Calculate 3 to the power of 2',
    category: 'mathematical-operations'
  },
  {
    id: 'math-9',
    title: 'Absolute Value Positive',
    expression: 'abs(7)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Absolute value of positive number',
    category: 'mathematical-operations'
  },
  {
    id: 'math-10',
    title: 'Absolute Value Negative',
    expression: 'abs(-7)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Absolute value of negative number',
    category: 'mathematical-operations'
  },
  {
    id: 'math-11',
    title: 'Modulo Remainder',
    expression: '17 % 5',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Calculate remainder of 17 divided by 5',
    category: 'mathematical-operations'
  },
  {
    id: 'math-12',
    title: 'Even Number Check',
    expression: '8 % 2 == 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if number is even using modulo',
    category: 'mathematical-operations'
  },
  {
    id: 'math-13',
    title: 'Odd Number Check',
    expression: '7 % 2 == 1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if number is odd using modulo',
    category: 'mathematical-operations'
  },
  {
    id: 'math-14',
    title: 'Negative Power',
    expression: '2 ^ -2',
    sampleInput: '{}',
    expectedOutput: '0.25',
    description: 'Calculate negative power (1/4)',
    category: 'mathematical-operations'
  },
  {
    id: 'math-15',
    title: 'Fractional Power',
    expression: '9 ^ 0.5',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Calculate fractional power (square root)',
    category: 'mathematical-operations'
  },
  {
    id: 'math-16',
    title: 'Complex Expression',
    expression: '(5 + 3) * 2 - 4 / 2',
    sampleInput: '{}',
    expectedOutput: '14',
    description: 'Complex expression with multiple operations',
    category: 'mathematical-operations'
  },
  {
    id: 'math-17',
    title: 'Nested Parentheses',
    expression: '((2 + 3) * (4 - 1)) / 3',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Expression with nested parentheses',
    category: 'mathematical-operations'
  },
  {
    id: 'math-18',
    title: 'Power of Power',
    expression: '2 ^ (3 ^ 2)',
    sampleInput: '{}',
    expectedOutput: '512',
    description: 'Calculate power of power (2^9)',
    category: 'mathematical-operations'
  },
  {
    id: 'math-19',
    title: 'Multiple Modulo',
    expression: '(15 % 7) % 3',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Chain modulo operations',
    category: 'mathematical-operations'
  },
  {
    id: 'math-20',
    title: 'Division with Remainder',
    expression: '22 / 7',
    sampleInput: '{}',
    expectedOutput: '3.142857142857143',
    description: 'Division resulting in decimal',
    category: 'mathematical-operations'
  },
  {
    id: 'math-21',
    title: 'Zero Power',
    expression: '5 ^ 0',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Any number to the power of 0 equals 1',
    category: 'mathematical-operations'
  },
  {
    id: 'math-22',
    title: 'Power of One',
    expression: '1 ^ 100',
    sampleInput: '{}',
    expectedOutput: '1',
    description: '1 to any power equals 1',
    category: 'mathematical-operations'
  },
  {
    id: 'math-23',
    title: 'Square Root of a Squared Number',
    expression: "(5 ^ 2) ^ 0.5",
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Square root of a squared number',
    category: 'mathematical-operations'
  },
  {
    id: 'math-24',
    title: 'Absolute of Expression',
    expression: 'abs(3 - 8)',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Absolute value of expression result',
    category: 'mathematical-operations'
  },
  {
    id: 'math-25',
    title: 'Modulo with Variables',
    expression: 'x % y',
    sampleInput: '{"x": 13, "y": 4}',
    expectedOutput: '1',
    description: 'Modulo operation with variables',
    category: 'mathematical-operations'
  },
  {
    id: 'math-26',
    title: 'Power with Variables',
    expression: 'base ^ exponent',
    sampleInput: '{"base": 3, "exponent": 4}',
    expectedOutput: '81',
    description: 'Power operation with variables',
    category: 'mathematical-operations'
  },
  {
    id: 'math-27',
    title: 'Complex Variable Expression',
    expression: '(a + b) * c - d / e',
    sampleInput: '{"a": 2, "b": 3, "c": 4, "d": 10, "e": 2}',
    expectedOutput: '15',
    description: 'Complex expression with multiple variables',
    category: 'mathematical-operations'
  },

  // Complex Mathematical Expressions (from complex_mathExamples)
  {
    id: 'complex-math-1',
    title: 'Multi-step Calculation',
    expression: '(10 + 5) * 2 - 8 / 4',
    sampleInput: '{}',
    expectedOutput: '28',
    description: 'Complex calculation with multiple operations and parentheses',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-2',
    title: 'Nested Parentheses Expression',
    expression: '((3 + 2) * (4 - 1)) + (6 / 2)',
    sampleInput: '{}',
    expectedOutput: '18',
    description: 'Expression with multiple levels of nested parentheses',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-3',
    title: 'Combination of Square Root and Power Operations',
    expression: "(16) ^ 0.5 * 2",
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Combination of square root and power operations',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-4',
    title: 'Modulo in Complex Expression',
    expression: '(15 % 4) * 3 + 7',
    sampleInput: '{}',
    expectedOutput: '16',
    description: 'Modulo operation within larger expression',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-5',
    title: 'Absolute Value in Expression',
    expression: 'abs(-5 + 2) * 4',
    sampleInput: '{}',
    expectedOutput: '12',
    description: 'Absolute value of sub-expression',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-6',
    title: 'Chained Power Operations',
    expression: '2 ^ 3 ^ 2',
    sampleInput: '{}',
    expectedOutput: '512',
    description: 'Right-associative power operations (2^(3^2) = 2^9)',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-7',
    title: 'Mixed Arithmetic with Precedence',
    expression: '5 + 3 * 2 ^ 2 - 4 / 2',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Expression testing operator precedence rules',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-8',
    title: 'Parentheses Override Precedence',
    expression: '(5 + 3) * (2 ^ 2) - (4 / 2)',
    sampleInput: '{}',
    expectedOutput: '30',
    description: 'Parentheses changing natural operator precedence',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-9',
    title: 'Nested Square Root Operations',
    expression: 'sqrt(sqrt(16))',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Nested square root operations',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-10',
    title: 'Complex Modulo Chain',
    expression: '((20 % 7) + 3) % 5',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Chained modulo operations with addition',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-11',
    title: 'Power of Absolute Value',
    expression: 'abs(-3) ^ 2',
    sampleInput: '{}',
    expectedOutput: '9',
    description: 'Power of absolute value result',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-12',
    title: 'Absolute of Power',
    expression: 'abs((-2) ^ 3)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Absolute value of power result',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-13',
    title: 'Square Root of Sum',
    expression: "(5 ^ 2 + 12 ^ 2) ^ 0.5",
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Square root of sum (Pythagorean theorem)',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-14',
    title: 'Fractional Exponents',
    expression: '8 ^ (1/3)',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Cube root using fractional exponent',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-15',
    title: 'Negative Base with Even Power',
    expression: '(-3) ^ 2',
    sampleInput: '{}',
    expectedOutput: '9',
    description: 'Negative number raised to even power',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-16',
    title: 'Negative Base with Odd Power',
    expression: '(-3) ^ 3',
    sampleInput: '{}',
    expectedOutput: '-27',
    description: 'Negative number raised to odd power',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-17',
    title: 'Division by Power Result',
    expression: '100 / (2 ^ 2)',
    sampleInput: '{}',
    expectedOutput: '25',
    description: 'Division by result of power operation',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-18',
    title: 'Modulo of Large Numbers',
    expression: '1000 % 37',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Modulo operation with larger numbers',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-19',
    title: 'Power Chain with Parentheses',
    expression: '(2 ^ 3) ^ 2',
    sampleInput: '{}',
    expectedOutput: '64',
    description: 'Power of power result with parentheses',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-20',
    title: 'Mixed Operations with Variables',
    expression: '(a + b) ^ 2 - 4 * a * b',
    sampleInput: '{"a": 3, "b": 4}',
    expectedOutput: '1',
    description: 'Complex algebraic expression with variables',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-21',
    title: 'Absolute Difference',
    expression: 'abs(x - y)',
    sampleInput: '{"x": 5, "y": 12}',
    expectedOutput: '7',
    description: 'Absolute difference between two variables',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-22',
    title: 'Distance Formula',
    expression: "((x2 - x1) ^ 0.5 ^ 2 + (y2 - y1) ^ 2)",
    sampleInput: '{"x1": 0, "y1": 0, "x2": 3, "y2": 4}',
    expectedOutput: '5',
    description: 'Distance formula between two points',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-23',
    title: 'Quadratic Expression',
    expression: 'a * x ^ 2 + b * x + c',
    sampleInput: '{"a": 2, "b": -3, "c": 1, "x": 2}',
    expectedOutput: '3',
    description: 'Quadratic polynomial evaluation',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-24',
    title: 'Compound Interest Formula',
    expression: 'P * (1 + r) ^ t',
    sampleInput: '{"P": 1000, "r": 0.05, "t": 3}',
    expectedOutput: '1157.625',
    description: 'Compound interest calculation',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-25',
    title: 'Factorial Approximation',
    expression: '1 * 2 * 3 * 4 * 5',
    sampleInput: '{}',
    expectedOutput: '120',
    description: 'Manual factorial calculation (5!)',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-26',
    title: 'Geometric Mean',
    expression: "(a * b) ^ 0.5",
    sampleInput: '{"a": 4, "b": 9}',
    expectedOutput: '6',
    description: 'Geometric mean of two numbers',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-27',
    title: 'Percentage Calculation',
    expression: '(part / whole) * 100',
    sampleInput: '{"part": 25, "whole": 80}',
    expectedOutput: '31.25',
    description: 'Calculate percentage',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-28',
    title: 'Circle Area',
    expression: 'pi * r ^ 2',
    sampleInput: '{"pi": 3.14159, "r": 5}',
    expectedOutput: '78.53975',
    description: 'Calculate area of circle',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-29',
    title: 'Temperature Conversion',
    expression: '(F - 32) * 5 / 9',
    sampleInput: '{"F": 100}',
    expectedOutput: '37.77777777777778',
    description: 'Convert Fahrenheit to Celsius',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-30',
    title: 'Change of Base Formula',
    expression: 'log(x) / log(10)',
    sampleInput: '{"x": 100}',
    expectedOutput: '2',
    description: 'Change of base formula for logarithms',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-31',
    title: 'Standard Deviation Calculation',
    expression: 'round((sum(map(numbers, (#- avg(numbers)) ^ 2)) / len(numbers)) ^ 0.5 * 100) / 100',
    sampleInput: '{"numbers": [1, 2, 2, 3, 4, 4, 4, 5]}',
    expectedOutput: '1.36',
    description: 'Standard deviation calculation component',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-32',
    title: 'Exponential Growth',
    expression: 'initial * e ^ (rate * time)',
    sampleInput: '{"initial": 100, "e": 2.71828, "rate": 0.1, "time": 5}',
    expectedOutput: '164.872',
    description: 'Exponential growth formula',
    category: 'mathematical-operations'
  },
  {
    id: 'complex-math-33',
    title: 'Complex Nested Mathematical Expression',
    expression: "((2 + 3) * (4 - 1)) + (6 / 2) + (16) ^ 0.5",
    sampleInput: '{}',
    expectedOutput: '20',
    description: 'Complex nested mathematical expression',
    category: 'mathematical-operations'
  },

  // Decimal Precision (from decimal_precisionExamples)
  {
    id: 'decimal-1',
    title: 'Decimal Addition Precision',
    expression: '0.1 + 0.2 == 0.3',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Floating point precision issue with decimal addition',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-2',
    title: 'Using Precision Function',
    expression: 'round(0.1 + 0.2, 10)',
    sampleInput: '{}',
    expectedOutput: '0.3',
    description: 'Using precision function for accurate decimal arithmetic',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-3',
    title: 'Decimal Multiplication',
    expression: '0.1 * 3',
    sampleInput: '{}',
    expectedOutput: '0.30000000000000004',
    description: 'Floating point precision in multiplication',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-4',
    title: 'Precise Decimal Multiplication',
    expression: 'round(0.1 * 3, 10)',
    sampleInput: '{}',
    expectedOutput: '0.3',
    description: 'Precise decimal multiplication with rounding',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-5',
    title: 'Decimal Division',
    expression: '1 / 3',
    sampleInput: '{}',
    expectedOutput: '0.3333333333333333',
    description: 'Division resulting in repeating decimal',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-6',
    title: 'Division with Specified Decimal Precision',
    expression: 'round(1 / 3, 4)',
    sampleInput: '{}',
    expectedOutput: '0.3333',
    description: 'Division with specified decimal precision',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-7',
    title: 'Complex Expression with Decimal Precision Control',
    expression: 'round((0.1 + 0.2) * 3, 10)',
    sampleInput: '{}',
    expectedOutput: '0.45',
    description: 'Complex expression with decimal precision control',
    category: 'mathematical-operations'
  },
  {
    id: 'decimal-8',
    title: 'Financial Calculation',
    expression: 'round(21.59, 2)',
    sampleInput: '{}',
    expectedOutput: '21.59',
    description: 'Financial calculation with 2 decimal places',
    category: 'mathematical-operations'
  },

  // Rounding Functions (from roundingExamples)
  {
    id: 'round-1',
    title: 'Basic Rounding',
    expression: 'round(3.7)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Round to nearest integer',
    category: 'mathematical-operations'
  },
  {
    id: 'round-2',
    title: 'Round Down',
    expression: 'round(3.2)',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Round down to nearest integer',
    category: 'mathematical-operations'
  },
  {
    id: 'round-3',
    title: 'Floor Function',
    expression: 'floor(3.9)',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Floor function always rounds down',
    category: 'mathematical-operations'
  },
  {
    id: 'round-4',
    title: 'Ceiling Function',
    expression: 'ceil(3.1)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Ceiling function always rounds up',
    category: 'mathematical-operations'
  },
  {
    id: 'round-5',
    title: 'Round with Precision',
    expression: 'round(3.14159, 2)',
    sampleInput: '{}',
    expectedOutput: '3.14',
    description: 'Round to specified decimal places',
    category: 'mathematical-operations'
  },
  {
    id: 'round-6',
    title: 'Floor with Negative',
    expression: 'floor(-2.3)',
    sampleInput: '{}',
    expectedOutput: '-3',
    description: 'Floor of negative number',
    category: 'mathematical-operations'
  },
  {
    id: 'round-7',
    title: 'Ceiling with Negative',
    expression: 'ceil(-2.7)',
    sampleInput: '{}',
    expectedOutput: '-2',
    description: 'Ceiling of negative number',
    category: 'mathematical-operations'
  },
  {
    id: 'round-8',
    title: 'Round Negative with Precision',
    expression: 'round(-3.14159, 3)',
    sampleInput: '{}',
    expectedOutput: '-3.142',
    description: 'Round negative number to 3 decimal places',
    category: 'mathematical-operations'
  },
  {
    id: 'round-9',
    title: 'Round to Tens',
    expression: "round(1234)",
    sampleInput: '{}',
    expectedOutput: '1230',
    description: 'Round to nearest ten using negative precision',
    category: 'mathematical-operations'
  },
  {
    id: 'round-10',
    title: 'Round Result of Complex Expression',
    expression: "round((5 ^ 2 + 12 ^ 2) ^ 0.5)",
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Round result of complex expression',
    category: 'mathematical-operations'
  },

  // EXTREME COMPLEX FINANCIAL EXAMPLES
  {
    id: 'extreme-finance-1',
    title: 'Multi-Currency Portfolio Risk Analysis',
    expression: "map(portfolios, {owner: #.owner, status: "analyzed"})",
    sampleInput: '{"portfolios": [{"owner": "John Doe", "holdings": [{"asset": "AAPL", "amount": 100, "price_usd": 150.25, "currency": "USD", "volatility": 0.25}, {"asset": "TSLA", "amount": 50, "price_usd": 180.50, "currency": "USD", "volatility": 0.45}, {"asset": "ASML", "amount": 25, "price_usd": 620.75, "currency": "EUR", "volatility": 0.35}]}]}',
    expectedOutput: '[{"owner": "John Doe", "total_value_usd": 39550.75, "currency_exposure": [{"currency": "USD", "amount": 24050.0, "percentage": 61}, {"currency": "EUR", "amount": 15518.75, "percentage": 39}], "risk_score": 0.33}]',
    description: 'Analyze multi-currency portfolio exposure and calculate weighted risk scores',
    category: 'extreme-finance'
  },
  {
    id: 'extreme-finance-2',
    title: 'Complex Options Chain Analysis',
    expression: "map(options_chains, {symbol: #.symbol, status: "analyzed"})",
    sampleInput: '{"options_chains": [{"symbol": "AAPL", "expiry": "2024-01-19", "spot_price": 150.25, "contracts": [{"type": "call", "strike": 145, "implied_volatility": 0.28, "volume": 1250}, {"type": "call", "strike": 155, "implied_volatility": 0.32, "volume": 890}, {"type": "put", "strike": 145, "implied_volatility": 0.30, "volume": 760}, {"type": "put", "strike": 155, "implied_volatility": 0.35, "volume": 1100}]}]}',
    expectedOutput: '[{"symbol": "AAPL", "expiry": "2024-01-19", "calls": {"count": 2, "itm": 1, "avg_iv": 30}, "puts": {"count": 2, "itm": 1, "avg_iv": 33}, "max_pain": 150.25}]',
    description: 'Analyze complex options chains with in-the-money calculations and implied volatility',
    category: 'extreme-finance'
  }
]; 