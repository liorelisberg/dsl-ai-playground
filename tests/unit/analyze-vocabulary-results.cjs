#!/usr/bin/env node

/**
 * Vocabulary Validation Results Analysis
 * 
 * This script analyzes the results from the deep vocabulary validation
 * and provides insights into the findings.
 */

const fs = require('fs');
const path = require('path');

console.log('📊 Analyzing Vocabulary Validation Results...\n');

// Load analysis files
const analysisPath = path.join(__dirname, '../../config/vocabulary-deep-analysis.json');
const invalidPath = path.join(__dirname, '../../config/invalid-vocabulary-entries.json');
const vocabularyPath = path.join(__dirname, '../../docs/config/zen-vocabulary-corrected.json');

const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
const invalid = JSON.parse(fs.readFileSync(invalidPath, 'utf8'));
const vocabulary = JSON.parse(fs.readFileSync(vocabularyPath, 'utf8'));

console.log('🔍 VALIDATION ANALYSIS REPORT');
console.log('============================\n');

console.log('📈 STATISTICS:');
console.log(`   Expressions analyzed: ${analysis.metadata.total_expressions_analyzed}`);
console.log(`   Datasets processed: ${analysis.metadata.datasets_analyzed}`);
console.log(`   Validation method: ${analysis.metadata.validation_method}\n`);

console.log('📋 RESULTS BY CATEGORY:');

// Functions Analysis
console.log('🔧 FUNCTIONS:');
console.log(`   In vocabulary: ${vocabulary.zen_functions.length}`);
console.log(`   Found in expressions: ${analysis.validation_results.functions.found_in_expressions}`);
console.log(`   Missing: ${analysis.validation_results.functions.not_found.length}`);

// Check for functions found that aren't in vocabulary
const vocabularyFunctions = new Set(vocabulary.zen_functions);
const foundFunctions = new Set(analysis.validation_results.functions.found_list);
const extraFunctions = [...foundFunctions].filter(f => !vocabularyFunctions.has(f));

if (extraFunctions.length > 0) {
  console.log(`   Extra functions found: ${extraFunctions.length}`);
  console.log('   Extra functions (not in vocabulary):');
  extraFunctions.forEach(func => console.log(`      - ${func}`));
}

// Operators Analysis
console.log('\n⚙️ OPERATORS:');
console.log(`   In vocabulary: ${vocabulary.zen_operators.length}`);
console.log(`   Found in expressions: ${analysis.validation_results.operators.found_in_expressions}`);
console.log(`   Missing: ${analysis.validation_results.operators.not_found.length}`);

const vocabularyOperators = new Set(vocabulary.zen_operators);
const foundOperators = new Set(analysis.validation_results.operators.found_list);
const extraOperators = [...foundOperators].filter(op => !vocabularyOperators.has(op));

if (extraOperators.length > 0) {
  console.log(`   Extra operators found: ${extraOperators.length}`);
  console.log('   Extra operators (not in vocabulary):');
  extraOperators.forEach(op => console.log(`      - "${op}"`));
}

// Keywords Analysis
console.log('\n🔑 KEYWORDS:');
console.log(`   In vocabulary: ${vocabulary.keywords.length}`);
console.log(`   Found in expressions: ${analysis.validation_results.keywords.found_in_expressions}`);
console.log(`   Missing: ${analysis.validation_results.keywords.not_found.length}`);

const vocabularyKeywords = new Set(vocabulary.keywords);
const foundKeywords = new Set(analysis.validation_results.keywords.found_list);
const extraKeywords = [...foundKeywords].filter(kw => !vocabularyKeywords.has(kw));

if (extraKeywords.length > 0) {
  console.log(`   Extra keywords found: ${extraKeywords.length}`);
  console.log('   Extra keywords (not in vocabulary):');
  extraKeywords.forEach(kw => console.log(`      - ${kw}`));
}

// Invalid entries analysis
console.log('\n❌ INVALID ENTRIES:');
console.log(`   Total invalid: ${invalid.summary.total_invalid}`);
console.log(`   Invalid functions: ${invalid.invalid_functions.length}`);
console.log(`   Invalid operators: ${invalid.invalid_operators.length}`);
console.log(`   Invalid keywords: ${invalid.invalid_keywords.length}`);

if (invalid.invalid_functions.length > 0) {
  console.log('\n   Invalid Functions:');
  invalid.invalid_functions.forEach(func => console.log(`      - ${func}`));
}

if (invalid.invalid_operators.length > 0) {
  console.log('\n   Invalid Operators:');
  invalid.invalid_operators.forEach(op => console.log(`      - "${op}"`));
}

if (invalid.invalid_keywords.length > 0) {
  console.log('\n   Invalid Keywords:');
  invalid.invalid_keywords.forEach(kw => console.log(`      - ${kw}`));
}

// Overall accuracy
const totalInVocabulary = vocabulary.zen_functions.length + vocabulary.zen_operators.length + vocabulary.keywords.length;
const totalFound = analysis.validation_results.functions.found_in_expressions + 
                   analysis.validation_results.operators.found_in_expressions + 
                   analysis.validation_results.keywords.found_in_expressions;
const accuracy = ((totalInVocabulary - invalid.summary.total_invalid) / totalInVocabulary * 100).toFixed(1);

console.log('\n🎯 ACCURACY SUMMARY:');
console.log(`   Vocabulary accuracy: ${accuracy}%`);
console.log(`   Items correctly validated: ${totalInVocabulary - invalid.summary.total_invalid}/${totalInVocabulary}`);

// Generate recommendations
console.log('\n💡 RECOMMENDATIONS:');

if (invalid.summary.total_invalid === 0) {
  console.log('   ✅ Perfect! No invalid entries found.');
  console.log('   ✅ Vocabulary is 100% accurate against source datasets.');
} else {
  console.log(`   ⚠️  Remove ${invalid.summary.total_invalid} invalid entries from vocabulary.`);
}

if (extraFunctions.length > 0 || extraOperators.length > 0 || extraKeywords.length > 0) {
  console.log('   📝 Consider adding extra items found in expressions to vocabulary:');
  extraFunctions.forEach(func => console.log(`      + Function: ${func}`));
  extraOperators.forEach(op => console.log(`      + Operator: "${op}"`));
  extraKeywords.forEach(kw => console.log(`      + Keyword: ${kw}`));
}

console.log('\n✅ Analysis complete!'); 