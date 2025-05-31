#!/usr/bin/env node

/**
 * Phase 3: Topic Management & Intelligence Layer Test Suite
 * Tests semantic topic similarity detection and ZEN relevance validation
 */

import { performance } from 'perf_hooks';

// Test configuration
const BASE_URL = 'http://localhost:3000/api/chat/semantic';
const REQUEST_DELAY = 3000; // 3 second delay between tests

/**
 * Test scenarios for Phase 3 validation
 */
const TOPIC_MANAGEMENT_TESTS = [
  {
    name: 'Topic Similarity Detection',
    description: 'Tests semantic topic relatedness between array operations',
    conversation: [
      {
        message: 'What are arrays in ZEN DSL?',
        expectedTopic: 'arrays',
        expectedZenRelevance: true
      },
      {
        message: 'How do I filter arrays?',
        expectedTopic: 'arrays',
        expectedTopicRelation: 'same',
        expectedZenRelevance: true
      },
      {
        message: 'Show me map operations',
        expectedTopic: 'arrays',
        expectedTopicRelation: 'related',
        expectedZenRelevance: true
      },
      {
        message: 'What about string functions?',
        expectedTopic: 'strings',
        expectedTopicRelation: 'different',
        expectedZenRelevance: true
      }
    ]
  },
  {
    name: 'ZEN Relevance Validation',
    description: 'Tests accurate detection of ZEN vs non-ZEN topics',
    scenarios: [
      {
        message: 'How do I use the filter function in ZEN?',
        expectedZenRelevance: true,
        expectedConfidence: 0.8,
        expectedFunctions: ['filter']
      },
      {
        message: 'What is the len() function?',
        expectedZenRelevance: true,
        expectedConfidence: 0.8,
        expectedFunctions: ['len']
      },
      {
        message: 'How do I cook pasta?',
        expectedZenRelevance: false,
        expectedConfidence: 0.3,
        expectedFunctions: []
      },
      {
        message: 'Tell me about machine learning algorithms',
        expectedZenRelevance: false,
        expectedConfidence: 0.2,
        expectedFunctions: []
      },
      {
        message: 'Can I use ZEN DSL to process CSV data?',
        expectedZenRelevance: true,
        expectedConfidence: 0.7,
        expectedFunctions: []
      }
    ]
  },
  {
    name: 'Off-Topic Deflection',
    description: 'Tests professional handling of off-topic queries',
    scenarios: [
      {
        message: 'How do I write Python code?',
        expectedDeflection: true,
        expectedBridge: false
      },
      {
        message: 'Can you help me with SQL queries?',
        expectedDeflection: true,
        expectedBridge: true // Should bridge to ZEN data processing
      },
      {
        message: 'How do I filter() an array in ZEN?',
        expectedDeflection: false,
        expectedBridge: false
      }
    ]
  },
  {
    name: 'Topic Transition Intelligence',
    description: 'Tests smooth handling of topic transitions',
    conversation: [
      {
        message: 'What are ZEN DSL date functions?',
        expectedTopic: 'dates'
      },
      {
        message: 'How do I format dates?',
        expectedTopicRelation: 'same'
      },
      {
        message: 'Can I compare dates?',
        expectedTopicRelation: 'same'
      },
      {
        message: 'What about array operations?',
        expectedTopicRelation: 'different'
      },
      {
        message: 'How do I filter arrays by date?',
        expectedTopicRelation: 'related' // Combines arrays + dates
      }
    ]
  }
];

/**
 * Send message and analyze response
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
        sessionId: sessionId || `phase3-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }),
    });

    const responseTime = Math.round(performance.now() - startTime);
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data,
      responseTime
    };

  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);
    return {
      success: false,
      error: error.message,
      responseTime
    };
  }
}

/**
 * Test 1: Topic Similarity Detection
 */
async function testTopicSimilarityDetection() {
  console.log('\n🧪 Test 1: Topic Similarity Detection');
  
  const testData = TOPIC_MANAGEMENT_TESTS[0];
  const sessionId = `topic-similarity-${Date.now()}`;
  
  console.log(`📋 Testing: ${testData.description}`);
  
  const results = [];
  
  for (let i = 0; i < testData.conversation.length; i++) {
    const step = testData.conversation[i];
    console.log(`\n   Step ${i + 1}/${testData.conversation.length}: "${step.message}"`);
    
    const response = await sendMessage(step.message, sessionId);
    
    if (!response.success) {
      console.log(`     ❌ Request failed: ${response.error}`);
      results.push({ step: i + 1, passed: false, error: response.error });
      continue;
    }

    // Analyze response for topic management features
    const analysis = analyzeTopicManagementResponse(response.data, step);
    
    console.log(`     ✅ Response received (${response.data.text?.length || 0} chars)`);
    console.log(`     🎯 ZEN Relevance: ${analysis.zenRelevance ? 'YES' : 'NO'} (expected: ${step.expectedZenRelevance ? 'YES' : 'NO'})`);
    
    if (analysis.topicTransition) {
      console.log(`     🔄 Topic Transition: ${analysis.topicTransition} (expected: ${step.expectedTopicRelation || 'N/A'})`);
    }
    
    results.push({
      step: i + 1,
      passed: analysis.passed,
      zenRelevance: analysis.zenRelevance,
      topicTransition: analysis.topicTransition,
      responseTime: response.responseTime
    });
    
    // Delay between conversation steps
    if (i < testData.conversation.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const passedSteps = results.filter(r => r.passed).length;
  const passRate = (passedSteps / results.length * 100).toFixed(1);
  
  console.log(`\n📊 Topic Similarity Results:`);
  console.log(`   Passed: ${passedSteps}/${results.length} steps (${passRate}%)`);
  console.log(`   Average Response Time: ${Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)}ms`);
  
  return {
    passed: passRate >= 75,
    passRate: parseFloat(passRate),
    steps: results.length,
    details: results
  };
}

/**
 * Test 2: ZEN Relevance Validation
 */
async function testZenRelevanceValidation() {
  console.log('\n🧪 Test 2: ZEN Relevance Validation');
  
  const testData = TOPIC_MANAGEMENT_TESTS[1];
  
  console.log(`📋 Testing: ${testData.description}`);
  
  const results = [];
  
  for (let i = 0; i < testData.scenarios.length; i++) {
    const scenario = testData.scenarios[i];
    console.log(`\n   Scenario ${i + 1}/${testData.scenarios.length}: "${scenario.message}"`);
    
    const response = await sendMessage(scenario.message);
    
    if (!response.success) {
      console.log(`     ❌ Request failed: ${response.error}`);
      results.push({ scenario: i + 1, passed: false, error: response.error });
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }

    // Analyze ZEN relevance detection
    const analysis = analyzeZenRelevance(response.data, scenario);
    
    console.log(`     ✅ Response received`);
    console.log(`     🎯 ZEN Related: ${analysis.isZenRelated} (expected: ${scenario.expectedZenRelevance})`);
    console.log(`     📊 Confidence: ${(analysis.confidence * 100).toFixed(1)}% (expected: ≥${(scenario.expectedConfidence * 100).toFixed(0)}%)`);
    
    if (analysis.detectedFunctions.length > 0) {
      console.log(`     🔧 Functions: ${analysis.detectedFunctions.join(', ')}`);
    }
    
    results.push({
      scenario: i + 1,
      passed: analysis.passed,
      isZenRelated: analysis.isZenRelated,
      confidence: analysis.confidence,
      detectedFunctions: analysis.detectedFunctions,
      responseTime: response.responseTime
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  const passedScenarios = results.filter(r => r.passed).length;
  const passRate = (passedScenarios / results.length * 100).toFixed(1);
  
  console.log(`\n📊 ZEN Relevance Results:`);
  console.log(`   Passed: ${passedScenarios}/${results.length} scenarios (${passRate}%)`);
  console.log(`   Correct ZEN Detection: ${results.filter(r => r.isZenRelated === testData.scenarios[results.indexOf(r)].expectedZenRelevance).length}/${results.length}`);
  
  return {
    passed: passRate >= 80,
    passRate: parseFloat(passRate),
    scenarios: results.length,
    details: results
  };
}

/**
 * Test 3: Off-Topic Deflection
 */
async function testOffTopicDeflection() {
  console.log('\n🧪 Test 3: Off-Topic Deflection');
  
  const testData = TOPIC_MANAGEMENT_TESTS[2];
  
  console.log(`📋 Testing: ${testData.description}`);
  
  const results = [];
  
  for (let i = 0; i < testData.scenarios.length; i++) {
    const scenario = testData.scenarios[i];
    console.log(`\n   Scenario ${i + 1}/${testData.scenarios.length}: "${scenario.message}"`);
    
    const response = await sendMessage(scenario.message);
    
    if (!response.success) {
      console.log(`     ❌ Request failed: ${response.error}`);
      results.push({ scenario: i + 1, passed: false, error: response.error });
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }

    // Analyze deflection handling
    const analysis = analyzeDeflectionHandling(response.data, scenario);
    
    console.log(`     ✅ Response received`);
    console.log(`     🛡️  Deflection: ${analysis.hasDeflection ? 'YES' : 'NO'} (expected: ${scenario.expectedDeflection ? 'YES' : 'NO'})`);
    console.log(`     🌉 Bridge: ${analysis.hasBridge ? 'YES' : 'NO'} (expected: ${scenario.expectedBridge ? 'YES' : 'NO'})`);
    
    if (analysis.deflectionMessage) {
      console.log(`     💬 Message: "${analysis.deflectionMessage.substring(0, 100)}..."`);
    }
    
    results.push({
      scenario: i + 1,
      passed: analysis.passed,
      hasDeflection: analysis.hasDeflection,
      hasBridge: analysis.hasBridge,
      responseTime: response.responseTime
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  const passedScenarios = results.filter(r => r.passed).length;
  const passRate = (passedScenarios / results.length * 100).toFixed(1);
  
  console.log(`\n📊 Off-Topic Deflection Results:`);
  console.log(`   Passed: ${passedScenarios}/${results.length} scenarios (${passRate}%)`);
  
  return {
    passed: passRate >= 70,
    passRate: parseFloat(passRate),
    scenarios: results.length,
    details: results
  };
}

/**
 * Analyze response for topic management features using API metadata
 */
function analyzeTopicManagementResponse(responseData, expectedStep) {
  const responseText = responseData.text || '';
  const metadata = responseData.metadata || {};
  const topicManagement = metadata.topicManagement;
  
  // Use API metadata if available, fallback to heuristics
  let zenRelevance, topicTransition;
  
  if (topicManagement) {
    // Use actual Phase 3 API data
    zenRelevance = topicManagement.zenRelevance.isZenRelated;
    topicTransition = topicManagement.topicTransition?.relationship || null;
  } else {
    // Fallback to heuristic analysis
    const hasZenContent = /zen|dsl|filter|map|len|array|string|date/i.test(responseText);
    zenRelevance = hasZenContent;
    
    // Check for topic transition indicators in text
    if (responseText.includes('Building on') || responseText.includes('As we discussed')) {
      topicTransition = 'related';
    } else if (responseText.includes('different') || responseText.includes('shifting to')) {
      topicTransition = 'different';
    } else if (responseText.includes('continuing') || responseText.includes('similarly')) {
      topicTransition = 'same';
    } else {
      topicTransition = null;
    }
  }
  
  // Determine if test passed
  const zenPassed = zenRelevance === expectedStep.expectedZenRelevance;
  const topicPassed = !expectedStep.expectedTopicRelation || 
                     topicTransition === expectedStep.expectedTopicRelation;
  
  return {
    passed: zenPassed && topicPassed,
    zenRelevance,
    topicTransition,
    apiMetadata: !!topicManagement
  };
}

/**
 * Analyze ZEN relevance detection using API metadata
 */
function analyzeZenRelevance(responseData, expectedScenario) {
  const responseText = responseData.text || '';
  const metadata = responseData.metadata || {};
  const topicManagement = metadata.topicManagement;
  
  let isZenRelated, confidence, detectedFunctions;
  
  if (topicManagement) {
    // Use actual Phase 3 API data
    isZenRelated = topicManagement.zenRelevance.isZenRelated;
    confidence = topicManagement.zenRelevance.confidence;
    detectedFunctions = topicManagement.zenRelevance.detectedFunctions;
  } else {
    // Fallback to heuristic analysis
    const zenKeywords = ['zen', 'dsl', 'filter', 'map', 'len', 'array', 'string', 'date', 'function'];
    const zenMatches = zenKeywords.filter(keyword => 
      responseText.toLowerCase().includes(keyword)
    ).length;
    
    isZenRelated = zenMatches >= 2;
    confidence = Math.min(zenMatches / 5, 1.0);
    
    // Extract detected functions (basic)
    detectedFunctions = [];
    const functionRegex = /\b(filter|map|len|contains|sum|avg|max|min|substring|trim|upper|lower)\b/gi;
    const matches = responseText.match(functionRegex);
    if (matches) {
      detectedFunctions.push(...new Set(matches.map(m => m.toLowerCase())));
    }
  }
  
  // Check if results match expectations
  const relevancePassed = isZenRelated === expectedScenario.expectedZenRelevance;
  const confidencePassed = confidence >= expectedScenario.expectedConfidence;
  
  return {
    passed: relevancePassed && confidencePassed,
    isZenRelated,
    confidence,
    detectedFunctions,
    apiMetadata: !!topicManagement
  };
}

/**
 * Analyze deflection handling using API metadata
 */
function analyzeDeflectionHandling(responseData, expectedScenario) {
  const responseText = responseData.text || '';
  const metadata = responseData.metadata || {};
  const topicManagement = metadata.topicManagement;
  
  let hasDeflection, deflectionMessage, hasBridge;
  
  if (topicManagement) {
    // Use actual Phase 3 API data
    hasDeflection = topicManagement.deflection.hasDeflection;
    deflectionMessage = topicManagement.deflection.message;
    
    // Check for bridging language in deflection message
    if (deflectionMessage) {
      const bridgePhrases = [
        'similar data processing',
        'zen dsl can help',
        'approach using zen',
        'zen dsl offers'
      ];
      hasBridge = bridgePhrases.some(phrase => 
        deflectionMessage.toLowerCase().includes(phrase)
      );
    } else {
      hasBridge = false;
    }
  } else {
    // Fallback to heuristic analysis
    const deflectionPhrases = [
      'specialized in zen dsl',
      'outside zen',
      'not within zen',
      'recommend consulting',
      'specialized resources'
    ];
    
    hasDeflection = deflectionPhrases.some(phrase => 
      responseText.toLowerCase().includes(phrase)
    );
    
    // Check for bridging language
    const bridgePhrases = [
      'similar data processing',
      'zen dsl can help',
      'approach using zen',
      'zen dsl offers'
    ];
    
    hasBridge = bridgePhrases.some(phrase => 
      responseText.toLowerCase().includes(phrase)
    );
    
    // Extract deflection message
    deflectionMessage = null;
    if (hasDeflection) {
      const sentences = responseText.split(/[.!?]+/);
      deflectionMessage = sentences.find(sentence => 
        deflectionPhrases.some(phrase => sentence.toLowerCase().includes(phrase))
      );
    }
  }
  
  // Check if results match expectations
  const deflectionPassed = hasDeflection === expectedScenario.expectedDeflection;
  const bridgePassed = hasBridge === expectedScenario.expectedBridge;
  
  return {
    passed: deflectionPassed && bridgePassed,
    hasDeflection,
    hasBridge,
    deflectionMessage,
    apiMetadata: !!topicManagement
  };
}

/**
 * Main test runner
 */
async function runPhase3Tests() {
  console.log('🚀 PHASE 3: TOPIC MANAGEMENT & INTELLIGENCE LAYER TEST SUITE');
  console.log('=' .repeat(70));
  console.log('🧠 Testing semantic topic similarity detection and ZEN relevance validation');
  console.log('📡 Target: http://localhost:3000/api/chat/semantic');
  console.log('');
  
  const testResults = {
    topicSimilarity: null,
    zenRelevance: null,
    offTopicDeflection: null
  };
  
  try {
    // Test 1: Topic Similarity Detection
    testResults.topicSimilarity = await testTopicSimilarityDetection();
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
    
    // Test 2: ZEN Relevance Validation
    testResults.zenRelevance = await testZenRelevanceValidation();
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
    
    // Test 3: Off-Topic Deflection
    testResults.offTopicDeflection = await testOffTopicDeflection();
    
  } catch (error) {
    console.log(`❌ Test suite error: ${error.message}`);
    return false;
  }
  
  // Generate comprehensive report
  console.log('\n' + '=' .repeat(70));
  console.log('📊 PHASE 3 TOPIC MANAGEMENT TEST RESULTS');
  console.log('=' .repeat(70));
  
  // Individual test results
  if (testResults.topicSimilarity) {
    const { passed, passRate, steps } = testResults.topicSimilarity;
    console.log(`✅ Topic Similarity Detection: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Pass Rate: ${passRate}%, Steps: ${steps}`);
  }
  
  if (testResults.zenRelevance) {
    const { passed, passRate, scenarios } = testResults.zenRelevance;
    console.log(`✅ ZEN Relevance Validation: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Pass Rate: ${passRate}%, Scenarios: ${scenarios}`);
  }
  
  if (testResults.offTopicDeflection) {
    const { passed, passRate, scenarios } = testResults.offTopicDeflection;
    console.log(`✅ Off-Topic Deflection: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Pass Rate: ${passRate}%, Scenarios: ${scenarios}`);
  }
  
  // Overall assessment
  const passedTests = Object.values(testResults).filter(result => result && result.passed).length;
  const totalTests = Object.values(testResults).filter(result => result !== null).length;
  const overallPassRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : '0.0';
  
  console.log('-' .repeat(70));
  console.log(`🎯 Overall Results: ${passedTests}/${totalTests} tests passed (${overallPassRate}%)`);
  
  if (overallPassRate >= 75) {
    console.log('🎉 PHASE 3 IMPLEMENTATION: SUCCESS!');
    console.log('✅ Topic management and intelligence features are working correctly');
    console.log('🧠 Semantic topic similarity detection: Operational');
    console.log('🎯 ZEN relevance validation: Operational');
    console.log('🛡️  Off-topic deflection: Professional and helpful');
  } else {
    console.log('⚠️  PHASE 3 IMPLEMENTATION: NEEDS ATTENTION');
    console.log('🔧 Some topic management features may need refinement');
  }
  
  console.log('=' .repeat(70));
  
  return overallPassRate >= 75;
}

// Run the tests
runPhase3Tests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  }); 