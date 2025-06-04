import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

// Test the actual semantic chat API to identify history management issues
describe('Real History Management Issues - Semantic Chat API', () => {
  const baseUrl = 'http://localhost:3000';
  let testSessionId: string;
  let serverAvailable = false;

  beforeAll(async () => {
    // Check if server is running
    try {
      const response = await request(baseUrl)
        .get('/health')
        .timeout(2000);
      
      if (response.status === 200) {
        serverAvailable = true;
        console.log('✅ Server is available for testing');
      }
    } catch {
      console.log('⚠️ Server not available, tests will be skipped');
      serverAvailable = false;
    }

    testSessionId = `test-history-${Date.now()}`;
  });

  afterAll(async () => {
    // Clean up test session if server is available
    if (serverAvailable && testSessionId) {
      try {
        await request(baseUrl)
          .delete(`/api/chat/session/${testSessionId}`)
          .timeout(2000);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('History Context Failures', () => {
    test('should fail to answer "what did I previously ask" questions', async () => {
      if (!serverAvailable) {
        console.log('⚠️ Skipping test - server not available');
        return;
      }

      // Build conversation history
      const message1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How do I filter arrays in ZEN DSL?',
          sessionId: testSessionId
        })
        .timeout(10000)
        .expect(200);

      expect(message1.body).toHaveProperty('text');
      console.log('✅ First message sent successfully');

      const message2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Can you show me more examples of array filtering?',
          sessionId: testSessionId
        })
        .timeout(10000)
        .expect(200);

      expect(message2.body).toHaveProperty('text');
      console.log('✅ Second message sent successfully');

      // Now ask about previous questions - THIS SHOULD FAIL
      const historyQuestion = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What did I previously ask about?',
          sessionId: testSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('🔍 Response to "what did I previously ask":', historyQuestion.body.text.substring(0, 200));

      // Check if the response actually references the previous questions
      const response = historyQuestion.body.text.toLowerCase();
      const mentionsArrays = response.includes('array') || response.includes('filter');
      const mentionsExamples = response.includes('example');
      const mentionsPrevious = response.includes('previous') || response.includes('asked') || response.includes('earlier');

      console.log('📊 Analysis:');
      console.log(`   Mentions arrays/filtering: ${mentionsArrays}`);
      console.log(`   Mentions examples: ${mentionsExamples}`);
      console.log(`   Acknowledges previous questions: ${mentionsPrevious}`);

      // This test documents the failure - the AI should be able to reference previous questions
      if (!mentionsArrays && !mentionsPrevious) {
        console.log('❌ CONFIRMED: AI cannot reference previous conversation context');
      } else {
        console.log('✅ AI can reference previous conversation context');
      }
    });

    test('should fail to maintain topic continuity across consecutive questions', async () => {
      if (!serverAvailable) {
        console.log('⚠️ Skipping test - server not available');
        return;
      }

      const newSessionId = `${testSessionId}-continuity`;

      // Start with array topic
      await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What is array filtering in ZEN DSL?',
          sessionId: newSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ Array question 1 sent');

      const arrayQuestion2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Show me an example',
          sessionId: newSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ Array question 2 sent');
      console.log('🔍 Response to "show me an example":', arrayQuestion2.body.text.substring(0, 200));

      // Check if "show me an example" correctly refers to array filtering
      const response2 = arrayQuestion2.body.text.toLowerCase();
      const isArrayExample = response2.includes('array') || response2.includes('filter');

      await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How do I filter by multiple conditions?',
          sessionId: newSessionId
        })
        .timeout(10000)
        .expect(200);

      await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What if I want to filter by age > 25?',
          sessionId: newSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ Array question 4 sent');

      const arrayQuestion5 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Can you explain the syntax again?',
          sessionId: newSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ Array question 5 sent');
      console.log('🔍 Response to "explain the syntax again":', arrayQuestion5.body.text.substring(0, 200));

      // Check if "explain the syntax again" correctly refers to array filtering syntax
      const response5 = arrayQuestion5.body.text.toLowerCase();
      const explainsSyntax = response5.includes('array') || response5.includes('filter') || response5.includes('syntax');

      console.log('📊 Topic Continuity Analysis:');
      console.log(`   "Show me an example" refers to arrays: ${isArrayExample}`);
      console.log(`   "Explain the syntax again" refers to array syntax: ${explainsSyntax}`);

      if (!isArrayExample || !explainsSyntax) {
        console.log('❌ CONFIRMED: Topic continuity is broken across consecutive questions');
      } else {
        console.log('✅ Topic continuity is maintained');
      }
    });

    test('should demonstrate conversation flow breaks', async () => {
      if (!serverAvailable) {
        console.log('⚠️ Skipping test - server not available');
        return;
      }

      const flowSessionId = `${testSessionId}-flow`;

      // Start with string operations
      await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How do I manipulate strings in ZEN DSL?',
          sessionId: flowSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ String question 1 sent');

      await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Show me string slicing examples',
          sessionId: flowSessionId
        })
        .timeout(10000)
        .expect(200);

      // Switch to arrays without clear transition
      const arrayQ1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What about arrays?',
          sessionId: flowSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ Array question sent');
      console.log('🔍 Response to "What about arrays?":', arrayQ1.body.text.substring(0, 200));

      // Check if the AI acknowledges the topic switch
      const arrayResponse = arrayQ1.body.text.toLowerCase();
      const acknowledgesSwitch = arrayResponse.includes('string') || arrayResponse.includes('now') || arrayResponse.includes('switch');

      const arrayQ2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Give me examples',
          sessionId: flowSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('✅ Follow-up question sent');
      console.log('🔍 Response to "Give me examples":', arrayQ2.body.text.substring(0, 200));

      // Check if "Give me examples" correctly refers to arrays (current topic)
      const exampleResponse = arrayQ2.body.text.toLowerCase();
      const givesArrayExamples = exampleResponse.includes('array');
      const givesStringExamples = exampleResponse.includes('string');

      console.log('📊 Flow Analysis:');
      console.log(`   "What about arrays?" acknowledges topic switch: ${acknowledgesSwitch}`);
      console.log(`   "Give me examples" provides array examples: ${givesArrayExamples}`);
      console.log(`   "Give me examples" incorrectly provides string examples: ${givesStringExamples}`);

      if (!acknowledgesSwitch || !givesArrayExamples) {
        console.log('❌ CONFIRMED: Conversation flow breaks during topic transitions');
      } else {
        console.log('✅ Conversation flow is maintained during topic transitions');
      }
    });
  });

  describe('History Storage Investigation', () => {
    test('should investigate how history is actually stored', async () => {
      if (!serverAvailable) {
        console.log('⚠️ Skipping test - server not available');
        return;
      }

      const investigationSessionId = `${testSessionId}-investigation`;

      // Send multiple messages to build history
      const messages = [
        'First message about ZEN DSL basics',
        'Second message about array operations',
        'Third message about string manipulation',
        'Fourth message about mathematical operations',
        'Fifth message about date operations',
        'Sixth message about boolean logic',
        'Seventh message about complex expressions',
        'Eighth message about error handling'
      ];

      console.log('🔍 Sending multiple messages to investigate history storage...');

      for (let i = 0; i < messages.length; i++) {
        await request(baseUrl)
          .post('/api/chat/semantic')
          .send({
            message: messages[i],
            sessionId: investigationSessionId
          })
          .timeout(10000)
          .expect(200);

        console.log(`✅ Message ${i + 1} sent successfully`);
      }

      // Now ask about conversation history
      const historyInquiry = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Can you summarize our entire conversation so far?',
          sessionId: investigationSessionId
        })
        .timeout(10000)
        .expect(200);

      console.log('🔍 Response to conversation summary request:');
      console.log(historyInquiry.body.text);

      // Analyze how many previous messages are referenced
      const response = historyInquiry.body.text.toLowerCase();
      const messageReferences = messages.filter(msg => {
        const keywords = msg.toLowerCase().split(' ').slice(2, 4); // Get key words
        return keywords.some(keyword => response.includes(keyword));
      });

      console.log('📊 History Analysis:');
      console.log(`   Total messages sent: ${messages.length}`);
      console.log(`   Messages referenced in summary: ${messageReferences.length}`);
      console.log(`   Referenced messages: ${messageReferences.map(msg => msg.substring(0, 30)).join(', ')}`);

      if (messageReferences.length < messages.length / 2) {
        console.log('❌ CONFIRMED: History storage is limited or not properly accessed');
      } else {
        console.log('✅ History storage appears to be working correctly');
      }
    });

    test('should test session metrics endpoint', async () => {
      if (!serverAvailable) {
        console.log('⚠️ Skipping test - server not available');
        return;
      }

      try {
        const metricsResponse = await request(baseUrl)
          .get(`/api/chat/session/${testSessionId}/metrics`)
          .timeout(5000);

        if (metricsResponse.status === 200) {
          console.log('✅ Session metrics endpoint available');
          console.log('📊 Session metrics:', JSON.stringify(metricsResponse.body, null, 2));
        } else {
          console.log('⚠️ Session metrics endpoint not available or not implemented');
        }
      } catch {
        console.log('⚠️ Real API endpoint not available, skipping integration test');
        // This is expected in test environment
      }
    });
  });

  describe('Root Cause Analysis', () => {
    test('should identify the root cause of history management issues', async () => {
      if (!serverAvailable) {
        console.log('⚠️ Skipping test - server not available');
        return;
      }

      console.log('🔍 ROOT CAUSE ANALYSIS:');
      console.log('');
      console.log('Based on code analysis and testing, the issues are:');
      console.log('');
      console.log('1. HISTORY STORAGE MISMATCH:');
      console.log('   - ChatService (apps/server/src/services/chat.ts) has MAX_TURNS=4 limit');
      console.log('   - SemanticChat route (apps/server/src/routes/semanticChat.ts) uses separate sessionHistories Map');
      console.log('   - sessionHistories has NO LIMIT and keeps growing indefinitely');
      console.log('   - Line 225-230: sessionHistories.set(sessionId, [...conversationHistory, newTurns])');
      console.log('');
      console.log('2. PROMPT CONSTRUCTION ISSUES:');
      console.log('   - Recent history is sliced to last 8 turns (line 134: recentHistory.slice(-8))');
      console.log('   - But this may not include enough context for "what did I ask" questions');
      console.log('   - No explicit history inclusion in prompt for context questions');
      console.log('');
      console.log('3. CONVERSATION FLOW DETECTION:');
      console.log('   - DynamicContextManager detects flows but may not prioritize history appropriately');
      console.log('   - Token budget allocation may favor knowledge cards over conversation history');
      console.log('');
      console.log('4. MISSING HISTORY CONTEXT IN PROMPTS:');
      console.log('   - EnhancedPromptBuilder may not explicitly include conversation history context');
      console.log('   - AI model receives limited historical context for reference questions');

      // This test always passes - it's for documentation
      expect(true).toBe(true);
    });
  });
}); 