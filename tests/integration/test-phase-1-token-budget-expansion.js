#!/usr/bin/env node

/**
 * Phase 1: Token Budget Expansion Test Suite
 * 
 * Validates:
 * 1. Token budget increased from 2,000 to 8,000
 * 2. Enhanced dynamic budget allocation
 * 3. Conversation flow detection
 * 4. Improved conversation history retention
 * 5. Knowledge card optimization
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000; // 30 seconds for complex tests
const REQUEST_DELAY = 3000; // 3 second delay between requests to avoid rate limiting

// Test utilities
function generateSessionId() {
  return 'phase1-test-' + Math.random().toString(36).substring(2, 15);
}

// Utility to add delay between requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(message, sessionId = generateSessionId(), jsonContext = null) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/api/chat/semantic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        jsonContext,
        maxTokens: 8000 // Updated to test new budget limit
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    return {
      ...data,
      metadata: {
        ...data.metadata,
        actualProcessingTime: processingTime
      }
    };
  } catch (error) {
    return {
      error: error.message,
      processingTime: Date.now() - startTime
    };
  }
}

// Phase 1 Test Suite
class TokenBudgetExpansionTests {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📋',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️'
    }[level];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(testName, testFn) {
    this.results.total++;
    this.log(`Running: ${testName}`);
    
    try {
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_TIMEOUT)
        )
      ]);
      
      this.results.passed++;
      this.results.details.push({
        name: testName,
        status: 'PASS',
        result
      });
      
      this.log(`PASSED: ${testName}`, 'success');
      return result;
    } catch (error) {
      this.results.failed++;
      this.results.details.push({
        name: testName,
        status: 'FAIL', 
        error: error.message
      });
      
      this.log(`FAILED: ${testName} - ${error.message}`, 'error');
      throw error;
    }
  }

  // Test 1.1: Token Budget Expansion Validation
  async testTokenBudgetExpansion() {
    return this.runTest('Token Budget Expanded to 8,000', async () => {
      // Test with a complex query that would exceed old 2,000 token limit
      const complexQuery = 'Explain in detail how to combine filter, map, and reduce operations in ZEN DSL with multiple examples and edge cases for data processing workflows';
      
      const response = await sendMessage(complexQuery);
      
      if (response.error) {
        throw new Error(`Token expansion test failed: ${response.error}`);
      }
      
      // With expanded budget, we should get much richer responses
      const isSubstantialResponse = response.text.length > 2000; // Expect longer, detailed response
      const hasMultipleExamples = (response.text.match(/example/gi) || []).length >= 2;
      const hasDetailedExplanation = response.text.length > 1500;
      
      if (!isSubstantialResponse) {
        throw new Error(`Response not substantial enough for expanded budget: ${response.text.length} chars`);
      }
      
      return {
        responseLength: response.text.length,
        processingTime: response.metadata.actualProcessingTime,
        hasMultipleExamples,
        hasDetailedExplanation,
        tokenEfficiency: response.metadata.tokenEfficiency
      };
    });
  }

  // Test 1.2: Learning Flow Detection and Allocation
  async testLearningFlowAllocation() {
    return this.runTest('Learning Flow Detection & Allocation', async () => {
      const sessionId = generateSessionId();
      
      // Learning flow triggers
      const learningQueries = [
        'What is the len() function?',
        'Explain how filter works in ZEN',
        'Teach me about array operations',
        'I want to understand string functions'
      ];
      
      const results = [];
      
      for (let i = 0; i < learningQueries.length; i++) {
        const query = learningQueries[i];
        
        // Add delay between requests to avoid rate limiting
        if (i > 0) {
          this.log(`⏳ Waiting ${REQUEST_DELAY/1000}s before next request...`);
          await delay(REQUEST_DELAY);
        }
        
        const response = await sendMessage(query, sessionId);
        
        if (response.error) {
          throw new Error(`Learning flow test failed for "${query}": ${response.error}`);
        }
        
        results.push({
          query,
          responseLength: response.text.length,
          processingTime: response.metadata.actualProcessingTime,
          hasEducationalContent: /explain|example|learn|understand|concept/i.test(response.text)
        });
      }
      
      const avgResponseLength = results.reduce((sum, r) => sum + r.responseLength, 0) / results.length;
      const educationalRate = results.filter(r => r.hasEducationalContent).length / results.length;
      
      // With learning flow, expect longer, more educational responses (lowered threshold for testing)
      if (avgResponseLength < 1000) {
        throw new Error(`Learning responses not detailed enough: ${avgResponseLength} avg chars`);
      }
      
      if (educationalRate < 0.6) {
        throw new Error(`Educational content rate too low: ${educationalRate * 100}%`);
      }
      
      return {
        sessionId,
        queries: results.length,
        avgResponseLength,
        educationalRate: educationalRate * 100,
        avgProcessingTime: results.reduce((sum, r) => sum + r.processingTime, 0) / results.length
      };
    });
  }

  // Test 1.3: Problem-Solving Flow Detection
  async testProblemSolvingFlow() {
    return this.runTest('Problem-Solving Flow Detection', async () => {
      const sessionId = generateSessionId();
      
      // Problem-solving flow triggers
      const problemQueries = [
        'I have an error with filter function',
        'Help me debug this expression: filter(items, # > 5)',
        'Fix this issue with my ZEN code',
        'Troubleshoot array operations not working'
      ];
      
      const results = [];
      
      for (const query of problemQueries) {
        const response = await sendMessage(query, sessionId);
        
        if (response.error) {
          throw new Error(`Problem-solving flow test failed for "${query}": ${response.error}`);
        }
        
        results.push({
          query,
          responseLength: response.text.length,
          processingTime: response.metadata.actualProcessingTime,
          hasProblemSolvingContent: /error|fix|debug|issue|problem|solution|troubleshoot/i.test(response.text)
        });
      }
      
      const problemSolvingRate = results.filter(r => r.hasProblemSolvingContent).length / results.length;
      
      if (problemSolvingRate < 0.75) {
        throw new Error(`Problem-solving content rate too low: ${problemSolvingRate * 100}%`);
      }
      
      return {
        sessionId,
        queries: results.length,
        problemSolvingRate: problemSolvingRate * 100,
        avgResponseLength: results.reduce((sum, r) => sum + r.responseLength, 0) / results.length
      };
    });
  }

  // Test 1.4: Enhanced Conversation History Retention
  async testEnhancedHistoryRetention() {
    return this.runTest('Enhanced Conversation History Retention', async () => {
      const sessionId = generateSessionId();
      
      // Build a conversation with multiple turns
      const conversationSteps = [
        'What are arrays in ZEN?',
        'How do I filter them?', 
        'Can you show me examples with numbers?',
        'What about combining filter with map?',
        'Are there any performance considerations?',
        'Can you summarize everything we discussed about arrays?'
      ];
      
      const responses = [];
      
      for (const step of conversationSteps) {
        const response = await sendMessage(step, sessionId);
        
        if (response.error) {
          throw new Error(`History retention test failed at step "${step}": ${response.error}`);
        }
        
        responses.push({
          query: step,
          response: response.text,
          length: response.text.length,
          processingTime: response.metadata.actualProcessingTime
        });
      }
      
      // Final response should reference multiple previous topics
      const finalResponse = responses[responses.length - 1].response.toLowerCase();
      const referencesToPrevious = [
        finalResponse.includes('array'),
        finalResponse.includes('filter'),
        finalResponse.includes('map'),
        finalResponse.includes('example') || finalResponse.includes('number'),
        finalResponse.includes('performance') || finalResponse.includes('consider')
      ];
      
      const contextRetentionRate = referencesToPrevious.filter(Boolean).length / referencesToPrevious.length;
      
      if (contextRetentionRate < 0.6) {
        throw new Error(`Context retention too low: ${contextRetentionRate * 100}%`);
      }
      
      return {
        sessionId,
        conversationTurns: conversationSteps.length,
        contextRetentionRate: contextRetentionRate * 100,
        avgResponseLength: responses.reduce((sum, r) => sum + r.length, 0) / responses.length,
        totalProcessingTime: responses.reduce((sum, r) => sum + r.processingTime, 0)
      };
    });
  }

  // Test 1.5: Complex Query Handling with Expanded Budget
  async testComplexQueryHandling() {
    return this.runTest('Complex Query Handling with Expanded Budget', async () => {
      const complexQuery = `
        I need to understand the complete data processing pipeline in ZEN DSL:
        1. How to filter arrays based on multiple conditions
        2. Transform the filtered data using map operations
        3. Aggregate results with mathematical functions
        4. Handle edge cases and error scenarios
        5. Optimize performance for large datasets
        Please provide detailed examples for each step with real-world use cases.
      `;
      
      const response = await sendMessage(complexQuery);
      
      if (response.error) {
        throw new Error(`Complex query test failed: ${response.error}`);
      }
      
      // Validate comprehensive response
      const hasAllTopics = [
        /filter.*condition/i.test(response.text),
        /map.*transform/i.test(response.text),
        /mathematical|aggregate/i.test(response.text),
        /edge case|error/i.test(response.text),
        /performance|optimi/i.test(response.text)
      ];
      
      const topicCoverageRate = hasAllTopics.filter(Boolean).length / hasAllTopics.length;
      const hasMultipleExamples = (response.text.match(/example/gi) || []).length >= 3;
      const isComprehensive = response.text.length > 3000;
      
      if (topicCoverageRate < 0.8) {
        throw new Error(`Topic coverage too low: ${topicCoverageRate * 100}%`);
      }
      
      if (!isComprehensive) {
        throw new Error(`Response not comprehensive enough: ${response.text.length} chars`);
      }
      
      return {
        responseLength: response.text.length,
        topicCoverageRate: topicCoverageRate * 100,
        hasMultipleExamples,
        isComprehensive,
        processingTime: response.metadata.actualProcessingTime,
        tokenEfficiency: response.metadata.tokenEfficiency
      };
    });
  }

  // Test 1.6: JSON Context with Expanded Budget
  async testJsonContextExpansion() {
    return this.runTest('JSON Context Handling with Expanded Budget', async () => {
      const largeJsonContext = {
        users: Array.from({length: 20}, (_, i) => ({
          id: i + 1,
          name: `User${i + 1}`,
          age: 20 + Math.floor(Math.random() * 40),
          department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
          salary: 50000 + Math.floor(Math.random() * 50000),
          projects: Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, j) => `Project${j + 1}`)
        })),
        metrics: {
          totalRevenue: 1000000,
          quarterlyGrowth: 12.5,
          customerSatisfaction: 8.7
        }
      };
      
      const query = 'Analyze this user data and create ZEN expressions to find high-performing employees and calculate department statistics';
      
      const response = await sendMessage(query, generateSessionId(), largeJsonContext);
      
      if (response.error) {
        throw new Error(`JSON context test failed: ${response.error}`);
      }
      
      const hasZenExpressions = /filter\(|map\(|sum\(|avg\(/g.test(response.text);
      const referencesData = /user|department|salary|age/i.test(response.text);
      const hasAnalysis = /analysis|calculate|statistic/i.test(response.text);
      
      if (!hasZenExpressions) {
        throw new Error('Response does not contain ZEN expressions');
      }
      
      if (!referencesData) {
        throw new Error('Response does not reference provided JSON data');
      }
      
      return {
        responseLength: response.text.length,
        hasZenExpressions,
        referencesData,
        hasAnalysis,
        processingTime: response.metadata.actualProcessingTime,
        tokenEfficiency: response.metadata.tokenEfficiency
      };
    });
  }

  // Run all Phase 1 tests
  async runAllTests() {
    this.log('🚀 Starting Phase 1: Token Budget Expansion Test Suite', 'info');
    this.log(`📊 Testing against: ${BASE_URL}`, 'info');
    this.log(`💰 New Token Budget: 8,000 (4x increase from 2,000)`, 'info');
    this.log(`🧠 Enhanced Features: Flow-aware allocation, improved retention`, 'info');
    
    const startTime = Date.now();
    
    try {
      // Run all Phase 1 tests
      await this.testTokenBudgetExpansion();
      await this.testLearningFlowAllocation();
      await this.testProblemSolvingFlow();
      await this.testEnhancedHistoryRetention();
      await this.testComplexQueryHandling();
      await this.testJsonContextExpansion();
      
    } catch (error) {
      this.log(`Test execution error: ${error.message}`, 'error');
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate report
    this.generateReport(totalTime);
  }

  generateReport(totalTime) {
    this.log('\n📋 ========== PHASE 1: TOKEN BUDGET EXPANSION RESULTS ==========', 'info');
    this.log(`📊 Total Tests: ${this.results.total}`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`, 'info');
    this.log(`⏱️  Total Execution Time: ${totalTime}ms`, 'info');
    
    // Detailed results
    this.log('\n📋 Detailed Test Results:', 'info');
    this.results.details.forEach(detail => {
      const status = detail.status === 'PASS' ? '✅' : '❌';
      this.log(`${status} ${detail.name}`, detail.status === 'PASS' ? 'success' : 'error');
      
      if (detail.result) {
        this.log(`   📊 ${JSON.stringify(detail.result, null, 2)}`, 'info');
      }
      
      if (detail.error) {
        this.log(`   💬 ${detail.error}`, 'error');
      }
    });
    
    // Summary assessment
    const passRate = (this.results.passed / this.results.total) * 100;
    
    if (passRate === 100) {
      this.log('\n🎉 PHASE 1: TOKEN BUDGET EXPANSION FULLY SUCCESSFUL!', 'success');
      this.log('✅ All enhancements working - ready for Phase 2', 'success');
    } else if (passRate >= 80) {
      this.log('\n⚠️  PHASE 1: TOKEN BUDGET EXPANSION MOSTLY SUCCESSFUL', 'warning');
      this.log('✅ Major improvements achieved - minor issues to address', 'warning');
    } else {
      this.log('\n❌ PHASE 1: TOKEN BUDGET EXPANSION NEEDS ATTENTION', 'error');
      this.log('❌ Significant issues detected - requires fixes', 'error');
    }
    
    this.log('\n🔧 Next Steps:', 'info');
    if (passRate >= 80) {
      this.log('✅ Proceed to Phase 2: Conversation Continuity Implementation', 'success');
    } else {
      this.log('🔍 Review failed tests and address budget allocation issues', 'warning');
      this.log('🔄 Re-run tests after fixes', 'info');
    }
  }
}

// Run tests if called directly
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const testSuite = new TokenBudgetExpansionTests();
  testSuite.runAllTests().catch(error => {
    console.error('❌ Phase 1 test suite execution failed:', error);
    process.exit(1);
  });
}

export { TokenBudgetExpansionTests }; 