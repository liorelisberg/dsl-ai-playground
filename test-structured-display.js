// Test script for enhanced structured DSL display
// Run this in browser console to test the new code block rendering

console.log('🎨 Testing Enhanced Structured DSL Display');
console.log('===========================================');

// Test content with structured DSL format
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
    
    // Find corresponding input and expression blocks after this title
    const afterTitleContent = content.slice(match.index + match[0].length);
    
    const inputMatch = afterTitleContent.match(/\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/);
    const expressionMatch = afterTitleContent.match(/\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/);
    
    if (inputMatch && expressionMatch) {
      blocks.push({
        type: 'dsl-example',
        title: match[1].trim(),
        input: inputMatch[1].trim(),
        expression: expressionMatch[1].trim()
      });
      
      // Update lastIndex to after the expression block
      const expressionEnd = match.index + match[0].length + 
        afterTitleContent.indexOf(expressionMatch[0]) + expressionMatch[0].length;
      lastIndex = expressionEnd;
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
  }
});

console.log('\n🎯 Expected UI Rendering:');
console.log('=========================');
console.log('✅ Text blocks render as regular markdown');
console.log('✅ DSL examples render as structured code blocks with:');
console.log('   📝 Title header with hash icon');
console.log('   📊 JSON input with syntax highlighting');
console.log('   ⚡ ZEN expression with syntax highlighting');
console.log('   🎨 Professional styling with proper sections');

console.log('\n🧪 Manual Testing Steps:');
console.log('========================');
console.log('1. Open http://localhost:8080');
console.log('2. Ask AI: "Show me string and array operations"');
console.log('3. Verify structured display:');
console.log('   - Clear section headers with icons');
console.log('   - Proper JSON syntax highlighting');
console.log('   - Clean ZEN expression formatting');
console.log('   - Try This buttons work correctly');

console.log('\n💡 Look for these visual improvements:');
console.log('=====================================');
console.log('• Title sections with indigo header background');
console.log('• Separate Sample Input and ZEN Expression sections');
console.log('• Syntax highlighting for JSON (light/dark theme)');
console.log('• JavaScript-style highlighting for expressions');
console.log('• Clean borders and spacing between sections');

console.log('\n🔥 Enhanced Chat → Parser Integration Complete!');
console.log('Now with beautiful structured code block display! 🎨'); 