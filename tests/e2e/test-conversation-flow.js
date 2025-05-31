#!/usr/bin/env node

/**
 * Conversation Flow Test Suite
 * Tests the model's ability to:
 * - Comprehend user messages and requests
 * - Maintain conversation context across multiple turns
 * - Provide responses that reference previous conversation
 * - Build logical connections between current and past requests
 */

import axios from 'axios';
import chalk from 'chalk';

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_SESSION_ID = `test_flow_${Date.now()}`;

// Test flow scenarios
const TEST_FLOWS = [
  {
    name: "ZEN DSL String Operations Discovery",
    description: "Tests progressive discovery of string capabilities with context building",
    messages: [
      {
        id: 1,
        message: "Hello",
        expectedContexts: ["greeting", "introduction"],
        expectedTopics: []
      },
      {
        id: 2, 
        message: "in as few words as possible, what are the capabilities of the string type? functions and operators",
        expectedContexts: ["brevity", "string operations", "functions", "operators"],
        expectedTopics: ["string capabilities"],
        shouldReference: []
      },
      {
        id: 3,
        message: "generate a short example for each",
        expectedContexts: ["examples", "string functions", "code samples"],
        expectedTopics: ["string capabilities", "examples"],
        shouldReference: [2] // Should reference the string capabilities from message 2
      },
      {
        id: 4,
        message: "regarding the extract function, provide some examples, demonstrating the function's capabilities.",
        expectedContexts: ["extract function", "detailed examples", "capabilities"],
        expectedTopics: ["string capabilities", "examples", "extract function"],
        shouldReference: [2, 3] // Should reference both string capabilities and previous examples
      }
    ]
  },
  {
    name: "ZEN DSL Array Operations Deep Dive",
    description: "Tests progressive understanding of array operations with contextual building",
    messages: [
      {
        id: 1,
        message: "I'm working with arrays in ZEN DSL",
        expectedContexts: ["arrays", "ZEN DSL", "data structures"],
        expectedTopics: ["arrays"]
      },
      {
        id: 2,
        message: "What's the difference between filter and map in ZEN?", 
        expectedContexts: ["filter", "map", "comparison", "array operations"],
        expectedTopics: ["arrays", "filter", "map"],
        shouldReference: [1]
      },
      {
        id: 3,
        message: "Show me how to chain them together",
        expectedContexts: ["chaining", "filter", "map", "combination"],
        expectedTopics: ["arrays", "filter", "map", "chaining"],
        shouldReference: [2] // Should reference filter/map from message 2
      },
      {
        id: 4,
        message: "What happens if I use the # placeholder incorrectly?",
        expectedContexts: ["placeholder", "error handling", "debugging"],
        expectedTopics: ["arrays", "placeholder", "debugging"],
        shouldReference: [2, 3] // Should reference previous array operations discussion
      }
    ]
  },
  {
    name: "Problem-Solving Context Evolution", 
    description: "Tests how context evolves from problem statement to solution refinement",
    messages: [
      {
        id: 1,
        message: "I need to validate user input data",
        expectedContexts: ["validation", "input", "data processing"],
        expectedTopics: ["validation"]
      },
      {
        id: 2,
        message: "Specifically, I need to check if email addresses are valid",
        expectedContexts: ["email validation", "regex", "string checking"],
        expectedTopics: ["validation", "email"],
        shouldReference: [1]
      },
      {
        id: 3,
        message: "Can you show me the ZEN DSL pattern for that?",
        expectedContexts: ["ZEN pattern", "email validation", "implementation"],
        expectedTopics: ["validation", "email", "ZEN pattern"],
        shouldReference: [2] // Should reference email validation from message 2
      },
      {
        id: 4,
        message: "What if the email field is optional in my data?",
        expectedContexts: ["optional fields", "conditional validation", "null handling"],
        expectedTopics: ["validation", "email", "optional fields"],
        shouldReference: [2, 3] // Should reference both email validation and ZEN pattern
      }
    ]
  }
];

// Analysis helpers
class ConversationAnalyzer {
  static analyzeContextAwareness(response, currentMessage, previousMessages, previousResponses) {
    const analysis = {
      hasCurrentContext: false,
      referencesPrevious: false,
      buildsLogically: false,
      maintainsTopicFlow: false,
      details: []
    };

    const responseText = response.text.toLowerCase();
    const currentText = currentMessage.message.toLowerCase();

    // Check if response addresses current message context
    const currentContexts = currentMessage.expectedContexts || [];
    const contextMatches = currentContexts.filter(context => 
      responseText.includes(context.toLowerCase())
    );
    
    if (contextMatches.length > 0) {
      analysis.hasCurrentContext = true;
      analysis.details.push(`✅ Addresses current context: ${contextMatches.join(', ')}`);
    }

    // Check if response references previous conversation when it should
    if (currentMessage.shouldReference && currentMessage.shouldReference.length > 0) {
      const referencedMessages = currentMessage.shouldReference.map(id => 
        previousMessages.find(msg => msg.id === id)
      ).filter(Boolean);

      const referencedContexts = referencedMessages.flatMap(msg => msg.expectedContexts || []);
      const referenceMatches = referencedContexts.filter(context =>
        responseText.includes(context.toLowerCase())
      );

      if (referenceMatches.length > 0) {
        analysis.referencesPrevious = true;
        analysis.details.push(`✅ References previous context: ${referenceMatches.join(', ')}`);
      } else {
        analysis.details.push(`❌ Missing references to: ${referencedContexts.join(', ')}`);
      }
    }

    // Check logical building (progressive concepts)
    const allTopics = [...new Set([
      ...previousMessages.flatMap(msg => msg.expectedTopics || []),
      ...(currentMessage.expectedTopics || [])
    ])];

    const topicMatches = allTopics.filter(topic =>
      responseText.includes(topic.toLowerCase())
    );

    if (topicMatches.length >= Math.min(allTopics.length, 2)) {
      analysis.buildsLogically = true;
      analysis.details.push(`✅ Maintains topic flow: ${topicMatches.join(', ')}`);
    }

    // Check topic flow maintenance
    if (previousResponses.length > 0) {
      const previousTopics = previousMessages.flatMap(msg => msg.expectedTopics || []);
      const continuityTopics = previousTopics.filter(topic =>
        responseText.includes(topic.toLowerCase())
      );

      if (continuityTopics.length > 0) {
        analysis.maintainsTopicFlow = true;
        analysis.details.push(`✅ Maintains topic continuity: ${continuityTopics.join(', ')}`);
      }
    }

    return analysis;
  }

  static calculateOverallScore(analysis) {
    const weights = {
      hasCurrentContext: 0.3,
      referencesPrevious: 0.3,
      buildsLogically: 0.2,
      maintainsTopicFlow: 0.2
    };

    return Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (analysis[key] ? weight : 0);
    }, 0);
  }
}

// API interaction
async function sendMessage(message, sessionId) {
  try {
    const response = await axios.post(`${BASE_URL}/api/chat/semantic`, {
      message,
      sessionId,
      maxTokens: 2000
    });
    return response.data;
  } catch (error) {
    console.error(chalk.red(`❌ API Error: ${error.message}`));
    if (error.response) {
      console.error(chalk.red(`Response: ${JSON.stringify(error.response.data, null, 2)}`));
    }
    throw error;
  }
}

// Test execution
async function runFlowTest(flow) {
  console.log(chalk.blue(`\n🚀 Running Flow Test: ${flow.name}`));
  console.log(chalk.gray(`Description: ${flow.description}\n`));

  const sessionId = `${TEST_SESSION_ID}_${flow.name.replace(/\s+/g, '_').toLowerCase()}`;
  const responses = [];
  const analyses = [];
  
  for (let i = 0; i < flow.messages.length; i++) {
    const currentMessage = flow.messages[i];
    const previousMessages = flow.messages.slice(0, i);
    const previousResponses = responses.slice(0, i);

    console.log(chalk.cyan(`\n📝 Message ${currentMessage.id}: "${currentMessage.message}"`));
    
    // Send message
    try {
      const startTime = Date.now();
      const response = await sendMessage(currentMessage.message, sessionId);
      const responseTime = Date.now() - startTime;

      responses.push(response);

      // Analyze context awareness
      const analysis = ConversationAnalyzer.analyzeContextAwareness(
        response,
        currentMessage,
        previousMessages,
        previousResponses
      );

      const score = ConversationAnalyzer.calculateOverallScore(analysis);
      analyses.push({ ...analysis, score, responseTime });

      // Display results
      console.log(chalk.green(`✅ Response received (${responseTime}ms)`));
      console.log(chalk.yellow(`🧠 Context Score: ${(score * 100).toFixed(1)}%`));
      
      // Show first 200 chars of response
      const responsePreview = response.text.length > 200 
        ? response.text.substring(0, 200) + "..."
        : response.text;
      console.log(chalk.gray(`Response preview: "${responsePreview}"`));

      // Show analysis details
      analysis.details.forEach(detail => {
        console.log(`   ${detail}`);
      });

      // Show metadata
      if (response.metadata) {
        console.log(chalk.magenta(`📊 Metadata: ${response.metadata.semanticMatches} matches, ${response.metadata.userExpertise} expertise, ${response.metadata.tokenEfficiency}% efficiency`));
      }

    } catch (error) {
      console.error(chalk.red(`❌ Failed to process message ${currentMessage.id}: ${error.message}`));
      analyses.push({ error: error.message, score: 0 });
    }

    // Wait between messages to simulate natural conversation
    if (i < flow.messages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { responses, analyses };
}

// Test result analysis
function analyzeFlowResults(flow, analyses) {
  console.log(chalk.blue(`\n📊 Flow Analysis: ${flow.name}`));
  
  const validAnalyses = analyses.filter(a => !a.error);
  if (validAnalyses.length === 0) {
    console.log(chalk.red("❌ No valid responses to analyze"));
    return { overallScore: 0, passed: false };
  }

  const overallScore = validAnalyses.reduce((sum, a) => sum + a.score, 0) / validAnalyses.length;
  const avgResponseTime = validAnalyses.reduce((sum, a) => sum + (a.responseTime || 0), 0) / validAnalyses.length;
  
  // Context awareness metrics
  const contextAwarenessMetrics = {
    currentContextHits: validAnalyses.filter(a => a.hasCurrentContext).length,
    previousReferenceHits: validAnalyses.filter(a => a.referencesPrevious).length,
    logicalBuildingHits: validAnalyses.filter(a => a.buildsLogically).length,
    topicFlowHits: validAnalyses.filter(a => a.maintainsTopicFlow).length
  };

  const passed = overallScore >= 0.7; // 70% threshold

  console.log(chalk.yellow(`Overall Context Score: ${(overallScore * 100).toFixed(1)}%`));
  console.log(chalk.yellow(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`));
  console.log(chalk.yellow(`Context Awareness Breakdown:`));
  console.log(`  - Current Context: ${contextAwarenessMetrics.currentContextHits}/${validAnalyses.length} (${(contextAwarenessMetrics.currentContextHits/validAnalyses.length*100).toFixed(1)}%)`);
  console.log(`  - Previous References: ${contextAwarenessMetrics.previousReferenceHits}/${validAnalyses.length} (${(contextAwarenessMetrics.previousReferenceHits/validAnalyses.length*100).toFixed(1)}%)`);
  console.log(`  - Logical Building: ${contextAwarenessMetrics.logicalBuildingHits}/${validAnalyses.length} (${(contextAwarenessMetrics.logicalBuildingHits/validAnalyses.length*100).toFixed(1)}%)`);
  console.log(`  - Topic Flow: ${contextAwarenessMetrics.topicFlowHits}/${validAnalyses.length} (${(contextAwarenessMetrics.topicFlowHits/validAnalyses.length*100).toFixed(1)}%)`);

  if (passed) {
    console.log(chalk.green(`✅ Flow Test PASSED`));
  } else {
    console.log(chalk.red(`❌ Flow Test FAILED (Score: ${(overallScore * 100).toFixed(1)}% < 70%)`));
  }

  return { 
    overallScore, 
    passed, 
    avgResponseTime, 
    contextAwarenessMetrics,
    validResponses: validAnalyses.length,
    totalMessages: analyses.length
  };
}

// Main test runner
async function runAllFlowTests() {
  console.log(chalk.bold.blue("🧪 Conversation Flow Test Suite"));
  console.log(chalk.gray("Testing model's conversation comprehension and context awareness\n"));

  const results = [];

  for (const flow of TEST_FLOWS) {
    try {
      const { responses, analyses } = await runFlowTest(flow);
      const flowResult = analyzeFlowResults(flow, analyses);
      
      results.push({
        flowName: flow.name,
        ...flowResult
      });

    } catch (error) {
      console.error(chalk.red(`❌ Flow test failed: ${error.message}`));
      results.push({
        flowName: flow.name,
        overallScore: 0,
        passed: false,
        error: error.message
      });
    }
  }

  // Overall results summary
  console.log(chalk.bold.blue("\n🎯 Overall Test Results"));
  console.log("=" * 50);

  const passedFlows = results.filter(r => r.passed).length;
  const totalFlows = results.length;
  const overallPassRate = passedFlows / totalFlows;
  const avgScore = results.reduce((sum, r) => sum + (r.overallScore || 0), 0) / totalFlows;

  results.forEach(result => {
    const status = result.passed ? chalk.green("✅ PASS") : chalk.red("❌ FAIL");
    const score = result.overallScore ? `${(result.overallScore * 100).toFixed(1)}%` : "N/A";
    console.log(`${status} ${result.flowName}: ${score}`);
    
    if (result.error) {
      console.log(chalk.red(`    Error: ${result.error}`));
    }
  });

  console.log(chalk.bold.yellow(`\n📈 Summary:`));
  console.log(`Pass Rate: ${passedFlows}/${totalFlows} (${(overallPassRate * 100).toFixed(1)}%)`);
  console.log(`Average Score: ${(avgScore * 100).toFixed(1)}%`);
  
  if (overallPassRate >= 0.8) {
    console.log(chalk.bold.green("🎉 Conversation Flow Tests: EXCELLENT"));
  } else if (overallPassRate >= 0.6) {
    console.log(chalk.bold.yellow("⚠️  Conversation Flow Tests: GOOD (Room for improvement)"));
  } else {
    console.log(chalk.bold.red("❌ Conversation Flow Tests: NEEDS IMPROVEMENT"));
  }

  // Performance insights
  const avgResponseTime = results.reduce((sum, r) => sum + (r.avgResponseTime || 0), 0) / results.filter(r => r.avgResponseTime).length;
  console.log(chalk.cyan(`\n⚡ Performance: Avg response time ${avgResponseTime.toFixed(0)}ms`));

  return {
    passRate: overallPassRate,
    avgScore,
    avgResponseTime,
    results
  };
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllFlowTests()
    .then((results) => {
      process.exit(results.passRate >= 0.8 ? 0 : 1);
    })
    .catch((error) => {
      console.error(chalk.red("Test suite failed:", error));
      process.exit(1);
    });
}

export {
  runAllFlowTests,
  runFlowTest,
  ConversationAnalyzer,
  TEST_FLOWS
}; 