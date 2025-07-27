#!/usr/bin/env node

/**
 * MAP() FUNCTION ANALYSIS SCRIPT
 * 
 * Purpose: Extract and analyze all map() usage patterns from existing knowledge cards
 * Goal: Understand capabilities, complexity levels, and prepare for unified card generation
 * 
 * Output: Comprehensive analysis of map() redundancy and unique capabilities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const KNOWLEDGE_CARDS_DIR = path.join(__dirname, '../knowledge-cards');
const OUTPUT_FILE = path.join(__dirname, '../docs/map-analysis-results.json');

// Analysis results storage
const analysisResults = {
  total_map_occurrences: 0,
  files_with_map: [],
  unique_capabilities: {},
  complexity_levels: {
    basic: [],
    intermediate: [],
    advanced: []
  },
  usage_patterns: {
    simple_transform: [],      // map(array, # * 2)
    property_extraction: [],   // map(objects, #.property)
    object_transformation: [], // map(objects, {new: structure})
    chained_operations: [],    // map(filter(...), ...)
    nested_mapping: [],        // map(..., map(...))
    aggregation_input: []      // sum(map(...)), avg(map(...))
  },
  redundancy_analysis: {},
  consolidation_recommendations: []
};

/**
 * Extract map() expressions from file content
 */
function extractMapExpressions(content, filePath) {
  const mapRegex = /map\([^)]+(?:\([^)]*\))*[^)]*\)/g;
  const expressions = [];
  let match;
  
  while ((match = mapRegex.exec(content)) !== null) {
    expressions.push({
      expression: match[0],
      file: filePath,
      line: getLineNumber(content, match.index)
    });
  }
  
  return expressions;
}

/**
 * Get line number for given character index
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

/**
 * Analyze expression complexity
 */
function analyzeComplexity(expression) {
  let score = 0;
  
  // Basic scoring factors
  if (expression.includes('filter(')) score += 3;  // Chaining
  if (expression.includes('sum(') || expression.includes('avg(')) score += 2;  // Aggregation
  if (expression.includes('{') && expression.includes('}')) score += 2;  // Object creation
  if (expression.includes('#.') && expression.match(/#\./g).length > 1) score += 2;  // Multiple properties
  if (expression.includes('map(map(')) score += 4;  // Nested mapping
  if (expression.includes('?') && expression.includes(':')) score += 2;  // Conditionals
  
  // Length factor
  if (expression.length > 100) score += 2;
  if (expression.length > 200) score += 3;
  
  if (score <= 3) return 'basic';
  if (score <= 8) return 'intermediate';
  return 'advanced';
}

/**
 * Categorize usage pattern
 */
function categorizeUsagePattern(expression) {
  // Simple transform: map(array, # operator value)
  if (/map\(\[[^\]]+\], # [+\-*/^] \d+\)/.test(expression)) {
    return 'simple_transform';
  }
  
  // Property extraction: map(objects, #.property)
  if (/map\([^,]+, #\.\w+\)$/.test(expression)) {
    return 'property_extraction';
  }
  
  // Object transformation: map(objects, {key: value})
  if (expression.includes('{') && expression.includes('}')) {
    return 'object_transformation';
  }
  
  // Chained operations: map(filter(...), ...)
  if (expression.includes('filter(') && expression.indexOf('map(') > expression.indexOf('filter(')) {
    return 'chained_operations';
  }
  
  // Nested mapping: map(..., map(...))
  if (expression.includes('map(map(')) {
    return 'nested_mapping';
  }
  
  // Aggregation input: sum(map(...)), avg(map(...))
  if (/^(sum|avg|min|max|median)\(map\(/.test(expression)) {
    return 'aggregation_input';
  }
  
  return 'other';
}

/**
 * Extract capability from expression
 */
function extractCapability(expression) {
  if (expression.includes('#.')) {
    if (expression.includes('{') && expression.includes('}')) {
      return 'object_restructuring';
    }
    return 'property_extraction';
  }
  
  if (expression.includes('# *') || expression.includes('# +') || expression.includes('# -') || expression.includes('# /')) {
    return 'arithmetic_transformation';
  }
  
  if (expression.includes('filter(')) {
    return 'filtered_transformation';
  }
  
  if (expression.includes('upper(') || expression.includes('lower(') || expression.includes('len(')) {
    return 'function_application';
  }
  
  if (expression.includes('?') && expression.includes(':')) {
    return 'conditional_transformation';
  }
  
  return 'basic_transformation';
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const expressions = extractMapExpressions(content, filePath);
    
    if (expressions.length > 0) {
      analysisResults.files_with_map.push({
        file: filePath,
        count: expressions.length
      });
      
      expressions.forEach(expr => {
        analysisResults.total_map_occurrences++;
        
        const complexity = analyzeComplexity(expr.expression);
        const pattern = categorizeUsagePattern(expr.expression);
        const capability = extractCapability(expr.expression);
        
        // Store by complexity
        analysisResults.complexity_levels[complexity].push({
          expression: expr.expression,
          file: expr.file,
          line: expr.line,
          capability: capability,
          pattern: pattern
        });
        
        // Store by pattern
        if (!analysisResults.usage_patterns[pattern]) {
          analysisResults.usage_patterns[pattern] = [];
        }
        analysisResults.usage_patterns[pattern].push(expr.expression);
        
        // Store capability
        if (!analysisResults.unique_capabilities[capability]) {
          analysisResults.unique_capabilities[capability] = [];
        }
        analysisResults.unique_capabilities[capability].push(expr.expression);
      });
    }
  } catch (error) {
    console.log(`⚠️ Error processing file ${filePath}: ${error.message}`);
  }
}

/**
 * Walk directory recursively
 */
function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.mdc') || file.endsWith('.json')) {
      processFile(filePath);
    }
  });
}

/**
 * Generate consolidation recommendations
 */
function generateRecommendations() {
  // Identify redundant patterns
  Object.entries(analysisResults.usage_patterns).forEach(([pattern, expressions]) => {
    if (expressions.length > 3) {
      analysisResults.redundancy_analysis[pattern] = {
        count: expressions.length,
        unique_expressions: [...new Set(expressions)].length,
        redundancy_level: expressions.length - [...new Set(expressions)].length
      };
    }
  });
  
  // Generate recommendations
  analysisResults.consolidation_recommendations = [
    {
      action: "create_basic_examples_card",
      target_capability: "arithmetic_transformation", 
      consolidates: analysisResults.usage_patterns.simple_transform?.length || 0,
      complexity: "basic"
    },
    {
      action: "create_property_extraction_card",
      target_capability: "property_extraction",
      consolidates: analysisResults.usage_patterns.property_extraction?.length || 0,
      complexity: "intermediate"
    },
    {
      action: "create_object_transformation_card", 
      target_capability: "object_restructuring",
      consolidates: analysisResults.usage_patterns.object_transformation?.length || 0,
      complexity: "intermediate"
    },
    {
      action: "create_chained_operations_card",
      target_capability: "filtered_transformation", 
      consolidates: analysisResults.usage_patterns.chained_operations?.length || 0,
      complexity: "advanced"
    }
  ];
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting MAP() function analysis...');
  
  if (!fs.existsSync(KNOWLEDGE_CARDS_DIR)) {
    console.error(`❌ Knowledge cards directory not found: ${KNOWLEDGE_CARDS_DIR}`);
    process.exit(1);
  }
  
  // Create docs directory if it doesn't exist
  const docsDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Process all files
  walkDirectory(KNOWLEDGE_CARDS_DIR);
  
  // Generate recommendations
  generateRecommendations();
  
  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(analysisResults, null, 2));
  
  // Print summary
  console.log('📊 MAP() Analysis Complete!');
  console.log(`   📁 Files processed: ${analysisResults.files_with_map.length}`);
  console.log(`   📈 Total map() occurrences: ${analysisResults.total_map_occurrences}`);
  console.log(`   🎯 Unique capabilities: ${Object.keys(analysisResults.unique_capabilities).length}`);
  console.log(`   📊 Complexity distribution:`);
  console.log(`      • Basic: ${analysisResults.complexity_levels.basic.length}`);
  console.log(`      • Intermediate: ${analysisResults.complexity_levels.intermediate.length}`);
  console.log(`      • Advanced: ${analysisResults.complexity_levels.advanced.length}`);
  console.log(`   💾 Results saved to: ${OUTPUT_FILE}`);
  console.log('');
  console.log('🚀 Ready for unified card generation!');
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, analysisResults }; 