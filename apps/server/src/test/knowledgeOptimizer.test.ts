// Test file for Knowledge Optimizer
// Phase 1.2 Implementation Test

import { KnowledgeOptimizer, ScoredKnowledgeCard } from '../services/knowledgeOptimizer';
import { KnowledgeCard } from '../services/vectorStore';
import { ChatTurn } from '../services/contextManager';

const optimizer = new KnowledgeOptimizer();

// Sample knowledge cards (simulating DSL knowledge base)
const sampleKnowledgeCards: KnowledgeCard[] = [
  {
    id: 'array_1',
    content: 'Array filtering allows you to create new arrays with elements that pass a test. Use .filter(condition) to filter arrays.',
    source: 'array-rule.mdc',
    category: 'array',
    relevanceScore: 0.8
  },
  {
    id: 'array_2', 
    content: 'Array mapping transforms each element. Use .map(function) to transform array elements.',
    source: 'array-rule.mdc',
    category: 'array',
    relevanceScore: 0.7
  },
  {
    id: 'string_1',
    content: 'String manipulation includes .substring(), .toUpperCase(), .toLowerCase() functions for text processing.',
    source: 'strings-rule.mdc',
    category: 'strings',
    relevanceScore: 0.6
  },
  {
    id: 'number_1',
    content: 'Math operations include addition, subtraction, multiplication, division and advanced functions like Math.round().',
    source: 'numbers-rule.mdc',
    category: 'numbers',
    relevanceScore: 0.5
  },
  {
    id: 'object_1',
    content: 'Object property access uses dot notation like object.property or bracket notation object["property"].',
    source: 'object-rule.mdc',
    category: 'object',
    relevanceScore: 0.4
  }
];

// Sample conversation history
const sampleHistory: ChatTurn[] = [
  {
    role: 'user',
    content: 'How do I work with arrays in DSL?',
    timestamp: new Date(Date.now() - 120000) // 2 minutes ago
  },
  {
    role: 'assistant',
    content: 'Arrays in DSL support filtering, mapping, and other operations. The filter function is very useful.',
    timestamp: new Date(Date.now() - 60000) // 1 minute ago
  }
];

console.log('🧪 Testing Knowledge Optimizer Implementation\n');

// Test 1: Array query with no history
console.log('📝 Test 1: New Conversation - Array Query');
const arrayResult = optimizer.selectOptimalCards(
  sampleKnowledgeCards,
  'How do I filter arrays?',
  [],
  400 // token budget
);

console.log(`Selected ${arrayResult.cards.length} cards with ${arrayResult.metrics.tokensUsed} tokens`);
arrayResult.cards.forEach(card => {
  console.log(`  - ${optimizer.getCardScoreBreakdown(card)}`);
});
console.log('');

// Test 2: String query with array history (contextual relevance)
console.log('📝 Test 2: String Query with Array History');
const stringResult = optimizer.selectOptimalCards(
  sampleKnowledgeCards,
  'What about string operations?',
  sampleHistory,
  300 // token budget
);

console.log(`Selected ${stringResult.cards.length} cards with ${stringResult.metrics.tokensUsed} tokens`);
stringResult.cards.forEach(card => {
  console.log(`  - ${optimizer.getCardScoreBreakdown(card)}`);
});
console.log('');

// Test 3: Low token budget (forced optimization)
console.log('📝 Test 3: Low Token Budget Optimization');
const lowBudgetResult = optimizer.selectOptimalCards(
  sampleKnowledgeCards,
  'DSL array filter and map operations',
  sampleHistory,
  150 // very low budget
);

console.log(`Selected ${lowBudgetResult.cards.length} cards with ${lowBudgetResult.metrics.tokensUsed} tokens`);
lowBudgetResult.cards.forEach(card => {
  console.log(`  - ${optimizer.getCardScoreBreakdown(card)}`);
});
console.log('');

// Test 4: Complex query with recency boost
console.log('📝 Test 4: Complex Query with Recent Array Discussion');
const recentArrayHistory: ChatTurn[] = [
  {
    role: 'user',
    content: 'Tell me about array operations',
    timestamp: new Date(Date.now() - 30000) // 30 seconds ago
  },
  {
    role: 'assistant',
    content: 'Array operations are fundamental in DSL programming.',
    timestamp: new Date(Date.now() - 15000) // 15 seconds ago
  }
];

const complexResult = optimizer.selectOptimalCards(
  sampleKnowledgeCards,
  'How to combine array filtering with mapping?',
  recentArrayHistory,
  500 // high budget
);

console.log(`Selected ${complexResult.cards.length} cards with ${complexResult.metrics.tokensUsed} tokens`);
complexResult.cards.forEach(card => {
  console.log(`  - ${optimizer.getCardScoreBreakdown(card)}`);
});
console.log('');

// Test 5: DSL concept extraction test
console.log('📝 Test 5: DSL Concept Detection');
const queries = [
  'array filter operations',
  'string manipulation functions', 
  'mathematical calculations',
  'object property access'
];

queries.forEach(query => {
  const result = optimizer.selectOptimalCards(
    sampleKnowledgeCards,
    query,
    [],
    200
  );
  
  console.log(`Query: "${query}" → Selected: ${result.cards.length} cards (${result.metrics.tokensUsed} tokens)`);
  const topCard = result.cards[0];
  if (topCard) {
    console.log(`  Top relevance: ${topCard.category} (${(topCard.efficiency * 100).toFixed(1)}% efficiency)`);
  }
});
console.log('');

// Test 6: Edge cases
console.log('📝 Test 6: Edge Cases');

// Empty candidates
const emptyResult = optimizer.selectOptimalCards([], 'test query', [], 100);
console.log(`Empty candidates: ${emptyResult.cards.length} cards selected`);

// Zero budget
const zeroBudgetResult = optimizer.selectOptimalCards(sampleKnowledgeCards, 'test query', [], 0);
console.log(`Zero budget: ${zeroBudgetResult.cards.length} cards selected`);

// Very high budget
const highBudgetResult = optimizer.selectOptimalCards(sampleKnowledgeCards, 'DSL operations', [], 10000);
console.log(`High budget: ${highBudgetResult.cards.length} cards selected (${highBudgetResult.metrics.tokensUsed} tokens)`);

console.log('\n✅ Knowledge Optimizer tests completed!'); 