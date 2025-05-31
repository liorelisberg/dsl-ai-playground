#!/usr/bin/env node

/**
 * Phase 0: Gemini 2.0 Flash Upgrade Test Suite
 * 
 * Validates:
 * 1. Model initialization with new version
 * 2. Backward compatibility with existing prompts
 * 3. Enhanced reasoning capabilities
 * 4. Performance characteristics
 * 5. Error handling robustness
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 20000; // 20 seconds
const PERFORMANCE_THRESHOLD = 12000; // 12 seconds

// Test utilities
function generateSessionId() {
  return 'test-' + Math.random().toString(36).substring(2, 15);
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
        maxTokens: 2000
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

// Test suite
class Gemini2UpgradeTests {
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

  // Test 1: Basic Model Initialization
  async testModelInitialization() {
    return this.runTest('Model Initializes Successfully', async () => {
      const response = await sendMessage('Hello ZEN assistant');
      
      if (response.error) {
        throw new Error(`Model initialization failed: ${response.error}`);
      }
      
      if (!response.text) {
        throw new Error('No response text received');
      }
      
      if (!response.metadata) {
        throw new Error('No metadata received');
      }
      
      if (response.metadata.actualProcessingTime > PERFORMANCE_THRESHOLD) {
        throw new Error(`Response too slow: ${response.metadata.actualProcessingTime}ms`);
      }
      
      return {
        responseLength: response.text.length,
        processingTime: response.metadata.actualProcessingTime,
        hasMetadata: !!response.metadata
      };
    });
  }

  // Test 2: Enhanced Reasoning Capabilities  
  async testEnhancedReasoning() {
    return this.runTest('Enhanced Reasoning Capabilities', async () => {
      const response = await sendMessage('How do filter and map work together in ZEN DSL?');
      
      if (response.error) {
        throw new Error(`Reasoning test failed: ${response.error}`);
      }
      
      const text = response.text.toLowerCase();
      const hasFilterMap = /filter.*map|map.*filter/.test(text);
      const hasZenReference = /zen|dsl/.test(text);
      const isSubstantial = response.text.length > 100;
      
      if (!hasFilterMap) {
        throw new Error('Response does not explain filter/map relationship');
      }
      
      if (!hasZenReference) {
        throw new Error('Response does not reference ZEN DSL context');
      }
      
      if (!isSubstantial) {
        throw new Error('Response too brief for reasoning test');
      }
      
      return {
        hasFilterMapExplanation: hasFilterMap,
        hasZenContext: hasZenReference,
        responseLength: response.text.length,
        processingTime: response.metadata.actualProcessingTime
      };
    });
  }

  // Test 3: Backward Compatibility
  async testBackwardCompatibility() {
    return this.runTest('Backward Compatibility with Existing Prompts', async () => {
      const testCases = [
        'What is len() function?',
        'How to filter arrays?',
        'Show me string operations',
        'Explain date functions'
      ];
      
      const results = [];
      
      for (const testCase of testCases) {
        const response = await sendMessage(testCase);
        
        if (response.error) {
          throw new Error(`Compatibility test failed for "${testCase}": ${response.error}`);
        }
        
        results.push({
          query: testCase,
          responseLength: response.text.length,
          processingTime: response.metadata.actualProcessingTime,
          hasZenContent: /zen|dsl/i.test(response.text)
        });
      }
      
      const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
      const zenContentRate = results.filter(r => r.hasZenContent).length / results.length;
      
      if (avgProcessingTime > PERFORMANCE_THRESHOLD) {
        throw new Error(`Average processing time too slow: ${avgProcessingTime}ms`);
      }
      
      if (zenContentRate < 0.75) {
        throw new Error(`ZEN content rate too low: ${zenContentRate * 100}%`);
      }
      
      return {
        testCases: results.length,
        avgProcessingTime,
        zenContentRate: zenContentRate * 100
      };
    });
  }

  // Test 4: Performance Characteristics
  async testPerformanceCharacteristics() {
    return this.runTest('Performance Within Acceptable Limits', async () => {
      const iterations = 3;
      const results = [];
      
      for (let i = 0; i < iterations; i++) {
        const response = await sendMessage(`Test performance iteration ${i + 1}`);
        
        if (response.error) {
          throw new Error(`Performance test iteration ${i + 1} failed: ${response.error}`);
        }
        
        results.push({
          iteration: i + 1,
          processingTime: response.metadata.actualProcessingTime,
          responseLength: response.text.length
        });
      }
      
      const avgTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
      const maxTime = Math.max(...results.map(r => r.processingTime));
      const minTime = Math.min(...results.map(r => r.processingTime));
      
      if (avgTime > PERFORMANCE_THRESHOLD) {
        throw new Error(`Average response time too slow: ${avgTime}ms`);
      }
      
      if (maxTime > PERFORMANCE_THRESHOLD * 1.5) {
        throw new Error(`Max response time too slow: ${maxTime}ms`);
      }
      
      return {
        iterations,
        avgTime,
        maxTime,
        minTime,
        variance: maxTime - minTime
      };
    });
  }

  // Test 5: Error Handling Robustness
  async testErrorHandling() {
    return this.runTest('Error Handling Robustness', async () => {
      const errorTests = [
        { input: '', expectedBehavior: 'graceful_handling' },
        { input: 'x'.repeat(5000), expectedBehavior: 'length_limit' },
        { input: 'Tell me about non-ZEN topics like cooking', expectedBehavior: 'topic_deflection' }
      ];
      
      const results = [];
      
      for (const test of errorTests) {
        const response = await sendMessage(test.input);
        
        // For error handling tests, we expect responses, not errors
        const hasResponse = !!response.text;
        const isGraceful = !response.error || response.text;
        
        results.push({
          input: test.input.length > 50 ? test.input.substring(0, 50) + '...' : test.input,
          expectedBehavior: test.expectedBehavior,
          hasResponse,
          isGraceful,
          processingTime: response.metadata?.actualProcessingTime || response.processingTime
        });
      }
      
      const gracefulRate = results.filter(r => r.isGraceful).length / results.length;
      
      if (gracefulRate < 1.0) {
        throw new Error(`Error handling not graceful enough: ${gracefulRate * 100}%`);
      }
      
      return {
        errorTests: results.length,
        gracefulHandlingRate: gracefulRate * 100,
        results
      };
    });
  }

  // Test 6: Conversation Context Retention
  async testConversationContext() {
    return this.runTest('Conversation Context Retention', async () => {
      const sessionId = generateSessionId();
      
      // First message
      const response1 = await sendMessage('What is the len() function?', sessionId);
      if (response1.error) {
        throw new Error(`First message failed: ${response1.error}`);
      }
      
      // Second message referencing first
      const response2 = await sendMessage('Can you give me an example of using it?', sessionId);
      if (response2.error) {
        throw new Error(`Second message failed: ${response2.error}`);
      }
      
      // Check if second response shows context awareness
      const hasContextAwareness = response2.text.toLowerCase().includes('len') || 
                                   /length|example|function/.test(response2.text.toLowerCase());
      
      if (!hasContextAwareness) {
        throw new Error('Model does not show conversation context retention');
      }
      
      return {
        sessionId,
        firstResponseLength: response1.text.length,
        secondResponseLength: response2.text.length,
        hasContextAwareness,
        avgProcessingTime: (response1.metadata.actualProcessingTime + response2.metadata.actualProcessingTime) / 2
      };
    });
  }

  // Test 7: ZEN DSL Knowledge Validation
  async testZenKnowledge() {
    return this.runTest('ZEN DSL Knowledge Validation', async () => {
      const zenQueries = [
        'What ZEN functions work with arrays?',
        'How do I use the d() function for dates?',
        'What string operations are available?',
        'Show me mathematical functions in ZEN'
      ];
      
      const results = [];
      
      for (const query of zenQueries) {
        const response = await sendMessage(query);
        
        if (response.error) {
          throw new Error(`ZEN knowledge test failed for "${query}": ${response.error}`);
        }
        
        const text = response.text.toLowerCase();
        const hasZenFunctions = /len|filter|map|contains|sum|avg|min|max|upper|lower|trim/.test(text);
        const avoidsJavaScript = !/javascript|js|\.push|\.pop|\.slice/.test(text);
        
        results.push({
          query,
          hasZenFunctions,
          avoidsJavaScript,
          responseLength: response.text.length,
          processingTime: response.metadata.actualProcessingTime
        });
      }
      
      const zenAccuracy = results.filter(r => r.hasZenFunctions).length / results.length;
      const jsAvoidance = results.filter(r => r.avoidsJavaScript).length / results.length;
      
      if (zenAccuracy < 0.8) {
        throw new Error(`ZEN function accuracy too low: ${zenAccuracy * 100}%`);
      }
      
      if (jsAvoidance < 0.9) {
        throw new Error(`JavaScript avoidance too low: ${jsAvoidance * 100}%`);
      }
      
      return {
        queries: results.length,
        zenAccuracy: zenAccuracy * 100,
        jsAvoidance: jsAvoidance * 100,
        avgProcessingTime: results.reduce((sum, r) => sum + r.processingTime, 0) / results.length
      };
    });
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 Starting Gemini 2.0 Flash Upgrade Test Suite', 'info');
    this.log(`📊 Testing against: ${BASE_URL}`, 'info');
    this.log(`⏱️  Timeout threshold: ${TEST_TIMEOUT}ms`, 'info');
    this.log(`🚄 Performance threshold: ${PERFORMANCE_THRESHOLD}ms`, 'info');
    
    const startTime = Date.now();
    
    try {
      // Run all tests
      await this.testModelInitialization();
      await this.testEnhancedReasoning();
      await this.testBackwardCompatibility();
      await this.testPerformanceCharacteristics();
      await this.testErrorHandling();
      await this.testConversationContext();
      await this.testZenKnowledge();
      
    } catch (error) {
      this.log(`Test execution error: ${error.message}`, 'error');
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate report
    this.generateReport(totalTime);
  }

  generateReport(totalTime) {
    this.log('\n📋 ========== GEMINI 2.0 FLASH UPGRADE TEST RESULTS ==========', 'info');
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
      this.log('\n🎉 GEMINI 2.0 FLASH UPGRADE: FULLY SUCCESSFUL!', 'success');
      this.log('✅ All tests passed - upgrade is ready for production', 'success');
    } else if (passRate >= 80) {
      this.log('\n⚠️  GEMINI 2.0 FLASH UPGRADE: MOSTLY SUCCESSFUL', 'warning');
      this.log('✅ Upgrade functional but with some issues - review failures', 'warning');
    } else {
      this.log('\n❌ GEMINI 2.0 FLASH UPGRADE: NEEDS ATTENTION', 'error');
      this.log('❌ Significant issues detected - upgrade needs fixes', 'error');
    }
    
    this.log('\n🔧 Next Steps:', 'info');
    if (passRate === 100) {
      this.log('✅ Proceed to Phase 1: Token Budget Expansion', 'success');
    } else {
      this.log('🔍 Review failed tests and address issues before proceeding', 'warning');
      this.log('🔄 Re-run tests after fixes', 'info');
    }
  }
}

// Run tests if called directly
const __filename = fileURLToPath(import.meta.url);

// Check if this file is being run directly
if (process.argv[1] === __filename) {
  const testSuite = new Gemini2UpgradeTests();
  testSuite.runAllTests().catch(error => {
    console.error('❌ Test suite execution failed:', error);
    process.exit(1);
  });
}

export { Gemini2UpgradeTests, sendMessage, generateSessionId }; 