#!/usr/bin/env node

/**
 * Deep Vocabulary Validation: Context-Aware Expression Analysis
 * 
 * This script performs sophisticated validation of functions, operators, and keywords
 * by parsing actual ZEN expressions and validating usage context.
 */

const fs = require('fs');
const path = require('path');

console.log('🔬 Deep Vocabulary Validation - Context-Aware Analysis...\n');

// Load vocabulary
const vocabularyPath = path.join(__dirname, '../../config/zen-vocabulary-corrected.json');
const vocabulary = JSON.parse(fs.readFileSync(vocabularyPath, 'utf8'));

class ZenExpressionParser {
  constructor() {
    // Function pattern: functionName followed by opening parenthesis
    this.functionPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    
    // Operator patterns with context awareness
    this.operatorPatterns = {
      // Mathematical operators (between values/variables)
      mathematical: /(\+|\-|\*|\/|\%|\^)/g,
      
      // Comparison operators (between values)
      comparison: /(==|!=|<=|>=|<|>)/g,
      
      // Boolean operators (as whole words between expressions)
      boolean: /\b(and|or|not)\b/g,
      
      // Membership operators (as whole words)
      membership: /\b(in|not\s+in)\b/g,
      
      // Ternary operators
      ternary: /\?|:/g,
      
      // Special operators
      closure: /#/g,
      template: /\$/g,
      range: /\.\.\./g,
      range2: /\.\./g,
      nullish: /\?\?/g,
      
      // Brackets and parentheses
      brackets: /[\[\]\(\)]/g,
      
      // Template strings
      template_delimiter: /`/g
    };
    
    // Keyword pattern: as standalone tokens
    this.keywordPattern = /\b(true|false|null|and|or|not|in)\b/g;
  }

  /**
   * Extract all ZEN expressions from CSV content
   */
  extractExpressions(csvContent) {
    const lines = csvContent.split('\n');
    const expressions = [];
    
    for (const line of lines) {
      // Skip comments, empty lines, and CSV headers
      if (line.trim().startsWith('#') || 
          line.trim() === '' || 
          line.includes('expression (string)')) continue;
      
      // CSV format: expression;;expected_output or expression;input;expected_output
      const parts = line.split(';');
      if (parts.length >= 2) {
        const expression = parts[0].trim();
        if (expression && !expression.startsWith('#')) {
          expressions.push({
            expression,
            line: line.trim()
          });
        }
      }
    }
    
    return expressions;
  }

  /**
   * Parse functions from expression
   */
  parseFunctions(expression) {
    const functions = new Set();
    let match;
    
    // Reset regex
    this.functionPattern.lastIndex = 0;
    
    while ((match = this.functionPattern.exec(expression)) !== null) {
      const functionName = match[1];
      // Exclude common JavaScript/programming keywords that aren't ZEN functions
      // Allow short names but exclude specific known false positives
      if (!['if', 'for', 'while', 'function', 'return', 'var', 'let', 'const'].includes(functionName)) {
        functions.add(functionName);
      }
    }
    
    return Array.from(functions);
  }

  /**
   * Parse operators from expression
   */
  parseOperators(expression) {
    const operators = new Set();
    
    // Parse each type of operator
    Object.entries(this.operatorPatterns).forEach(([type, pattern]) => {
      pattern.lastIndex = 0; // Reset regex
      let match;
      
      while ((match = pattern.exec(expression)) !== null) {
        if (type === 'membership' && match[0] === 'not in') {
          operators.add('not in');
        } else {
          operators.add(match[0]);
        }
      }
    });
    
    return Array.from(operators);
  }

  /**
   * Parse keywords from expression
   */
  parseKeywords(expression) {
    const keywords = new Set();
    let match;
    
    // Reset regex
    this.keywordPattern.lastIndex = 0;
    
    while ((match = this.keywordPattern.exec(expression)) !== null) {
      keywords.add(match[0]);
    }
    
    return Array.from(keywords);
  }

  /**
   * Validate if a function usage is legitimate (not just a substring)
   */
  isLegitimateFunction(functionName, expression) {
    // Should be followed by opening parenthesis
    const pattern = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
    return pattern.test(expression);
  }

  /**
   * Validate if an operator usage is legitimate
   */
  isLegitimateOperator(operator, expression) {
    // For word-based operators, ensure they are whole words
    if (['and', 'or', 'not', 'in'].includes(operator)) {
      const pattern = new RegExp(`\\b${operator}\\b`, 'g');
      return pattern.test(expression);
    }
    
    // For 'not in', check as phrase
    if (operator === 'not in') {
      return /\bnot\s+in\b/.test(expression);
    }
    
    // For symbol operators, simple presence is sufficient
    return expression.includes(operator);
  }

  /**
   * Validate if a keyword usage is legitimate
   */
  isLegitimateKeyword(keyword, expression) {
    // Should appear as whole word
    const pattern = new RegExp(`\\b${keyword}\\b`, 'g');
    return pattern.test(expression);
  }
}

// Initialize parser
const parser = new ZenExpressionParser();

// Load all datasets
const datasetsDir = path.join(__dirname, '../../docs/datasets');
const csvFiles = fs.readdirSync(datasetsDir).filter(f => f.endsWith('.csv'));

console.log('📊 Loading datasets...');
csvFiles.forEach(file => console.log(`   - ${file}`));

// Extract all expressions
let allExpressions = [];
csvFiles.forEach(file => {
  const content = fs.readFileSync(path.join(datasetsDir, file), 'utf8');
  const expressions = parser.extractExpressions(content);
  allExpressions = allExpressions.concat(expressions);
  console.log(`   - ${file}: ${expressions.length} expressions`);
});

console.log(`\n📝 Total expressions to analyze: ${allExpressions.length}\n`);

// Validation results
const validationResults = {
  functions: {
    found: new Set(),
    notFound: new Set(),
    illegitimate: new Set()
  },
  operators: {
    found: new Set(),
    notFound: new Set(),
    illegitimate: new Set()
  },
  keywords: {
    found: new Set(),
    notFound: new Set(),
    illegitimate: new Set()
  }
};

// Analyze all expressions
console.log('🔍 Analyzing expressions...');

allExpressions.forEach((item, index) => {
  if (index % 50 === 0) {
    console.log(`   Processed ${index}/${allExpressions.length} expressions...`);
  }
  
  const { expression } = item;
  
  // Parse functions
  const foundFunctions = parser.parseFunctions(expression);
  foundFunctions.forEach(func => {
    if (parser.isLegitimateFunction(func, expression)) {
      validationResults.functions.found.add(func);
    }
  });
  
  // Parse operators
  const foundOperators = parser.parseOperators(expression);
  foundOperators.forEach(op => {
    if (parser.isLegitimateOperator(op, expression)) {
      validationResults.operators.found.add(op);
    }
  });
  
  // Parse keywords
  const foundKeywords = parser.parseKeywords(expression);
  foundKeywords.forEach(keyword => {
    if (parser.isLegitimateKeyword(keyword, expression)) {
      validationResults.keywords.found.add(keyword);
    }
  });
});

console.log(`   Completed analysis of ${allExpressions.length} expressions.\n`);

// Check what's missing
vocabulary.zen_functions.forEach(func => {
  if (!validationResults.functions.found.has(func)) {
    validationResults.functions.notFound.add(func);
  }
});

vocabulary.zen_operators.forEach(op => {
  if (!validationResults.operators.found.has(op)) {
    validationResults.operators.notFound.add(op);
  }
});

vocabulary.keywords.forEach(keyword => {
  if (!validationResults.keywords.found.has(keyword)) {
    validationResults.keywords.notFound.add(keyword);
  }
});

// Generate detailed report
console.log('📋 DEEP VALIDATION RESULTS');
console.log('==========================\n');

console.log('🔧 FUNCTIONS:');
console.log(`   ✅ Found: ${validationResults.functions.found.size}/${vocabulary.zen_functions.length}`);
console.log(`   ❌ Not Found: ${validationResults.functions.notFound.size}`);

if (validationResults.functions.notFound.size > 0) {
  console.log('\n   Missing Functions:');
  Array.from(validationResults.functions.notFound).forEach(func => {
    console.log(`      - ${func}`);
  });
}

console.log('\n⚙️ OPERATORS:');
console.log(`   ✅ Found: ${validationResults.operators.found.size}/${vocabulary.zen_operators.length}`);
console.log(`   ❌ Not Found: ${validationResults.operators.notFound.size}`);

if (validationResults.operators.notFound.size > 0) {
  console.log('\n   Missing Operators:');
  Array.from(validationResults.operators.notFound).forEach(op => {
    console.log(`      - "${op}"`);
  });
}

console.log('\n🔑 KEYWORDS:');
console.log(`   ✅ Found: ${validationResults.keywords.found.size}/${vocabulary.keywords.length}`);
console.log(`   ❌ Not Found: ${validationResults.keywords.notFound.size}`);

if (validationResults.keywords.notFound.size > 0) {
  console.log('\n   Missing Keywords:');
  Array.from(validationResults.keywords.notFound).forEach(keyword => {
    console.log(`      - ${keyword}`);
  });
}

// Create analysis report
const analysisReport = {
  metadata: {
    timestamp: new Date().toISOString(),
    total_expressions_analyzed: allExpressions.length,
    datasets_analyzed: csvFiles.length,
    validation_method: "context-aware expression parsing"
  },
  validation_results: {
    functions: {
      total_in_vocabulary: vocabulary.zen_functions.length,
      found_in_expressions: validationResults.functions.found.size,
      not_found: Array.from(validationResults.functions.notFound),
      found_list: Array.from(validationResults.functions.found).sort()
    },
    operators: {
      total_in_vocabulary: vocabulary.zen_operators.length,
      found_in_expressions: validationResults.operators.found.size,
      not_found: Array.from(validationResults.operators.notFound),
      found_list: Array.from(validationResults.operators.found).sort()
    },
    keywords: {
      total_in_vocabulary: vocabulary.keywords.length,
      found_in_expressions: validationResults.keywords.found.size,
      not_found: Array.from(validationResults.keywords.notFound),
      found_list: Array.from(validationResults.keywords.found).sort()
    }
  },
  invalid_entries: {
    functions: Array.from(validationResults.functions.notFound),
    operators: Array.from(validationResults.operators.notFound),
    keywords: Array.from(validationResults.keywords.notFound)
  },
  sample_expressions_analyzed: allExpressions.slice(0, 10).map(item => item.expression)
};

// Write analysis to file
const outputPath = path.join(__dirname, '../../config/vocabulary-deep-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(analysisReport, null, 2));

console.log(`\n💾 DETAILED ANALYSIS SAVED: ${outputPath}`);

// Write invalid entries to separate file for analysis
const invalidEntries = {
  summary: {
    total_invalid: validationResults.functions.notFound.size + 
                   validationResults.operators.notFound.size + 
                   validationResults.keywords.notFound.size,
    by_type: {
      functions: validationResults.functions.notFound.size,
      operators: validationResults.operators.notFound.size,
      keywords: validationResults.keywords.notFound.size
    }
  },
  invalid_functions: Array.from(validationResults.functions.notFound),
  invalid_operators: Array.from(validationResults.operators.notFound),
  invalid_keywords: Array.from(validationResults.keywords.notFound),
  analysis_notes: {
    functions: "These functions are in vocabulary but never used in any ZEN expression",
    operators: "These operators are in vocabulary but never used in any ZEN expression",
    keywords: "These keywords are in vocabulary but never used in any ZEN expression",
    recommendation: "Remove these from vocabulary as they appear to be hallucinations"
  }
};

const invalidPath = path.join(__dirname, '../../config/invalid-vocabulary-entries.json');
fs.writeFileSync(invalidPath, JSON.stringify(invalidEntries, null, 2));

console.log(`💾 INVALID ENTRIES SAVED: ${invalidPath}`);

// Summary
const totalInvalid = validationResults.functions.notFound.size + 
                    validationResults.operators.notFound.size + 
                    validationResults.keywords.notFound.size;

console.log('\n🎯 VALIDATION SUMMARY:');
console.log(`   Total items in vocabulary: ${vocabulary.zen_functions.length + vocabulary.zen_operators.length + vocabulary.keywords.length}`);
console.log(`   Items found in expressions: ${validationResults.functions.found.size + validationResults.operators.found.size + validationResults.keywords.found.size}`);
console.log(`   Invalid items: ${totalInvalid}`);

if (totalInvalid === 0) {
  console.log('\n🎉 PERFECT! All vocabulary items are validated against expressions.');
  process.exit(0);
} else {
  console.log(`\n⚠️  Found ${totalInvalid} potentially invalid vocabulary entries.`);
  console.log('   Please review the invalid-vocabulary-entries.json file.');
  process.exit(1);
} 