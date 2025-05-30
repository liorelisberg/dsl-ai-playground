// Test file for JSON Context Optimizer
// Phase 1.3 Implementation Test

import { JSONContextOptimizer, JsonOptimizationResult } from '../services/jsonOptimizer';

const optimizer = new JSONContextOptimizer();

// Sample JSON data (simulating uploaded business data)
const sampleData = {
  company: {
    name: "Tech Solutions Inc",
    id: "COMP-001",
    founded: "2020-01-15",
    employees: 150,
    revenue: 2500000
  },
  departments: [
    {
      id: "DEPT-001",
      name: "Engineering",
      budget: 800000,
      employees: 45,
      manager: {
        name: "John Smith",
        email: "john.smith@company.com",
        startDate: "2020-03-01"
      },
      projects: [
        { id: "PROJ-001", name: "Web Platform", status: "active", budget: 300000 },
        { id: "PROJ-002", name: "Mobile App", status: "planning", budget: 200000 }
      ]
    }
  ],
  metrics: {
    revenue: {
      monthly: [200000, 210000, 195000, 250000],
      yearToDate: 855000
    },
    performance: {
      efficiency: 0.85,
      satisfaction: 0.92,
      growth: 0.15
    }
  }
};

console.log('🧪 Testing JSON Context Optimizer Implementation\n');

// Test 1: Employee information query
console.log('📝 Test 1: Employee Information Query');
const employeeResult = optimizer.optimizeForQuery(
  sampleData,
  'Show me employee information and department data',
  500
);

console.log(`Optimization: ${employeeResult.optimizationType}`);
console.log(`Tokens used: ${employeeResult.tokensUsed}`);
console.log(`Fields found: ${employeeResult.extractedFields.length}`);
console.log('');

// Test 2: Budget and financial query
console.log('📝 Test 2: Budget Query');
const budgetResult = optimizer.optimizeForQuery(
  sampleData,
  'What are the budget allocations and revenue metrics?',
  300
);

console.log(`Optimization: ${budgetResult.optimizationType}`);
console.log(`Tokens used: ${budgetResult.tokensUsed}`);
console.log(`Fields found: ${budgetResult.extractedFields.length}`);
console.log('');

// Test 3: Full data with high budget
console.log('📝 Test 3: Full Data with High Budget');
const fullResult = optimizer.optimizeForQuery(
  sampleData,
  'I need access to all company data @fulljson',
  15000,
  true
);

console.log(`Optimization: ${fullResult.optimizationType}`);
console.log(`Tokens used: ${fullResult.tokensUsed}`);
console.log('');

// Test 4: Minimal budget
console.log('📝 Test 4: Minimal Budget');
const minimalResult = optimizer.optimizeForQuery(
  sampleData,
  'Company revenue data',
  50
);

console.log(`Optimization: ${minimalResult.optimizationType}`);
console.log(`Tokens used: ${minimalResult.tokensUsed}`);
console.log('');

// Test 5: Edge cases
console.log('📝 Test 5: Edge Cases');
const emptyResult = optimizer.optimizeForQuery(null, 'test', 100);
console.log(`Empty data: ${emptyResult.optimizationType}`);

const zeroBudgetResult = optimizer.optimizeForQuery(sampleData, 'test', 0);
console.log(`Zero budget: ${zeroBudgetResult.optimizationType}`);

console.log('\n✅ JSON Context Optimizer tests completed!'); 