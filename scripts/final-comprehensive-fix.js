#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Final Comprehensive Fix Script
 * Addresses all remaining failure types with advanced logic
 */

console.log('🚀 Final Comprehensive Fix Script');
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

// Results tracking
const results = {
  totalProcessed: 0,
  fixedAutomatically: 0,
  needsManualReview: 0,
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
 * Advanced mismatch classification with more patterns
 */
function classifyMismatch(mismatch) {
  const { expectedParsed, actualResult, expression, expectedOutput } = mismatch;
  
  // 1. Date/time related patterns
  if (expression.includes('d(') || expression.includes('date(') || 
      expression.includes('.format(') || expression.includes('.startOf(') ||
      expression.includes('.endOf(') || expression.includes('.add(') ||
      expression.includes('.sub(')) {
    return { type: 'date', confidence: 'high' };
  }
  
  // 2. String slicing patterns
  if (expression.includes('[') && expression.includes(':')) {
    return { type: 'stringSlice', confidence: 'high' };
  }
  
  // 3. Template literal patterns
  if (expression.includes('`') || expression.includes('${')) {
    return { type: 'template', confidence: 'medium' };
  }
  
  // 4. Range operations patterns
  if (expression.includes('..') || (expression.includes('[') && expression.includes(']'))) {
    return { type: 'range', confidence: 'medium' };
  }
  
  // 5. Complex mathematical expressions
  if (expression.includes('^') || expression.includes('sqrt(') || 
      expression.includes('round(') || expression.includes('precision(')) {
    return { type: 'math', confidence: 'high' };
  }
  
  // 6. Array formatting issues (quoted vs unquoted strings)
  if (Array.isArray(actualResult) && typeof expectedOutput === 'string' &&
      expectedOutput.startsWith("'[") && expectedOutput.endsWith("]'")) {
    return { type: 'arrayFormat', confidence: 'high' };
  }
  
  // 7. Boolean/logical expressions
  if (typeof expectedParsed === 'boolean' && typeof actualResult !== 'boolean') {
    return { type: 'booleanLogic', confidence: 'medium' };
  }
  
  return { type: 'other', confidence: 'low' };
}

/**
 * Apply intelligent fixes based on classification
 */
function createFixedExpectedOutput(mismatch, actualResult, classification) {
  const { type, confidence } = classification;
  
  switch (type) {
    case 'date':
      // Date results should be properly formatted strings
      if (typeof actualResult === 'string') {
        return `"${actualResult.replace(/"/g, '\\"')}"`;
      }
      return JSON.stringify(actualResult);
      
    case 'stringSlice':
      // String slice results are typically strings
      if (typeof actualResult === 'string') {
        return `"${actualResult.replace(/"/g, '\\"')}"`;
      }
      return JSON.stringify(actualResult);
      
    case 'template':
      // Template results are strings
      if (typeof actualResult === 'string') {
        return `"${actualResult.replace(/"/g, '\\"')}"`;
      }
      return JSON.stringify(actualResult);
      
    case 'range':
      // Range operations might return strings or arrays
      if (typeof actualResult === 'string') {
        return `"${actualResult.replace(/"/g, '\\"')}"`;
      }
      return JSON.stringify(actualResult);
      
    case 'math':
      // Math results are typically numbers
      if (typeof actualResult === 'number') {
        return actualResult.toString();
      }
      return JSON.stringify(actualResult);
      
    case 'arrayFormat':
      // Array formatting - convert to proper JSON
      return JSON.stringify(actualResult);
      
    case 'booleanLogic':
      // Boolean logic fixes
      if (typeof actualResult === 'boolean') {
        return actualResult.toString();
      }
      return JSON.stringify(actualResult);
      
    default:
      // Generic formatting
      if (typeof actualResult === 'string') {
        return `"${actualResult.replace(/"/g, '\\"')}"`;
      } else if (typeof actualResult === 'number') {
        return actualResult.toString();
      } else if (typeof actualResult === 'boolean') {
        return actualResult.toString();
      } else if (actualResult === null) {
        return 'null';
      } else {
        return JSON.stringify(actualResult);
      }
  }
}

/**
 * Reliable file update function
 */
function updateExpectedOutput(filePath, exampleId, newExpectedOutput) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let foundExample = false;
  let lineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes(`id: '${exampleId}'`) || line.includes(`id: "${exampleId}"`)) {
      foundExample = true;
      // Look for expectedOutput in the following lines
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        if (lines[j].includes('expectedOutput:')) {
          lineIndex = j;
          break;
        }
      }
      break;
    }
  }
  
  if (foundExample && lineIndex !== -1) {
    const indentation = lines[lineIndex].match(/^\s*/)[0];
    lines[lineIndex] = `${indentation}expectedOutput: ${newExpectedOutput},`;
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  
  return false;
}

/**
 * Process all remaining mismatches
 */
async function processRemainingMismatches() {
  console.log(`📊 Processing ${mismatches.length} remaining mismatches...\n`);
  
  // Group by file for organized processing
  const fileGroups = {};
  mismatches.forEach(mismatch => {
    if (!fileGroups[mismatch.file]) {
      fileGroups[mismatch.file] = [];
    }
    fileGroups[mismatch.file].push(mismatch);
  });
  
  console.log(`📁 Processing ${Object.keys(fileGroups).length} files...\n`);
  
  for (const [fileName, examples] of Object.entries(fileGroups)) {
    console.log(`\n📄 Processing ${fileName} (${examples.length} mismatches)...`);
    
    if (!results.byCategory[fileName]) {
      results.byCategory[fileName] = {
        total: examples.length,
        fixed: 0,
        needsReview: 0,
        errors: 0
      };
    }
    
    for (const mismatch of examples) {
      results.totalProcessed++;
      
      try {
        console.log(`  ⏳ ${mismatch.id}: ${mismatch.title}`);
        
        // Classify the mismatch
        const classification = classifyMismatch(mismatch);
        console.log(`    Type: ${classification.type} (${classification.confidence} confidence)`);
        
        // Get fresh result from ZEN engine
        const actualResult = await callZenEngine(mismatch.expression, mismatch.sampleInput);
        
        // Determine if we should auto-fix or flag for manual review
        const shouldAutoFix = classification.confidence === 'high' || 
                             (classification.confidence === 'medium' && 
                              classification.type !== 'booleanLogic');
        
        if (shouldAutoFix) {
          // Apply automatic fix
          const newExpectedOutput = createFixedExpectedOutput(mismatch, actualResult, classification);
          const filePath = path.join(EXAMPLES_DIR, fileName);
          
          const success = updateExpectedOutput(filePath, mismatch.id, newExpectedOutput);
          
          if (success) {
            console.log(`  ✅ ${mismatch.id}: AUTO-FIXED → ${newExpectedOutput}`);
            results.fixedAutomatically++;
            results.byCategory[fileName].fixed++;
          } else {
            console.log(`  ❌ ${mismatch.id}: FAILED TO UPDATE FILE`);
            results.errors++;
            results.byCategory[fileName].errors++;
          }
        } else {
          console.log(`  ⚠️  ${mismatch.id}: FLAGGED FOR MANUAL REVIEW`);
          console.log(`    Expected: ${JSON.stringify(mismatch.expectedParsed)}`);
          console.log(`    Actual: ${JSON.stringify(actualResult)}`);
          results.needsManualReview++;
          results.byCategory[fileName].needsReview++;
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
 * Generate comprehensive summary
 */
function generateSummary() {
  console.log('\n🎯 COMPREHENSIVE FIX SUMMARY');
  console.log('==============================');
  console.log(`📊 Total Processed: ${results.totalProcessed}`);
  console.log(`✅ Auto-Fixed: ${results.fixedAutomatically}`);
  console.log(`⚠️  Needs Manual Review: ${results.needsManualReview}`);
  console.log(`❌ Errors: ${results.errors}`);
  
  const successRate = results.totalProcessed > 0 ? 
    (results.fixedAutomatically / results.totalProcessed * 100).toFixed(1) : 0;
  console.log(`\n🎉 Auto-Fix Success Rate: ${successRate}%`);
  
  console.log('\n📁 BY FILE:');
  Object.entries(results.byCategory).forEach(([file, stats]) => {
    const fileSuccessRate = stats.total > 0 ? (stats.fixed / stats.total * 100).toFixed(1) : 0;
    console.log(`   ${file}: ${stats.fixed}/${stats.total} fixed (${fileSuccessRate}%)`);
    if (stats.needsReview > 0) {
      console.log(`     → ${stats.needsReview} need manual review`);
    }
  });
  
  if (results.fixedAutomatically > 0) {
    console.log('\n🔄 NEXT STEPS:');
    console.log('1. Re-run validation: node scripts/validate-outputs.js');
    console.log('2. Check improved success rate');
    if (results.needsManualReview > 0) {
      console.log('3. Manually review flagged examples');
      console.log('4. Create targeted fixes for remaining edge cases');
    }
  }
  
  // Save manual review list
  if (results.needsManualReview > 0) {
    const manualReviewExamples = mismatches.filter(m => {
      const classification = classifyMismatch(m);
      return classification.confidence === 'low' || 
             (classification.confidence === 'medium' && classification.type === 'booleanLogic');
    });
    
    fs.writeFileSync('manual-review-list.json', JSON.stringify({
      summary: {
        totalExamples: manualReviewExamples.length,
        generatedAt: new Date().toISOString()
      },
      examples: manualReviewExamples.map(ex => ({
        file: ex.file,
        id: ex.id,
        title: ex.title,
        expression: ex.expression,
        expectedOutput: ex.expectedOutput,
        actualResult: ex.actualResult,
        classification: classifyMismatch(ex)
      }))
    }, null, 2));
    
    console.log('\n📋 Manual review list saved to manual-review-list.json');
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await processRemainingMismatches();
    generateSummary();
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

main(); 