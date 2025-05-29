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
