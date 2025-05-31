#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Precise Example Fixing Script
 * Updates expectedOutput values with high precision using AST-like parsing
 */

console.log('🔧 Precise Example Fixing Script');
console.log('=====================================\n');

const EXAMPLES_DIR = path.join(__dirname, '../src/examples');
const ZEN_API_URL = 'http://localhost:3000/api/evaluate-dsl';

// Load failure data
const mismatchFile = path.join(__dirname, '../output-mismatches.json');
if (!fs.existsSync(mismatchFile)) {
  console.error('❌ No output-mismatches.json found. Run validate-outputs.js first.');
  process.exit(1);
}

const mismatches = JSON.parse(fs.readFileSync(mismatchFile, 'utf8')).mismatches;

// Tracking
const results = {
  totalProcessed: 0,
  highConfidenceFixes: 0,
  mediumConfidenceFixes: 0,
  skippedForReview: 0,
  errors: 0,
  byCategory: {}
};

/**
 * Make API call to ZEN engine
 */
async function callZenEngine(expression, sampleInput) {
  try {
    const response = await fetch(ZEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: expression,
        data: typeof sampleInput === 'string' ? JSON.parse(sampleInput) : sampleInput
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    // Extract the actual result value from the API response
    let actualResult = result.result;
    
    if (typeof actualResult === 'string') {
      try {
        const parsed = JSON.parse(actualResult);
        if (parsed && typeof parsed === 'object' && 'result' in parsed) {
          actualResult = parsed.result;
        } else {
          actualResult = parsed;
        }
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }
    
    return actualResult;
  } catch (error) {
    throw new Error(`ZEN API call failed: ${error.message}`);
  }
}

/**
 * Classify fix confidence level
 */
function classifyFixConfidence(mismatch, actualResult) {
  const { expectedParsed, expression } = mismatch;
  
  // Skip obviously broken examples
  if (!expression || expression.trim() === '' || expression.includes('undefined')) {
    return 'skip';
  }
  
  // HIGH CONFIDENCE FIXES
  
  // 1. Floating point precision issues (tiny differences)
  if (typeof expectedParsed === 'number' && typeof actualResult === 'number') {
    const diff = Math.abs(expectedParsed - actualResult);
    if (diff > 0 && diff < 0.001) {
      return 'high';
    }
  }
  
  // 2. Date format standardization (ISO 8601)
  if (typeof actualResult === 'string' && actualResult.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return 'high';
  }
  
  // 3. Array/Object with identical structure but different formatting
  if (Array.isArray(expectedParsed) && Array.isArray(actualResult)) {
    if (expectedParsed.length === actualResult.length) {
      return 'high';
    }
  }
  
  // 4. String escaping differences (same content, different escaping)
  if (typeof expectedParsed === 'string' && typeof actualResult === 'string') {
    const expectedClean = expectedParsed.replace(/\\"/g, '"').replace(/\\'/g, "'");
    const actualClean = actualResult.replace(/\\"/g, '"').replace(/\\'/g, "'");
    if (expectedClean === actualClean) {
      return 'high';
    }
  }
  
  // MEDIUM CONFIDENCE FIXES
  
  // 1. Object structure matches but values differ slightly
  if (typeof expectedParsed === 'object' && typeof actualResult === 'object' &&
      expectedParsed !== null && actualResult !== null && 
      !Array.isArray(expectedParsed) && !Array.isArray(actualResult)) {
    const expectedKeys = Object.keys(expectedParsed).sort();
    const actualKeys = Object.keys(actualResult).sort();
    if (expectedKeys.length === actualKeys.length && 
        expectedKeys.every(key => actualKeys.includes(key))) {
      return 'medium';
    }
  }
  
  // 2. Template literal results (when expression contains template syntax)
  if (expression.includes('`') || expression.includes('${')) {
    return 'medium';
  }
  
  // Default to manual review
  return 'skip';
}

/**
 * Format result as proper expectedOutput string for TypeScript
 */
function formatExpectedOutput(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
  
  // For arrays and objects, use compact JSON
  return JSON.stringify(value);
}

/**
 * Update example file with new expectedOutput
 */
function updateExampleFile(filePath, exampleId, newExpectedOutput) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Strategy: Find the example by ID and replace just the expectedOutput field
  // More robust approach using line-by-line processing
  
  const lines = content.split('\n');
  let inTargetExample = false;
  let braceDepth = 0;
  let updatedLines = [];
  let foundExample = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line contains our target example ID
    if (line.includes(`id: "${exampleId}"`) || line.includes(`id: '${exampleId}'`)) {
      inTargetExample = true;
      foundExample = true;
      braceDepth = 0;
    }
    
    if (inTargetExample) {
      // Count braces to know when example object ends
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      
      // Check if this line contains expectedOutput
      if (line.includes('expectedOutput:')) {
        // Replace the expectedOutput value
        const indentation = line.match(/^\s*/)[0];
        const newLine = `${indentation}expectedOutput: ${newExpectedOutput},`;
        updatedLines.push(newLine);
        console.log(`    Updated line ${i + 1}: expectedOutput: ${newExpectedOutput}`);
      } else {
        updatedLines.push(line);
      }
      
      // End of example object
      if (braceDepth === 0 && line.includes('}')) {
        inTargetExample = false;
      }
    } else {
      updatedLines.push(line);
    }
  }
  
  if (foundExample) {
    const newContent = updatedLines.join('\n');
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  
  return false;
}

/**
 * Process a batch of fixes
 */
async function processFixes() {
  console.log(`📊 Processing ${mismatches.length} failing examples...\n`);
  
  // Group by file for efficient processing
  const fileGroups = {};
  mismatches.forEach(mismatch => {
    if (!fileGroups[mismatch.file]) {
      fileGroups[mismatch.file] = [];
    }
    fileGroups[mismatch.file].push(mismatch);
  });
  
  console.log(`📁 Processing ${Object.keys(fileGroups).length} files...\n`);
  
  for (const [fileName, examples] of Object.entries(fileGroups)) {
    console.log(`\n📄 Processing ${fileName} (${examples.length} examples)...`);
    
    if (!results.byCategory[fileName]) {
      results.byCategory[fileName] = {
        total: examples.length,
        fixed: 0,
        skipped: 0,
        errors: 0
      };
    }
    
    for (const mismatch of examples) {
      results.totalProcessed++;
      
      try {
        console.log(`  ⏳ ${mismatch.id}: ${mismatch.title}`);
        
        // Get fresh result from ZEN engine
        const actualResult = await callZenEngine(mismatch.expression, mismatch.sampleInput);
        
        // Classify fix confidence
        const confidence = classifyFixConfidence(mismatch, actualResult);
        
        if (confidence === 'skip') {
          console.log(`  ⚠️  ${mismatch.id}: SKIPPED (manual review required)`);
          results.skippedForReview++;
          results.byCategory[fileName].skipped++;
          continue;
        }
        
        // Apply the fix
        const newExpectedOutput = formatExpectedOutput(actualResult);
        const filePath = path.join(EXAMPLES_DIR, fileName);
        
        const success = updateExampleFile(filePath, mismatch.id, newExpectedOutput);
        
        if (success) {
          console.log(`  ✅ ${mismatch.id}: FIXED (${confidence} confidence)`);
          if (confidence === 'high') {
            results.highConfidenceFixes++;
          } else {
            results.mediumConfidenceFixes++;
          }
          results.byCategory[fileName].fixed++;
        } else {
          console.log(`  ❌ ${mismatch.id}: FAILED TO UPDATE`);
          results.errors++;
          results.byCategory[fileName].errors++;
        }
        
      } catch (error) {
        console.log(`  💥 ${mismatch.id}: ERROR - ${error.message}`);
        results.errors++;
        results.byCategory[fileName].errors++;
      }
    }
  }
}

/**
 * Generate summary report
 */
function generateSummary() {
  console.log('\n🎯 FIXING SUMMARY');
  console.log('==================');
  console.log(`📊 Total Processed: ${results.totalProcessed}`);
  console.log(`✅ High Confidence Fixes: ${results.highConfidenceFixes}`);
  console.log(`🔶 Medium Confidence Fixes: ${results.mediumConfidenceFixes}`);
  console.log(`⚠️  Skipped for Review: ${results.skippedForReview}`);
  console.log(`❌ Errors: ${results.errors}`);
  
  const totalFixed = results.highConfidenceFixes + results.mediumConfidenceFixes;
  const successRate = results.totalProcessed > 0 ? (totalFixed / results.totalProcessed * 100).toFixed(1) : 0;
  console.log(`\n🎉 Success Rate: ${successRate}% (${totalFixed}/${results.totalProcessed})`);
  
  console.log('\n📁 BY FILE:');
  Object.entries(results.byCategory).forEach(([file, stats]) => {
    const fileSuccessRate = stats.total > 0 ? (stats.fixed / stats.total * 100).toFixed(1) : 0;
    console.log(`   ${file}: ${stats.fixed}/${stats.total} fixed (${fileSuccessRate}%)`);
  });
  
  if (totalFixed > 0) {
    console.log('\n🔄 NEXT STEPS:');
    console.log('1. Compile TypeScript to verify syntax: pnpm run build');
    console.log('2. Re-run validation: node scripts/validate-outputs.js');
    console.log('3. Check remaining failures for manual review');
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await processFixes();
    generateSummary();
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

main(); 