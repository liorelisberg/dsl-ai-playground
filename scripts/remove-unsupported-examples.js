#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Remove Unsupported Examples Script
 * Removes examples that use functions not supported by ZEN language
 */

console.log('🗑️  Remove Unsupported Examples Script');
console.log('=====================================\n');

// Configuration
const EXAMPLES_DIR = path.join(__dirname, '../src/examples');

// List of unsupported functions and their example IDs
const unsupportedExamples = [
  {
    id: 'array-flat-6',
    title: 'Get Unique Elements',
    function: 'unique()',
    reason: 'unique() function does not exist in ZEN language'
  },
  {
    id: 'array-flat-7', 
    title: 'Sort Numerical Array',
    function: 'sort()',
    reason: 'sort() function does not exist in ZEN language'
  },
  {
    id: 'array-flat-8',
    title: 'Sort String Array', 
    function: 'sort()',
    reason: 'sort() function does not exist in ZEN language'
  },
  {
    id: 'array-flat-9',
    title: 'Reverse Array',
    function: 'reverse()',
    reason: 'reverse() function does not exist in ZEN language'
  }
];

/**
 * Remove examples from a file
 */
function removeExamplesFromFile(filePath, exampleIds) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let removedCount = 0;
  
  for (const exampleId of exampleIds) {
    // Create regex to match the entire example object
    const exampleRegex = new RegExp(
      `\\s*{[^}]*id:\\s*['"]${exampleId}['"][^}]*}(?:,\\s*)?`,
      'gs'
    );
    
    const beforeLength = fileContent.length;
    fileContent = fileContent.replace(exampleRegex, '');
    
    if (fileContent.length < beforeLength) {
      removedCount++;
      console.log(`   ✅ Removed example: ${exampleId}`);
    }
  }
  
  // Clean up any trailing commas
  fileContent = fileContent.replace(/,(\s*\])/g, '$1');
  
  if (removedCount > 0) {
    fs.writeFileSync(filePath, fileContent);
  }
  
  return removedCount;
}

/**
 * Main function
 */
async function removeUnsupportedExamples() {
  console.log('🚀 Starting removal of unsupported examples...\n');
  
  console.log('📋 Examples to remove:');
  unsupportedExamples.forEach(example => {
    console.log(`   - ${example.id}: ${example.title} (${example.function})`);
    console.log(`     Reason: ${example.reason}`);
  });
  console.log('');
  
  // Group examples by source file
  const examplesByFile = {};
  unsupportedExamples.forEach(example => {
    // Assume they're in arrayOperationsExamples.ts based on the failed examples
    const sourceFile = 'arrayOperationsExamples.ts';
    if (!examplesByFile[sourceFile]) {
      examplesByFile[sourceFile] = [];
    }
    examplesByFile[sourceFile].push(example.id);
  });
  
  let totalRemoved = 0;
  
  // Process each file
  for (const [fileName, exampleIds] of Object.entries(examplesByFile)) {
    const filePath = path.join(EXAMPLES_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      console.log(`📄 Processing ${fileName}:`);
      const removed = removeExamplesFromFile(filePath, exampleIds);
      totalRemoved += removed;
      console.log(`   Removed ${removed} examples\n`);
    } else {
      console.log(`⚠️  File not found: ${fileName}\n`);
    }
  }
  
  // Summary
  console.log('📊 REMOVAL SUMMARY');
  console.log('=====================================');
  console.log(`Total Examples Removed: ${totalRemoved}`);
  console.log(`Reason: Using functions not supported by ZEN language`);
  
  if (totalRemoved > 0) {
    console.log('\n🛠️  NEXT STEPS:');
    console.log('1. Re-run validation: node scripts/validate-examples.js');
    console.log('2. Commit the changes if validation improves');
    console.log('3. Focus on remaining valid examples that need debugging');
  }
  
  console.log('\n✅ Removal complete!');
}

// Run the script
removeUnsupportedExamples()
  .catch(error => {
    console.error('💥 Removal script failed:', error);
    process.exit(1);
  }); 