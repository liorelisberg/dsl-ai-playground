#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Example Validation Script
 * Tests all DSL examples against the ZEN engine evaluation service
 * Identifies and reports failed examples for fixing
 */

console.log('🔍 DSL Example Validation Script');
console.log('=====================================\n');

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const EXAMPLES_DIR = path.join(__dirname, '../src/examples');
const FAILED_EXAMPLES_FILE = path.join(__dirname, '../failed-examples.json');

// Statistics
let stats = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * Test a single example against the DSL evaluation service
 */
async function validateExample(example) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/evaluate-dsl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: example.expression,
        data: JSON.parse(example.sampleInput)
      })
    });

    const result = await response.json();
    
    // Check if evaluation was successful
    if (response.ok && result.result !== undefined && !result.error) {
      return { success: true, result: result.result };
    } else {
      return { 
        success: false, 
        error: result.error || result.message || 'Unknown error',
        httpStatus: response.status
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Network/Parse error: ${error.message}` 
    };
  }
}

/**
 * Load all examples from the examples directory
 */
async function loadAllExamples() {
  const examples = [];
  const exampleFiles = fs.readdirSync(EXAMPLES_DIR)
    .filter(file => file.endsWith('Examples.ts') || file.endsWith('Examples.js'))
    .filter(file => !file.includes('.backup.') && !file.includes('index.'));

  console.log(`📁 Found ${exampleFiles.length} example files:`);
  exampleFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');

  for (const file of exampleFiles) {
    try {
      const filePath = path.join(EXAMPLES_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // More robust regex to extract the examples array
      const examplesMatch = fileContent.match(/export const \w+Examples:\s*Example\[\]\s*=\s*(\[[\s\S]*?\]);?\s*$/m);
      
      if (examplesMatch) {
        // Clean up the array string and parse it
        let examplesStr = examplesMatch[1];
        
        // Remove trailing semicolon if present
        if (examplesStr.endsWith('];')) {
          examplesStr = examplesStr.slice(0, -1);
        }
        
        try {
          // Create a safe evaluation context
          const safeEval = new Function('', `
            // Define Example type interface for validation
            const Example = {};
            return ${examplesStr};
          `);
          
          const fileExamples = safeEval();
          
          if (Array.isArray(fileExamples)) {
            examples.push(...fileExamples.map(ex => ({
              ...ex,
              sourceFile: file
            })));
            console.log(`   ✅ Loaded ${fileExamples.length} examples from ${file}`);
          } else {
            console.warn(`⚠️  Invalid examples array in ${file}`);
          }
        } catch (parseError) {
          console.warn(`⚠️  Could not parse examples from ${file}: ${parseError.message}`);
          console.warn(`     Attempting alternative parsing...`);
          
          // Try alternative parsing for complex arrays
          try {
            // Load the file as a module by creating a temporary file
            const tempContent = fileContent
              .replace(/import.*from.*['"][^'"]*['"];?\s*/g, '') // Remove imports
              .replace(/export const (\w+Examples)/, 'const $1') + '\n\nexport default ' + fileContent.match(/export const (\w+Examples)/)[1] + ';';
            
            const tempPath = path.join(__dirname, `temp_${file}.mjs`);
            fs.writeFileSync(tempPath, tempContent);
            
            try {
              const module = await import(tempPath);
              const fileExamples = module.default;
              
              if (Array.isArray(fileExamples)) {
                examples.push(...fileExamples.map(ex => ({
                  ...ex,
                  sourceFile: file
                })));
                console.log(`   ✅ Loaded ${fileExamples.length} examples from ${file} (alternative method)`);
              }
            } finally {
              // Clean up temp file
              if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
              }
            }
          } catch (altError) {
            console.error(`❌ Failed to parse ${file} with both methods: ${altError.message}`);
          }
        }
      } else {
        console.warn(`⚠️  No examples export found in ${file}`);
        // Try to find the array pattern manually
        const arrayMatch = fileContent.match(/\[\s*\{[\s\S]*?\}\s*\]/);
        if (arrayMatch) {
          console.log(`   ⚠️  Found array pattern but not in expected export format`);
        }
      }
    } catch (error) {
      console.error(`❌ Error loading ${file}: ${error.message}`);
    }
  }

  console.log(`\n📊 Total examples loaded: ${examples.length}`);
  return examples;
}

/**
 * Check if the DSL service is running
 */
async function checkDSLService() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ DSL service is running\n');
      return true;
    } else {
      throw new Error(`Health check failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ DSL service is not running or not accessible');
    console.error('   Make sure to start the backend server: pnpm run dev:server');
    console.error(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Save failed examples to a file for analysis
 */
function saveFailedExamples(failedExamples) {
  const reportData = {
    timestamp: new Date().toISOString(),
    totalExamples: stats.total,
    failedCount: stats.failed,
    passedCount: stats.passed,
    failedExamples: failedExamples.map(ex => ({
      id: ex.example.id,
      title: ex.example.title,
      category: ex.example.category,
      expression: ex.example.expression,
      sampleInput: ex.example.sampleInput,
      sourceFile: ex.example.sourceFile,
      error: ex.error,
      httpStatus: ex.httpStatus
    }))
  };

  fs.writeFileSync(FAILED_EXAMPLES_FILE, JSON.stringify(reportData, null, 2));
  console.log(`\n📝 Failed examples saved to: ${FAILED_EXAMPLES_FILE}`);
}

/**
 * Main validation function
 */
async function validateAllExamples() {
  console.log('🚀 Starting example validation...\n');

  // Check if DSL service is running
  if (!(await checkDSLService())) {
    process.exit(1);
  }

  // Load all examples
  const examples = await loadAllExamples();
  console.log(`📊 Loaded ${examples.length} examples for validation\n`);

  if (examples.length === 0) {
    console.error('❌ No examples found to validate');
    process.exit(1);
  }

  stats.total = examples.length;
  const failedExamples = [];

  // Validate each example
  console.log('🧪 Testing examples...');
  
  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    process.stdout.write(`   [${i + 1}/${examples.length}] ${example.title} ... `);

    const result = await validateExample(example);

    if (result.success) {
      console.log('✅ PASS');
      stats.passed++;
    } else {
      console.log(`❌ FAIL - ${result.error}`);
      stats.failed++;
      failedExamples.push({
        example,
        error: result.error,
        httpStatus: result.httpStatus
      });
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Print summary
  console.log('\n📊 VALIDATION SUMMARY');
  console.log('=====================================');
  console.log(`Total Examples: ${stats.total}`);
  console.log(`✅ Passed: ${stats.passed} (${((stats.passed / stats.total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`);

  if (stats.failed > 0) {
    console.log('\n🔧 FAILED EXAMPLES BY CATEGORY:');
    const categoryGroups = {};
    failedExamples.forEach(({example}) => {
      if (!categoryGroups[example.category]) {
        categoryGroups[example.category] = 0;
      }
      categoryGroups[example.category]++;
    });

    Object.entries(categoryGroups)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} failed`);
      });

    saveFailedExamples(failedExamples);
    
    console.log('\n🛠️  NEXT STEPS:');
    console.log('1. Review failed-examples.json for error details');
    console.log('2. Run the fix script: node scripts/fix-examples.js');
    console.log('3. Re-run validation after fixes');
  } else {
    console.log('\n🎉 All examples passed validation! ✨');
  }

  console.log('\n✅ Validation complete!');
}

// Run the validation
validateAllExamples()
  .catch(error => {
    console.error('💥 Validation script failed:', error);
    process.exit(1);
  }); 