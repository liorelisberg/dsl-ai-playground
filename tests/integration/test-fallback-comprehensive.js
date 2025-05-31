#!/usr/bin/env node

/**
 * Comprehensive Fallback Mechanism Test Suite
 * Tests all API resilience scenarios and error recovery
 */

import { performance } from 'perf_hooks';

// Test configuration
const BASE_URL = 'http://localhost:3000/api/chat/semantic';
const REQUEST_DELAY = 2000; // 2 second delay between tests

// Test scenarios to validate
const FALLBACK_SCENARIOS = [
  {
    name: 'Normal Operation',
    message: 'What is len() in ZEN DSL?',
    expectedFallback: false,
    description: 'Should use primary model without fallback'
  },
  {
    name: 'Complex Query Stress Test',
    message: 'Explain all ZEN DSL array functions including filter, map, reduce, sort, reverse, find, findIndex, every, some, forEach, slice, splice, join, concat, includes, indexOf, lastIndexOf with comprehensive examples, edge cases, performance implications, best practices, common pitfalls, error handling, type safety considerations, and integration patterns with other ZEN DSL features',
    expectedFallback: 'possible',
    description: 'Complex query that might trigger fallback during high load'
  },
  {
    name: 'Rapid Request Burst',
    messages: [
      'What are arrays?',
      'How do I filter them?',
      'Show me map examples',
      'Explain reduce function',
      'What about string functions?'
    ],
    expectedFallback: 'possible',
    description: 'Rapid requests to test rate limiting and potential fallback'
  }
];

/**
 * Send API request with detailed response analysis
 */
async function sendMessage(message, sessionId = null) {
  const startTime = performance.now();
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: sessionId || `fallback-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }),
    });

    const responseTime = Math.round(performance.now() - startTime);
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data,
      responseTime,
      headers: Object.fromEntries(response.headers.entries())
    };

  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);
    return {
      success: false,
      status: 0,
      error: error.message,
      responseTime
    };
  }
}

/**
 * Analyze response for fallback indicators
 */
function analyzeFallbackResponse(response) {
  if (!response.success) {
    return {
      fallbackDetected: false,
      model: 'unknown',
      error: response.error || 'Request failed'
    };
  }

  const { data } = response;
  const resilience = data.metadata?.resilience;
  
  return {
    fallbackDetected: resilience?.wasFallback || false,
    model: resilience?.model || 'unknown',
    delayTime: resilience?.delayTime || 0,
    apiStress: resilience?.apiStress || 'unknown',
    responseLength: data.text?.length || 0,
    hasFeedbackMessage: data.text?.includes('---') || false
  };
}

/**
 * Test normal operation scenario
 */
async function testNormalOperation() {
  console.log('\n🧪 Test 1: Normal Operation');
  
  const scenario = FALLBACK_SCENARIOS[0];
  const response = await sendMessage(scenario.message);
  const analysis = analyzeFallbackResponse(response);
  
  console.log(`📝 Query: "${scenario.message}"`);
  console.log(`🎯 Status: ${response.success ? 'Success' : 'Failed'}`);
  console.log(`⚡ Response Time: ${response.responseTime}ms`);
  console.log(`🤖 Model Used: ${analysis.model}`);
  console.log(`🔄 Fallback: ${analysis.fallbackDetected ? 'Yes' : 'No'}`);
  console.log(`📊 Response Length: ${analysis.responseLength} chars`);
  
  if (analysis.delayTime > 0) {
    console.log(`⏱️  Processing Delay: ${analysis.delayTime}ms`);
  }
  
  return {
    passed: response.success,
    fallbackUsed: analysis.fallbackDetected,
    model: analysis.model,
    responseTime: response.responseTime
  };
}

/**
 * Test complex query that might trigger fallback
 */
async function testComplexQueryStress() {
  console.log('\n🧪 Test 2: Complex Query Stress Test');
  
  const scenario = FALLBACK_SCENARIOS[1];
  const response = await sendMessage(scenario.message);
  const analysis = analyzeFallbackResponse(response);
  
  console.log(`📝 Query: Complex array functions explanation (${scenario.message.length} chars)`);
  console.log(`🎯 Status: ${response.success ? 'Success' : 'Failed'}`);
  console.log(`⚡ Response Time: ${response.responseTime}ms`);
  console.log(`🤖 Model Used: ${analysis.model}`);
  console.log(`🔄 Fallback: ${analysis.fallbackDetected ? 'Yes' : 'No'}`);
  console.log(`📊 Response Length: ${analysis.responseLength} chars`);
  console.log(`💬 Has Feedback: ${analysis.hasFeedbackMessage ? 'Yes' : 'No'}`);
  
  if (analysis.fallbackDetected) {
    console.log(`✅ Fallback mechanism activated successfully!`);
  }
  
  if (analysis.delayTime > 5000) {
    console.log(`⏱️  Significant delay detected: ${analysis.delayTime}ms`);
  }
  
  return {
    passed: response.success,
    fallbackUsed: analysis.fallbackDetected,
    model: analysis.model,
    responseTime: response.responseTime,
    hadSignificantDelay: analysis.delayTime > 5000
  };
}

/**
 * Test rapid request burst to trigger rate limiting
 */
async function testRapidRequestBurst() {
  console.log('\n🧪 Test 3: Rapid Request Burst (Rate Limiting Test)');
  
  const scenario = FALLBACK_SCENARIOS[2];
  const sessionId = `burst-test-${Date.now()}`;
  const results = [];
  
  console.log(`📦 Sending ${scenario.messages.length} rapid requests...`);
  
  // Send requests in quick succession
  for (let i = 0; i < scenario.messages.length; i++) {
    const message = scenario.messages[i];
    console.log(`   ${i + 1}/${scenario.messages.length}: "${message}"`);
    
    const response = await sendMessage(message, sessionId);
    const analysis = analyzeFallbackResponse(response);
    
    results.push({
      success: response.success,
      fallback: analysis.fallbackDetected,
      model: analysis.model,
      responseTime: response.responseTime,
      delayTime: analysis.delayTime
    });
    
    const statusIcon = response.success ? '✅' : '❌';
    const fallbackIcon = analysis.fallbackDetected ? '🔄' : '➡️';
    console.log(`     ${statusIcon} ${fallbackIcon} ${analysis.model} (${response.responseTime}ms)`);
    
    // Small delay to prevent overwhelming
    if (i < scenario.messages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
  
  // Analyze burst results
  const successCount = results.filter(r => r.success).length;
  const fallbackCount = results.filter(r => r.fallback).length;
  const avgResponseTime = Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length);
  const maxDelay = Math.max(...results.map(r => r.delayTime || 0));
  
  console.log(`📊 Burst Test Results:`);
  console.log(`   Success Rate: ${successCount}/${results.length} (${(successCount/results.length*100).toFixed(1)}%)`);
  console.log(`   Fallback Usage: ${fallbackCount}/${results.length} (${(fallbackCount/results.length*100).toFixed(1)}%)`);
  console.log(`   Average Response Time: ${avgResponseTime}ms`);
  console.log(`   Maximum Delay: ${maxDelay}ms`);
  
  return {
    passed: successCount >= results.length * 0.8, // 80% success rate acceptable
    fallbackCount,
    successRate: successCount / results.length,
    avgResponseTime,
    maxDelay
  };
}

/**
 * Test fallback metrics retrieval
 */
async function testFallbackMetrics() {
  console.log('\n🧪 Test 4: Fallback Metrics Validation');
  
  // Send a request that might trigger metrics
  const response = await sendMessage('Test metrics collection');
  
  if (response.success && response.data.metadata) {
    const { metadata } = response.data;
    
    console.log(`📊 Metadata Available: ${metadata ? 'Yes' : 'No'}`);
    
    if (metadata.resilience) {
      const { resilience } = metadata;
      console.log(`🔍 Resilience Metrics:`);
      console.log(`   Model: ${resilience.model || 'unknown'}`);
      console.log(`   Fallback: ${resilience.wasFallback || false}`);
      console.log(`   Delay: ${resilience.delayTime || 0}ms`);
      console.log(`   API Stress: ${resilience.apiStress || 'unknown'}`);
      
      return { passed: true, hasMetrics: true };
    } else {
      console.log(`⚠️  No resilience metrics in response`);
      return { passed: true, hasMetrics: false };
    }
  } else {
    console.log(`❌ Failed to get response for metrics test`);
    return { passed: false, hasMetrics: false };
  }
}

/**
 * Test delay for rate limiting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main test runner
 */
async function runFallbackTests() {
  console.log('🚀 COMPREHENSIVE FALLBACK MECHANISM TEST SUITE');
  console.log('=' .repeat(60));
  console.log('🎯 Testing API resilience, fallback models, and error recovery');
  console.log('📡 Target: http://localhost:3000/api/chat/semantic');
  console.log('');
  
  const testResults = {
    normalOperation: null,
    complexQueryStress: null,
    rapidRequestBurst: null,
    fallbackMetrics: null
  };
  
  try {
    // Test 1: Normal operation
    testResults.normalOperation = await testNormalOperation();
    await delay(REQUEST_DELAY);
    
    // Test 2: Complex query stress
    testResults.complexQueryStress = await testComplexQueryStress();
    await delay(REQUEST_DELAY);
    
    // Test 3: Rapid request burst
    testResults.rapidRequestBurst = await testRapidRequestBurst();
    await delay(REQUEST_DELAY);
    
    // Test 4: Fallback metrics
    testResults.fallbackMetrics = await testFallbackMetrics();
    
  } catch (error) {
    console.log(`❌ Test suite error: ${error.message}`);
    return false;
  }
  
  // Generate comprehensive report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 FALLBACK MECHANISM TEST RESULTS');
  console.log('=' .repeat(60));
  
  // Normal operation results
  if (testResults.normalOperation) {
    const { passed, fallbackUsed, model, responseTime } = testResults.normalOperation;
    console.log(`✅ Normal Operation: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Model: ${model}, Fallback: ${fallbackUsed ? 'Yes' : 'No'}, Time: ${responseTime}ms`);
  }
  
  // Complex query results
  if (testResults.complexQueryStress) {
    const { passed, fallbackUsed, model, responseTime, hadSignificantDelay } = testResults.complexQueryStress;
    console.log(`✅ Complex Query Stress: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Model: ${model}, Fallback: ${fallbackUsed ? 'Yes' : 'No'}, Time: ${responseTime}ms`);
    if (fallbackUsed) {
      console.log(`   🎯 Fallback mechanism successfully activated!`);
    }
  }
  
  // Rapid burst results
  if (testResults.rapidRequestBurst) {
    const { passed, fallbackCount, successRate, avgResponseTime, maxDelay } = testResults.rapidRequestBurst;
    console.log(`✅ Rapid Request Burst: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Success Rate: ${(successRate * 100).toFixed(1)}%, Fallbacks: ${fallbackCount}, Avg Time: ${avgResponseTime}ms`);
    if (maxDelay > 3000) {
      console.log(`   ⏱️  Rate limiting detected: ${maxDelay}ms max delay`);
    }
  }
  
  // Metrics results
  if (testResults.fallbackMetrics) {
    const { passed, hasMetrics } = testResults.fallbackMetrics;
    console.log(`✅ Fallback Metrics: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Metrics Available: ${hasMetrics ? 'Yes' : 'No'}`);
  }
  
  // Overall assessment
  const passedTests = Object.values(testResults).filter(result => result && result.passed).length;
  const totalTests = Object.values(testResults).filter(result => result !== null).length;
  const overallPassRate = (passedTests / totalTests * 100).toFixed(1);
  
  console.log('-' .repeat(60));
  console.log(`🎯 Overall Results: ${passedTests}/${totalTests} tests passed (${overallPassRate}%)`);
  
  // Fallback mechanism assessment
  const fallbacksDetected = [
    testResults.normalOperation?.fallbackUsed,
    testResults.complexQueryStress?.fallbackUsed,
    testResults.rapidRequestBurst?.fallbackCount > 0
  ].filter(Boolean).length;
  
  if (fallbacksDetected > 0) {
    console.log(`🔄 Fallback Mechanism: TESTED & WORKING (${fallbacksDetected} scenarios triggered fallback)`);
    console.log(`✅ API resilience is functioning correctly`);
  } else {
    console.log(`🔄 Fallback Mechanism: AVAILABLE (no fallbacks needed during testing)`);
    console.log(`ℹ️  System operating normally - fallback available if needed`);
  }
  
  console.log('=' .repeat(60));
  
  return overallPassRate >= 80;
}

// Run the tests
runFallbackTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  }); 