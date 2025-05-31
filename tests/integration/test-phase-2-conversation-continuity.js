#!/usr/bin/env node

/**
 * Phase 2: Conversation Continuity Test Suite
 * 
 * Validates:
 * 1. Older message summarization functionality
 * 2. Conversation linking instructions and markers
 * 3. Flow-specific summary generation
 * 4. Conversation context preservation
 * 5. Reference building and threading
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 45000; // 45 seconds for conversation tests
const REQUEST_DELAY = 4000; // 4 second delay between requests for conversation flow

// Test utilities
function generateSessionId() {
  return 'phase2-test-' + Math.random().toString(36).substring(2, 15);
}

// Utility to add delay between requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(message, sessionId = generateSessionId()) {
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
        maxTokens: 8000
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

// Phase 2 Test Suite
class ConversationContinuityTests {
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

  // Test 2.1: Conversation Linking and Markers
  async testConversationLinking() {
    return this.runTest('Conversation Linking & Markers', async () => {
      const sessionId = generateSessionId();
      
      // Build a conversation that should trigger linking
      const conversationSteps = [
        'What are arrays in ZEN DSL?',
        'How do I filter them?',
        'Can you show me examples with numbers?',
        'What about string arrays?'
      ];
      
      const responses = [];
      
      for (let i = 0; i < conversationSteps.length; i++) {
        const step = conversationSteps[i];
        
        // Add delay between requests
        if (i > 0) {
          this.log(`⏳ Waiting ${REQUEST_DELAY/1000}s before next request...`);
          await delay(REQUEST_DELAY);
        }
        
        const response = await sendMessage(step, sessionId);
        
        if (response.error) {
          throw new Error(`Conversation linking test failed at step "${step}": ${response.error}`);
        }
        
        responses.push({
          query: step,
          response: response.text,
          length: response.text.length,
          processingTime: response.metadata.actualProcessingTime
        });
      }
      
      // Check for conversation markers in responses after the first
      const conversationMarkers = [
        'building on',
        'as we discussed',
        'continuing from',
        'as we explored',
        'previously mentioned',
        'earlier conversation',
        'our discussion',
        'we covered',
        'as established'
      ];
      
      let markersFound = 0;
      let totalMarkersDetected = 0;
      
      for (let i = 1; i < responses.length; i++) {
        const responseText = responses[i].response.toLowerCase();
        const foundMarkers = conversationMarkers.filter(marker => 
          responseText.includes(marker)
        );
        
        if (foundMarkers.length > 0) {
          markersFound++;
          totalMarkersDetected += foundMarkers.length;
        }
      }
      
      const markerRate = markersFound / (responses.length - 1);
      
      // Phase 2 success criteria: At least 60% of follow-up responses should have conversation markers
      if (markerRate < 0.6) {
        throw new Error(`Conversation marker rate too low: ${(markerRate * 100).toFixed(1)}% (expected ≥60%)`);
      }
      
      return {
        sessionId,
        conversationTurns: conversationSteps.length,
        responsesWithMarkers: markersFound,
        markerRate: markerRate * 100,
        totalMarkersDetected,
        avgResponseLength: responses.reduce((sum, r) => sum + r.length, 0) / responses.length,
        totalProcessingTime: responses.reduce((sum, r) => sum + r.processingTime, 0)
      };
    });
  }

  // Test 2.2: Flow-Specific Message Summarization
  async testFlowSpecificSummarization() {
    return this.runTest('Flow-Specific Message Summarization', async () => {
      const sessionId = generateSessionId();
      
      // Create a long learning conversation to trigger summarization
      const learningSteps = [
        'What is the len() function in ZEN?',
        'How does filter() work?',
        'Explain map() operations',
        'Show me string functions',
        'What about mathematical operations?',
        'How do I combine these functions?',
        'Can you explain boolean operations?',
        'What are conditional expressions?',
        'How do I work with objects?',
        'What about type checking?',
        'Can you now explain everything we discussed about ZEN?'
      ];
      
      const responses = [];
      
      for (let i = 0; i < learningSteps.length; i++) {
        const step = learningSteps[i];
        
        // Add delay between requests
        if (i > 0) {
          this.log(`⏳ Waiting ${REQUEST_DELAY/1000}s before step ${i + 1}...`);
          await delay(REQUEST_DELAY);
        }
        
        const response = await sendMessage(step, sessionId);
        
        if (response.error) {
          throw new Error(`Summarization test failed at step "${step}": ${response.error}`);
        }
        
        responses.push({
          query: step,
          response: response.text,
          length: response.text.length,
          processingTime: response.metadata.actualProcessingTime
        });
      }
      
      // Final response should demonstrate conversation continuity
      const finalResponse = responses[responses.length - 1].response.toLowerCase();
      
      // Check for comprehensive reference to previous discussion
      const comprehensiveIndicators = [
        'len',
        'filter',
        'map',
        'string',
        'mathematical',
        'boolean',
        'conditional',
        'discussed',
        'explored',
        'covered'
      ];
      
      const comprehensiveScore = comprehensiveIndicators.filter(indicator => 
        finalResponse.includes(indicator)
      ).length / comprehensiveIndicators.length;
      
      if (comprehensiveScore < 0.7) {
        throw new Error(`Comprehensive reference score too low: ${(comprehensiveScore * 100).toFixed(1)}% (expected ≥70%)`);
      }
      
      return {
        sessionId,
        learningSteps: learningSteps.length,
        comprehensiveScore: comprehensiveScore * 100,
        finalResponseLength: responses[responses.length - 1].length,
        avgResponseLength: responses.reduce((sum, r) => sum + r.length, 0) / responses.length,
        totalProcessingTime: responses.reduce((sum, r) => sum + r.processingTime, 0)
      };
    });
  }

  // Test 2.3: Problem-Solving Flow Continuity
  async testProblemSolvingContinuity() {
    return this.runTest('Problem-Solving Flow Continuity', async () => {
      const sessionId = generateSessionId();
      
      // Create a problem-solving conversation
      const problemSteps = [
        'I have an error with this expression: filter(users, age > 30)',
        'The filter is not working correctly',
        'How do I fix the syntax?',
        'Now I want to map the results to get names only',
        'Can you help me combine the filter and map?'
      ];
      
      const responses = [];
      
      for (let i = 0; i < problemSteps.length; i++) {
        const step = problemSteps[i];
        
        // Add delay between requests
        if (i > 0) {
          this.log(`⏳ Waiting ${REQUEST_DELAY/1000}s before next request...`);
          await delay(REQUEST_DELAY);
        }
        
        const response = await sendMessage(step, sessionId);
        
        if (response.error) {
          throw new Error(`Problem-solving test failed at step "${step}": ${response.error}`);
        }
        
        responses.push({
          query: step,
          response: response.text,
          length: response.text.length,
          processingTime: response.metadata.actualProcessingTime
        });
      }
      
      // Check for problem-solving continuity
      const problemSolvingIndicators = [
        'error',
        'fix',
        'solution',
        'correct',
        'syntax',
        'filter',
        'map',
        'combine'
      ];
      
      let problemContextScore = 0;
      
      for (let i = 1; i < responses.length; i++) {
        const responseText = responses[i].response.toLowerCase();
        const contextScore = problemSolvingIndicators.filter(indicator => 
          responseText.includes(indicator)
        ).length;
        problemContextScore += contextScore;
      }
      
      const avgContextScore = problemContextScore / (responses.length - 1);
      
      if (avgContextScore < 3) {
        throw new Error(`Problem context continuity too low: ${avgContextScore} indicators per response (expected ≥3)`);
      }
      
      return {
        sessionId,
        problemSteps: problemSteps.length,
        avgContextScore,
        problemContextScore,
        avgResponseLength: responses.reduce((sum, r) => sum + r.length, 0) / responses.length
      };
    });
  }

  // Run all Phase 2 tests
  async runAllTests() {
    this.log('🚀 Starting Phase 2: Conversation Continuity Test Suite', 'info');
    this.log(`📊 Testing against: ${BASE_URL}`, 'info');
    this.log(`🔗 Phase 2 Features: Message summarization, conversation linking, flow awareness`, 'info');
    
    const startTime = Date.now();
    
    try {
      // Run all Phase 2 tests
      await this.testConversationLinking();
      await this.testFlowSpecificSummarization();
      await this.testProblemSolvingContinuity();
      
    } catch (error) {
      this.log(`Test execution error: ${error.message}`, 'error');
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate report
    this.generateReport(totalTime);
  }

  generateReport(totalTime) {
    this.log('\n📋 ========== PHASE 2: CONVERSATION CONTINUITY RESULTS ==========', 'info');
    this.log(`📊 Total Tests: ${this.results.total}`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`, 'info');
    this.log(`⏱️  Total Execution Time: ${Math.round(totalTime / 1000)}s`, 'info');
    
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
      this.log('\n🎉 PHASE 2: CONVERSATION CONTINUITY FULLY SUCCESSFUL!', 'success');
      this.log('✅ Conversation linking and summarization working perfectly', 'success');
      this.log('🚀 Ready for Phase 3: Topic Management', 'success');
    } else if (passRate >= 66) {
      this.log('\n⚠️  PHASE 2: CONVERSATION CONTINUITY MOSTLY SUCCESSFUL', 'warning');
      this.log('✅ Core conversation features working', 'warning');
      this.log('⚠️  Some enhancements need attention', 'warning');
    } else {
      this.log('\n❌ PHASE 2: CONVERSATION CONTINUITY NEEDS ATTENTION', 'error');
      this.log('❌ Critical conversation features not working', 'error');
      this.log('🔧 Fix issues before proceeding to Phase 3', 'error');
    }
    
    this.log('\n🔧 Next Steps:', 'info');
    if (passRate >= 66) {
      this.log('✅ Proceed to Phase 3: Topic Management Implementation', 'success');
    } else {
      this.log('🔍 Review conversation linking and summarization implementation', 'warning');
      this.log('🔄 Re-run tests after fixes', 'info');
    }
  }
}

// Run tests if called directly
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const testSuite = new ConversationContinuityTests();
  testSuite.runAllTests().catch(error => {
    console.error('❌ Phase 2 test suite execution failed:', error);
    process.exit(1);
  });
}

export { ConversationContinuityTests }; 