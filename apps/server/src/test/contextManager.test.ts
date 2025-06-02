// Test file for Dynamic Context Manager
// Phase 1.1 Implementation Test

import { DynamicContextManager, ChatTurn, ContextBudget } from '../services/contextManager';

const contextManager = new DynamicContextManager();

// Test data
const sampleHistory: ChatTurn[] = [
  {
    role: 'user',
    content: 'How do I filter arrays in DSL?',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    role: 'assistant', 
    content: 'You can filter arrays using the .filter() function like this: myArray.filter(item => item.value > 10)',
    timestamp: new Date(Date.now() - 30000)
  }
];

console.log('🧪 Testing Dynamic Context Manager Implementation\n');

// Test 1: New conversation (no history)
console.log('📝 Test 1: New Conversation Budget Allocation');
const newConversationBudget = contextManager.calculateOptimalBudget(
  'What is the DSL array syntax?',
  [],
  false,
  'simple'
);

console.log('Budget:', contextManager.getBudgetSummary(newConversationBudget));
console.log('Valid:', contextManager.validateBudget(newConversationBudget));
console.log('');

// Test 2: Ongoing conversation with history
console.log('📝 Test 2: Ongoing Conversation Budget Allocation');
const ongoingBudget = contextManager.calculateOptimalBudget(
  'Can you show me a more complex example?',
  sampleHistory,
  false,
  'moderate'
);

console.log('Budget:', contextManager.getBudgetSummary(ongoingBudget));
console.log('Valid:', contextManager.validateBudget(ongoingBudget));
console.log('');

// Test 3: Complex query with JSON context
console.log('📝 Test 3: Complex Query with JSON Context');
const complexBudget = contextManager.calculateOptimalBudget(
  'How can I optimize performance when filtering large arrays with multiple conditions and combine results? @fulljson',
  sampleHistory,
  true,
  'complex'
);

console.log('Budget:', contextManager.getBudgetSummary(complexBudget));
console.log('Valid:', contextManager.validateBudget(complexBudget));
console.log('');

// Test 4: History optimization
console.log('📝 Test 4: History Optimization');
const extendedHistory: ChatTurn[] = [
  ...sampleHistory,
  {
    role: 'user',
    content: 'What about string manipulation?',
    timestamp: new Date(Date.now() - 15000)
  },
  {
    role: 'assistant',
    content: 'String manipulation in DSL includes functions like extract(), upper(), split(), and more.',
    timestamp: new Date(Date.now() - 10000)
  }
];

const optimizedHistory = contextManager.optimizeHistory(extendedHistory, 300);
console.log(`Original history: ${extendedHistory.length} turns`);
console.log(`Optimized history: ${optimizedHistory.length} turns`);
console.log('');

// Test 5: Query complexity assessment
console.log('📝 Test 5: Query Complexity Assessment');
const queries = [
  'What is DSL?',
  'Compare array filter vs map functions',
  'How to optimize performance with multiple complex operations and edge cases?'
];

queries.forEach(query => {
  const complexity = contextManager.assessQueryComplexity(query);
  console.log(`Query: "${query}" → Complexity: ${complexity}`);
});
console.log('');

// Test 6: Token estimation accuracy
console.log('📝 Test 6: Token Estimation');
const testTexts = [
  'Hello',
  'This is a moderate length sentence for testing.',
  'This is a very long sentence that should consume significantly more tokens than the shorter examples above, testing our token estimation accuracy.'
];

testTexts.forEach(text => {
  const tokens = contextManager.estimateTokens(text);
  console.log(`Text: "${text}" → Estimated tokens: ${tokens} (chars: ${text.length})`);
});

console.log('\n✅ Dynamic Context Manager tests completed!'); 