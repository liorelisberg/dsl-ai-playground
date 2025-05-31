#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Smart Example Fixing Script
 * Automatically fixes expectedOutput based on actual ZEN engine results
 */

console.log('🛠️  Smart Example Fixing Script');
console.log('=====================================\n');

const EXAMPLES_DIR = path.join(__dirname, '../src/examples');
const ZEN_API_URL = 'http://localhost:3000/api/evaluate-dsl';

// Load failure analysis
const analysisFile = path.join(__dirname, '../failure-analysis.json');
if (!fs.existsSync(analysisFile)) {
  console.error('❌ No failure-analysis.json found. Run analyze-failures.js first.');
  process.exit(1);
}

const analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
const mismatches = JSON.parse(fs.readFileSync('output-mismatches.json', 'utf8')).mismatches;

// Tracking
const fixes = {
  applied: 0,
  skipped: 0,
  errors: 0,
  byType: {}
};

/**
 * Make API call to ZEN engine to get fresh result
 */
async function callZenEngine(expression, sampleInput) {
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
}

/**
 * Format actual result as expectedOutput string
 */
function formatAsExpectedOutput(actualResult) {
  if (actualResult === null) return 'null';
  if (actualResult === undefined) return 'undefined';
  if (typeof actualResult === 'boolean') return actualResult.toString();
  if (typeof actualResult === 'number') return actualResult.toString();
  if (typeof actualResult === 'string') return `"${actualResult}"`;
  
  // For objects and arrays, use JSON with proper formatting
  return JSON.stringify(actualResult);
}

/**
 * Check if a fix should be applied based on confidence
 */
function shouldApplyFix(mismatch, actualResult) {
  const { expression, expectedParsed } = mismatch;
  
  // Never fix if expression looks suspicious or incomplete
  if (expression.includes('undefined') || expression.trim() === '') {
    return false;
  }
  
  // High confidence fixes
  // 1. Date format standardization
  if (typeof actualResult === 'string' && actualResult.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return true;
  }
  
  // 2. Floating point precision (small differences)
  if (typeof expectedParsed === 'number' && typeof actualResult === 'number') {
    const diff = Math.abs(expectedParsed - actualResult);
    if (diff < 0.01 && diff > 0) {
      return true;
    }
  }
  
  // 3. Array/Object formatting (structure same, formatting different)
  if (Array.isArray(expectedParsed) && Array.isArray(actualResult)) {
    return true;
  }
  
  if (typeof expectedParsed === 'object' && typeof actualResult === 'object' && 
      expectedParsed !== null && actualResult !== null) {
    return true;
  }
  
  // 4. String escaping issues
  if (typeof expectedParsed === 'string' && typeof actualResult === 'string') {
    const expectedUnescaped = expectedParsed.replace(/\\"/g, '"');
    const actualUnescaped = actualResult.replace(/\\"/g, '"');
    if (expectedUnescaped === actualUnescaped) {
      return true;
    }
  }
  
  // Medium confidence - require manual review for now
  return false;
}

/**
 * Apply fix to a specific example in a file
 */
function applyFixToFile(filePath, exampleId, newExpectedOutput) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find the specific example and update its expectedOutput
  // This regex matches the example object and captures the expectedOutput field
  const exampleRegex = new RegExp(
    `(\\{[^}]*id:\\s*['"]${exampleId}['"][^}]*expectedOutput:\\s*)(['"][^'"]*['"]|[^,}]*)(.*?\\})`,
    'gm'
  );
  
  const updatedContent = content.replace(exampleRegex, (match, prefix, oldExpected, suffix) => {
    console.log(`    Updating ${exampleId}: ${oldExpected} → ${newExpectedOutput}`);
    return `${prefix}${newExpectedOutput}${suffix}`;
  });
  
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent);
    return true;
  }
  
  return false;
}

/**
 * Process fixes for a specific pattern type
 */
async function processPatternFixes(patternType, examples) {
  console.log(`\n🔧 Processing ${patternType} fixes (${examples.length} examples)...`);
  
  fixes.byType[patternType] = { applied: 0, skipped: 0, errors: 0 };
  
  for (const mismatch of examples) {
    try {
      console.log(`  ⏳ ${mismatch.id}: ${mismatch.title}`);
      
      // Get fresh result from ZEN engine
      const actualResult = await callZenEngine(mismatch.expression, mismatch.sampleInput);
      
      // Check if we should apply this fix
      if (!shouldApplyFix(mismatch, actualResult)) {
        console.log(`  ⚠️  ${mismatch.id}: SKIPPED (requires manual review)`);
        fixes.skipped++;
        fixes.byType[patternType].skipped++;
        continue;
      }
      
      // Format the new expected output
      const newExpectedOutput = formatAsExpectedOutput(actualResult);
      
      // Apply the fix to the file
      const filePath = path.join(EXAMPLES_DIR, mismatch.file);
      const success = applyFixToFile(filePath, mismatch.id, newExpectedOutput);
      
      if (success) {
        console.log(`  ✅ ${mismatch.id}: FIXED`);
        fixes.applied++;
        fixes.byType[patternType].applied++;
      } else {
        console.log(`  ❌ ${mismatch.id}: FAILED TO UPDATE FILE`);
        fixes.errors++;
        fixes.byType[patternType].errors++;
      }
      
    } catch (error) {
      console.log(`  💥 ${mismatch.id}: ERROR - ${error.message}`);
      fixes.errors++;
      fixes.byType[patternType].errors++;
    }
  }
}

/**
 * Generate manual review report for skipped examples
 */
function generateManualReviewReport(skippedExamples) {
  const manualReview = {
    summary: {
      totalExamples: skippedExamples.length,
      generatedAt: new Date().toISOString()
    },
    examples: skippedExamples.map(ex => ({
      file: ex.file,
      id: ex.id,
      title: ex.title,
      expression: ex.expression,
      expectedOutput: ex.expectedOutput,
      actualResult: ex.actualResult,
      reason: 'Requires manual verification',
      recommendation: 'Review expression logic and expected output validity'
    }))
  };
  
  fs.writeFileSync('manual-review.json', JSON.stringify(manualReview, null, 2));
  console.log(`\n📋 Manual review report saved to manual-review.json`);
}

/**
 * Main execution
 */
async function main() {
  console.log(`📊 Found ${mismatches.length} failing examples to process\n`);
  
  // Group mismatches by pattern for targeted fixing
  const patternGroups = {};
  
  mismatches.forEach(mismatch => {
    // Simple pattern classification
    let pattern = 'other';
    
    if (typeof mismatch.actualResult === 'string' && 
        mismatch.actualResult.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      pattern = 'dateFormat';
    } else if (typeof mismatch.expectedParsed === 'number' && 
               typeof mismatch.actualResult === 'number') {
      pattern = 'floatingPoint';
    } else if (Array.isArray(mismatch.expectedParsed) && 
               Array.isArray(mismatch.actualResult)) {
      pattern = 'arrayFormat';
    } else if (mismatch.expression.includes('`') || mismatch.expression.includes('${')) {
      pattern = 'templateFormat';
    } else if (typeof mismatch.expectedParsed === 'object' && 
               typeof mismatch.actualResult === 'object' &&
               mismatch.expectedParsed !== null && mismatch.actualResult !== null) {
      pattern = 'objectFormat';
    }
    
    if (!patternGroups[pattern]) {
      patternGroups[pattern] = [];
    }
    patternGroups[pattern].push(mismatch);
  });
  
  // Process each pattern group
  const priorityOrder = ['dateFormat', 'floatingPoint', 'arrayFormat', 'objectFormat', 'templateFormat', 'other'];
  
  for (const pattern of priorityOrder) {
    if (patternGroups[pattern]) {
      await processPatternFixes(pattern, patternGroups[pattern]);
    }
  }
  
  // Generate final report
  console.log('\n🎯 FIXING SUMMARY');
  console.log('==================');
  console.log(`✅ Applied: ${fixes.applied}`);
  console.log(`⚠️  Skipped: ${fixes.skipped}`);
  console.log(`❌ Errors: ${fixes.errors}`);
  
  console.log('\n📊 BY PATTERN:');
  Object.entries(fixes.byType).forEach(([pattern, stats]) => {
    console.log(`   ${pattern}: ${stats.applied} applied, ${stats.skipped} skipped, ${stats.errors} errors`);
  });
  
  if (fixes.applied > 0) {
    console.log('\n🔄 NEXT STEPS:');
    console.log('1. Re-run TypeScript compilation to check syntax');
    console.log('2. Re-run output validation to verify fixes');
    console.log('3. Review manual-review.json for remaining issues');
  }
}

main().catch(console.error); 