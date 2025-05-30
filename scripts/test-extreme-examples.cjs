const fs = require('fs');
const path = require('path');

// Validated DSL functions (79 total)
const VALID_FUNCTIONS = [
  'abs', 'add', 'all', 'any', 'avg', 'ceil', 'contains', 'count', 'd', 'date', 
  'diff', 'endsWith', 'extract', 'filter', 'first', 'flatMap', 'floor', 'format',
  'formatNumber', 'get', 'groupBy', 'join', 'keys', 'last', 'len', 'lower', 'map',
  'matches', 'max', 'median', 'min', 'now', 'number', 'orderBy', 'pow', 'range',
  'reverse', 'round', 'select', 'size', 'slice', 'some', 'sort', 'split', 'sqrt',
  'startsWith', 'string', 'sum', 'take', 'trim', 'type', 'unique', 'upper', 'values',
  'after', 'before', 'between', 'equals', 'gt', 'gte', 'isAfter', 'isBefore', 'lt',
  'lte', 'and', 'or', 'not', 'if', 'then', 'else', 'iif', 'tz', 'year', 'month',
  'day', 'hour', 'minute', 'second', 'weekday', 'yearday', 'week', 'quarter'
];

// Enhanced validation for extreme examples
function validateComplexExpression(expression) {
  const issues = [];
  
  // Check bracket matching with nesting depth tracking
  let depth = 0;
  let maxDepth = 0;
  const brackets = [];
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (['(', '[', '{'].includes(char)) {
      brackets.push({ type: char, pos: i });
      depth++;
      maxDepth = Math.max(maxDepth, depth);
    } else if ([')', ']', '}'].includes(char)) {
      const last = brackets.pop();
      if (!last) {
        issues.push(`Unmatched closing bracket '${char}' at position ${i}`);
      } else {
        const expected = { '(': ')', '[': ']', '{': '}' }[last.type];
        if (char !== expected) {
          issues.push(`Mismatched brackets: '${last.type}' at ${last.pos} closed by '${char}' at ${i}`);
        }
      }
      depth--;
    }
  }
  
  if (brackets.length > 0) {
    issues.push(`Unclosed brackets: ${brackets.map(b => `'${b.type}' at ${b.pos}`).join(', ')}`);
  }

  // Check for function usage
  const functionPattern = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  let match;
  const usedFunctions = new Set();
  
  while ((match = functionPattern.exec(expression)) !== null) {
    const funcName = match[1];
    usedFunctions.add(funcName);
    if (!VALID_FUNCTIONS.includes(funcName)) {
      issues.push(`Invalid function: '${funcName}' at position ${match.index}`);
    }
  }

  // Enhanced complexity analysis
  const complexity = {
    nestingDepth: maxDepth,
    functionCount: usedFunctions.size,
    totalLength: expression.length,
    arraySlicing: (expression.match(/\[.*?:\]|\[:.*?\]|\[.*?:.*?\]/g) || []).length,
    templateStrings: (expression.match(/`[^`]*`/g) || []).length,
    conditionals: (expression.match(/\?.*?:/g) || []).length,
    complexityScore: maxDepth * 2 + usedFunctions.size + Math.floor(expression.length / 100)
  };

  return {
    valid: issues.length === 0,
    issues,
    complexity,
    usedFunctions: Array.from(usedFunctions)
  };
}

// Test individual example with enhanced error handling
async function testSingleExample(example, index) {
  console.log(`\n🔍 Testing Example ${index + 1}: ${example.title}`);
  console.log(`   Category: ${example.category}`);
  console.log(`   Expression Length: ${example.expression.length} chars`);
  
  try {
    // Validate expression syntax
    const validation = validateComplexExpression(example.expression);
    
    if (!validation.valid) {
      console.log(`   ❌ Syntax Issues Found:`);
      validation.issues.forEach(issue => console.log(`      - ${issue}`));
      return { valid: false, reason: 'syntax_error', details: validation.issues };
    }

    // Log complexity metrics
    console.log(`   📊 Complexity: Depth=${validation.complexity.nestingDepth}, Functions=${validation.complexity.functionCount}, Score=${validation.complexity.complexityScore}`);
    console.log(`   🔧 Functions Used: ${validation.usedFunctions.join(', ')}`);

    // Parse sample input
    let sampleInput;
    try {
      sampleInput = JSON.parse(example.sampleInput);
    } catch (e) {
      console.log(`   ❌ Invalid Sample Input JSON: ${e.message}`);
      return { valid: false, reason: 'invalid_input', details: e.message };
    }

    // Parse expected output
    let expectedOutput;
    try {
      expectedOutput = JSON.parse(example.expectedOutput);
    } catch (e) {
      console.log(`   ❌ Invalid Expected Output JSON: ${e.message}`);
      return { valid: false, reason: 'invalid_output', details: e.message };
    }

    // Validate logical structure
    if (!example.id || !example.title || !example.description) {
      console.log(`   ❌ Missing required fields`);
      return { valid: false, reason: 'missing_fields' };
    }

    console.log(`   ✅ VALID - Complex example passed all checks`);
    return { 
      valid: true, 
      complexity: validation.complexity,
      functions: validation.usedFunctions
    };

  } catch (error) {
    console.log(`   ❌ Unexpected Error: ${error.message}`);
    return { valid: false, reason: 'unexpected_error', details: error.message };
  }
}

// Auto-fix common issues in extreme examples
function autoFixExample(example, validationResult) {
  let fixed = { ...example };
  let changes = [];

  // Fix bracket mismatches (basic cases)
  if (validationResult.issues.some(issue => issue.includes('bracket'))) {
    // Simple bracket fixing - count and balance
    let expression = fixed.expression;
    const openBrackets = (expression.match(/\(/g) || []).length;
    const closeBrackets = (expression.match(/\)/g) || []).length;
    
    if (openBrackets > closeBrackets) {
      expression += ')'.repeat(openBrackets - closeBrackets);
      changes.push(`Added ${openBrackets - closeBrackets} closing parentheses`);
    }
    
    fixed.expression = expression;
  }

  return { fixed, changes };
}

// Main validation function
async function validateExtremeExamples() {
  console.log('🚀 EXTREME DSL EXAMPLES VALIDATION');
  console.log('==================================');
  
  try {
    // Read examples
    const examplesPath = path.join(__dirname, '..', 'temp-extreme-complex-examples.json');
    const examplesData = JSON.parse(fs.readFileSync(examplesPath, 'utf8'));
    
    console.log(`📊 Loaded ${examplesData.length} extreme examples`);
    
    const results = {
      valid: [],
      invalid: [],
      fixed: [],
      categories: {},
      totalComplexity: 0,
      allFunctions: new Set()
    };

    // Test each example
    for (let i = 0; i < examplesData.length; i++) {
      const example = examplesData[i];
      const testResult = await testSingleExample(example, i);
      
      if (testResult.valid) {
        results.valid.push({
          example,
          complexity: testResult.complexity,
          functions: testResult.functions
        });
        results.totalComplexity += testResult.complexity.complexityScore;
        testResult.functions.forEach(f => results.allFunctions.add(f));
        
        // Track categories
        if (!results.categories[example.category]) {
          results.categories[example.category] = 0;
        }
        results.categories[example.category]++;
        
      } else {
        // Try to auto-fix
        const validation = validateComplexExpression(example.expression);
        const autoFix = autoFixExample(example, validation);
        
        if (autoFix.changes.length > 0) {
          console.log(`🔧 Attempting auto-fix: ${autoFix.changes.join(', ')}`);
          const fixedTest = await testSingleExample(autoFix.fixed, i);
          
          if (fixedTest.valid) {
            results.fixed.push({
              original: example,
              fixed: autoFix.fixed,
              changes: autoFix.changes
            });
            console.log(`   ✅ Auto-fix successful!`);
          } else {
            results.invalid.push({
              example,
              reason: testResult.reason,
              details: testResult.details
            });
          }
        } else {
          results.invalid.push({
            example,
            reason: testResult.reason,
            details: testResult.details
          });
        }
      }
    }

    // Generate comprehensive report
    console.log('\n📈 EXTREME VALIDATION RESULTS');
    console.log('==============================');
    console.log(`✅ Valid Examples: ${results.valid.length}`);
    console.log(`🔧 Fixed Examples: ${results.fixed.length}`);
    console.log(`❌ Invalid Examples: ${results.invalid.length}`);
    console.log(`📊 Average Complexity Score: ${Math.round(results.totalComplexity / results.valid.length)}`);
    console.log(`🔧 Unique Functions Used: ${results.allFunctions.size}`);
    
    console.log('\n📋 Category Breakdown:');
    Object.entries(results.categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} examples`);
    });

    console.log('\n🔧 Functions Utilized:');
    console.log(`   ${Array.from(results.allFunctions).sort().join(', ')}`);

    if (results.invalid.length > 0) {
      console.log('\n❌ Invalid Examples Details:');
      results.invalid.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.example.title}`);
        console.log(`      Reason: ${item.reason}`);
        if (item.details) {
          console.log(`      Details: ${item.details}`);
        }
      });
    }

    // Generate integration suggestions
    console.log('\n🎯 INTEGRATION RECOMMENDATIONS');
    console.log('===============================');
    
    const validExamples = [...results.valid, ...results.fixed.map(f => ({ example: f.fixed }))];
    const categoryMapping = {
      'extreme-sports-betting': 'src/examples/complexExamples.ts',
      'extreme-finance': 'src/examples/mathematicalOperationsExamples.ts', 
      'extreme-events': 'src/examples/dateOperationsExamples.ts',
      'extreme-data': 'src/examples/arrayProcessingExamples.ts',
      'extreme-edge': 'src/examples/complexExamples.ts'
    };

    Object.entries(categoryMapping).forEach(([category, file]) => {
      const categoryExamples = validExamples.filter(item => item.example.category === category);
      if (categoryExamples.length > 0) {
        console.log(`📁 ${file}: Add ${categoryExamples.length} examples`);
        categoryExamples.forEach(item => {
          console.log(`   - ${item.example.title}`);
        });
      }
    });

    return results;

  } catch (error) {
    console.error('💥 Fatal Error:', error.message);
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  validateExtremeExamples()
    .then(results => {
      const hasIssues = results.invalid.length > 0;
      console.log(`\n${hasIssues ? '⚠️' : '🎉'} Validation ${hasIssues ? 'completed with issues' : 'successful'}!`);
      process.exit(hasIssues ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { validateExtremeExamples, validateComplexExpression }; 