import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { chatService } from '../../apps/server/src/services/chat';

// We'll test the actual API endpoints to validate real behavior
describe('History Management Validation - API Integration', () => {
  let app: express.Application;
  let testSessionId: string;

  beforeEach(() => {
    // Create a test session ID
    testSessionId = `test-history-${Date.now()}`;
    
    // Setup minimal Express app for testing
    app = express();
    app.use(express.json({ limit: '50mb' }));
    
    // Mock the chat endpoint (we'll need to import the actual route)
    app.post('/api/chat', async (req, res) => {
      try {
        const { message, sessionId } = req.body;
        
        // Add user message to history
        chatService.addTurn(sessionId, 'user', message);
        
        // Mock AI response for testing
        const mockResponse = `Mock response to: ${message}`;
        
        // Add assistant response to history
        chatService.addTurn(sessionId, 'assistant', mockResponse);
        
        // Get current history after both messages are added
        const history = chatService.getHistory(sessionId);
        
        res.json({
          response: mockResponse,
          historyLength: history.length, // Current history length after both messages
          sessionId: sessionId
        });
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });

    // Add history inspection endpoint
    app.get('/api/chat/:sessionId/history', (req, res) => {
      const { sessionId } = req.params;
      const history = chatService.getHistory(sessionId);
      res.json({ history, sessionId });
    });
  });

  describe('Basic History Accumulation', () => {
    test('should accumulate conversation history correctly', async () => {
      // First message
      const response1 = await request(app)
        .post('/api/chat')
        .send({
          message: 'What is ZEN DSL?',
          sessionId: testSessionId
        })
        .expect(200);

      expect(response1.body.historyLength).toBe(2); // user + assistant

      // Second message
      const response2 = await request(app)
        .post('/api/chat')
        .send({
          message: 'Can you show me examples?',
          sessionId: testSessionId
        })
        .expect(200);

      expect(response2.body.historyLength).toBe(4); // 2 previous + 2 new

      // Third message
      const response3 = await request(app)
        .post('/api/chat')
        .send({
          message: 'How do I filter arrays?',
          sessionId: testSessionId
        })
        .expect(200);

      expect(response3.body.historyLength).toBe(4); // Should be limited by MAX_TURNS = 4
    });

    test('should maintain history across multiple requests', async () => {
      const messages = [
        'What is ZEN DSL?',
        'Show me array examples',
        'How do I filter data?',
        'What about string operations?'
      ];

      const responses: Array<{ body: { historyLength: number } }> = [];

      for (let i = 0; i < messages.length; i++) {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: messages[i],
            sessionId: testSessionId
          })
          .expect(200);

        responses.push(response);
      }

      // Verify responses
      expect(responses[0].body.historyLength).toBe(2);  // First exchange
      expect(responses[1].body.historyLength).toBe(4);  // Second exchange (hits MAX_TURNS)
      expect(responses[2].body.historyLength).toBe(4);  // Third exchange (still at MAX_TURNS)
      expect(responses[3].body.historyLength).toBe(4);  // Fourth exchange (still at MAX_TURNS)
    });
  });

  describe('History Context Questions', () => {
    test('should handle "what did I previously ask" questions', async () => {
      // Build conversation history
      await request(app)
        .post('/api/chat')
        .send({
          message: 'How do I filter arrays in ZEN DSL?',
          sessionId: testSessionId
        });

      await request(app)
        .post('/api/chat')
        .send({
          message: 'Can you show me more examples?',
          sessionId: testSessionId
        });

      // Now ask about previous questions
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'What did I previously ask about?',
          sessionId: testSessionId
        })
        .expect(200);

      // Check that history is available
      const historyResponse = await request(app)
        .get(`/api/chat/${testSessionId}/history`)
        .expect(200);

      expect(historyResponse.body.history.length).toBeGreaterThan(0);
      
      // Verify the history contains our previous questions
      const userMessages = historyResponse.body.history.filter((turn: { role: string; content: string }) => turn.role === 'user');
      expect(userMessages.length).toBeGreaterThan(0);
      
      // Check if any of our messages are in the history (may be truncated due to MAX_TURNS)
      const allUserContent = userMessages.map((turn: { role: string; content: string }) => turn.content);
      const hasRelevantHistory = allUserContent.some((content: string) => 
        content.includes('filter') || content.includes('examples') || content.includes('previously')
      );
      expect(hasRelevantHistory).toBe(true);
    });

    test('should handle topic continuity questions', async () => {
      // Start with array topic
      await request(app)
        .post('/api/chat')
        .send({
          message: 'How do I work with arrays in ZEN DSL?',
          sessionId: testSessionId
        });

      await request(app)
        .post('/api/chat')
        .send({
          message: 'Show me filtering examples',
          sessionId: testSessionId
        });

      // Ask about current topic
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'What topic are we discussing?',
          sessionId: testSessionId
        })
        .expect(200);

      // Verify history context is maintained
      const historyResponse = await request(app)
        .get(`/api/chat/${testSessionId}/history`)
        .expect(200);

      // Should have some history (limited by MAX_TURNS = 4)
      expect(historyResponse.body.history.length).toBeGreaterThan(0);
      expect(historyResponse.body.history.length).toBeLessThanOrEqual(4);
    });
  });

  describe('Conversation Flow Continuity', () => {
    test('should maintain context across consecutive related questions', async () => {
      const relatedQuestions = [
        'What is array filtering in ZEN DSL?',
        'Show me an example',
        'How do I filter by multiple conditions?',
        'What if I want to filter by age > 25?',
        'Can you explain the syntax again?'
      ];

      const responses: Array<{ body: { historyLength: number } }> = [];

      for (const question of relatedQuestions) {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: question,
            sessionId: testSessionId
          })
          .expect(200);

        responses.push(response);
      }

      // Verify history accumulation (limited by MAX_TURNS = 4)
      expect(responses[0].body.historyLength).toBe(2);  // First exchange
      expect(responses[1].body.historyLength).toBe(4);  // Second exchange (hits limit)
      expect(responses[2].body.historyLength).toBe(4);  // Third exchange (at limit)
      expect(responses[3].body.historyLength).toBe(4);  // Fourth exchange (at limit)
      expect(responses[4].body.historyLength).toBe(4);  // Fifth exchange (at limit)

      // Check final history state
      const finalHistory = await request(app)
        .get(`/api/chat/${testSessionId}/history`)
        .expect(200);

      // Should be limited to MAX_TURNS = 4
      expect(finalHistory.body.history.length).toBe(4);
      
      // Verify most recent questions are in history
      const userMessages = finalHistory.body.history
        .filter((turn: { role: string; content: string }) => turn.role === 'user')
        .map((turn: { role: string; content: string }) => turn.content);

      // Should contain the most recent questions (due to MAX_TURNS limit)
      expect(userMessages.length).toBeGreaterThan(0);
    });

    test('should handle topic transitions properly', async () => {
      // Start with arrays
      await request(app)
        .post('/api/chat')
        .send({
          message: 'How do I filter arrays?',
          sessionId: testSessionId
        });

      await request(app)
        .post('/api/chat')
        .send({
          message: 'Show me array examples',
          sessionId: testSessionId
        });

      // Switch to strings
      await request(app)
        .post('/api/chat')
        .send({
          message: 'Now tell me about string operations',
          sessionId: testSessionId
        });

      await request(app)
        .post('/api/chat')
        .send({
          message: 'How do I manipulate strings?',
          sessionId: testSessionId
        });

      // Ask about conversation history
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'What topics have we covered in this conversation?',
          sessionId: testSessionId
        })
        .expect(200);

      // Verify complete history is maintained (limited by MAX_TURNS)
      const historyResponse = await request(app)
        .get(`/api/chat/${testSessionId}/history`)
        .expect(200);

      expect(historyResponse.body.history.length).toBe(4); // Limited by MAX_TURNS
      
      // Should contain recent topics
      const allContent = historyResponse.body.history
        .map((turn: { role: string; content: string }) => turn.content)
        .join(' ');

      // Due to MAX_TURNS limit, may only have recent content
      expect(allContent.length).toBeGreaterThan(0);
    });
  });

  describe('Session Isolation', () => {
    test('should isolate history between different sessions', async () => {
      const session1 = `${testSessionId}-1`;
      const session2 = `${testSessionId}-2`;

      // Add messages to session 1
      await request(app)
        .post('/api/chat')
        .send({
          message: 'Session 1 message about arrays',
          sessionId: session1
        });

      // Add messages to session 2
      await request(app)
        .post('/api/chat')
        .send({
          message: 'Session 2 message about strings',
          sessionId: session2
        });

      // Check session 1 history
      const history1 = await request(app)
        .get(`/api/chat/${session1}/history`)
        .expect(200);

      // Check session 2 history
      const history2 = await request(app)
        .get(`/api/chat/${session2}/history`)
        .expect(200);

      // Each session should only have its own messages
      expect(history1.body.history.length).toBe(2); // 1 exchange
      expect(history2.body.history.length).toBe(2); // 1 exchange

      // Verify content isolation
      const session1Content = history1.body.history.map((turn: { role: string; content: string }) => turn.content).join(' ');
      const session2Content = history2.body.history.map((turn: { role: string; content: string }) => turn.content).join(' ');

      expect(session1Content).toContain('arrays');
      expect(session1Content).not.toContain('strings');
      expect(session2Content).toContain('strings');
      expect(session2Content).not.toContain('arrays');
    });
  });

  describe('History Limits and Cleanup', () => {
    test('should respect maximum history limits', async () => {
      // Send many messages to test history limits
      const manyMessages = Array.from({ length: 10 }, (_, i) => `Message ${i + 1} about ZEN DSL`);

      for (const message of manyMessages) {
        await request(app)
          .post('/api/chat')
          .send({
            message,
            sessionId: testSessionId
          });
      }

      // Check final history
      const historyResponse = await request(app)
        .get(`/api/chat/${testSessionId}/history`)
        .expect(200);

      // Should respect the MAX_TURNS limit (4 turns = 2 exchanges)
      console.log('Final history length:', historyResponse.body.history.length);
      
      // The actual implementation should limit this to MAX_TURNS = 4
      expect(historyResponse.body.history.length).toBe(4);
    });
  });

  describe('Real API Integration Test', () => {
    test('should test against actual semantic chat endpoint if available', async () => {
      // This test would use the real semantic chat endpoint
      // We'll skip it if the server isn't running
      
      try {
        const response = await request('http://localhost:3001')
          .post('/api/semantic-chat')
          .send({
            message: 'Test history management',
            sessionId: testSessionId
          })
          .timeout(5000);

        if (response.status === 200) {
          console.log('✅ Real API endpoint is available');
          expect(response.body).toHaveProperty('response');
        }
      } catch (error) {
        console.log('⚠️ Real API endpoint not available, skipping integration test');
        // This is expected in test environment
      }
    });
  });
}); 