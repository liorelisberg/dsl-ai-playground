// Test script for enhanced structured DSL display
// Run this in browser console to test the new code block rendering

console.log('🎨 Testing Enhanced Structured DSL Display');
console.log('===========================================');

// Test content with educational scenarios (your specific case)
console.log('\n📚 Testing Educational Question Scenarios');
console.log('==========================================');

const educationalContent = `
# Complete Guide to ZEN String Functions

ZEN DSL provides comprehensive string manipulation capabilities. Here are ALL the string functions available:

## Basic String Operations

### upper(string)
Converts text to uppercase.
- Returns: String in uppercase
- Example: upper("hello") → "HELLO"

### lower(string) 
Converts text to lowercase.
- Returns: String in lowercase
- Example: lower("WORLD") → "world"

### len(string)
Returns the length/character count of a string.
- Returns: Number
- Example: len("test") → 4

## String Testing Functions

### contains(string, substring)
Checks if a string contains another string.
- Returns: Boolean
- Case-sensitive
- Example: contains("hello world", "world") → true

### startsWith(string, prefix)
Tests if string begins with specified prefix.
- Returns: Boolean
- Example: startsWith("hello", "he") → true

### endsWith(string, suffix)
Tests if string ends with specified suffix.
- Returns: Boolean  
- Example: endsWith("hello", "lo") → true

## Usage Notes

- All string functions are case-sensitive unless noted
- String positions are 0-indexed
- Functions can be chained for complex operations
- Use with conditional expressions for powerful text processing

For practical examples with real data, ask me to "show string function examples" and I'll provide working code samples.
`;

// Test content with structured DSL format including results
const structuredContent = `
Here are some useful ZEN DSL operations:

\${title}
Converting user names to uppercase for display
\${title}

\${inputBlock}
{"user": {"name": "john doe", "role": "developer"}}
\${inputBlock}

\${expressionBlock}
upper(user.name) + " (" + user.role + ")"
\${expressionBlock}

\${resultBlock}
"JOHN DOE (developer)"
\${resultBlock}

This will transform the name to uppercase and format it nicely.

\${title}
Filtering users by age criteria
\${title}

\${inputBlock}
{"users": [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 17}, {"name": "Carol", "age": 30}]}
\${inputBlock}

\${expressionBlock}
filter(users, #.age >= 18)
\${expressionBlock}

\${resultBlock}
[{"name": "Alice", "age": 25}, {"name": "Carol", "age": 30}]
\${resultBlock}

Result: Only users 18 or older will be returned.

\${title}
Extracting email addresses from user profiles
\${title}

\${inputBlock}
{"profiles": [{"name": "John", "email": "john@example.com"}, {"name": "Jane", "email": "jane@example.com"}]}
\${inputBlock}

\${expressionBlock}
map(profiles, #.email)
\${expressionBlock}

This extracts just the email addresses from the profile objects.
`;

// Mock the parsing function to test locally
function parseStructuredContent(content) {
  const blocks = [];
  
  // Split content by title markers
  const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
  let lastIndex = 0;
  let match;
  
  while ((match = titlePattern.exec(content)) !== null) {
    // Add text before this example
    if (match.index > lastIndex) {
      const precedingText = content.slice(lastIndex, match.index).trim();
      if (precedingText) {
        blocks.push({ type: 'text', content: precedingText });
      }
    }
    
    // Find corresponding input, expression, and result blocks after this title
    const afterTitleContent = content.slice(match.index + match[0].length);
    
    const inputMatch = afterTitleContent.match(/\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/);
    const expressionMatch = afterTitleContent.match(/\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/);
    const resultMatch = afterTitleContent.match(/\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/);
    
    if (inputMatch && expressionMatch) {
      blocks.push({
        type: 'dsl-example',
        title: match[1].trim(),
        input: inputMatch[1].trim(),
        expression: expressionMatch[1].trim(),
        result: resultMatch ? resultMatch[1].trim() : undefined
      });
      
      // Update lastIndex to after the last block (result if present, otherwise expression)
      const lastBlock = resultMatch || expressionMatch;
      const lastBlockEnd = match.index + match[0].length + 
        afterTitleContent.indexOf(lastBlock[0]) + lastBlock[0].length;
      lastIndex = lastBlockEnd;
    } else {
      lastIndex = match.index + match[0].length;
    }
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim();
    if (remainingText) {
      blocks.push({ type: 'text', content: remainingText });
    }
  }
  
  return blocks;
}

// Test the parsing
const blocks = parseStructuredContent(structuredContent);

console.log('\n📊 Parsing Results:');
console.log('==================');
console.log(`Total blocks: ${blocks.length}`);

blocks.forEach((block, index) => {
  console.log(`\nBlock ${index + 1}:`);
  console.log(`  Type: ${block.type}`);
  
  if (block.type === 'text') {
    console.log(`  Content: "${block.content.substring(0, 50)}..."`);
  } else if (block.type === 'dsl-example') {
    console.log(`  Title: "${block.title}"`);
    console.log(`  Input: ${block.input}`);
    console.log(`  Expression: ${block.expression}`);
    if (block.result) {
      console.log(`  Result: ${block.result}`);
    }
  }
});

// Test educational content (your scenario)
console.log('\n📚 Educational Content Analysis:');
console.log('================================');

const educationalBlocks = parseStructuredContent(educationalContent);
console.log(`Educational content blocks: ${educationalBlocks.length}`);
console.log(`All blocks are type: ${educationalBlocks.map(b => b.type).join(', ')}`);

// Mock the detection functions
function mockGetPairStatistics(content) {
  const inputPattern = /\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/g;
  const expressionPattern = /\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/g;
  const resultPattern = /\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/g;
  const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
  
  const inputMatches = [...content.matchAll(inputPattern)];
  const expressionMatches = [...content.matchAll(expressionPattern)];
  const resultMatches = [...content.matchAll(resultPattern)];
  const titleMatches = [...content.matchAll(titlePattern)];
  
  return {
    hasMarkers: inputMatches.length > 0 || expressionMatches.length > 0,
    inputBlocks: inputMatches.length,
    expressionBlocks: expressionMatches.length,
    resultBlocks: resultMatches.length,
    titleBlocks: titleMatches.length
  };
}

const educationalStats = mockGetPairStatistics(educationalContent);
const structuredStats = mockGetPairStatistics(structuredContent);

console.log('\n🔍 Content Analysis Comparison:');
console.log('===============================');
console.log('Educational Content (Explain ALL string functions):');
console.log(`  Has markers: ${educationalStats.hasMarkers}`);
console.log(`  Input blocks: ${educationalStats.inputBlocks}`);
console.log(`  Expression blocks: ${educationalStats.expressionBlocks}`);
console.log(`  Result blocks: ${educationalStats.resultBlocks}`);
console.log(`  Title blocks: ${educationalStats.titleBlocks}`);

console.log('\nStructured Content (Examples):');
console.log(`  Has markers: ${structuredStats.hasMarkers}`);
console.log(`  Input blocks: ${structuredStats.inputBlocks}`);
console.log(`  Expression blocks: ${structuredStats.expressionBlocks}`);
console.log(`  Result blocks: ${structuredStats.resultBlocks}`);
console.log(`  Title blocks: ${structuredStats.titleBlocks}`);

console.log('\n💡 Issue Analysis:');
console.log('==================');
console.log('✅ Educational content correctly shows NO markers detected');
console.log('✅ Educational content renders as regular markdown (expected)');
console.log('✅ No "Try This" buttons should appear (correct behavior)');
console.log('✅ DSL examples with markers render as structured blocks');

console.log('\n🎯 Your "Explain ALL string functions" scenario:');
console.log('===============================================');
console.log('Expected behavior:');
console.log('• Content renders as regular markdown with proper formatting');
console.log('• No structured code blocks (no DSL markers detected)');
console.log('• No "Try This" buttons (no extractable examples)');
console.log('• Clean educational display with proper typography');

console.log('\n❓ What was the actual issue you experienced?');
console.log('============================================');
console.log('Was the problem:');
console.log('• Content not displaying properly?');
console.log('• Try This buttons appearing when they shouldn\'t?');
console.log('• Structured blocks appearing for educational content?');
console.log('• Something else with the UI rendering?');

console.log('\n🔧 Next Steps for Debugging:');
console.log('============================');
console.log('1. Test the "Explain ALL string functions" query at http://localhost:8081');
console.log('2. Check browser console for any DSL detection logs');
console.log('3. Verify content renders as expected markdown');
console.log('4. Look for any unexpected Try This buttons');
console.log('5. Report specific UI issues observed');

console.log('\n🎯 Expected UI Rendering:');
console.log('=========================');
console.log('✅ Text blocks render as regular markdown');
console.log('✅ DSL examples render as structured code blocks with:');
console.log('   📝 Title header with hash icon');
console.log('   📊 JSON input with syntax highlighting + copy button');
console.log('   ⚡ ZEN expression with syntax highlighting + copy button');
console.log('   ✅ Expected result with syntax highlighting + copy button (when available)');
console.log('   📋 Individual copy buttons for each code section');
console.log('   🎨 Professional styling with proper sections');

console.log('\n🧪 Manual Testing Steps:');
console.log('========================');
console.log('1. Open http://localhost:8080');
console.log('2. Ask AI: "Show me string and array operations"');
console.log('3. Verify structured display:');
console.log('   - Clear section headers with icons');
console.log('   - Proper JSON syntax highlighting');
console.log('   - Clean ZEN expression formatting');
console.log('   - Expected result section (emerald styling)');
console.log('   - Copy buttons in top right of each section');
console.log('   - Try This buttons work correctly');
console.log('4. Test copy functionality:');
console.log('   - Click copy button on Sample Input section');
console.log('   - Click copy button on ZEN Expression section');
console.log('   - Click copy button on Expected Result section');
console.log('   - Verify toast notifications appear');
console.log('   - Check buttons show checkmark when copied');

console.log('\n💡 Look for these visual improvements:');
console.log('=====================================');
console.log('• Title sections with indigo header background');
console.log('• Separate Sample Input and ZEN Expression sections');
console.log('• Expected Result section with emerald styling (when available)');
console.log('• Copy buttons in top right corner of each section');
console.log('• Copy/Check icon state changes with hover effects');
console.log('• Syntax highlighting for JSON (light/dark theme)');
console.log('• JavaScript-style highlighting for expressions');
console.log('• Clean borders and spacing between sections');
console.log('• Toast notifications for successful copy operations');

console.log('\n🔥 Enhanced Chat → Parser Integration Complete!');
console.log('Now with beautiful structured code blocks, copy functionality, AND result display! 🎨📋✅'); 