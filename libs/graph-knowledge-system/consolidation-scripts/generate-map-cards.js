#!/usr/bin/env node

/**
 * MAP() UNIFIED CARD GENERATION SCRIPT
 * 
 * Purpose: Generate unified knowledge cards for map() function based on analysis results
 * Input: Analysis results from analyze-map-usage.js
 * Output: Unified cards using new interface format with graph relationships
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ANALYSIS_FILE = path.join(__dirname, '../docs/map-analysis-results.json');
const OUTPUT_DIR = path.join(__dirname, '../unified-cards');

/**
 * Generate unified knowledge cards for map() function
 */
function generateMapCards() {
  // Read analysis results
  const analysisData = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf8'));
  
  const unifiedCards = [
    // Card 1: Basic Arithmetic Transformation
    {
      id: "map-arithmetic-transformation-basic",
      function: "map",
      function_format: "map(array, # operator value)",
      capability: "arithmetic_transformation",
      complexity: "basic",
      primary_example: {
        expression: "map([1, 2, 3, 4, 5], # * 2)",
        sample_input: {},
        expected_output: [2, 4, 6, 8, 10],
        explanation: "Transform each array element using arithmetic operations with # placeholder"
      },
      related_examples: [
        {
          variation: "addition",
          expression: "map([1, 2, 3], # + 10)",
          context: "Add constant to each element"
        },
        {
          variation: "power",
          expression: "map([1, 2, 3, 4], # ^ 2)",
          context: "Square each element"
        },
        {
          variation: "string_concatenation",
          expression: "map(['a', 'b', 'c'], # + '!')",
          context: "Append character to each string"
        }
      ],
      relationships: {
        commonly_used_with: ["filter", "sum", "len"],
        input_preparation: ["Direct array literal", "Variable containing array"],
        output_usage: ["Further map operations", "Aggregation functions"],
        builds_on: ["array_basics", "arithmetic_operators"],
        leads_to: ["property_extraction", "chained_operations"]
      },
      retrieval_metadata: {
        tags: ["transformation", "arithmetic", "basic_operations"],
        use_cases: ["data_processing", "mathematical_operations", "array_transformation"],
        difficulty_progression: "builds_on: arrays | leads_to: object_mapping"
      }
    },

    // Card 2: Property Extraction
    {
      id: "map-property-extraction-intermediate",
      function: "map",
      function_format: "map(object_array, #.property)",
      capability: "property_extraction",
      complexity: "intermediate",
      primary_example: {
        expression: "map([{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], #.id)",
        sample_input: {},
        expected_output: [1, 2],
        explanation: "Extract specific property from each object in array using dot notation"
      },
      related_examples: [
        {
          variation: "price_extraction",
          expression: "map(items, #.price)",
          context: "Extract price property from product items"
        },
        {
          variation: "nested_property",
          expression: "map(orders, #.customer.name)",
          context: "Extract nested property from objects"
        },
        {
          variation: "calculated_property",
          expression: "map(items, #.qty * #.price)",
          context: "Calculate values using multiple properties"
        }
      ],
      relationships: {
        commonly_used_with: ["filter", "sum", "avg", "max", "min"],
        input_preparation: ["Object arrays from API", "Database query results"],
        output_usage: ["Aggregation calculations", "Data analysis"],
        builds_on: ["object_property_access", "array_mapping"],
        leads_to: ["object_transformation", "complex_chaining"]
      },
      retrieval_metadata: {
        tags: ["object_access", "property_extraction", "data_extraction"],
        use_cases: ["api_data_processing", "business_analytics", "report_generation"],
        difficulty_progression: "builds_on: property_access | leads_to: object_restructuring"
      }
    },

    // Card 3: Object Transformation
    {
      id: "map-object-transformation-intermediate",
      function: "map",
      function_format: "map(object_array, {new_structure})",
      capability: "object_restructuring",
      complexity: "intermediate",
      primary_example: {
        expression: "map(items, {id: #.id, fullName: #.firstName + ' ' + #.lastName})",
        sample_input: {
          "items": [
            {"id": 1, "firstName": "John", "lastName": "Doe"},
            {"id": 2, "firstName": "Jane", "lastName": "Smith"}
          ]
        },
        expected_output: [
          {"id": 1, "fullName": "John Doe"},
          {"id": 2, "fullName": "Jane Smith"}
        ],
        explanation: "Transform objects into new structure with computed properties"
      },
      related_examples: [
        {
          variation: "status_transformation", 
          expression: "map(customers, {name: #.name, tier: #.orders > 100 ? 'platinum' : #.orders > 50 ? 'gold' : 'silver'})",
          context: "Transform with conditional logic"
        },
        {
          variation: "data_enrichment",
          expression: "map(products, {product: #.name, status: #.quantity <= 0 ? 'out_of_stock' : 'available'})",
          context: "Enrich data with calculated status"
        },
        {
          variation: "complex_calculation",
          expression: "map(orders, {order_id: #.id, total: sum(map(#.items, #.price * #.quantity))})",
          context: "Nested calculations within transformation"
        }
      ],
      relationships: {
        commonly_used_with: ["filter", "conditional_operators"],
        input_preparation: ["API response objects", "Database records"],
        output_usage: ["UI display data", "Report formatting"],
        builds_on: ["property_extraction", "conditional_logic"],
        leads_to: ["complex_business_logic", "advanced_transformations"]
      },
      retrieval_metadata: {
        tags: ["object_transformation", "data_restructuring", "business_logic"],
        use_cases: ["data_normalization", "ui_data_preparation", "business_reporting"],
        difficulty_progression: "builds_on: object_creation | leads_to: complex_chaining"
      }
    },

    // Card 4: Chained Operations (Advanced)
    {
      id: "map-chained-operations-advanced",
      function: "map",
      function_format: "map(filter(array, condition), transformation)",
      capability: "filtered_transformation",
      complexity: "advanced",
      primary_example: {
        expression: "map(filter([{id: 1, name: 'John', active: true}, {id: 2, name: 'Jane', active: false}], #.active), #.name)",
        sample_input: {},
        expected_output: ["John"],
        explanation: "Chain filter and map operations to process subset of data"
      },
      related_examples: [
        {
          variation: "numeric_filter_transform",
          expression: "map(filter([1, 2, 3, 4, 5], # > 2), # * 2)",
          context: "Filter numbers then transform them"
        },
        {
          variation: "aggregation_chaining",
          expression: "sum(map(filter(orders, #.status == 'completed'), #.total))",
          context: "Filter, transform, then aggregate"
        },
        {
          variation: "complex_business_logic",
          expression: "avg(map(filter(employees, #.department == 'sales'), #.performance_score))",
          context: "Business analytics with chaining"
        }
      ],
      relationships: {
        commonly_used_with: ["filter", "sum", "avg", "max", "min", "count"],
        input_preparation: ["Large datasets", "Business data collections"],
        output_usage: ["Business analytics", "Performance metrics"],
        builds_on: ["map_basics", "filter_operations", "aggregation_functions"],
        leads_to: ["complex_data_pipelines", "business_intelligence"]
      },
      retrieval_metadata: {
        tags: ["chaining", "data_pipeline", "advanced_operations"],
        use_cases: ["business_analytics", "data_science", "performance_analysis"],
        difficulty_progression: "builds_on: filtering + mapping | leads_to: complex_pipelines"
      }
    },

    // Card 5: Instruction Card for map()
    {
      id: "map-function-instruction",
      type: "instruction",
      function: "map",
      function_format: "map(array, transformation_expression)",
      syntax: "map(array, transformation_expression)",
      description: "Transforms each element in an array using the provided expression",
      parameters: [
        {
          name: "array",
          type: "Array", 
          description: "Input array to transform"
        },
        {
          name: "transformation_expression",
          type: "Expression",
          description: "Expression to apply to each element (use # as placeholder)"
        }
      ],
      returns: "Array with transformed elements",
      constraints: [
        "Array must not be empty for meaningful results",
        "Transformation expression must be valid ZEN DSL",
        "Use # placeholder to reference current element"
      ],
      related_functions: ["filter", "reduce", "flatMap", "sum", "avg"],
      common_patterns: [
        "Arithmetic: map(numbers, # * 2)",
        "Property extraction: map(objects, #.property)",
        "Object transformation: map(objects, {new: structure})",
        "Chaining: map(filter(array, condition), transformation)"
      ]
    }
  ];

  return unifiedCards;
}

/**
 * Save unified cards to output directory
 */
function saveUnifiedCards(cards) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Save individual cards
  cards.forEach((card, index) => {
    const filename = `${card.id}.json`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(card, null, 2));
  });

  // Save consolidated file
  const consolidatedFile = path.join(OUTPUT_DIR, 'map-unified-cards.json');
  fs.writeFileSync(consolidatedFile, JSON.stringify({
    function: "map",
    generated_at: new Date().toISOString(),
    total_cards: cards.length,
    consolidates_occurrences: 117, // From analysis
    cards: cards
  }, null, 2));
}

/**
 * Generate summary statistics
 */
function generateSummary(originalAnalysis, newCards) {
  const summary = {
    consolidation_success: {
      original_occurrences: originalAnalysis.total_map_occurrences,
      original_files: originalAnalysis.files_with_map.length,
      unified_cards: newCards.length,
      reduction_percentage: Math.round((1 - newCards.length / originalAnalysis.total_map_occurrences) * 100)
    },
    capability_coverage: {
      original_capabilities: Object.keys(originalAnalysis.unique_capabilities).length,
      cards_by_capability: newCards.filter(card => card.capability).reduce((acc, card) => {
        acc[card.capability] = (acc[card.capability] || 0) + 1;
        return acc;
      }, {}),
      instruction_cards: newCards.filter(card => card.type === 'instruction').length,
      example_cards: newCards.filter(card => card.type !== 'instruction').length
    },
    complexity_distribution: newCards.filter(card => card.complexity).reduce((acc, card) => {
      acc[card.complexity] = (acc[card.complexity] || 0) + 1;
      return acc;
    }, {}),
    relationship_completeness: {
      cards_with_relationships: newCards.filter(card => card.relationships).length,
      unique_relationship_types: [...new Set(
        newCards.flatMap(card => card.relationships ? Object.keys(card.relationships) : [])
      )].length
    }
  };

  return summary;
}

/**
 * Main execution
 */
function main() {
  console.log('🏗️ Starting MAP() unified card generation...');
  
  if (!fs.existsSync(ANALYSIS_FILE)) {
    console.error(`❌ Analysis file not found: ${ANALYSIS_FILE}`);
    console.error('   Run analyze-map-usage.js first');
    process.exit(1);
  }

  // Load analysis data
  const analysisData = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf8'));
  
  // Generate unified cards
  const unifiedCards = generateMapCards();
  
  // Save cards
  saveUnifiedCards(unifiedCards);
  
  // Generate summary
  const summary = generateSummary(analysisData, unifiedCards);
  const summaryFile = path.join(OUTPUT_DIR, 'consolidation-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  // Print results
  console.log('🎯 MAP() Unified Cards Generated!');
  console.log(`   📋 Original occurrences: ${summary.consolidation_success.original_occurrences}`);
  console.log(`   📁 Original files: ${summary.consolidation_success.original_files}`);
  console.log(`   🗂️  Unified cards: ${summary.consolidation_success.unified_cards}`);
  console.log(`   📉 Reduction: ${summary.consolidation_success.reduction_percentage}%`);
  console.log('');
  console.log('📊 Card Distribution:');
  console.log(`   📝 Example cards: ${summary.capability_coverage.example_cards}`);
  console.log(`   📖 Instruction cards: ${summary.capability_coverage.instruction_cards}`);
  console.log('');
  console.log('🎯 Complexity Coverage:');
  Object.entries(summary.complexity_distribution).forEach(([complexity, count]) => {
    console.log(`   • ${complexity}: ${count} cards`);
  });
  console.log('');
  console.log(`💾 Cards saved to: ${OUTPUT_DIR}`);
  console.log('🚀 Ready for graph relationship modeling!');
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, generateMapCards }; 