// Real examples extracted from Zen Engine datasets
const realExamples = [
  // Boolean operations
  {
    id: 'bool-1',
    title: 'Boolean AND Operation',
    expression: 'true and false',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Boolean AND logic operation',
    category: 'boolean'
  },
  {
    id: 'bool-2', 
    title: 'Boolean OR Operation',
    expression: 'true or false',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Boolean OR logic operation',
    category: 'boolean'
  },
  {
    id: 'bool-3',
    title: 'Boolean NOT Operation',
    expression: 'not true',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Boolean NOT logic operation',
    category: 'boolean'
  },
  {
    id: 'bool-4',
    title: 'Variable Boolean Check',
    expression: 'x == true',
    sampleInput: '{ "x": true }',
    expectedOutput: 'true',
    description: 'Check if variable equals true',
    category: 'boolean'
  },

  // Numbers and arithmetic
  {
    id: 'num-1',
    title: 'Number Equality',
    expression: '1 == 1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if numbers are equal',
    category: 'numbers'
  },
  {
    id: 'num-2',
    title: 'Number Addition',
    expression: '1 + 2 == 3',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Add two numbers and check result',
    category: 'numbers'
  },
  {
    id: 'num-3',
    title: 'Mathematical Expression',
    expression: '3 + 4 * 2',
    sampleInput: '{}',
    expectedOutput: '11',
    description: 'Complex mathematical expression with order of operations',
    category: 'numbers'
  },
  {
    id: 'num-4',
    title: 'Absolute Value',
    expression: 'abs(-5)',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Get absolute value of negative number',
    category: 'numbers'
  },
  {
    id: 'num-5',
    title: 'Power Operation',
    expression: '2 ^ 3 == 8',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Raise number to power and check result',
    category: 'numbers'
  },
  {
    id: 'num-6',
    title: 'Modulo Operation',
    expression: '5 % 2 == 1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Get remainder from division',
    category: 'numbers'
  },

  // String operations
  {
    id: 'str-1',
    title: 'String Concatenation',
    expression: "'hello' + \" \" + \"world\"",
    sampleInput: '{}',
    expectedOutput: "'hello world'",
    description: 'Concatenate multiple strings',
    category: 'string'
  },
  {
    id: 'str-2',
    title: 'String Length',
    expression: 'len("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Get length of string',
    category: 'string'
  },
  {
    id: 'str-3',
    title: 'String to Uppercase',
    expression: 'upper("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Convert string to uppercase',
    category: 'string'
  },
  {
    id: 'str-4',
    title: 'String to Lowercase',
    expression: 'lower("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"hello, world!"',
    description: 'Convert string to lowercase',
    category: 'string'
  },
  {
    id: 'str-5',
    title: 'String Trim',
    expression: 'trim("  HELLO, WORLD!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Remove leading and trailing whitespace',
    category: 'string'
  },
  {
    id: 'str-6',
    title: 'String Contains',
    expression: 'contains("Hello, World!", "lo")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string contains substring',
    category: 'string'
  },
  {
    id: 'str-7',
    title: 'String Starts With',
    expression: 'startsWith("Hello, World!", "Hello")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string starts with prefix',
    category: 'string'
  },
  {
    id: 'str-8',
    title: 'String Ends With',
    expression: 'endsWith("Hello, World!", "World!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string ends with suffix',
    category: 'string'
  },
  {
    id: 'str-9',
    title: 'String Pattern Matching',
    expression: 'matches("Hello, World!", "H[a-z]+, W[a-z]+!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string matches regex pattern',
    category: 'string'
  },
  {
    id: 'str-10',
    title: 'Phone Number Validation',
    expression: 'matches("123-456-7890", "[0-9]{3}-[0-9]{3}-[0-9]{4}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate phone number format with regex',
    category: 'string'
  },
  {
    id: 'str-11',
    title: 'Date Extraction',
    expression: 'extract("2022-09-18", "(\\d{4})-(\\d{2})-(\\d{2})")',
    sampleInput: '{}',
    expectedOutput: '["2022-09-18", "2022", "09", "18"]',
    description: 'Extract date parts using regex groups',
    category: 'string'
  },
  {
    id: 'str-12',
    title: 'String Split',
    expression: 'split("hello1,hello2,hello3", ",")',
    sampleInput: '{}',
    expectedOutput: "['hello1', 'hello2', 'hello3']",
    description: 'Split string by delimiter',
    category: 'string'
  },
  {
    id: 'str-13',
    title: 'Split and Convert',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert to numbers',
    category: 'string'
  },

  // Template strings
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

  // String slicing
  {
    id: 'slice-1',
    title: 'String Slice Start',
    expression: 'string[0:5]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'sample'",
    description: 'Extract substring from start',
    category: 'slice'
  },
  {
    id: 'slice-2',
    title: 'String Slice End',
    expression: 'string[7:12]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'string'",
    description: 'Extract substring from middle to end',
    category: 'slice'
  },
  {
    id: 'slice-3',
    title: 'String Slice From Index',
    expression: 'string[7:]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'string'",
    description: 'Extract substring from index to end',
    category: 'slice'
  },
  {
    id: 'slice-4',
    title: 'String Slice To Index',
    expression: 'string[:5]',
    sampleInput: '{"string": "sample_string"}',
    expectedOutput: "'sample'",
    description: 'Extract substring from start to index',
    category: 'slice'
  },

  // Array operations
  {
    id: 'array-1',
    title: 'Array Length',
    expression: 'len([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Get length of array',
    category: 'array'
  },
  {
    id: 'array-2',
    title: 'Array Sum',
    expression: 'sum([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Calculate sum of array elements',
    category: 'array'
  },
  {
    id: 'array-3',
    title: 'Array Average',
    expression: 'avg([10, 20, 30])',
    sampleInput: '{}',
    expectedOutput: '20',
    description: 'Calculate average of array elements',
    category: 'array'
  },
  {
    id: 'array-4',
    title: 'Array Minimum',
    expression: 'min([5, 8, 2, 11, 7])',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Find minimum value in array',
    category: 'array'
  },
  {
    id: 'array-5',
    title: 'Array Maximum',
    expression: 'max([5, 8, 2, 11, 7])',
    sampleInput: '{}',
    expectedOutput: '11',
    description: 'Find maximum value in array',
    category: 'array'
  },
  {
    id: 'array-6',
    title: 'Array Contains',
    expression: 'contains([1, 2, 3, 4, 5], 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if array contains element',
    category: 'array'
  },
  {
    id: 'array-7',
    title: 'Array Filter',
    expression: 'filter([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: '[4, 5]',
    description: 'Filter array elements by condition',
    category: 'array'
  },
  {
    id: 'array-8',
    title: 'Array Map',
    expression: 'map([1, 2, 3, 4, 5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[2, 4, 6, 8, 10]',
    description: 'Transform each array element',
    category: 'array'
  },
  {
    id: 'array-9',
    title: 'Array Some',
    expression: 'some([1, 2, 3, 4, 5], # > 3)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if some elements match condition',
    category: 'array'
  },
  {
    id: 'array-10',
    title: 'Array Count',
    expression: 'count([1, 2, 3, 4, 5, 2], # == 2)',
    sampleInput: '{}',
    expectedOutput: '2',
    description: 'Count elements matching condition',
    category: 'array'
  },
  {
    id: 'array-11',
    title: 'Array Keys',
    expression: 'keys([10, 11, 12])',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2]',
    description: 'Get array indices as keys',
    category: 'array'
  },

  // Object operations
  {
    id: 'obj-1',
    title: 'Property Access',
    expression: 'user.address.city',
    sampleInput: '{"user": {"address": {"city": "New York"}}}',
    expectedOutput: '"New York"',
    description: 'Access nested object property',
    category: 'object'
  },
  {
    id: 'obj-2',
    title: 'Array Index Access',
    expression: 'user.contacts[0].phone',
    sampleInput: '{"user": {"contacts": [{"phone": "123-456-7890"}]}}',
    expectedOutput: '"123-456-7890"',
    description: 'Access array element property',
    category: 'object'
  },
  {
    id: 'obj-3',
    title: 'Object Keys',
    expression: 'keys(customer)',
    sampleInput: '{"customer": {"firstName": "John"}}',
    expectedOutput: '["firstName"]',
    description: 'Get object property keys',
    category: 'object'
  },
  {
    id: 'obj-4',
    title: 'Object Values',
    expression: 'values(customer)',
    sampleInput: '{"customer": {"firstName": "John"}}',
    expectedOutput: '["John"]',
    description: 'Get object property values',
    category: 'object'
  },
  {
    id: 'obj-5',
    title: 'Array Index Check',
    expression: 'data.items[0] == "a"',
    sampleInput: '{"data": {"items": ["a", "b", "c"]}}',
    expectedOutput: 'true',
    description: 'Check array element value',
    category: 'object'
  },
  {
    id: 'obj-6',
    title: 'Sum Object Values',
    expression: 'sum(values({a: 1, b: 2, c: 3}))',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Sum all values in an object',
    category: 'object'
  },
  {
    id: 'obj-7',
    title: 'Dynamic Key Creation',
    expression: 'keys({[`dynamic-${"key"}`]: 123})',
    sampleInput: '{}',
    expectedOutput: '["dynamic-key"]',
    description: 'Create object with dynamic key',
    category: 'object'
  },
  {
    id: 'obj-8',
    title: 'Check Values Contains',
    expression: 'contains(values({a: 1, b: 2, c: 3}), 2)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if object values contain a specific value',
    category: 'object'
  },

  // Conditional operations
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

  // Type conversions
  {
    id: 'type-1',
    title: 'Number to String',
    expression: 'string(123)',
    sampleInput: '{}',
    expectedOutput: '"123"',
    description: 'Convert number to string',
    category: 'conversion'
  },
  {
    id: 'type-2',
    title: 'String to Number',
    expression: 'number("123.45")',
    sampleInput: '{}',
    expectedOutput: '123.45',
    description: 'Convert string to number',
    category: 'conversion'
  },
  {
    id: 'type-3',
    title: 'Boolean to Number',
    expression: 'number(true)',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Convert boolean to number',
    category: 'conversion'
  },
  {
    id: 'type-4',
    title: 'String to Boolean',
    expression: 'bool("true")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Convert string to boolean',
    category: 'conversion'
  },

  // Date operations
  {
    id: 'date-1',
    title: 'Date Creation',
    expression: 'd("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Create date from string',
    category: 'date'
  },
  {
    id: 'date-2',
    title: 'Date Addition',
    expression: 'd("2023-10-15").add("1d")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16T00:00:00Z"',
    description: 'Add one day to date',
    category: 'date'
  },
  {
    id: 'date-3',
    title: 'Date Comparison',
    expression: 'd("2023-10-15").isBefore(d("2023-10-16"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare two dates',
    category: 'date'
  },
  {
    id: 'date-4',
    title: 'Date Year',
    expression: 'd("2023-10-15").year()',
    sampleInput: '{}',
    expectedOutput: '2023',
    description: 'Extract year from date',
    category: 'date'
  },
  {
    id: 'date-5',
    title: 'Date Month',
    expression: 'd("2023-10-15").month()',
    sampleInput: '{}',
    expectedOutput: '10',
    description: 'Extract month from date',
    category: 'date'
  },
  {
    id: 'date-6',
    title: 'Date Day',
    expression: 'd("2023-10-15").day()',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Extract day from date',
    category: 'date'
  },
  {
    id: 'date-7',
    title: 'Date Formatting',
    expression: 'd("2023-10-15").format("%Y-%m-%d")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15"',
    description: 'Format date as string',
    category: 'date'
  },
  {
    id: 'date-8',
    title: 'Date Validation - Valid',
    expression: 'd("2023-10-15").isValid()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date string is valid',
    category: 'date'
  },
  {
    id: 'date-9',
    title: 'Date Validation - Invalid',
    expression: 'd("2023-13-01").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check invalid date (month 13)',
    category: 'date'
  },
  {
    id: 'date-10',
    title: 'Date Set Month',
    expression: 'd("2023-10-15").set("month", 5)',
    sampleInput: '{}',
    expectedOutput: '"2023-05-15T00:00:00Z"',
    description: 'Set month of existing date',
    category: 'date'
  },
  {
    id: 'date-11',
    title: 'Start of Month',
    expression: 'd("2023-10-15").startOf("month")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-01T00:00:00Z"',
    description: 'Get first day of month',
    category: 'date'
  },
  {
    id: 'date-12',
    title: 'End of Month',
    expression: 'd("2023-10-15").endOf("month")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-31T23:59:59Z"',
    description: 'Get last moment of month',
    category: 'date'
  },
  {
    id: 'date-13',
    title: 'Date Difference',
    expression: 'd("2023-10-15").diff(d("2023-09-15"), "month")',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Calculate difference between dates in months',
    category: 'date'
  },
  {
    id: 'date-14',
    title: 'Month Comparison',
    expression: 'd("2025-02-15").isSame(d("2025-02-28"), "month")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two dates are in same month',
    category: 'date'
  },

  // Null handling
  {
    id: 'null-1',
    title: 'Nullish Coalescing',
    expression: 'null ?? "hello"',
    sampleInput: '{}',
    expectedOutput: '"hello"',
    description: 'Return right side if left is null',
    category: 'null'
  },
  {
    id: 'null-2',
    title: 'User Name Default',
    expression: 'user.name ?? "Guest"',
    sampleInput: '{"user": {"name": "John"}}',
    expectedOutput: '"John"',
    description: 'Use existing value or default',
    category: 'null'
  },
  {
    id: 'null-3',
    title: 'Missing Property Default',
    expression: 'user.name ?? "Guest"',
    sampleInput: '{"user": {}}',
    expectedOutput: '"Guest"',
    description: 'Use default when property missing',
    category: 'null'
  },

  // Complex expressions
  {
    id: 'complex-1',
    title: 'Chained Array Operations',
    expression: 'map(filter([1, 2, 3, 4, 5], # > 2), # * 2)',
    sampleInput: '{}',
    expectedOutput: '[6, 8, 10]',
    description: 'Filter then map array elements',
    category: 'complex'
  },
  {
    id: 'complex-2',
    title: 'Object Array Mapping',
    expression: 'map([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id)',
    sampleInput: '{}',
    expectedOutput: '[1, 2]',
    description: 'Extract property from object array',
    category: 'complex'
  },
  {
    id: 'complex-3',
    title: 'Data Transformation',
    expression: 'map(items, {id: #.id, fullName: #.firstName + " " + #.lastName})',
    sampleInput: '{"items": [{"id": 1, "firstName": "John", "lastName": "Doe"}, {"id": 2, "firstName": "Jane", "lastName": "Smith"}]}',
    expectedOutput: '[{"id": 1, "fullName": "John Doe"}, {"id": 2, "fullName": "Jane Smith"}]',
    description: 'Transform object array to new structure',
    category: 'complex'
  },
  {
    id: 'complex-4',
    title: 'Statistical Calculation',
    expression: 'avg(map(items, #.price))',
    sampleInput: '{"items": [{"price": 10}, {"price": 20}, {"price": 30}]}',
    expectedOutput: '20',
    description: 'Calculate average price from object array',
    category: 'complex'
  },

  // Range operations
  {
    id: 'range-1',
    title: 'Range Mapping',
    expression: 'map([0..3], #)',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2, 3]',
    description: 'Map over inclusive range',
    category: 'range'
  },
  {
    id: 'range-2',
    title: 'Exclusive Range Start',
    expression: 'map((0..3], #)',
    sampleInput: '{}',
    expectedOutput: '[1, 2, 3]',
    description: 'Map over range excluding start',
    category: 'range'
  },
  {
    id: 'range-3',
    title: 'Exclusive Range End',
    expression: 'map([0..3), #)',
    sampleInput: '{}',
    expectedOutput: '[0, 1, 2]',
    description: 'Map over range excluding end',
    category: 'range'
  },
  {
    id: 'range-4',
    title: 'Range Multiplication',
    expression: 'map([0..5], # * 2)',
    sampleInput: '{}',
    expectedOutput: '[0, 2, 4, 6, 8, 10]',
    description: 'Multiply each number in range by 2',
    category: 'range'
  },

  // Advanced Array Methods
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

  // Mathematical Functions
  {
    id: 'math-1',
    title: 'Floor Function',
    expression: 'floor(4.8)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Round down to nearest integer',
    category: 'mathematical'
  },
  {
    id: 'math-2',
    title: 'Ceiling Function', 
    expression: 'ceil(4.1)',
    sampleInput: '{}',
    expectedOutput: '5',
    description: 'Round up to nearest integer',
    category: 'mathematical'
  },
  {
    id: 'math-3',
    title: 'Basic Rounding',
    expression: 'round(3.5)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Round to nearest integer',
    category: 'mathematical'
  },
  {
    id: 'math-4',
    title: 'Floor Comparison',
    expression: 'floor(8.9) == 8',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Floor function in comparison',
    category: 'mathematical'
  },
  {
    id: 'math-5',
    title: 'Ceiling Comparison',
    expression: 'ceil(8.1) == 9',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Ceiling function in comparison',
    category: 'mathematical'
  },
  {
    id: 'math-6',
    title: 'Round Comparison',
    expression: 'round(7.6) == 8',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Rounding function in comparison',
    category: 'mathematical'
  },
  {
    id: 'math-7',
    title: 'Round Down',
    expression: 'round(7.4)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Round 7.4 down to 7',
    category: 'mathematical'
  },
  {
    id: 'math-8',
    title: 'Round Up',
    expression: 'round(7.5)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Round 7.5 up to 8 (half-up rounding)',
    category: 'mathematical'
  },
  {
    id: 'math-9',
    title: 'Round Up High',
    expression: 'round(7.6)',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Round 7.6 up to 8',
    category: 'mathematical'
  },
  {
    id: 'math-10',
    title: 'Round Negative Down',
    expression: 'round(-7.4)',
    sampleInput: '{}',
    expectedOutput: '-7',
    description: 'Round negative number toward zero',
    category: 'mathematical'
  },
  {
    id: 'math-11',
    title: 'Round Negative Half',
    expression: 'round(-7.5)',
    sampleInput: '{}',
    expectedOutput: '-8',
    description: 'Round negative half away from zero',
    category: 'mathematical'
  },
  {
    id: 'math-12',
    title: 'Round Negative Up',
    expression: 'round(-7.6)',
    sampleInput: '{}',
    expectedOutput: '-8',
    description: 'Round negative number away from zero',
    category: 'mathematical'
  },
  {
    id: 'math-13',
    title: 'Round with Zero Precision',
    expression: 'round(7.444, 0)',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Round to integer (0 decimal places)',
    category: 'mathematical'
  },
  {
    id: 'math-14',
    title: 'Round to 1 Decimal',
    expression: 'round(7.444, 1)',
    sampleInput: '{}',
    expectedOutput: '7.4',
    description: 'Round to 1 decimal place',
    category: 'mathematical'
  },
  {
    id: 'math-15',
    title: 'Round to 2 Decimals',
    expression: 'round(7.444, 2)',
    sampleInput: '{}',
    expectedOutput: '7.44',
    description: 'Round to 2 decimal places',
    category: 'mathematical'
  },
  {
    id: 'math-16',
    title: 'Round Up with Precision',
    expression: 'round(7.555, 1)',
    sampleInput: '{}',
    expectedOutput: '7.6',
    description: 'Round up to 1 decimal place',
    category: 'mathematical'
  },
  {
    id: 'math-17',
    title: 'Round Up to 2 Decimals',
    expression: 'round(7.555, 2)',
    sampleInput: '{}',
    expectedOutput: '7.56',
    description: 'Round up to 2 decimal places',
    category: 'mathematical'
  },
  {
    id: 'math-18',
    title: 'Round Negative with Precision',
    expression: 'round(-7.444, 2)',
    sampleInput: '{}',
    expectedOutput: '-7.44',
    description: 'Round negative number to 2 decimal places',
    category: 'mathematical'
  },
  {
    id: 'math-19',
    title: 'Complex Mathematical Expression',
    expression: 'floor(8.9) + ceil(4.1) * 2',
    sampleInput: '{}',
    expectedOutput: '18',
    description: 'Complex expression: floor(8.9) + ceil(4.1) * 2 = 8 + 5 * 2 = 18',
    category: 'mathematical'
  },
  {
    id: 'math-20',
    title: 'Decimal Addition Precision',
    expression: '0.1 + 0.2 == 0.3',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal addition (0.1 + 0.2 = 0.3)',
    category: 'mathematical'
  },
  {
    id: 'math-21',
    title: 'Decimal Addition Result',
    expression: '0.1 + 0.2',
    sampleInput: '{}',
    expectedOutput: '0.3',
    description: 'Precise decimal addition result',
    category: 'mathematical'
  },
  {
    id: 'math-22',
    title: 'Decimal Multiplication Precision',
    expression: '0.1 * 0.2 == 0.02',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal multiplication',
    category: 'mathematical'
  },
  {
    id: 'math-23',
    title: 'Decimal Multiplication Result',
    expression: '0.1 * 0.2',
    sampleInput: '{}',
    expectedOutput: '0.02',
    description: 'Precise decimal multiplication result',
    category: 'mathematical'
  },
  {
    id: 'math-24',
    title: 'Decimal Subtraction Precision',
    expression: '0.3 - 0.1 == 0.2',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal subtraction',
    category: 'mathematical'
  },
  {
    id: 'math-25',
    title: 'Decimal Subtraction Result',
    expression: '0.3 - 0.1',
    sampleInput: '{}',
    expectedOutput: '0.2',
    description: 'Precise decimal subtraction result',
    category: 'mathematical'
  },
  {
    id: 'math-26',
    title: 'Decimal Division Precision',
    expression: '0.3 / 0.1 == 3.0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'High-precision decimal division',
    category: 'mathematical'
  },
  {
    id: 'math-27',
    title: 'Decimal Division Result',
    expression: '0.3 / 0.1',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Precise decimal division result',
    category: 'mathematical'
  },

  // Type Checking Functions
  {
    id: 'type-1',
    title: 'Check Numeric Float',
    expression: 'isNumeric(123.123)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if floating point number is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-2',
    title: 'Check Numeric Integer',
    expression: 'isNumeric(123)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if integer is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-3',
    title: 'Check Numeric String Float',
    expression: 'isNumeric("123.123")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string containing float is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-4',
    title: 'Check Numeric String Integer',
    expression: 'isNumeric("123")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string containing integer is numeric',
    category: 'type-checking'
  },
  {
    id: 'type-5',
    title: 'Check Non-Numeric String',
    expression: 'isNumeric("string")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if text string is numeric (returns false)',
    category: 'type-checking'
  },
  {
    id: 'type-6',
    title: 'Check Boolean Not Numeric',
    expression: 'isNumeric(true)',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if boolean is numeric (returns false)',
    category: 'type-checking'
  },
  {
    id: 'type-7',
    title: 'Detect String Type',
    expression: 'type("hello")',
    sampleInput: '{}',
    expectedOutput: '"string"',
    description: 'Detect type of string value',
    category: 'type-checking'
  },
  {
    id: 'type-8',
    title: 'Detect Number Type',
    expression: 'type(123)',
    sampleInput: '{}',
    expectedOutput: '"number"',
    description: 'Detect type of numeric value',
    category: 'type-checking'
  },
  {
    id: 'type-9',
    title: 'Detect Boolean Type',
    expression: 'type(true)',
    sampleInput: '{}',
    expectedOutput: '"bool"',
    description: 'Detect type of boolean value',
    category: 'type-checking'
  },
  {
    id: 'type-10',
    title: 'Detect Null Type',
    expression: 'type(null)',
    sampleInput: '{}',
    expectedOutput: '"null"',
    description: 'Detect type of null value',
    category: 'type-checking'
  },
  {
    id: 'type-11',
    title: 'Detect Array Type',
    expression: 'type([1, 2, 3])',
    sampleInput: '{}',
    expectedOutput: '"array"',
    description: 'Detect type of array value',
    category: 'type-checking'
  },

  // Advanced Date Operations
  {
    id: 'date-adv-1',
    title: 'Validate Null Date',
    expression: 'd(null).isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if null date is valid (returns false)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-2',
    title: 'Validate Invalid String',
    expression: 'd("foo").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if invalid date string is valid (returns false)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-3',
    title: 'Validate Invalid Month',
    expression: 'd("2023-13-01").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date with invalid month (13) is valid',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-4',
    title: 'Validate Invalid Day',
    expression: 'd("2023-02-30").isValid()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date with invalid day (Feb 30) is valid',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-5',
    title: 'Convert to New York Time',
    expression: 'd("2023-10-15T00:00:00Z").tz("America/New_York")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-14T20:00:00-04:00"',
    description: 'Convert UTC time to New York timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-6',
    title: 'Convert to London Time',
    expression: 'd("2023-10-15T00:00:00Z").tz("Europe/London")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T01:00:00+01:00"',
    description: 'Convert UTC time to London timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-7',
    title: 'Convert to UTC',
    expression: 'd("2023-10-15T00:00:00+00:00").tz("UTC")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Convert time to UTC timezone',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-8',
    title: 'Complex Timezone Conversion',
    expression: 'd("2023-10-15T12:00:00+02:00", "Etc/GMT-2").tz("UTC")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:00:00Z"',
    description: 'Convert from specific timezone to UTC',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-9',
    title: 'Check Yesterday',
    expression: 'd().sub(1, "d").isYesterday()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date minus 1 day is yesterday',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-10',
    title: 'Check Tomorrow',
    expression: 'd().add(1, "d").isTomorrow()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date plus 1 day is tomorrow',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-11',
    title: 'Check Is Today',
    expression: 'd("2023-10-15").isToday()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if specific date is today (context-dependent)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-12',
    title: 'Date Equality',
    expression: 'd("2023-10-15") == d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two identical dates are equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-13',
    title: 'Date Inequality',
    expression: 'd("2023-10-15") == d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if two different dates are equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-14',
    title: 'Date Not Equal',
    expression: 'd("2023-10-15") != d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two different dates are not equal',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-15',
    title: 'Date Less Than',
    expression: 'd("2023-10-15") < d("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if first date is before second date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-16',
    title: 'Date Less Than Equal',
    expression: 'd("2023-10-15") <= d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is less than or equal to same date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-17',
    title: 'Date Greater Than',
    expression: 'd("2023-10-16") > d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if first date is after second date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-18',
    title: 'Date Greater Than Equal',
    expression: 'd("2023-10-15") >= d("2023-10-15")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is greater than or equal to same date',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-19',
    title: 'Date Range Check',
    expression: 'd("2023-10-15") in [d("2023-10-01")..d("2023-10-31")]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is within a date range (October 2023)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-20',
    title: 'Same Day Check',
    expression: 'd().isSame(d(), "day")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if two dates are the same day',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-21',
    title: 'Start of Day',
    expression: 'd("2023-10-15").startOf("day")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00Z"',
    description: 'Get start of day (midnight)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-22',
    title: 'Start of Hour',
    expression: 'd("2023-10-15T10:30:45Z").startOf("hour")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:00:00Z"',
    description: 'Get start of current hour',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-23',
    title: 'End of Day',
    expression: 'd("2023-10-15").endOf("day")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T23:59:59Z"',
    description: 'Get end of day (23:59:59)',
    category: 'date-advanced'
  },
  {
    id: 'date-adv-24',
    title: 'End of Hour',
    expression: 'd("2023-10-15T10:30:45Z").endOf("hour")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:59:59Z"',
    description: 'Get end of current hour',
    category: 'date-advanced'
  },

  // Complex Mathematical Expressions
  {
    id: 'complex-math-1',
    title: 'Complex Order of Operations',
    expression: '(10 + 5) * 3 / 2 > 15',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (10 + 5) * 3 / 2 = 22.5 > 15',
    category: 'complex-math'
  },
  {
    id: 'complex-math-2',
    title: 'Division with Parentheses',
    expression: '(100 - 25) / (5 * 2) < 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (100 - 25) / (5 * 2) = 75 / 10 = 7.5 < 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-3',
    title: 'Division and Addition',
    expression: '1000 / (10 - 2) + 50 == 175',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 1000 / 8 + 50 = 125 + 50 = 175',
    category: 'complex-math'
  },
  {
    id: 'complex-math-4',
    title: 'Multiplication of Sums',
    expression: '(3 + 4) * (8 - 6) == 14',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: (3 + 4) * (8 - 6) = 7 * 2 = 14',
    category: 'complex-math'
  },
  {
    id: 'complex-math-5',
    title: 'Power Comparison',
    expression: '10^3 != 999',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Power expression: 10³ = 1000 ≠ 999',
    category: 'complex-math'
  },
  {
    id: 'complex-math-6',
    title: 'Power Division',
    expression: '1000 / 10^3 <= 1.1',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Power division: 1000 / 1000 = 1.0 ≤ 1.1',
    category: 'complex-math'
  },
  {
    id: 'complex-math-7',
    title: 'Absolute Value Comparison',
    expression: 'abs(-20) > 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Absolute value: |-20| = 20 > 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-8',
    title: 'Modulo Non-Zero',
    expression: '10 % 3 != 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Modulo operation: 10 % 3 = 1 ≠ 0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-9',
    title: 'Negative and Power',
    expression: '-8 + 2^3 == 0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Negative and power: -8 + 2³ = -8 + 8 = 0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-10',
    title: 'Double Negative',
    expression: '2 * -(-5) == 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Double negative: 2 * -(-5) = 2 * 5 = 10',
    category: 'complex-math'
  },
  {
    id: 'complex-math-11',
    title: 'Division Chain',
    expression: '20 / (5 / 2) == 8.0',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Division chain: 20 / (5 / 2) = 20 / 2.5 = 8.0',
    category: 'complex-math'
  },
  {
    id: 'complex-math-12',
    title: 'Multi-Operation Expression',
    expression: '(4 + 2) * 3 - (5 / 2) + 1 < 18',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Multi-operation: (4 + 2) * 3 - (5 / 2) + 1 = 6 * 3 - 2.5 + 1 = 16.5 < 18',
    category: 'complex-math'
  },
  {
    id: 'complex-math-13',
    title: 'Power Plus Multiplication',
    expression: '5^2 + 3 * 4 - 6 / 2 > 20',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 5² + 3 * 4 - 6 / 2 = 25 + 12 - 3 = 34 > 20',
    category: 'complex-math'
  },
  {
    id: 'complex-math-14',
    title: 'Power with Decimal Result',
    expression: '4^3 - 2 * 5 + 7 / 2 == 57.5',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: 4³ - 2 * 5 + 7 / 2 = 64 - 10 + 3.5 = 57.5',
    category: 'complex-math'
  },
  {
    id: 'complex-math-15',
    title: 'Absolute Value in Expression',
    expression: 'abs(-7 + 4) * (8 - 6^2) < 34',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Complex expression: |(-7 + 4)| * (8 - 6²) = |-3| * (8 - 36) = 3 * (-28) = -84 < 34',
    category: 'complex-math'
  },
  {
    id: 'complex-math-16',
    title: 'Range Check Inclusive',
    expression: '5 in [1..10]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if 5 is in inclusive range [1..10]',
    category: 'complex-math'
  },
  {
    id: 'complex-math-17',
    title: 'Range Check Exclusive',
    expression: '5 in (1..10)',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if 5 is in exclusive range (1..10)',
    category: 'complex-math'
  },

  // Dynamic Object Operations
  {
    id: 'dynamic-obj-1',
    title: 'Dynamic Key with Template',
    expression: '{[`key-${value}`]: 123}',
    sampleInput: '{"value":"test"}',
    expectedOutput: '{"key-test":123}',
    description: 'Create object with computed key using template string',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-2',
    title: 'Property as Key',
    expression: '{[user.id]: user.name}',
    sampleInput: '{"user":{"id":"u123","name":"John"}}',
    expectedOutput: '{"u123":"John"}',
    description: 'Use object property value as key for new object',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-3',
    title: 'Keys of Dynamic Object',
    expression: 'keys({[`dynamic-${"key"}`]: 123})',
    sampleInput: '{}',
    expectedOutput: '["dynamic-key"]',
    description: 'Get keys from object with computed key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-4',
    title: 'Dynamic Key with Variable',
    expression: '{[prefix + "-" + suffix]: value}',
    sampleInput: '{"prefix":"user","suffix":"123","value":"John"}',
    expectedOutput: '{"user-123":"John"}',
    description: 'Create dynamic key by concatenating variables',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-5',
    title: 'Conditional Dynamic Key',
    expression: '{[status == "active" ? "activeUser" : "inactiveUser"]: user.name}',
    sampleInput: '{"status":"active","user":{"name":"John"}}',
    expectedOutput: '{"activeUser":"John"}',
    description: 'Use conditional expression as object key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-6',
    title: 'Multiple Dynamic Keys',
    expression: '{[key1]: value1, [key2]: value2}',
    sampleInput: '{"key1":"firstName","value1":"John","key2":"lastName","value2":"Doe"}',
    expectedOutput: '{"firstName":"John","lastName":"Doe"}',
    description: 'Create object with multiple computed keys',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-7',
    title: 'Dynamic Key from Array Index',
    expression: '{[`item_${index}`]: items[index]}',
    sampleInput: '{"index":0,"items":["apple","banana","cherry"]}',
    expectedOutput: '{"item_0":"apple"}',
    description: 'Use array index to create dynamic key and value',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-8',
    title: 'Dynamic Key with Function',
    expression: '{[upper(category)]: count}',
    sampleInput: '{"category":"books","count":25}',
    expectedOutput: '{"BOOKS":25}',
    description: 'Transform property value to create dynamic key',
    category: 'dynamic-objects'
  },

  // Date Duration Arithmetic  
  {
    id: 'date-dur-1',
    title: 'Add Duration to Date',
    expression: 'date("2023-10-15") + duration("1d")',
    sampleInput: '{}',
    expectedOutput: '1697414400',
    description: 'Add 1 day duration to date (returns timestamp)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-2',
    title: 'Subtract Duration from Date',
    expression: 'date("2023-10-15") - duration("7d")',
    sampleInput: '{}',
    expectedOutput: '1696723200',
    description: 'Subtract 7 days duration from date (returns timestamp)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-3',
    title: 'Date String After Addition',
    expression: 'dateString(date("2023-10-15") + duration("1d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16 00:00:00"',
    description: 'Format date after adding duration as readable string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-4',
    title: 'Date String After Subtraction',
    expression: 'dateString(date("2023-10-15") - duration("7d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-08 00:00:00"',
    description: 'Format date after subtracting duration as readable string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-5',
    title: 'Duration Comparison',
    expression: 'date("2023-10-15") + duration("1d") == date("2023-10-16")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare date with duration arithmetic to another date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-6',
    title: 'Hour Duration',
    expression: 'duration("1h 30m")',
    sampleInput: '{}',
    expectedOutput: '5400',
    description: 'Create duration of 1 hour 30 minutes (5400 seconds)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-7',
    title: 'Add Hours to Date',
    expression: 'dateString(date("2023-10-15") + duration("12h"))',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15 12:00:00"',
    description: 'Add 12 hours to date and format as string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-8',
    title: 'Start of Day',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "day"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get start of day from datetime string',
    category: 'date-duration'
  },
  {
    id: 'date-dur-9',
    title: 'End of Day',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "d"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 23:59:59"',
    description: 'Get end of day from datetime string (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-10',
    title: 'Start of Hour',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "hour"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:00:00"',
    description: 'Get start of current hour',
    category: 'date-duration'
  },
  {
    id: 'date-dur-11',
    title: 'End of Hour',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "h"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:59:59"',
    description: 'Get end of current hour (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-12',
    title: 'Start of Minute',
    expression: 'dateString(startOf("2023-01-01 15:45:01", "minute"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:45:00"',
    description: 'Get start of current minute',
    category: 'date-duration'
  },
  {
    id: 'date-dur-13',
    title: 'End of Minute',
    expression: 'dateString(endOf("2023-01-01 15:45:01", "m"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 15:45:59"',
    description: 'Get end of current minute (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-14',
    title: 'Start of Week',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "week"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-02 00:00:00"',
    description: 'Get start of week (Monday) from given date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-15',
    title: 'End of Week',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "w"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-08 23:59:59"',
    description: 'Get end of week (Sunday) from given date',
    category: 'date-duration'
  },
  {
    id: 'date-dur-16',
    title: 'Start of Month',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "month"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get first day of month',
    category: 'date-duration'
  },
  {
    id: 'date-dur-17',
    title: 'End of Month',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "M"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-31 23:59:59"',
    description: 'Get last moment of month (short format)',
    category: 'date-duration'
  },
  {
    id: 'date-dur-18',
    title: 'Start of Year',
    expression: 'dateString(startOf("2023-01-04 15:45:01", "year"))',
    sampleInput: '{}',
    expectedOutput: '"2023-01-01 00:00:00"',
    description: 'Get first day of year',
    category: 'date-duration'
  },
  {
    id: 'date-dur-19',
    title: 'End of Year',
    expression: 'dateString(endOf("2023-01-04 15:45:01", "y"))',
    sampleInput: '{}',
    expectedOutput: '"2023-12-31 23:59:59"',
    description: 'Get last moment of year (short format)',
    category: 'date-duration'
  },

  // Array Statistics
  {
    id: 'array-stats-1',
    title: 'Array Median',
    expression: 'median([4, 2, 7, 5, 3])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find median value in array (middle value when sorted)',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-2',
    title: 'Array Mode',
    expression: 'mode([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find mode (most frequent value) in array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-3',
    title: 'Median of Sorted Array',
    expression: 'median([1, 2, 3, 4, 5])',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Find median of odd-length sorted array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-4',
    title: 'Median of Even Array',
    expression: 'median([1, 2, 3, 4])',
    sampleInput: '{}',
    expectedOutput: '2.5',
    description: 'Find median of even-length array (average of middle two)',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-5',
    title: 'Mode of String Array',
    expression: 'mode(["apple", "banana", "apple", "cherry", "apple"])',
    sampleInput: '{}',
    expectedOutput: '"apple"',
    description: 'Find most frequent string in array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-6',
    title: 'Statistical Comparison',
    expression: 'median([1, 5, 9]) > avg([1, 5, 9])',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Compare median and average of same array',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-7',
    title: 'Combined Statistics',
    expression: 'max([median([1, 3, 5]), avg([2, 4, 6])])',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Find maximum between median of one array and average of another',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-8',
    title: 'Mode Frequency Check',
    expression: 'count([1, 1, 2, 2, 2, 3], # == mode([1, 1, 2, 2, 2, 3]))',
    sampleInput: '{}',
    expectedOutput: '3',
    description: 'Count occurrences of the mode value',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-9',
    title: 'Range Calculation',
    expression: 'max([1, 3, 7, 2, 9]) - min([1, 3, 7, 2, 9])',
    sampleInput: '{}',
    expectedOutput: '8',
    description: 'Calculate range (difference between max and min)',
    category: 'array-statistics'
  },
  {
    id: 'array-stats-10',
    title: 'Median Price Calculation',
    expression: 'median(map(products, #.price))',
    sampleInput: '{"products":[{"price":10},{"price":20},{"price":30},{"price":15},{"price":25}]}',
    expectedOutput: '20',
    description: 'Find median price from product array',
    category: 'array-statistics'
  },

  // Extended Date Parts
  {
    id: 'date-parts-1',
    title: 'Extract Year Function',
    expression: 'year(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '2023',
    description: 'Extract year using year() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-2',
    title: 'Extract Month of Year',
    expression: 'monthOfYear(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '10',
    description: 'Extract month number using monthOfYear() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-3',
    title: 'Extract Day of Month',
    expression: 'dayOfMonth(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '15',
    description: 'Extract day of month using dayOfMonth() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-4',
    title: 'Extract Day of Week',
    expression: 'dayOfWeek(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '7',
    description: 'Extract day of week (1=Monday, 7=Sunday) using dayOfWeek() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-5',
    title: 'Extract Week of Year',
    expression: 'weekOfYear(date("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: '41',
    description: 'Extract week number of year using weekOfYear() function',
    category: 'date-parts'
  },
  {
    id: 'date-parts-6',
    title: 'Date Parts Comparison',
    expression: 'monthOfYear(date("2023-10-15")) == 10',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Compare extracted month with expected value',
    category: 'date-parts'
  },
  {
    id: 'date-parts-7',
    title: 'Weekend Check',
    expression: 'dayOfWeek(date("2023-10-15")) in [6, 7]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date falls on weekend (Saturday=6, Sunday=7)',
    category: 'date-parts'
  },
  {
    id: 'date-parts-8',
    title: 'Year Range Check',
    expression: 'year(date("2023-10-15")) in [2020..2025]',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if year is within specific range',
    category: 'date-parts'
  },
  {
    id: 'date-parts-9',
    title: 'Quarter Calculation',
    expression: 'ceil(monthOfYear(date("2023-10-15")) / 3)',
    sampleInput: '{}',
    expectedOutput: '4',
    description: 'Calculate quarter from month (Q4 for October)',
    category: 'date-parts'
  },
  {
    id: 'date-parts-10',
    title: 'Week Progress',
    expression: 'weekOfYear(date("2023-10-15")) / 52.0',
    sampleInput: '{}',
    expectedOutput: '0.7884615384615384',
    description: 'Calculate year progress as decimal (week 41 of 52)',
    category: 'date-parts'
  },

  // Business Calculations
  {
    id: 'business-1',
    title: 'Permission Check',
    expression: 'some(user.permissions, # == "edit")',
    sampleInput: '{"user":{"permissions":["view","edit","delete"]}}',
    expectedOutput: 'true',
    description: 'Check if user has specific permission',
    category: 'business-calculations'
  },
  {
    id: 'business-2',
    title: 'Price Validation All',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items":[{"price":15},{"price":20},{"price":25}]}',
    expectedOutput: 'true',
    description: 'Check if all items meet minimum price requirement',
    category: 'business-calculations'
  },
  {
    id: 'business-3',
    title: 'Price Validation Some Fail',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items":[{"price":15},{"price":5},{"price":25}]}',
    expectedOutput: 'false',
    description: 'Price validation with some items failing requirement',
    category: 'business-calculations'
  },
  {
    id: 'business-4',
    title: 'Average Price Calculation',
    expression: 'avg(map(items, #.price))',
    sampleInput: '{"items":[{"price":10},{"price":20},{"price":30}]}',
    expectedOutput: '20',
    description: 'Calculate average price from product array',
    category: 'business-calculations'
  },
  {
    id: 'business-5',
    title: 'Maximum Order Value',
    expression: 'max(map(items, #.qty * #.price))',
    sampleInput: '{"items":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '45',
    description: 'Find maximum order value (quantity × price)',
    category: 'business-calculations'
  },
  {
    id: 'business-6',
    title: 'Total Revenue Calculation',
    expression: 'sum(map(orders, #.qty * #.price))',
    sampleInput: '{"orders":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '85',
    description: 'Calculate total revenue from all orders',
    category: 'business-calculations'
  },
  {
    id: 'business-7',
    title: 'High Value Orders',
    expression: 'filter(orders, #.qty * #.price > 30)',
    sampleInput: '{"orders":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '[{"qty":3,"price":15}]',
    description: 'Filter orders with value greater than threshold',
    category: 'business-calculations'
  },
  {
    id: 'business-8',
    title: 'Count High Value Orders',
    expression: 'len(filter(orders, #.qty * #.price > 30))',
    sampleInput: '{"orders":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '1',
    description: 'Count orders exceeding value threshold',
    category: 'business-calculations'
  },
  {
    id: 'business-9',
    title: 'Admin Permission Check',
    expression: 'some(user.roles, # == "admin")',
    sampleInput: '{"user":{"roles":["user","editor","admin"]}}',
    expectedOutput: 'true',
    description: 'Check if user has admin role',
    category: 'business-calculations'
  },
  {
    id: 'business-10',
    title: 'All Items In Stock',
    expression: 'all(inventory, #.stock > 0)',
    sampleInput: '{"inventory":[{"stock":5},{"stock":10},{"stock":3}]}',
    expectedOutput: 'true',
    description: 'Check if all items are in stock',
    category: 'business-calculations'
  },
  {
    id: 'business-11',
    title: 'Low Stock Alert',
    expression: 'some(inventory, #.stock < 5)',
    sampleInput: '{"inventory":[{"stock":5},{"stock":2},{"stock":10}]}',
    expectedOutput: 'true',
    description: 'Check if any items have low stock',
    category: 'business-calculations'
  },
  {
    id: 'business-12',
    title: 'Discount Eligibility',
    expression: 'sum(map(cart, #.price)) > 100',
    sampleInput: '{"cart":[{"price":45},{"price":35},{"price":25}]}',
    expectedOutput: 'true',
    description: 'Check if cart total qualifies for discount',
    category: 'business-calculations'
  },

  // Unary Operations
  {
    id: 'unary-1',
    title: 'Boolean Context True',
    expression: 'true',
    sampleInput: '{ "$": true }',
    expectedOutput: 'true',
    description: 'Boolean literal evaluation in true context',
    category: 'unary-operations'
  },
  {
    id: 'unary-2',
    title: 'Boolean Context False',
    expression: 'true',
    sampleInput: '{ "$": false }',
    expectedOutput: 'false',
    description: 'Boolean literal evaluation in false context',
    category: 'unary-operations'
  },
  {
    id: 'unary-3',
    title: 'Greater Than Comparison',
    expression: '> 5',
    sampleInput: '{"$": 10}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is greater than 5',
    category: 'unary-operations'
  },
  {
    id: 'unary-4',
    title: 'Less Than Comparison',
    expression: '< 10',
    sampleInput: '{"$": 5}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is less than 10',
    category: 'unary-operations'
  },
  {
    id: 'unary-5',
    title: 'Greater Than or Equal',
    expression: '>= 10',
    sampleInput: '{"$": 10}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is greater than or equal to 10',
    category: 'unary-operations'
  },
  {
    id: 'unary-6',
    title: 'Less Than or Equal',
    expression: '<= 5',
    sampleInput: '{"$": 5}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is less than or equal to 5',
    category: 'unary-operations'
  },
  {
    id: 'unary-7',
    title: 'Range Check Inclusive',
    expression: '[-10..0]',
    sampleInput: '{"$": 0}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is in inclusive range [-10..0]',
    category: 'unary-operations'
  },
  {
    id: 'unary-8',
    title: 'Range Check Exclusive Start',
    expression: '(-10..0]',
    sampleInput: '{"$": -10}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is in range excluding start (-10..0]',
    category: 'unary-operations'
  },
  {
    id: 'unary-9',
    title: 'Range Check Exclusive End',
    expression: '[-10..0)',
    sampleInput: '{"$": -10}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is in range excluding end [-10..0)',
    category: 'unary-operations'
  },
  {
    id: 'unary-10',
    title: 'Range Check Both Exclusive',
    expression: '(-10..0)',
    sampleInput: '{"$": 0}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is in range excluding both ends (-10..0)',
    category: 'unary-operations'
  },
  {
    id: 'unary-11',
    title: 'Complex Range Check',
    expression: '[-15..-5]',
    sampleInput: '{"$": -4.99}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is in decimal range [-15..-5]',
    category: 'unary-operations'
  },
  {
    id: 'unary-12',
    title: 'Combined Comparison',
    expression: '> 5 and < 10',
    sampleInput: '{"$": 5}',
    expectedOutput: 'false',
    description: 'Check if context value ($) is greater than 5 AND less than 10',
    category: 'unary-operations'
  },
  {
    id: 'unary-13',
    title: 'Range and Comparison',
    expression: '[-10..0] and > -5',
    sampleInput: '{"$": -4.99}',
    expectedOutput: 'true',
    description: 'Check if context value ($) is in range AND greater than -5',
    category: 'unary-operations'
  },
  {
    id: 'unary-14',
    title: 'String Set Check',
    expression: '"GB","US"',
    sampleInput: '{"$": "US"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) matches one of the values',
    category: 'unary-operations'
  },
  {
    id: 'unary-15',
    title: 'String Length Check',
    expression: 'len($) == 13',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) length equals 13',
    category: 'unary-operations'
  },
  {
    id: 'unary-16',
    title: 'String Starts With',
    expression: 'startsWith($, "Hello")',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) starts with "Hello"',
    category: 'unary-operations'
  },
  {
    id: 'unary-17',
    title: 'String Ends With',
    expression: 'endsWith($, "World!")',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) ends with "World!"',
    category: 'unary-operations'
  },
  {
    id: 'unary-18',
    title: 'String Contains',
    expression: 'contains($, "lo")',
    sampleInput: '{"$": "Hello, World!"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) contains "lo"',
    category: 'unary-operations'
  },
  {
    id: 'unary-19',
    title: 'String Slice Check',
    expression: '$[0:5] == "sample"',
    sampleInput: '{"$": "sample_string"}',
    expectedOutput: 'true',
    description: 'Check if context string ($) slice [0:5] equals "sample"',
    category: 'unary-operations'
  },

  // Advanced String Operations
  {
    id: 'str-adv-1',
    title: 'Multi-String Concatenation',
    expression: '"Hello" + " " + "World" + "!"',
    sampleInput: '{}',
    expectedOutput: '"Hello World!"',
    description: 'Concatenate multiple strings with spaces and punctuation',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-2',
    title: 'User Data Concatenation',
    expression: '"User: " + user.name',
    sampleInput: '{"user":{"name":"John"}}',
    expectedOutput: '"User: John"',
    description: 'Concatenate static text with user property',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-3',
    title: 'Template vs Concatenation',
    expression: 'user.firstName + " " + user.lastName',
    sampleInput: '{"user":{"firstName":"John","lastName":"Doe"}}',
    expectedOutput: '"John Doe"',
    description: 'Build full name by concatenating first and last name',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-4',
    title: 'Array Join Operation',
    expression: 'join(["apple", "banana", "cherry"], ", ")',
    sampleInput: '{}',
    expectedOutput: '"apple, banana, cherry"',
    description: 'Join array elements into comma-separated string',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-5',
    title: 'Array Join with Separator',
    expression: 'join(map(items, #.name), " | ")',
    sampleInput: '{"items":[{"name":"John"},{"name":"Jane"},{"name":"Bob"}]}',
    expectedOutput: '"John | Jane | Bob"',
    description: 'Extract names and join with pipe separator',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-6',
    title: 'String Repeat Operation',
    expression: 'repeat("*", 5)',
    sampleInput: '{}',
    expectedOutput: '"*****"',
    description: 'Repeat character multiple times',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-7',
    title: 'String Reverse',
    expression: 'reverse("hello")',
    sampleInput: '{}',
    expectedOutput: '"olleh"',
    description: 'Reverse string character order',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-8',
    title: 'Character At Index',
    expression: 'charAt("hello", 0)',
    sampleInput: '{}',
    expectedOutput: '"h"',
    description: 'Get character at specific index',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-9',
    title: 'Find Index Of',
    expression: 'indexOf("hello world", "world")',
    sampleInput: '{}',
    expectedOutput: '6',
    description: 'Find index of substring within string',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-10',
    title: 'Substring Extraction',
    expression: 'substring("hello world", 6, 5)',
    sampleInput: '{}',
    expectedOutput: '"world"',
    description: 'Extract substring from start index with length',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-11',
    title: 'String Builder Pattern',
    expression: '"(" + user.id + ") " + user.name + " - " + user.status',
    sampleInput: '{"user":{"id":"123","name":"John","status":"active"}}',
    expectedOutput: '"(123) John - active"',
    description: 'Build complex string from multiple properties',
    category: 'string-advanced'
  },
  {
    id: 'str-adv-12',
    title: 'Conditional Concatenation',
    expression: 'user.title ? user.title + " " + user.name : user.name',
    sampleInput: '{"user":{"title":"Dr.","name":"Smith"}}',
    expectedOutput: '"Dr. Smith"',
    description: 'Conditionally include title in name concatenation',
    category: 'string-advanced'
  },

  // Advanced Date Constructors
  {
    id: 'date-const-1',
    title: 'Date with Time',
    expression: 'd("2023-10-15 14:30")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:00Z"',
    description: 'Create date with specific time',
    category: 'date-constructors'
  },
  {
    id: 'date-const-2',
    title: 'Date with Seconds',
    expression: 'd("2023-10-15 14:30:45")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:45Z"',
    description: 'Create date with time including seconds',
    category: 'date-constructors'
  },
  {
    id: 'date-const-3',
    title: 'Date with Timezone',
    expression: 'd("2023-10-15", "Europe/Berlin")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T00:00:00+02:00"',
    description: 'Create date with specific timezone',
    category: 'date-constructors'
  },
  {
    id: 'date-const-4',
    title: 'DateTime with Timezone',
    expression: 'd("2023-10-15 14:30", "Europe/Berlin")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:00+02:00"',
    description: 'Create datetime with timezone specification',
    category: 'date-constructors'
  },
  {
    id: 'date-const-5',
    title: 'Full DateTime with Timezone',
    expression: 'd("2023-10-15 14:30:45", "Europe/Berlin")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T14:30:45+02:00"',
    description: 'Create full datetime with timezone and seconds',
    category: 'date-constructors'
  },
  {
    id: 'date-const-6',
    title: 'Add Duration String',
    expression: 'd("2023-10-15").add("1d 5h")',
    sampleInput: '{}',
    expectedOutput: '"2023-10-16T05:00:00Z"',
    description: 'Add complex duration string (1 day 5 hours)',
    category: 'date-constructors'
  },
  {
    id: 'date-const-7',
    title: 'Subtract with Units',
    expression: 'd("2023-10-15").sub(1, "M")',
    sampleInput: '{}',
    expectedOutput: '"2023-09-15T00:00:00Z"',
    description: 'Subtract 1 month using unit specification',
    category: 'date-constructors'
  },
  {
    id: 'date-const-8',
    title: 'Is Same Or Before',
    expression: 'd("2023-10-15").isSameOrBefore(d("2023-10-16"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is same or before another date',
    category: 'date-constructors'
  },
  {
    id: 'date-const-9',
    title: 'Is Same Or After',
    expression: 'd("2023-10-15").isSameOrAfter(d("2023-10-14"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if date is same or after another date',
    category: 'date-constructors'
  },
  {
    id: 'date-const-10',
    title: 'Date Validation Check',
    expression: 'd("Europe/Berlin").isValid() and d("Europe/Berlin").isToday()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate timezone string and check if today (context-dependent)',
    category: 'date-constructors'
  },
  {
    id: 'date-const-11',
    title: 'Is Before Check',
    expression: 'd("2023-10-15").isBefore(d("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date is before same date (returns false)',
    category: 'date-constructors'
  },
  {
    id: 'date-const-12',
    title: 'Is After Check',
    expression: 'd("2023-10-15").isAfter(d("2023-10-15"))',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if date is after same date (returns false)',
    category: 'date-constructors'
  },

  // Utility Functions
  {
    id: 'util-1',
    title: 'Fuzzy Match Exact',
    expression: 'fuzzyMatch("hello", "hello")',
    sampleInput: '{}',
    expectedOutput: '1',
    description: 'Fuzzy string matching with exact match (returns 1.0)',
    category: 'utility-functions'
  },
  {
    id: 'util-2',
    title: 'Fuzzy Match Partial',
    expression: 'fuzzyMatch("world", "hello")',
    sampleInput: '{}',
    expectedOutput: '0.2',
    description: 'Fuzzy string matching with low similarity',
    category: 'utility-functions'
  },
  {
    id: 'util-3',
    title: 'Fuzzy Match Array',
    expression: 'fuzzyMatch(["hello", "world"], "hello")',
    sampleInput: '{}',
    expectedOutput: '[1, 0.2]',
    description: 'Fuzzy match string against array of strings',
    category: 'utility-functions'
  },
  {
    id: 'util-4',
    title: 'Date Offset Name Berlin',
    expression: 'd("2023-10-15", "Europe/Berlin").offsetName()',
    sampleInput: '{}',
    expectedOutput: '"Europe/Berlin"',
    description: 'Get timezone offset name from date',
    category: 'utility-functions'
  },
  {
    id: 'util-5',
    title: 'Date Offset Name LA',
    expression: 'd("2023-10-15", "America/Los_Angeles").offsetName()',
    sampleInput: '{}',
    expectedOutput: '"America/Los_Angeles"',
    description: 'Get timezone offset name for Los Angeles',
    category: 'utility-functions'
  },
  {
    id: 'util-6',
    title: 'Leap Year Check False',
    expression: 'd("2023-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check if year 2023 is a leap year (false)',
    category: 'utility-functions'
  },
  {
    id: 'util-7',
    title: 'Leap Year Check True',
    expression: 'd("2024-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if year 2024 is a leap year (true)',
    category: 'utility-functions'
  },
  {
    id: 'util-8',
    title: 'Century Leap Year',
    expression: 'd("2000-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check leap year for century year 2000 (true)',
    category: 'utility-functions'
  },
  {
    id: 'util-9',
    title: 'Century Non-Leap Year',
    expression: 'd("1900-10-15").isLeapYear()',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Check leap year for century year 1900 (false)',
    category: 'utility-functions'
  },
  {
    id: 'util-10',
    title: 'Date Set Year',
    expression: 'd("2023-10-15").set("year", 2024)',
    sampleInput: '{}',
    expectedOutput: '"2024-10-15T00:00:00Z"',
    description: 'Set year component of date to 2024',
    category: 'utility-functions'
  },
  {
    id: 'util-11',
    title: 'Date Set Month',
    expression: 'd("2023-10-15").set("month", 5)',
    sampleInput: '{}',
    expectedOutput: '"2023-05-15T00:00:00Z"',
    description: 'Set month component of date to May (5)',
    category: 'utility-functions'
  },
  {
    id: 'util-12',
    title: 'Date Set Day',
    expression: 'd("2023-10-15").set("day", 20)',
    sampleInput: '{}',
    expectedOutput: '"2023-10-20T00:00:00Z"',
    description: 'Set day component of date to 20th',
    category: 'utility-functions'
  },
  {
    id: 'util-13',
    title: 'Date Set Hour',
    expression: 'd("2023-10-15T10:30:00Z").set("hour", 15)',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T15:30:00Z"',
    description: 'Set hour component of datetime to 15 (3 PM)',
    category: 'utility-functions'
  },
  {
    id: 'util-14',
    title: 'Date Set Minute',
    expression: 'd("2023-10-15T10:30:00Z").set("minute", 45)',
    sampleInput: '{}',
    expectedOutput: '"2023-10-15T10:45:00Z"',
    description: 'Set minute component of datetime to 45',
    category: 'utility-functions'
  }
];

export const getExamples = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sort by category, then by title
  return realExamples.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
};
