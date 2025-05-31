#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Targeted Example Fixing Script
 * Focuses on specific, high-confidence fixes with reliable file updates
 */

console.log('🎯 Targeted Example Fixing Script');
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

// Focus on specific fix types
const targetFixes = {
  // Date format standardization (Z to +timezone)
  dateTimezone: {
    count: 0,
    examples: []
  },
  // Floating point precision
  floatingPoint: {
    count: 0,
    examples: []
  },
  // Array/Object JSON formatting
  jsonFormat: {
    count: 0,
    examples: []
  }
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
 * Classify and categorize fixes
 */
function classifyMismatch(mismatch) {
  const { expectedParsed, actualResult, expression } = mismatch;
  
  // Date timezone format issues
  if (typeof expectedParsed === 'string' && typeof actualResult === 'string') {
    // Check if it's a date format issue (Z vs timezone offset)
    const expectedDate = expectedParsed.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    const actualDate = actualResult.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    
    if (expectedDate && actualDate) {
      // Extract the date parts to see if they're the same date/time
      const expectedBase = expectedParsed.replace('Z', '');
      const actualBase = actualResult.replace(/[+-]\d{2}:\d{2}$/, '');
      
      if (expectedBase === actualBase) {
        return 'dateTimezone';
      }
    }
  }
  
  // Floating point precision
  if (typeof expectedParsed === 'number' && typeof actualResult === 'number') {
    const diff = Math.abs(expectedParsed - actualResult);
    if (diff > 0 && diff < 0.01) {
      return 'floatingPoint';
    }
  }
  
  // JSON formatting (arrays, objects)
  if ((Array.isArray(expectedParsed) && Array.isArray(actualResult)) ||
      (typeof expectedParsed === 'object' && typeof actualResult === 'object' &&
       expectedParsed !== null && actualResult !== null)) {
    return 'jsonFormat';
  }
  
  return 'other';
}

/**
 * Create a reliable file update function
 */
function updateExpectedOutput(filePath, exampleId, newExpectedOutput) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find the example by looking for the ID line and then the expectedOutput line
  const lines = content.split('\n');
  let foundExample = false;
  let lineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for the ID line
    if (line.includes(`id: '${exampleId}'`) || line.includes(`id: "${exampleId}"`)) {
      foundExample = true;
      // Now look for expectedOutput in the following lines
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('expectedOutput:')) {
          lineIndex = j;
          break;
        }
      }
      break;
    }
  }
  
  if (foundExample && lineIndex !== -1) {
    // Replace the expectedOutput line
    const indentation = lines[lineIndex].match(/^\s*/)[0];
    lines[lineIndex] = `${indentation}expectedOutput: ${newExpectedOutput},`;
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  
  return false;
}

/**
 * Process specific fix types
 */
async function processTargetedFixes() {
  console.log(`📊 Analyzing ${mismatches.length} mismatches for targeted fixes...\n`);
  
  // Classify all mismatches
  for (const mismatch of mismatches) {
    const category = classifyMismatch(mismatch);
    if (targetFixes[category]) {
      targetFixes[category].examples.push(mismatch);
      targetFixes[category].count++;
    }
  }
  
  // Report categories
  console.log('🔍 CATEGORIZED FIXES:');
  Object.entries(targetFixes).forEach(([category, data]) => {
    console.log(`   ${category}: ${data.count} examples`);
  });
  console.log('');
  
  // Process each category
  for (const [category, data] of Object.entries(targetFixes)) {
    if (data.count === 0) continue;
    
    console.log(`\n🔧 Processing ${category} fixes (${data.count} examples)...`);
    
    for (const mismatch of data.examples) {
      try {
        console.log(`  ⏳ ${mismatch.id}: ${mismatch.title}`);
        
        // Get fresh result from ZEN engine
        const actualResult = await callZenEngine(mismatch.expression, mismatch.sampleInput);
        
        // Format the new expected output
        let newExpectedOutput;
        if (typeof actualResult === 'string') {
          newExpectedOutput = `"${actualResult.replace(/"/g, '\\"')}"`;
        } else if (typeof actualResult === 'number') {
          newExpectedOutput = actualResult.toString();
        } else if (typeof actualResult === 'boolean') {
          newExpectedOutput = actualResult.toString();
        } else if (actualResult === null) {
          newExpectedOutput = 'null';
        } else {
          newExpectedOutput = JSON.stringify(actualResult);
        }
        
        // Apply the fix
        const filePath = path.join(EXAMPLES_DIR, mismatch.file);
        const success = updateExpectedOutput(filePath, mismatch.id, newExpectedOutput);
        
        if (success) {
          console.log(`  ✅ ${mismatch.id}: FIXED → ${newExpectedOutput}`);
        } else {
          console.log(`  ❌ ${mismatch.id}: FAILED TO UPDATE`);
        }
        
      } catch (error) {
        console.log(`  💥 ${mismatch.id}: ERROR - ${error.message}`);
      }
    }
  }
}

/**
 * Generate summary
 */
function generateSummary() {
  const totalFixes = Object.values(targetFixes).reduce((sum, data) => sum + data.count, 0);
  
  console.log('\n🎯 TARGETED FIX SUMMARY');
  console.log('========================');
  console.log(`📊 Total Targeted Fixes: ${totalFixes}`);
  
  Object.entries(targetFixes).forEach(([category, data]) => {
    if (data.count > 0) {
      console.log(`   ${category}: ${data.count} fixes`);
    }
  });
  
  if (totalFixes > 0) {
    console.log('\n🔄 NEXT STEPS:');
    console.log('1. Re-run validation: node scripts/validate-outputs.js');
    console.log('2. Check improvement in success rate');
    console.log('3. Review remaining failures manually');
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await processTargetedFixes();
    generateSummary();
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

main(); 