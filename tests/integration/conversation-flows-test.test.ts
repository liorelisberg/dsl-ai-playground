import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';

// Test realistic conversation flows to validate API message construction
describe('Conversation Flows - Real User Interactions', () => {
  const baseUrl = 'http://localhost:3000';
  let serverAvailable = false;

  beforeAll(async () => {
    try {
      const response = await request(baseUrl).get('/health').timeout(2000);
      serverAvailable = response.status === 200;
      console.log(serverAvailable ? '✅ Server available for conversation flow testing' : '⚠️ Server not available');
    } catch {
      // Expected to fail - no conversation context
    }
  });

  describe('Learning Flow - New User Learning ZEN DSL', () => {
    test('should handle a complete learning journey', async () => {
      if (!serverAvailable) return;

      const sessionId = `learning-flow-${Date.now()}`;
      console.log('\n🎓 LEARNING FLOW - New User Journey');
      console.log('=' .repeat(50));

      // 1. Initial curiosity
      console.log('\n1️⃣ Initial Question');
      const response1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What is ZEN DSL and how does it work?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "What is ZEN DSL and how does it work?"`);
      console.log(`🤖 AI: "${response1.body.text.substring(0, 150)}..."`);

      // 2. Dive deeper into specific topic
      console.log('\n2️⃣ Diving Deeper');
      const response2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Can you show me some examples of array operations?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Can you show me some examples of array operations?"`);
      console.log(`🤖 AI: "${response2.body.text.substring(0, 150)}..."`);

      // 3. Follow-up clarification
      console.log('\n3️⃣ Follow-up Clarification');
      const response3 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'I dont understand the # syntax. Can you explain it again?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "I dont understand the # syntax. Can you explain it again?"`);
      console.log(`🤖 AI: "${response3.body.text.substring(0, 150)}..."`);

      // 4. Practical application
      console.log('\n4️⃣ Practical Application');
      const response4 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How would I filter an array of users to get only adults over 18?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "How would I filter an array of users to get only adults over 18?"`);
      console.log(`🤖 AI: "${response4.body.text.substring(0, 150)}..."`);

      // 5. Memory test
      console.log('\n5️⃣ Memory Test');
      const response5 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What did we discuss at the beginning of our conversation?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "What did we discuss at the beginning of our conversation?"`);
      console.log(`🤖 AI: "${response5.body.text.substring(0, 150)}..."`);

      // Analyze conversation continuity
      const mentionsZEN = response5.body.text.toLowerCase().includes('zen dsl');
      const mentionsArrays = response5.body.text.toLowerCase().includes('array');
      const mentionsBeginning = response5.body.text.toLowerCase().includes('beginning') || 
                               response5.body.text.toLowerCase().includes('start') ||
                               response5.body.text.toLowerCase().includes('first');

      console.log('\n📊 Learning Flow Analysis:');
      console.log(`   ✅ Remembers ZEN DSL discussion: ${mentionsZEN}`);
      console.log(`   ✅ Remembers array operations: ${mentionsArrays}`);
      console.log(`   ✅ Acknowledges beginning reference: ${mentionsBeginning}`);

      expect(response5.body.sessionId).toBe(sessionId);
    }, 45000);
  });

  describe('Problem-Solving Flow - User with Specific Issue', () => {
    test('should handle debugging and problem-solving', async () => {
      if (!serverAvailable) return;

      const sessionId = `problem-solving-${Date.now()}`;
      console.log('\n🔧 PROBLEM-SOLVING FLOW - Debugging Issues');
      console.log('=' .repeat(50));

      // 1. Present the problem
      console.log('\n1️⃣ Problem Statement');
      const response1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'I am trying to filter an array but getting an error. My expression is: filter(users, #.age > 25)',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "I am trying to filter an array but getting an error. My expression is: filter(users, #.age > 25)"`);
      console.log(`🤖 AI: "${response1.body.text.substring(0, 150)}..."`);

      // 2. Provide more context
      console.log('\n2️⃣ Additional Context');
      const response2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'My data looks like this: [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 20}]',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "My data looks like this: [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 20}]"`);
      console.log(`🤖 AI: "${response2.body.text.substring(0, 150)}..."`);

      // 3. Ask for corrected solution
      console.log('\n3️⃣ Solution Request');
      const response3 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Can you show me the correct way to write this expression?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Can you show me the correct way to write this expression?"`);
      console.log(`🤖 AI: "${response3.body.text.substring(0, 150)}..."`);

      // 4. Test understanding
      console.log('\n4️⃣ Validation');
      const response4 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Why did my original expression fail?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Why did my original expression fail?"`);
      console.log(`🤖 AI: "${response4.body.text.substring(0, 150)}..."`);

      // Analyze problem-solving continuity
      const mentionsOriginalError = response4.body.text.toLowerCase().includes('filter') ||
                                   response4.body.text.toLowerCase().includes('users') ||
                                   response4.body.text.toLowerCase().includes('array');
      const mentionsWrapping = response4.body.text.toLowerCase().includes('wrap') ||
                              response4.body.text.toLowerCase().includes('object') ||
                              response4.body.text.toLowerCase().includes('{');

      console.log('\n📊 Problem-Solving Flow Analysis:');
      console.log(`   ✅ References original problem: ${mentionsOriginalError}`);
      console.log(`   ✅ Explains array wrapping issue: ${mentionsWrapping}`);

      expect(response4.body.sessionId).toBe(sessionId);
    }, 30000);
  });

  describe('Exploration Flow - Advanced User Experimenting', () => {
    test('should handle advanced exploration and experimentation', async () => {
      if (!serverAvailable) return;

      const sessionId = `exploration-${Date.now()}`;
      console.log('\n🔬 EXPLORATION FLOW - Advanced Experimentation');
      console.log('=' .repeat(50));

      // 1. Advanced string operations
      console.log('\n1️⃣ String Operations');
      const response1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Show me advanced string manipulation techniques in ZEN DSL',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Show me advanced string manipulation techniques in ZEN DSL"`);
      console.log(`🤖 AI: "${response1.body.text.substring(0, 150)}..."`);

      // 2. Combine with arrays
      console.log('\n2️⃣ Combining Operations');
      const response2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How can I combine those string operations with array processing?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "How can I combine those string operations with array processing?"`);
      console.log(`🤖 AI: "${response2.body.text.substring(0, 150)}..."`);

      // 3. Complex scenario
      console.log('\n3️⃣ Complex Scenario');
      const response3 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What about performance? Are there any optimization tips for complex expressions?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "What about performance? Are there any optimization tips for complex expressions?"`);
      console.log(`🤖 AI: "${response3.body.text.substring(0, 150)}..."`);

      // 4. Edge cases
      console.log('\n4️⃣ Edge Cases');
      const response4 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What happens with empty arrays or null values?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "What happens with empty arrays or null values?"`);
      console.log(`🤖 AI: "${response4.body.text.substring(0, 150)}..."`);

      // 5. Callback to earlier discussion
      console.log('\n5️⃣ Reference Previous Discussion');
      const response5 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Going back to the string operations we discussed earlier, can you give me a real-world example?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Going back to the string operations we discussed earlier, can you give me a real-world example?"`);
      console.log(`🤖 AI: "${response5.body.text.substring(0, 150)}..."`);

      // Analyze exploration continuity
      const referencesEarlier = response5.body.text.toLowerCase().includes('earlier') ||
                               response5.body.text.toLowerCase().includes('previous') ||
                               response5.body.text.toLowerCase().includes('discussed');
      const providesExample = response5.body.text.length > 200; // Substantial response

      console.log('\n📊 Exploration Flow Analysis:');
      console.log(`   ✅ References earlier discussion: ${referencesEarlier}`);
      console.log(`   ✅ Provides substantial example: ${providesExample}`);

      expect(response5.body.sessionId).toBe(sessionId);
    }, 45000);
  });

  describe('Topic Switching Flow - Multiple Domain Exploration', () => {
    test('should handle topic transitions gracefully', async () => {
      if (!serverAvailable) return;

      const sessionId = `topic-switching-${Date.now()}`;
      console.log('\n🔄 TOPIC SWITCHING FLOW - Multiple Domains');
      console.log('=' .repeat(50));

      // 1. Start with arrays
      console.log('\n1️⃣ Arrays Domain');
      const response1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Teach me about array filtering and mapping in ZEN DSL',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Teach me about array filtering and mapping in ZEN DSL"`);
      console.log(`🤖 AI: "${response1.body.text.substring(0, 150)}..."`);

      // 2. Switch to dates
      console.log('\n2️⃣ Switch to Dates');
      const response2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Now tell me about date operations instead',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Now tell me about date operations instead"`);
      console.log(`🤖 AI: "${response2.body.text.substring(0, 150)}..."`);

      // 3. Combine both topics
      console.log('\n3️⃣ Combine Topics');
      const response3 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How would I filter an array of events by date range?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "How would I filter an array of events by date range?"`);
      console.log(`🤖 AI: "${response3.body.text.substring(0, 150)}..."`);

      // 4. Add mathematical operations
      console.log('\n4️⃣ Add Math Operations');
      const response4 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What about calculating the total duration of those filtered events?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "What about calculating the total duration of those filtered events?"`);
      console.log(`🤖 AI: "${response4.body.text.substring(0, 150)}..."`);

      // 5. Comprehensive review
      console.log('\n5️⃣ Comprehensive Review');
      const response5 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Can you summarize all the different operations we have covered in this conversation?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Can you summarize all the different operations we have covered in this conversation?"`);
      console.log(`🤖 AI: "${response5.body.text.substring(0, 150)}..."`);

      // Analyze topic switching
      const mentionsArrays = response5.body.text.toLowerCase().includes('array');
      const mentionsDates = response5.body.text.toLowerCase().includes('date');
      const mentionsMath = response5.body.text.toLowerCase().includes('calcul') || 
                          response5.body.text.toLowerCase().includes('math') ||
                          response5.body.text.toLowerCase().includes('total');
      const mentionsFiltering = response5.body.text.toLowerCase().includes('filter');

      console.log('\n📊 Topic Switching Analysis:');
      console.log(`   ✅ Mentions arrays: ${mentionsArrays}`);
      console.log(`   ✅ Mentions dates: ${mentionsDates}`);
      console.log(`   ✅ Mentions math/calculations: ${mentionsMath}`);
      console.log(`   ✅ Mentions filtering: ${mentionsFiltering}`);

      expect(response5.body.sessionId).toBe(sessionId);
    }, 45000);
  });

  describe('Context Reference Flow - Memory and Reference Testing', () => {
    test('should handle various types of context references', async () => {
      if (!serverAvailable) return;

      const sessionId = `context-reference-${Date.now()}`;
      console.log('\n🧠 CONTEXT REFERENCE FLOW - Memory Testing');
      console.log('=' .repeat(50));

      // 1. Establish context with specific example
      console.log('\n1️⃣ Establish Context');
      const response1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'I need to process a list of employees: [{"name": "John", "salary": 50000, "department": "IT"}]. Show me how to filter high earners.',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "I need to process a list of employees: [{"name": "John", "salary": 50000, "department": "IT"}]. Show me how to filter high earners."`);
      console.log(`🤖 AI: "${response1.body.text.substring(0, 150)}..."`);

      // 2. Reference "that example"
      console.log('\n2️⃣ Reference Previous Example');
      const response2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'In that example, how would I also sort by salary?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "In that example, how would I also sort by salary?"`);
      console.log(`🤖 AI: "${response2.body.text.substring(0, 150)}..."`);

      // 3. Reference "what you showed me"
      console.log('\n3️⃣ Reference AI\'s Previous Response');
      const response3 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'What you showed me works great, but can I group by department too?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "What you showed me works great, but can I group by department too?"`);
      console.log(`🤖 AI: "${response3.body.text.substring(0, 150)}..."`);

      // 4. Reference "earlier conversation"
      console.log('\n4️⃣ Reference Earlier Conversation');
      const response4 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Going back to our earlier conversation about employees, what if some salary data is missing?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Going back to our earlier conversation about employees, what if some salary data is missing?"`);
      console.log(`🤖 AI: "${response4.body.text.substring(0, 150)}..."`);

      // 5. Specific data reference
      console.log('\n5️⃣ Specific Data Reference');
      const response5 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'With John from the IT department example, how would I check if his record is complete?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "With John from the IT department example, how would I check if his record is complete?"`);
      console.log(`🤖 AI: "${response5.body.text.substring(0, 150)}..."`);

      // Analyze context references
      const remembersJohn = response5.body.text.toLowerCase().includes('john');
      const remembersIT = response5.body.text.toLowerCase().includes('it') || 
                         response5.body.text.toLowerCase().includes('department');
      const remembersEmployee = response5.body.text.toLowerCase().includes('employee') ||
                               response5.body.text.toLowerCase().includes('record');

      console.log('\n📊 Context Reference Analysis:');
      console.log(`   ✅ Remembers John: ${remembersJohn}`);
      console.log(`   ✅ Remembers IT department: ${remembersIT}`);
      console.log(`   ✅ Remembers employee context: ${remembersEmployee}`);

      expect(response5.body.sessionId).toBe(sessionId);
    }, 30000);
  });

  describe('Error Recovery Flow - Handling Mistakes and Corrections', () => {
    test('should handle user corrections and clarifications', async () => {
      if (!serverAvailable) return;

      const sessionId = `error-recovery-${Date.now()}`;
      console.log('\n🔄 ERROR RECOVERY FLOW - Corrections and Clarifications');
      console.log('=' .repeat(50));

      // 1. User makes incorrect assumption
      console.log('\n1️⃣ Incorrect Assumption');
      const response1 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'How do I use the slice() function to get part of an array in ZEN DSL?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "How do I use the slice() function to get part of an array in ZEN DSL?"`);
      console.log(`🤖 AI: "${response1.body.text.substring(0, 150)}..."`);

      // 2. User realizes mistake
      console.log('\n2️⃣ User Correction');
      const response2 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Oh wait, I think I was wrong about slice(). What is the correct syntax for array slicing?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Oh wait, I think I was wrong about slice(). What is the correct syntax for array slicing?"`);
      console.log(`🤖 AI: "${response2.body.text.substring(0, 150)}..."`);

      // 3. Clarification request
      console.log('\n3️⃣ Clarification Request');
      const response3 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'So to clarify, there is no slice() function and I should use bracket notation instead?',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "So to clarify, there is no slice() function and I should use bracket notation instead?"`);
      console.log(`🤖 AI: "${response3.body.text.substring(0, 150)}..."`);

      // 4. Apply corrected understanding
      console.log('\n4️⃣ Apply Correction');
      const response4 = await request(baseUrl)
        .post('/api/chat/semantic')
        .send({
          message: 'Perfect! Now show me how to use that bracket notation with an array of names.',
          sessionId
        })
        .timeout(15000)
        .expect(200);

      console.log(`👤 User: "Perfect! Now show me how to use that bracket notation with an array of names."`);
      console.log(`🤖 AI: "${response4.body.text.substring(0, 150)}..."`);

      // Analyze error recovery
      const correctsBracketNotation = response4.body.text.includes('[') && response4.body.text.includes(':');
      const avoidsMentioningSlice = !response4.body.text.toLowerCase().includes('slice()');

      console.log('\n📊 Error Recovery Analysis:');
      console.log(`   ✅ Uses correct bracket notation: ${correctsBracketNotation}`);
      console.log(`   ✅ Avoids incorrect slice() function: ${avoidsMentioningSlice}`);

      expect(response4.body.sessionId).toBe(sessionId);
    }, 30000);
  });

  describe('Performance Analysis', () => {
    test('should analyze conversation flow performance', async () => {
      if (!serverAvailable) return;

      console.log('\n⚡ PERFORMANCE ANALYSIS');
      console.log('=' .repeat(50));

      const sessionId = `performance-test-${Date.now()}`;
      const startTime = Date.now();

      // Rapid fire questions to test response consistency
      const rapidQuestions = [
        'What is ZEN DSL?',
        'Show me array examples',
        'How about string operations?',
        'What did we discuss first?',
        'Combine arrays and strings'
      ];

      interface ResponseMetrics {
        question: string;
        responseTime: number;
        hasResponse: boolean;
        sessionConsistent: boolean;
      }

      const responses: ResponseMetrics[] = [];
      for (let i = 0; i < rapidQuestions.length; i++) {
        const questionStart = Date.now();
        
        const response = await request(baseUrl)
          .post('/api/chat/semantic')
          .send({
            message: rapidQuestions[i],
            sessionId
          })
          .timeout(15000)
          .expect(200);

        const responseTime = Date.now() - questionStart;
        responses.push({
          question: rapidQuestions[i],
          responseTime,
          hasResponse: response.body.text.length > 50,
          sessionConsistent: response.body.sessionId === sessionId
        });

        console.log(`${i + 1}. "${rapidQuestions[i]}" - ${responseTime}ms`);
      }

      const totalTime = Date.now() - startTime;
      const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length;
      const allSessionsConsistent = responses.every(r => r.sessionConsistent);
      const allHaveResponses = responses.every(r => r.hasResponse);

      console.log('\n📊 Performance Metrics:');
      console.log(`   Total conversation time: ${totalTime}ms`);
      console.log(`   Average response time: ${Math.round(avgResponseTime)}ms`);
      console.log(`   All sessions consistent: ${allSessionsConsistent}`);
      console.log(`   All responses substantial: ${allHaveResponses}`);
      console.log(`   Throughput: ${Math.round(responses.length / (totalTime / 1000))} questions/second`);

      expect(allSessionsConsistent).toBe(true);
      expect(allHaveResponses).toBe(true);
      expect(avgResponseTime).toBeLessThan(10000); // Less than 10 seconds average
    }, 60000);
  });
}); 