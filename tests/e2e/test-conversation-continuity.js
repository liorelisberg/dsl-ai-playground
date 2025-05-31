#!/usr/bin/env node

/**
 * Conversation Continuity Test Suite
 * Tests the model's ability to:
 * - Maintain conversation context across progressive questions
 * - Build understanding step-by-step on specific subjects
 * - Reference and build upon previous responses
 * - Provide coherent learning experiences
 * - Handle natural user question patterns
 */

import axios from 'axios';
import chalk from 'chalk';

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_SESSION_ID = `continuity_test_${Date.now()}`;

// Progressive learning conversation flows
const CONTINUITY_FLOWS = [
  {
    name: "Array Filtering Deep Dive",
    description: "Progressive learning about array filtering from basics to advanced concepts",
    subject: "array filtering",
    messages: [
      {
        id: 1,
        message: "What is the filter function in ZEN DSL?",
        expectsContinuity: [],
        buildsContext: ["filter", "arrays", "basics"],
        expectedElements: ["filter", "array", "function", "#", "placeholder"]
      },
      {
        id: 2,
        message: "Can you show me a simple example?",
        expectsContinuity: [1], // Should reference filter explanation
        buildsContext: ["examples", "practical"],
        expectedElements: ["filter", "example", "#", "array"],
        shouldReference: ["filter function", "placeholder"]
      },
      {
        id: 3,
        message: "How does the # placeholder work exactly?",
        expectsContinuity: [1, 2], // Should reference both filter concept and example
        buildsContext: ["placeholder", "mechanics"],
        expectedElements: ["#", "placeholder", "element", "each"],
        shouldReference: ["filter", "example", "#"]
      },
      {
        id: 4,
        message: "What happens if I filter an array of objects?",
        expectsContinuity: [1, 2, 3], // Should build on all previous understanding
        buildsContext: ["objects", "complex data"],
        expectedElements: ["objects", "filter", "#", "property"],
        shouldReference: ["placeholder", "filter", "#"]
      },
      {
        id: 5,
        message: "Can I chain filter with other array functions?",
        expectsContinuity: [1, 2, 3, 4], // Should reference entire conversation
        buildsContext: ["chaining", "composition"],
        expectedElements: ["chain", "filter", "map", "composition"],
        shouldReference: ["filter", "array", "objects"]
      }
    ]
  },
  {
    name: "String Manipulation Learning Journey",
    description: "Building understanding of string operations from simple to complex",
    subject: "string manipulation",
    messages: [
      {
        id: 1,
        message: "How do I check if a string contains specific text?",
        expectsContinuity: [],
        buildsContext: ["contains", "string search"],
        expectedElements: ["contains", "string", "text", "function"]
      },
      {
        id: 2,
        message: "What's the difference between contains and matches?",
        expectsContinuity: [1],
        buildsContext: ["comparison", "pattern matching"],
        expectedElements: ["contains", "matches", "difference", "pattern"],
        shouldReference: ["contains", "string"]
      },
      {
        id: 3,
        message: "Can you show me how matches works with patterns?",
        expectsContinuity: [1, 2],
        buildsContext: ["regex patterns", "examples"],
        expectedElements: ["matches", "pattern", "regex", "example"],
        shouldReference: ["matches", "contains", "difference"]
      },
      {
        id: 4,
        message: "How do I extract parts of a string that match a pattern?",
        expectsContinuity: [1, 2, 3],
        buildsContext: ["extraction", "advanced"],
        expectedElements: ["extract", "pattern", "parts", "string"],
        shouldReference: ["matches", "pattern", "string"]
      },
      {
        id: 5,
        message: "Can I use these string functions together in one expression?",
        expectsContinuity: [1, 2, 3, 4],
        buildsContext: ["composition", "complex expressions"],
        expectedElements: ["combine", "together", "expression", "string"],
        shouldReference: ["contains", "matches", "extract"]
      }
    ]
  },
  {
    name: "Conditional Logic Progression",
    description: "Learning conditional expressions from simple to nested scenarios",
    subject: "conditional logic",
    messages: [
      {
        id: 1,
        message: "How do I write a simple if-then condition in ZEN?",
        expectsContinuity: [],
        buildsContext: ["conditional", "if-then", "ternary"],
        expectedElements: ["condition", "?", ":", "ternary", "if"]
      },
      {
        id: 2,
        message: "What if I need to check multiple conditions?",
        expectsContinuity: [1],
        buildsContext: ["multiple conditions", "logical operators"],
        expectedElements: ["multiple", "and", "or", "conditions"],
        shouldReference: ["condition", "ternary"]
      },
      {
        id: 3,
        message: "How do I nest conditions inside each other?",
        expectsContinuity: [1, 2],
        buildsContext: ["nesting", "complex logic"],
        expectedElements: ["nest", "nested", "complex", "inside"],
        shouldReference: ["condition", "multiple", "ternary"]
      },
      {
        id: 4,
        message: "Can I use functions like len() or contains() in my conditions?",
        expectsContinuity: [1, 2, 3],
        buildsContext: ["functions in conditions", "practical usage"],
        expectedElements: ["len", "contains", "functions", "condition"],
        shouldReference: ["condition", "nested", "ternary"]
      },
      {
        id: 5,
        message: "What's the best way to handle complex business rules?",
        expectsContinuity: [1, 2, 3, 4],
        buildsContext: ["business rules", "best practices"],
        expectedElements: ["business", "rules", "complex", "best"],
        shouldReference: ["conditions", "functions", "nested"]
      }
    ]
  },
  {
    name: "Data Validation Workflow",
    description: "Progressive understanding of data validation techniques",
    subject: "data validation",
    messages: [
      {
        id: 1,
        message: "I need to validate user input. Where do I start?",
        expectsContinuity: [],
        buildsContext: ["validation", "user input", "basics"],
        expectedElements: ["validate", "input", "user", "data"]
      },
      {
        id: 2,
        message: "How do I check if a field is not empty?",
        expectsContinuity: [1],
        buildsContext: ["empty check", "required fields"],
        expectedElements: ["empty", "field", "null", "len"],
        shouldReference: ["validate", "input"]
      },
      {
        id: 3,
        message: "What about validating email format?",
        expectsContinuity: [1, 2],
        buildsContext: ["email validation", "format checking"],
        expectedElements: ["email", "format", "contains", "matches"],
        shouldReference: ["validate", "field", "empty"]
      },
      {
        id: 4,
        message: "How do I validate multiple fields at once?",
        expectsContinuity: [1, 2, 3],
        buildsContext: ["multiple validation", "composite rules"],
        expectedElements: ["multiple", "fields", "and", "all"],
        shouldReference: ["validate", "email", "empty"]
      },
      {
        id: 5,
        message: "Can I create reusable validation rules?",
        expectsContinuity: [1, 2, 3, 4],
        buildsContext: ["reusable rules", "best practices"],
        expectedElements: ["reusable", "rules", "pattern", "function"],
        shouldReference: ["validation", "multiple", "fields"]
      }
    ]
  }
];

// Continuity analysis class
class ContinuityAnalyzer {
  static analyzeContinuity(response, currentMessage, previousMessages, previousResponses) {
    const analysis = {
      maintainsContext: false,
      buildsOnPrevious: false,
      referencesConversation: false,
      providesProgression: false,
      continuityScore: 0,
      details: []
    };

    const responseText = response.text.toLowerCase();

    // 1. Check if response maintains context from conversation subject
    const subjectWords = currentMessage.buildsContext || [];
    const contextMatches = subjectWords.filter(word => 
      responseText.includes(word.toLowerCase())
    );
    
    if (contextMatches.length > 0) {
      analysis.maintainsContext = true;
      analysis.details.push(`✅ Maintains context: ${contextMatches.join(', ')}`);
    }

    // 2. Check if response builds on previous messages
    if (currentMessage.expectsContinuity && currentMessage.expectsContinuity.length > 0) {
      const referencedMessages = currentMessage.expectsContinuity.map(id => 
        previousMessages.find(msg => msg.id === id)
      ).filter(Boolean);

      const expectedReferences = currentMessage.shouldReference || [];
      const foundReferences = expectedReferences.filter(ref =>
        responseText.includes(ref.toLowerCase())
      );

      if (foundReferences.length > 0) {
        analysis.buildsOnPrevious = true;
        analysis.details.push(`✅ Builds on previous: ${foundReferences.join(', ')}`);
      } else if (expectedReferences.length > 0) {
        analysis.details.push(`❌ Missing continuity references: ${expectedReferences.join(', ')}`);
      }
    }

    // 3. Check for explicit conversation references
    const conversationMarkers = [
      'as we discussed', 'building on', 'from earlier', 'as mentioned',
      'continuing from', 'expanding on', 'building upon', 'as we saw',
      'from the previous', 'as shown', 'following up', 'extending'
    ];

    const hasConversationMarkers = conversationMarkers.some(marker =>
      responseText.includes(marker)
    );

    if (hasConversationMarkers) {
      analysis.referencesConversation = true;
      analysis.details.push(`✅ Uses conversation markers`);
    }

    // 4. Check if response provides learning progression
    const expectedElements = currentMessage.expectedElements || [];
    const elementMatches = expectedElements.filter(element =>
      responseText.includes(element.toLowerCase())
    );

    if (elementMatches.length >= Math.ceil(expectedElements.length * 0.6)) {
      analysis.providesProgression = true;
      analysis.details.push(`✅ Provides learning progression: ${elementMatches.join(', ')}`);
    }

    // Calculate overall continuity score
    const factors = [
      analysis.maintainsContext,
      analysis.buildsOnPrevious,
      analysis.referencesConversation,
      analysis.providesProgression
    ];

    analysis.continuityScore = factors.filter(Boolean).length / factors.length;

    return analysis;
  }

  static assessLearningProgression(allAnalyses, flow) {
    const progression = {
      overallContinuity: 0,
      learningFlow: 'fragmented',
      contextRetention: 0,
      buildingPattern: 'inconsistent',
      details: []
    };

    if (allAnalyses.length === 0) return progression;

    // Calculate overall continuity
    const validAnalyses = allAnalyses.filter(a => !a.error);
    progression.overallContinuity = validAnalyses.reduce((sum, a) => 
      sum + a.continuityScore, 0) / validAnalyses.length;

    // Assess learning flow pattern
    const continuityScores = validAnalyses.map(a => a.continuityScore);
    const isIncreasing = continuityScores.every((score, i) => 
      i === 0 || score >= continuityScores[i - 1] - 0.1
    );
    const isConsistent = continuityScores.every(score => score >= 0.6);

    if (isIncreasing && isConsistent) {
      progression.learningFlow = 'excellent';
    } else if (isConsistent) {
      progression.learningFlow = 'good';
    } else if (isIncreasing) {
      progression.learningFlow = 'improving';
    } else {
      progression.learningFlow = 'fragmented';
    }

    // Assess context retention across messages
    const contextRetentionScores = validAnalyses.map((a, i) => {
      if (i === 0) return 1; // First message has no context to retain
      return a.buildsOnPrevious ? 1 : 0;
    });

    progression.contextRetention = contextRetentionScores.reduce((sum, score) => 
      sum + score, 0) / Math.max(contextRetentionScores.length - 1, 1);

    // Assess building pattern
    const buildingScores = validAnalyses.map(a => a.providesProgression ? 1 : 0);
    const buildingRate = buildingScores.reduce((sum, score) => sum + score, 0) / buildingScores.length;

    if (buildingRate >= 0.8) {
      progression.buildingPattern = 'strong';
    } else if (buildingRate >= 0.6) {
      progression.buildingPattern = 'moderate';
    } else {
      progression.buildingPattern = 'weak';
    }

    return progression;
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
async function runContinuityTest(flow) {
  console.log(chalk.blue(`\n🔄 Running Continuity Test: ${flow.name}`));
  console.log(chalk.gray(`Subject: ${flow.subject}`));
  console.log(chalk.gray(`Description: ${flow.description}\n`));

  const sessionId = `${TEST_SESSION_ID}_${flow.name.replace(/\s+/g, '_').toLowerCase()}`;
  const responses = [];
  const analyses = [];
  
  for (let i = 0; i < flow.messages.length; i++) {
    const currentMessage = flow.messages[i];
    const previousMessages = flow.messages.slice(0, i);
    const previousResponses = responses.slice(0, i);

    console.log(chalk.cyan(`\n📝 Message ${currentMessage.id}: "${currentMessage.message}"`));
    
    // Show expected continuity
    if (currentMessage.expectsContinuity.length > 0) {
      console.log(chalk.yellow(`🔗 Expected continuity with messages: ${currentMessage.expectsContinuity.join(', ')}`));
    }

    try {
      const startTime = Date.now();
      const response = await sendMessage(currentMessage.message, sessionId);
      const responseTime = Date.now() - startTime;

      responses.push(response);

      // Analyze continuity
      const analysis = ContinuityAnalyzer.analyzeContinuity(
        response,
        currentMessage,
        previousMessages,
        previousResponses
      );

      analysis.responseTime = responseTime;
      analyses.push(analysis);

      // Display results
      console.log(chalk.green(`✅ Response received (${responseTime}ms)`));
      console.log(chalk.yellow(`🔄 Continuity Score: ${(analysis.continuityScore * 100).toFixed(1)}%`));
      
      // Show response preview
      const responsePreview = response.text.length > 200 
        ? response.text.substring(0, 200) + "..."
        : response.text;
      console.log(chalk.gray(`Response preview: "${responsePreview}"`));

      // Show analysis details
      analysis.details.forEach(detail => {
        console.log(`   ${detail}`);
      });

    } catch (error) {
      console.error(chalk.red(`❌ Failed to process message ${currentMessage.id}: ${error.message}`));
      analyses.push({ error: error.message, continuityScore: 0 });
    }

    // Wait between messages
    if (i < flow.messages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return { responses, analyses };
}

// Result analysis
function analyzeContinuityResults(flow, analyses) {
  console.log(chalk.blue(`\n📊 Continuity Analysis: ${flow.name}`));
  
  const validAnalyses = analyses.filter(a => !a.error);
  if (validAnalyses.length === 0) {
    console.log(chalk.red("❌ No valid responses to analyze"));
    return { overallScore: 0, passed: false };
  }

  const progression = ContinuityAnalyzer.assessLearningProgression(validAnalyses, flow);
  const overallScore = progression.overallContinuity;
  const avgResponseTime = validAnalyses.reduce((sum, a) => sum + (a.responseTime || 0), 0) / validAnalyses.length;

  // Continuity metrics
  const continuityMetrics = {
    contextMaintenance: validAnalyses.filter(a => a.maintainsContext).length,
    previousBuilding: validAnalyses.filter(a => a.buildsOnPrevious).length,
    conversationReferences: validAnalyses.filter(a => a.referencesConversation).length,
    learningProgression: validAnalyses.filter(a => a.providesProgression).length
  };

  const passed = overallScore >= 0.75; // 75% threshold for continuity

  console.log(chalk.yellow(`Subject: ${flow.subject}`));
  console.log(chalk.yellow(`Overall Continuity Score: ${(overallScore * 100).toFixed(1)}%`));
  console.log(chalk.yellow(`Learning Flow: ${progression.learningFlow}`));
  console.log(chalk.yellow(`Context Retention: ${(progression.contextRetention * 100).toFixed(1)}%`));
  console.log(chalk.yellow(`Building Pattern: ${progression.buildingPattern}`));
  console.log(chalk.yellow(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`));
  
  console.log(chalk.yellow(`\nContinuity Breakdown:`));
  console.log(`  - Context Maintenance: ${continuityMetrics.contextMaintenance}/${validAnalyses.length} (${(continuityMetrics.contextMaintenance/validAnalyses.length*100).toFixed(1)}%)`);
  console.log(`  - Builds on Previous: ${continuityMetrics.previousBuilding}/${validAnalyses.length} (${(continuityMetrics.previousBuilding/validAnalyses.length*100).toFixed(1)}%)`);
  console.log(`  - Conversation References: ${continuityMetrics.conversationReferences}/${validAnalyses.length} (${(continuityMetrics.conversationReferences/validAnalyses.length*100).toFixed(1)}%)`);
  console.log(`  - Learning Progression: ${continuityMetrics.learningProgression}/${validAnalyses.length} (${(continuityMetrics.learningProgression/validAnalyses.length*100).toFixed(1)}%)`);

  if (passed) {
    console.log(chalk.green(`✅ Continuity Test PASSED`));
  } else {
    console.log(chalk.red(`❌ Continuity Test FAILED (Score: ${(overallScore * 100).toFixed(1)}% < 75%)`));
  }

  return { 
    overallScore, 
    passed, 
    avgResponseTime,
    progression,
    continuityMetrics,
    validResponses: validAnalyses.length,
    totalMessages: analyses.length
  };
}

// Main test runner
async function runAllContinuityTests() {
  console.log(chalk.bold.blue("🔄 Conversation Continuity Test Suite"));
  console.log(chalk.gray("Testing progressive learning and context building across related questions\n"));

  const results = [];

  for (const flow of CONTINUITY_FLOWS) {
    try {
      const { responses, analyses } = await runContinuityTest(flow);
      const flowResult = analyzeContinuityResults(flow, analyses);
      
      results.push({
        flowName: flow.name,
        subject: flow.subject,
        ...flowResult
      });

    } catch (error) {
      console.error(chalk.red(`❌ Continuity test failed: ${error.message}`));
      results.push({
        flowName: flow.name,
        subject: flow.subject,
        overallScore: 0,
        passed: false,
        error: error.message
      });
    }
  }

  // Overall results summary
  console.log(chalk.bold.blue("\n🎯 Overall Continuity Results"));
  console.log("=" * 60);

  const passedFlows = results.filter(r => r.passed).length;
  const totalFlows = results.length;
  const overallPassRate = passedFlows / totalFlows;
  const avgScore = results.reduce((sum, r) => sum + (r.overallScore || 0), 0) / totalFlows;

  results.forEach(result => {
    const status = result.passed ? chalk.green("✅ PASS") : chalk.red("❌ FAIL");
    const score = result.overallScore ? `${(result.overallScore * 100).toFixed(1)}%` : "N/A";
    console.log(`${status} ${result.flowName} (${result.subject}): ${score}`);
    
    if (result.error) {
      console.log(chalk.red(`    Error: ${result.error}`));
    } else if (result.progression) {
      console.log(chalk.gray(`    Learning Flow: ${result.progression.learningFlow}, Context Retention: ${(result.progression.contextRetention * 100).toFixed(1)}%`));
    }
  });

  console.log(chalk.bold.yellow(`\n📈 Summary:`));
  console.log(`Pass Rate: ${passedFlows}/${totalFlows} (${(overallPassRate * 100).toFixed(1)}%)`);
  console.log(`Average Continuity Score: ${(avgScore * 100).toFixed(1)}%`);
  
  if (overallPassRate >= 0.8) {
    console.log(chalk.bold.green("🎉 Conversation Continuity: EXCELLENT"));
  } else if (overallPassRate >= 0.6) {
    console.log(chalk.bold.yellow("⚠️  Conversation Continuity: GOOD (Room for improvement)"));
  } else {
    console.log(chalk.bold.red("❌ Conversation Continuity: NEEDS IMPROVEMENT"));
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
  runAllContinuityTests()
    .then((results) => {
      process.exit(results.passRate >= 0.8 ? 0 : 1);
    })
    .catch((error) => {
      console.error(chalk.red("Continuity test suite failed:", error));
      process.exit(1);
    });
}

export {
  runAllContinuityTests,
  runContinuityTest,
  ContinuityAnalyzer,
  CONTINUITY_FLOWS
}; 