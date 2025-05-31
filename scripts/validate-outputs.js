#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Output Validation Script
 * Validates DSL example outputs against ZEN engine evaluation results
 * Handles time-dependent examples with format validation
 */

console.log('🔍 Output Validation Script');
console.log('=====================================\n');

// Configuration
const EXAMPLES_DIR = path.join(__dirname, '../src/examples');
const ZEN_API_URL = 'http://localhost:3000/api/evaluate-dsl';

// Time-dependent examples that need format validation instead of exact matching
const TIME_DEPENDENT_EXAMPLES = {
  'date-const-5': {
    description: 'Get Today at Midnight',
    formatValidator: (result) => {
      // Should match ISO datetime with timezone: YYYY-MM-DDTHH:MM:SS+HH:MM
      const isoTimezoneRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;
      return isoTimezoneRegex.test(result);
    }
  },
  'date-const-7': {
    description: 'Get Yesterday at Midnight',
    formatValidator: (result) => {
      // Should match ISO datetime with timezone and be yesterday's date
      const isoTimezoneRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;
      if (!isoTimezoneRegex.test(result)) return false;
      
      // Extract date part and verify it's yesterday
      const resultDate = new Date(result).toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const expectedDate = yesterday.toISOString().split('T')[0];
      
      return resultDate === expectedDate;
    }
  },
  'complex-template-1': {
    description: 'Dynamic Report Generation',
    formatValidator: (result) => {
      // Should contain the template structure with proper date format
      const expectedStructure = /Report Summary:\nTotal Orders: 2\nRevenue: \$400\nTop Customer: Alice\nGenerated: \d{4}-\d{2}-\d{2} \d{2}:\d{2}/;
      if (!expectedStructure.test(result)) return false;
      
      // Verify the date part is today's date
      const dateMatch = result.match(/Generated: (\d{4}-\d{2}-\d{2}) \d{2}:\d{2}/);
      if (!dateMatch) return false;
      
      const generatedDate = dateMatch[1];
      const today = new Date().toISOString().split('T')[0];
      
      return generatedDate === today;
    }
  }
};

// Results tracking
const results = {
  totalExamples: 0,
  passedExamples: 0,
  failedExamples: 0,
  apiErrors: 0,
  mismatches: [],
  apiFailures: [],
  summary: {}
};

/**
 * Make API call to ZEN engine
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
  
  // The API returns a JSON-stringified object, so we need to parse it
  if (typeof actualResult === 'string') {
    try {
      const parsed = JSON.parse(actualResult);
      // If the parsed result has a 'result' field, extract that
      if (parsed && typeof parsed === 'object' && 'result' in parsed) {
        actualResult = parsed.result;
      } else {
        actualResult = parsed;
      }
    } catch (e) {
      // If it's not valid JSON, keep as string
    }
  }
  
  return actualResult;
}

/**
 * Compare expected output with actual result
 * Uses format validation for time-dependent examples
 */
function compareOutputs(example, actualResult) {
  // Check if this is a time-dependent example
  if (TIME_DEPENDENT_EXAMPLES[example.id]) {
    const validator = TIME_DEPENDENT_EXAMPLES[example.id];
    const isValidFormat = validator.formatValidator(actualResult);
    
    if (isValidFormat) {
      console.log(`  ✅ ${example.id}: PASSED (format validated)`);
      return { passed: true, type: 'format-validated' };
    } else {
      console.log(`  ❌ ${example.id}: FORMAT MISMATCH`);
      return { 
        passed: false, 
        type: 'format-mismatch',
        details: `Format validation failed for time-dependent example: ${validator.description}`
      };
    }
  }

  // Standard exact matching for non-time-dependent examples
  const expectedStr = JSON.stringify(example.expectedOutput);
  const actualStr = JSON.stringify(actualResult);

  if (expectedStr === actualStr) {
    console.log(`  ✅ ${example.id}: PASSED`);
    return { passed: true, type: 'exact-match' };
  } else {
    console.log(`  ❌ ${example.id}: OUTPUT MISMATCH`);
    return { 
      passed: false, 
      type: 'output-mismatch',
      expectedStr,
      actualStr
    };
  }
}

/**
 * Parse expected output string to actual value
 */
function parseExpectedOutput(expectedOutput) {
  if (typeof expectedOutput !== 'string') {
    return expectedOutput;
  }

  // Handle string literals
  if (expectedOutput.startsWith('"') && expectedOutput.endsWith('"')) {
    return expectedOutput.slice(1, -1);
  }
  
  // Handle single quoted strings
  if (expectedOutput.startsWith("'") && expectedOutput.endsWith("'")) {
    return expectedOutput.slice(1, -1);
  }

  // Handle numbers
  if (/^-?\d+(\.\d+)?$/.test(expectedOutput)) {
    return parseFloat(expectedOutput);
  }

  // Handle booleans
  if (expectedOutput === 'true') return true;
  if (expectedOutput === 'false') return false;
  if (expectedOutput === 'null') return null;

  // Handle arrays and objects
  try {
    return JSON.parse(expectedOutput);
  } catch (e) {
    // If JSON parsing fails, return as string
    return expectedOutput;
  }
}

/**
 * Deep equality comparison with type coercion
 */
function deepEqual(actual, expected) {
  // Handle null/undefined
  if (actual === null && expected === null) return true;
  if (actual === undefined && expected === undefined) return true;
  if (actual === null || expected === null) return false;
  if (actual === undefined || expected === undefined) return false;

  // Handle primitive types
  if (typeof actual !== 'object' && typeof expected !== 'object') {
    // Handle number comparison with tolerance for floating point
    if (typeof actual === 'number' && typeof expected === 'number') {
      return Math.abs(actual - expected) < 1e-10;
    }
    return actual === expected;
  }

  // Handle arrays
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    return actual.every((item, index) => deepEqual(item, expected[index]));
  }

  // Handle objects
  if (typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = Object.keys(actual).sort();
    const expectedKeys = Object.keys(expected).sort();
    
    if (actualKeys.length !== expectedKeys.length) return false;
    if (!actualKeys.every(key => expectedKeys.includes(key))) return false;
    
    return actualKeys.every(key => deepEqual(actual[key], expected[key]));
  }

  return false;
}

/**
 * Validate a single example
 */
async function validateExample(example, fileName) {
  results.totalExamples++;
  
  try {
    console.log(`  ⏳ ${example.id}: ${example.title}`);
    
    // Make API call
    const actualResult = await callZenEngine(example.expression, example.sampleInput);
    const expectedResult = parseExpectedOutput(example.expectedOutput);
    
    // Compare results
    const comparisonResult = compareOutputs(example, actualResult);
    
    if (comparisonResult.passed) {
      if (comparisonResult.type === 'format-validated') {
        console.log(`  ✅ ${example.id}: PASSED (format validated)`);
      } else {
      console.log(`  ✅ ${example.id}: PASSED`);
      }
      results.passedExamples++;
    } else {
      console.log(`  ❌ ${example.id}: ${comparisonResult.type}`);
      results.failedExamples++;
      
      results.mismatches.push({
        file: fileName,
        id: example.id,
        title: example.title,
        expression: example.expression,
        sampleInput: example.sampleInput,
        expectedOutput: example.expectedOutput,
        expectedParsed: expectedResult,
        actualResult: actualResult,
        category: example.category || 'unknown',
        details: comparisonResult.details
      });
    }
    
  } catch (error) {
    console.log(`  💥 ${example.id}: API ERROR - ${error.message}`);
    results.apiErrors++;
    results.failedExamples++;
    
    results.apiFailures.push({
      file: fileName,
      id: example.id,
      title: example.title,
      expression: example.expression,
      sampleInput: example.sampleInput,
      error: error.message,
      category: example.category || 'unknown'
    });
  }
}

/**
 * Parse TypeScript file and extract examples
 */
function parseExamplesFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // More robust regex to extract the examples array (from working validation script)
  const examplesMatch = content.match(/export const \w+Examples:\s*Example\[\]\s*=\s*(\[[\s\S]*?\]);?\s*$/m);
  
  if (!examplesMatch) {
    return [];
  }

  let examplesStr = examplesMatch[1];
  
  // Remove trailing semicolon if present
  if (examplesStr.endsWith('];')) {
    examplesStr = examplesStr.slice(0, -1);
  }
  
  try {
    // Create a safe evaluation context (from working validation script)
    const safeEval = new Function('', `
      // Define Example type interface for validation
      const Example = {};
      return ${examplesStr};
    `);
    
    const fileExamples = safeEval();
    
    if (Array.isArray(fileExamples)) {
      return fileExamples.filter(ex => ex.id && ex.expression && ex.expectedOutput !== undefined);
    } else {
      console.warn(`⚠️  Invalid examples array in ${path.basename(filePath)}`);
      return [];
    }
  } catch (parseError) {
    console.warn(`⚠️  Could not parse examples from ${path.basename(filePath)}: ${parseError.message}`);
    return [];
  }
}

/**
 * Process all example files
 */
async function processAllFiles() {
  const files = fs.readdirSync(EXAMPLES_DIR)
    .filter(file => file.endsWith('Examples.ts'))
    .sort();

  console.log(`📁 Found ${files.length} example files\n`);

  for (const file of files) {
    const filePath = path.join(EXAMPLES_DIR, file);
    console.log(`📄 Processing ${file}...`);
    
    try {
      const examples = parseExamplesFromFile(filePath);
      console.log(`  📊 Found ${examples.length} examples`);
      
      results.summary[file] = {
        total: examples.length,
        passed: 0,
        failed: 0
      };
      
      for (const example of examples) {
        await validateExample(example, file);
      }
      
      // Update file summary
      const filePassed = examples.length - results.mismatches.filter(m => m.file === file).length - results.apiFailures.filter(f => f.file === file).length;
      results.summary[file].passed = filePassed;
      results.summary[file].failed = examples.length - filePassed;
      
    } catch (error) {
      console.log(`  💥 Error processing file: ${error.message}`);
    }
    
    console.log('');
  }
}

/**
 * Generate final report
 */
function generateReport() {
  console.log('\n🎯 VALIDATION SUMMARY');
  console.log('=====================================');
  console.log(`📊 Total Examples: ${results.totalExamples}`);
  console.log(`✅ Passed: ${results.passedExamples} (${(results.passedExamples/results.totalExamples*100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failedExamples} (${(results.failedExamples/results.totalExamples*100).toFixed(1)}%)`);
  console.log(`💥 API Errors: ${results.apiErrors}`);
  console.log(`🔀 Output Mismatches: ${results.mismatches.length}`);

  console.log('\n📁 BY FILE:');
  Object.entries(results.summary).forEach(([file, stats]) => {
    const successRate = stats.total > 0 ? (stats.passed / stats.total * 100).toFixed(1) : 0;
    console.log(`  ${file}: ${stats.passed}/${stats.total} (${successRate}%)`);
  });

  // Save detailed reports
  if (results.mismatches.length > 0) {
    fs.writeFileSync('output-mismatches.json', JSON.stringify({
      summary: {
        totalMismatches: results.mismatches.length,
        generatedAt: new Date().toISOString()
      },
      mismatches: results.mismatches
    }, null, 2));
    console.log('\n💾 Detailed mismatch report saved to output-mismatches.json');
  }

  if (results.apiFailures.length > 0) {
    fs.writeFileSync('api-failures.json', JSON.stringify({
      summary: {
        totalFailures: results.apiFailures.length,
        generatedAt: new Date().toISOString()
      },
      failures: results.apiFailures
    }, null, 2));
    console.log('💾 API failure report saved to api-failures.json');
  }

  // Overall result
  const overallSuccess = results.failedExamples === 0;
  console.log(`\n🏆 OVERALL: ${overallSuccess ? 'SUCCESS' : 'FAILURES DETECTED'}`);
  
  if (!overallSuccess) {
    console.log('\n🔍 To investigate failures:');
    if (results.mismatches.length > 0) {
      console.log('   📄 Check output-mismatches.json for detailed output comparison');
    }
    if (results.apiFailures.length > 0) {
      console.log('   📄 Check api-failures.json for API error details');
    }
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await processAllFiles();
    generateReport();
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

main(); 