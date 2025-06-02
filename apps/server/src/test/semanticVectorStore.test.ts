// Test file for Semantic Vector Store
// Phase 2.1 Implementation Test

import { SemanticVectorStore } from '../services/semanticVectorStore';
import { Document } from '../services/vectorStore';

console.log('🧪 Testing Semantic Vector Store Implementation\n');

// Only run if we have the embedding key
if (!process.env.GEMINI_EMBED_KEY) {
  console.log('⚠️  GEMINI_EMBED_KEY not available, skipping semantic tests');
  process.exit(0);
}

const semanticStore = new SemanticVectorStore();

// Sample DSL documents for testing
const sampleDocuments: Document[] = [
  {
    id: 'array_filter_1',
    content: 'Array filtering in DSL allows you to create new arrays containing only elements that satisfy a condition. Use filter(array, condition) syntax.',
    metadata: {
      source: 'array-rule.mdc',
      category: 'array',
      type: 'rule',
      tokens: 25
    }
  },
  {
    id: 'array_map_1',
    content: 'Array mapping transforms each element in an array using a function. The map operation applies the function to every element and returns a new array.',
    metadata: {
      source: 'array-rule.mdc', 
      category: 'array',
      type: 'rule',
      tokens: 28
    }
  },
  {
    id: 'string_ops_1',
    content: 'String operations in DSL include string extraction, case conversion, and splitting. Use extract(), upper(), lower() functions.',
    metadata: {
      source: 'strings-rule.mdc',
      category: 'strings',
      type: 'rule', 
      tokens: 24
    }
  },
  {
    id: 'math_basic_1',
    content: 'Mathematical operations support addition, subtraction, multiplication, division. Advanced functions like Math.round(), Math.floor() are available.',
    metadata: {
      source: 'numbers-rule.mdc',
      category: 'numbers',
      type: 'rule',
      tokens: 22
    }
  }
];

async function runSemanticTests() {
  try {
    // Test 1: Initialization
    console.log('📝 Test 1: Semantic Store Initialization');
    await semanticStore.initialize();
    console.log('✅ Initialization successful\n');

    // Test 2: Document processing with embeddings
    console.log('📝 Test 2: Document Processing with Embeddings');
    console.log('This may take 30-60 seconds due to embedding generation...');
    
    await semanticStore.upsertDocuments(sampleDocuments);
    
    const collectionInfo = semanticStore.getCollectionInfo();
    console.log(`✅ Processed ${collectionInfo.count} documents`);
    console.log(`✅ Has embeddings: ${collectionInfo.hasEmbeddings}\n`);

    // Test 3: Semantic search for array operations
    console.log('📝 Test 3: Semantic Search - Array Operations');
    const arrayResults = await semanticStore.search('How do I filter arrays by condition?', 3);
    
    console.log(`Found ${arrayResults.length} semantic matches:`);
    arrayResults.forEach((result, index) => {
      console.log(`  ${index + 1}. Similarity: ${(result.similarity * 100).toFixed(1)}% | Category: ${result.metadata.category}`);
      console.log(`     Tags: ${result.semanticTags.join(', ')}`);
      console.log(`     Reasoning: ${result.reasoningPath}`);
    });
    console.log('');

    // Test 4: Semantic search for string manipulation
    console.log('📝 Test 4: Semantic Search - String Manipulation');
    const stringResults = await semanticStore.search('text processing and case conversion', 3);
    
    console.log(`Found ${stringResults.length} semantic matches:`);
    stringResults.forEach((result, index) => {
      console.log(`  ${index + 1}. Similarity: ${(result.similarity * 100).toFixed(1)}% | Category: ${result.metadata.category}`);
      console.log(`     Complexity: ${result.complexity}`);
      console.log(`     Reasoning: ${result.reasoningPath}`);
    });
    console.log('');

    // Test 5: Cross-domain semantic search
    console.log('📝 Test 5: Cross-Domain Semantic Search');
    const crossResults = await semanticStore.search('mathematical transformations of data collections', 4);
    
    console.log(`Found ${crossResults.length} semantic matches:`);
    crossResults.forEach((result, index) => {
      console.log(`  ${index + 1}. Similarity: ${(result.similarity * 100).toFixed(1)}% | Category: ${result.metadata.category}`);
      console.log(`     Content preview: ${result.content.substring(0, 60)}...`);
    });
    console.log('');

    // Test 6: Performance and stats
    console.log('📝 Test 6: Performance Statistics');
    const stats = semanticStore.getStats();
    console.log(`Total documents: ${stats.totalDocuments}`);
    console.log(`Average embedding time: ${stats.avgEmbeddingTime.toFixed(0)}ms`);
    console.log(`Last updated: ${stats.lastUpdated.toISOString()}`);
    console.log('');

    // Test 7: Knowledge card conversion
    console.log('📝 Test 7: Knowledge Card Conversion');
    const knowledgeCards = semanticStore.searchResultsToKnowledgeCards(arrayResults);
    console.log(`Converted ${knowledgeCards.length} results to knowledge cards:`);
    knowledgeCards.forEach(card => {
      console.log(`  - ${card.category}: ${card.relevanceScore.toFixed(3)} relevance`);
    });

    console.log('\n✅ All semantic vector store tests completed successfully!');

  } catch (error) {
    console.error('❌ Semantic test failed:', error);
    process.exit(1);
  }
}

// Run the tests
runSemanticTests(); 