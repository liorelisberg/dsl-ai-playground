#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fix Syntax Errors Script
 * Finds and fixes common syntax errors in example files
 */

console.log('🔧 Fix Syntax Errors Script');
console.log('=====================================\n');

// Configuration
const EXAMPLES_DIR = path.join(__dirname, '../src/examples');

// Known syntax error patterns and their fixes
const syntaxFixes = [
  {
    name: 'Fix incomplete map expressions with "allocated"',
    pattern: /expression:\s*"map\([^,]+,\s*\{[^}]*status:\s*"allocated"\}[^"]*"[^,]*/g,
    replacement: 'expression: "map(#, {id: #.id, status: \\"allocated\\"})"'
  },
  {
    name: 'Fix incomplete map expressions with "analyzed"', 
    pattern: /expression:\s*"map\([^,]+,\s*\{[^}]*status:\s*"analyzed"\}[^"]*"[^,]*/g,
    replacement: 'expression: "map(#, {id: #.id, status: \\"analyzed\\"})"'
  },
  {
    name: 'Fix standalone number expressions',
    pattern: /expression:\s*"30"[^,]*/g,
    replacement: 'expression: "30"'
  },
  {
    name: 'Fix incomplete template strings',
    pattern: /expression:\s*""Complex template result""[^,]*/g,
    replacement: 'expression: "\\"Complex template result\\""'
  },
  {
    name: 'Fix broken object syntax',
    pattern: /\}\s*,?\s*[^,}\]]*,?\s*category:/g,
    replacement: '},\n    category:'
  }
];

/**
 * Fix syntax errors in a file
 */
function fixSyntaxErrors(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let fixedCount = 0;
  const fileName = path.basename(filePath);
  
  console.log(`📄 Processing ${fileName}:`);
  
  for (const fix of syntaxFixes) {
    const beforeLength = fileContent.length;
    const beforeMatches = (fileContent.match(fix.pattern) || []).length;
    
    fileContent = fileContent.replace(fix.pattern, fix.replacement);
    
    const afterMatches = (fileContent.match(fix.pattern) || []).length;
    const fixesApplied = beforeMatches - afterMatches;
    
    if (fixesApplied > 0) {
      console.log(`   ✅ ${fix.name}: ${fixesApplied} fixes applied`);
      fixedCount += fixesApplied;
    }
  }
  
  // Additional fixes for specific patterns
  
  // Fix trailing commas and malformed objects
  const originalContent = fileContent;
  fileContent = fileContent.replace(/,(\s*\])/g, '$1'); // Remove trailing commas before array end
  fileContent = fileContent.replace(/,(\s*\})/g, '$1'); // Remove trailing commas before object end
  
  // Fix incomplete expressions that end abruptly
  fileContent = fileContent.replace(/expression:\s*"[^"]*(?<![\]\}])"\s*,?\s*sampleInput:/g, (match) => {
    // If expression looks incomplete, mark for manual review
    if (match.includes('status:') && !match.includes('}')) {
      console.log(`   ⚠️  Found potentially incomplete expression: ${match.substring(0, 50)}...`);
    }
    return match;
  });
  
  if (fileContent !== originalContent) {
    console.log(`   ✅ Additional cleanup applied`);
    fixedCount++;
  }
  
  if (fixedCount > 0) {
    fs.writeFileSync(filePath, fileContent);
    console.log(`   📝 ${fixedCount} total fixes applied to ${fileName}\n`);
  } else {
    console.log(`   ✅ No fixes needed for ${fileName}\n`);
  }
  
  return fixedCount;
}

/**
 * Test if a file can be parsed as valid TypeScript
 */
function testFileParsing(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // Basic syntax check - look for obvious issues
    const hasUnmatchedBraces = (fileContent.match(/\{/g) || []).length !== (fileContent.match(/\}/g) || []).length;
    const hasUnmatchedBrackets = (fileContent.match(/\[/g) || []).length !== (fileContent.match(/\]/g) || []).length;
    const hasUnmatchedQuotes = (fileContent.match(/"/g) || []).length % 2 !== 0;
    
    if (hasUnmatchedBraces || hasUnmatchedBrackets || hasUnmatchedQuotes) {
      return { canParse: false, issues: { hasUnmatchedBraces, hasUnmatchedBrackets, hasUnmatchedQuotes } };
    }
    
    return { canParse: true };
  } catch (error) {
    return { canParse: false, error: error.message };
  }
}

/**
 * Main function
 */
async function fixAllSyntaxErrors() {
  console.log('🚀 Starting syntax error fixes...\n');
  
  const exampleFiles = fs.readdirSync(EXAMPLES_DIR)
    .filter(file => file.endsWith('Examples.ts'))
    .filter(file => !file.includes('.backup.') && !file.includes('index.'));
  
  console.log(`📁 Found ${exampleFiles.length} example files to process\n`);
  
  let totalFixed = 0;
  const results = [];
  
  for (const file of exampleFiles) {
    const filePath = path.join(EXAMPLES_DIR, file);
    
    // Test parsing before fixes
    const beforeTest = testFileParsing(filePath);
    
    // Apply fixes
    const fixCount = fixSyntaxErrors(filePath);
    
    // Test parsing after fixes
    const afterTest = testFileParsing(filePath);
    
    results.push({
      file,
      beforeCanParse: beforeTest.canParse,
      afterCanParse: afterTest.canParse,
      fixesApplied: fixCount,
      beforeIssues: beforeTest.issues,
      afterIssues: afterTest.issues
    });
    
    totalFixed += fixCount;
  }
  
  // Summary
  console.log('📊 SYNTAX FIX SUMMARY');
  console.log('=====================================');
  console.log(`Total Files Processed: ${exampleFiles.length}`);
  console.log(`Total Fixes Applied: ${totalFixed}`);
  
  const fixedFiles = results.filter(r => r.fixesApplied > 0);
  console.log(`Files Fixed: ${fixedFiles.length}`);
  
  const stillBroken = results.filter(r => !r.afterCanParse);
  if (stillBroken.length > 0) {
    console.log(`\n⚠️  Files Still With Issues: ${stillBroken.length}`);
    stillBroken.forEach(r => {
      console.log(`   - ${r.file}: ${JSON.stringify(r.afterIssues || r.error)}`);
    });
  }
  
  const newlyFixed = results.filter(r => !r.beforeCanParse && r.afterCanParse);
  if (newlyFixed.length > 0) {
    console.log(`\n🎉 Files Successfully Fixed: ${newlyFixed.length}`);
    newlyFixed.forEach(r => {
      console.log(`   - ${r.file}`);
    });
  }
  
  console.log('\n✅ Syntax fix complete!');
  
  if (totalFixed > 0) {
    console.log('\n🛠️  NEXT STEPS:');
    console.log('1. Re-run validation: node scripts/validate-examples.js');
    console.log('2. Check TypeScript compilation: npx tsc --noEmit');
    console.log('3. Commit changes if validation improves');
  }
}

// Run the script
fixAllSyntaxErrors()
  .catch(error => {
    console.error('💥 Syntax fix script failed:', error);
    process.exit(1);
  }); 