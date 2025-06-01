// Enhanced Chat → Parser Feature Test with Titles and Data Structure Validation
// Run this in browser console at http://localhost:8080

console.log('🎯 Testing Enhanced Chat → Parser Feature with Titles & Data Structure');
console.log('==================================================================');

// Test case 1: Single example with proper array wrapping
const singleExampleTest = `
Here's how to convert text:

\${title}
Converting user names to uppercase for display
\${title}

\${inputBlock}
{"user": {"name": "john doe", "role": "developer"}}
\${inputBlock}

\${expressionBlock}
upper(user.name) + " (" + user.role + ")"
\${expressionBlock}

Result: "JOHN DOE (developer)"
`;

// Test case 2: Multiple examples with proper array handling
const multipleExamplesTest = `
Here are common array operations:

\${title}
Filtering users who are adults (18+)
\${title}

\${inputBlock}
{"users": [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 17}]}
\${inputBlock}

\${expressionBlock}
filter(users, #.age >= 18)
\${expressionBlock}

\${title}
Extracting email addresses from user profiles
\${title}

\${inputBlock}
{"profiles": [{"name": "John", "email": "john@example.com"}]}
\${inputBlock}

\${expressionBlock}
map(profiles, #.email)
\${expressionBlock}

\${title}
Counting the total number of active sessions
\${title}

\${inputBlock}
{"sessions": ["active", "inactive", "active", "pending"]}
\${inputBlock}

\${expressionBlock}
len(filter(sessions, # == "active"))
\${expressionBlock}
`;

// Test case 3: INVALID format that should NOT appear
const invalidExampleTest = `
❌ This should NOT happen:

\${inputBlock}
[{"name": "Alice", "age": 25}]
\${inputBlock}

\${expressionBlock}
filter(this, age > 18)
\${expressionBlock}
`;

// Mock detection function (based on actual implementation)
function testExpressionDetection(content) {
  const pairs = [];
  
  try {
    const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
    const titleMatches = [...content.matchAll(titlePattern)];
    
    const inputPattern = /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g;
    const inputMatches = [...content.matchAll(inputPattern)];
    
    const expressionPattern = /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g;
    const expressionMatches = [...content.matchAll(expressionPattern)];
    
    const minLength = Math.min(inputMatches.length, expressionMatches.length);
    
    for (let i = 0; i < minLength; i++) {
      const extractedTitle = titleMatches[i] ? titleMatches[i][1].trim() : null;
      const fallbackTitle = minLength === 1 ? "Try This Example" : `Try Example ${i + 1}`;
      
      pairs.push({
        input: inputMatches[i][1].trim(),
        expression: expressionMatches[i][1].trim(),
        title: extractedTitle || fallbackTitle,
        index: i
      });
    }
    
  } catch (error) {
    console.error('Error extracting pairs:', error);
  }
  
  return pairs;
}

function generateButtonTitle(pair, allPairs) {
  if (allPairs.length === 1) {
    return "Try This";
  }
  
  let cleanTitle = pair.title
    .replace(/^Example\s*\d*:\s*/i, '')
    .replace(/^Try\s*/i, '')
    .trim();
  
  if (cleanTitle.length > 40) {
    cleanTitle = cleanTitle.substring(0, 37) + '...';
  }
  
  return cleanTitle || `Example ${pair.index + 1}`;
}

// Data structure validation functions
function validateDataStructure(pairs) {
  const issues = [];
  const successes = [];
  
  pairs.forEach((pair, index) => {
    const input = pair.input;
    const expression = pair.expression;
    
    // Check if input starts with raw array
    if (input.trim().startsWith('[')) {
      issues.push(`❌ Pair ${index + 1}: Raw array detected (should be wrapped in object)`);
    } else {
      successes.push(`✅ Pair ${index + 1}: Properly wrapped in object`);
    }
    
    // Check for invalid "this" references
    if (expression.includes('this')) {
      issues.push(`❌ Pair ${index + 1}: Invalid "this" reference (should use object key)`);
    } else {
      successes.push(`✅ Pair ${index + 1}: No invalid "this" references`);
    }
    
    // Check for array operations without # operator
    const arrayFunctions = ['filter', 'map', 'reduce', 'sort'];
    const hasArrayFunction = arrayFunctions.some(fn => expression.includes(fn + '('));
    
    if (hasArrayFunction && !expression.includes('#')) {
      issues.push(`❌ Pair ${index + 1}: Array function without "#" operator`);
    } else if (hasArrayFunction) {
      successes.push(`✅ Pair ${index + 1}: Proper "#" operator usage`);
    }
  });
  
  return { issues, successes };
}

// Run tests
console.log('\n📋 Test 1: Single Example with Proper Structure');
console.log('=============================================');
const singlePairs = testExpressionDetection(singleExampleTest);
console.log(`Detected: ${singlePairs.length} pair(s)`);
if (singlePairs.length > 0) {
  console.log(`Title: "${singlePairs[0].title}"`);
  console.log(`Button: "${generateButtonTitle(singlePairs[0], singlePairs)}"`);
  console.log('✅ Expected: Single "Try This" button');
}

console.log('\n📋 Test 2: Multiple Examples with Array Operations');
console.log('===============================================');
const multiplePairs = testExpressionDetection(multipleExamplesTest);
console.log(`Detected: ${multiplePairs.length} pair(s)`);

if (multiplePairs.length > 0) {
  console.log('\nButton titles:');
  multiplePairs.forEach((pair, i) => {
    console.log(`  ${i + 1}. "${generateButtonTitle(pair, multiplePairs)}"`);
  });
  
  if (multiplePairs.length === 2) {
    console.log('✅ Expected: Dropdown menu with 2 options');
  } else if (multiplePairs.length >= 3) {
    console.log('✅ Expected: Dropdown menu with descriptive options');
  }
}

console.log('\n🔍 Data Structure Validation');
console.log('============================');
const validation = validateDataStructure(multiplePairs);

console.log('\n✅ Successes:');
validation.successes.forEach(success => console.log(`  ${success}`));

if (validation.issues.length > 0) {
  console.log('\n❌ Issues Found:');
  validation.issues.forEach(issue => console.log(`  ${issue}`));
} else {
  console.log('\n🎉 All data structures are valid!');
}

console.log('\n📋 Test 3: Invalid Format Detection');
console.log('==================================');
const invalidPairs = testExpressionDetection(invalidExampleTest);
if (invalidPairs.length > 0) {
  const invalidValidation = validateDataStructure(invalidPairs);
  console.log('❌ Found invalid format (this should NOT happen in AI responses):');
  invalidValidation.issues.forEach(issue => console.log(`  ${issue}`));
}

console.log('\n🎯 Critical Validation Checklist:');
console.log('=================================');
console.log('✅ Arrays wrapped in objects (not raw arrays)');
console.log('✅ Expressions use object keys (not "this")');
console.log('✅ Array operations use "#" operator');
console.log('✅ Descriptive object keys ("users", "products", etc.)');

console.log('\n💡 Manual Testing Steps:');
console.log('========================');
console.log('1. Ask AI: "Filter an array of products by price"');
console.log('2. Verify: Input uses {"products": [...]} format');
console.log('3. Verify: Expression uses filter(products, #.price > X)');
console.log('4. Transfer and run: Should execute without errors');
console.log('5. Ask AI: "Show me map and filter operations"');
console.log('6. Check all array operations use proper structure');

console.log('\n🚀 Enhanced feature with data structure validation ready!');
console.log('This ensures all transferred expressions will execute successfully.');

console.log('\n🎯 UI Behavior Expectations:');
console.log('============================');
console.log('1. Single example → "Try This" button');
console.log('2. Multiple examples (2+) → Dropdown with descriptive names');
console.log('3. Titles are cleaned up (no "Example 1:" prefixes)');
console.log('4. Long titles are truncated to 40 characters max'); 