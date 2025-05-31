#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Failure Analysis Script
 * Analyzes output mismatches to identify patterns and create targeted fixes
 */

console.log('🔍 Failure Pattern Analysis');
console.log('=====================================\n');

// Load the mismatch data
const mismatchFile = path.join(__dirname, '../output-mismatches.json');
if (!fs.existsSync(mismatchFile)) {
  console.error('❌ No output-mismatches.json found. Run validate-outputs.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(mismatchFile, 'utf8'));
const mismatches = data.mismatches;

console.log(`📊 Analyzing ${mismatches.length} failed examples\n`);

// Analysis categories
const analysis = {
  byCategory: {},
  byPattern: {
    dateFormat: [],
    floatingPoint: [],
    stringEscape: [],
    objectFormat: [],
    arrayFormat: [],
    templateFormat: [],
    rangeFormat: [],
    typeCoercion: [],
    other: []
  },
  byFile: {},
  criticalIssues: []
};

/**
 * Categorize a mismatch by pattern type
 */
function categorizePattern(mismatch) {
  const { expectedParsed, actualResult, expression } = mismatch;
  
  // Date format issues
  if (typeof actualResult === 'string' && 
      (actualResult.includes('T') && actualResult.includes('Z')) ||
      expression.includes('d(') || expression.includes('date(')) {
    return 'dateFormat';
  }
  
  // Floating point precision
  if (typeof expectedParsed === 'number' && typeof actualResult === 'number' &&
      Math.abs(expectedParsed - actualResult) < 0.001 && expectedParsed !== actualResult) {
    return 'floatingPoint';
  }
  
  // String escape issues
  if (typeof expectedParsed === 'string' && typeof actualResult === 'string' &&
      (expectedParsed.includes('\\') || actualResult.includes('\\'))) {
    return 'stringEscape';
  }
  
  // Template format issues
  if (expression.includes('`') || expression.includes('${')) {
    return 'templateFormat';
  }
  
  // Range format issues
  if (expression.includes('..') || expression.includes('[') || expression.includes('(')) {
    return 'rangeFormat';
  }
  
  // Array format differences
  if (Array.isArray(expectedParsed) && Array.isArray(actualResult) &&
      JSON.stringify(expectedParsed) !== JSON.stringify(actualResult)) {
    return 'arrayFormat';
  }
  
  // Object format differences
  if (typeof expectedParsed === 'object' && typeof actualResult === 'object' &&
      expectedParsed !== null && actualResult !== null &&
      !Array.isArray(expectedParsed) && !Array.isArray(actualResult)) {
    return 'objectFormat';
  }
  
  // Type coercion issues
  if (typeof expectedParsed !== typeof actualResult) {
    return 'typeCoercion';
  }
  
  return 'other';
}

/**
 * Analyze each mismatch
 */
mismatches.forEach((mismatch, index) => {
  const { file, category, id, title, expression, expectedOutput, expectedParsed, actualResult } = mismatch;
  
  // By category
  if (!analysis.byCategory[category]) {
    analysis.byCategory[category] = [];
  }
  analysis.byCategory[category].push(mismatch);
  
  // By file
  if (!analysis.byFile[file]) {
    analysis.byFile[file] = [];
  }
  analysis.byFile[file].push(mismatch);
  
  // By pattern
  const pattern = categorizePattern(mismatch);
  analysis.byPattern[pattern].push(mismatch);
  
  // Critical issues (examples that might need manual review)
  if (pattern === 'typeCoercion' || pattern === 'other') {
    analysis.criticalIssues.push(mismatch);
  }
});

/**
 * Generate detailed report
 */
function generateReport() {
  console.log('📈 FAILURE PATTERN ANALYSIS');
  console.log('============================\n');
  
  // By category summary
  console.log('🏷️  BY CATEGORY:');
  Object.entries(analysis.byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, failures]) => {
      console.log(`   ${category}: ${failures.length} failures`);
    });
  
  console.log('\n🔍 BY PATTERN TYPE:');
  Object.entries(analysis.byPattern)
    .filter(([pattern, failures]) => failures.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([pattern, failures]) => {
      console.log(`   ${pattern}: ${failures.length} failures`);
      
      // Show examples for each pattern
      failures.slice(0, 3).forEach(failure => {
        console.log(`     • ${failure.id}: Expected ${JSON.stringify(failure.expectedParsed)} → Got ${JSON.stringify(failure.actualResult)}`);
      });
      if (failures.length > 3) {
        console.log(`     ... and ${failures.length - 3} more`);
      }
      console.log('');
    });
  
  console.log('📁 BY FILE:');
  Object.entries(analysis.byFile)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([file, failures]) => {
      console.log(`   ${file}: ${failures.length} failures`);
    });
  
  console.log(`\n🚨 CRITICAL ISSUES: ${analysis.criticalIssues.length} examples need manual review`);
  analysis.criticalIssues.forEach(issue => {
    console.log(`   • ${issue.id} (${issue.file}): ${issue.title}`);
    console.log(`     Expression: ${issue.expression}`);
    console.log(`     Expected: ${JSON.stringify(issue.expectedParsed)}`);
    console.log(`     Actual: ${JSON.stringify(issue.actualResult)}`);
    console.log('');
  });
}

/**
 * Generate fix recommendations
 */
function generateFixRecommendations() {
  console.log('\n🛠️  FIX RECOMMENDATIONS');
  console.log('=======================\n');
  
  const recommendations = [];
  
  // Date format fixes
  if (analysis.byPattern.dateFormat.length > 0) {
    recommendations.push({
      pattern: 'dateFormat',
      count: analysis.byPattern.dateFormat.length,
      description: 'Update expected date outputs to match ZEN ISO format',
      action: 'Update expectedOutput to use ISO 8601 format with timezone',
      examples: analysis.byPattern.dateFormat.slice(0, 2)
    });
  }
  
  // Floating point fixes
  if (analysis.byPattern.floatingPoint.length > 0) {
    recommendations.push({
      pattern: 'floatingPoint',
      count: analysis.byPattern.floatingPoint.length,
      description: 'Adjust floating point precision expectations',
      action: 'Round expected outputs to match ZEN precision',
      examples: analysis.byPattern.floatingPoint.slice(0, 2)
    });
  }
  
  // Template format fixes
  if (analysis.byPattern.templateFormat.length > 0) {
    recommendations.push({
      pattern: 'templateFormat',
      count: analysis.byPattern.templateFormat.length,
      description: 'Fix template string output format expectations',
      action: 'Update template outputs to match ZEN interpolation format',
      examples: analysis.byPattern.templateFormat.slice(0, 2)
    });
  }
  
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.pattern.toUpperCase()} (${rec.count} examples)`);
    console.log(`   Description: ${rec.description}`);
    console.log(`   Action: ${rec.action}`);
    console.log(`   Examples:`);
    rec.examples.forEach(ex => {
      console.log(`     • ${ex.id}: "${ex.expression}"`);
    });
    console.log('');
  });
}

/**
 * Save detailed analysis for fixing scripts
 */
function saveAnalysis() {
  const analysisData = {
    summary: {
      totalFailures: mismatches.length,
      byCategory: Object.fromEntries(
        Object.entries(analysis.byCategory).map(([k, v]) => [k, v.length])
      ),
      byPattern: Object.fromEntries(
        Object.entries(analysis.byPattern).map(([k, v]) => [k, v.length])
      ),
      criticalIssues: analysis.criticalIssues.length,
      generatedAt: new Date().toISOString()
    },
    details: analysis,
    recommendations: [
      // Add structured recommendations for automated fixing
    ]
  };
  
  fs.writeFileSync('failure-analysis.json', JSON.stringify(analysisData, null, 2));
  console.log('\n💾 Detailed analysis saved to failure-analysis.json');
}

/**
 * Main execution
 */
function main() {
  generateReport();
  generateFixRecommendations();
  saveAnalysis();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Review critical issues manually');
  console.log('2. Run targeted fix scripts for each pattern');
  console.log('3. Validate fixes maintain example quality');
  console.log('4. Re-run output validation');
}

main(); 