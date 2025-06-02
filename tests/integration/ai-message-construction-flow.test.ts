import { describe, test, expect } from '@jest/globals';
import { chatService } from '../../apps/server/src/services/chat';
import { DynamicContextManager } from '../../apps/server/src/services/contextManager';
import { EnhancedPromptBuilder } from '../../apps/server/src/services/enhancedPromptBuilder';
import { JSONContextOptimizer } from '../../apps/server/src/services/jsonOptimizer';
import { ConversationStateManager } from '../../apps/server/src/services/conversationStateManager';

describe('AI Message Construction Flow Integration', () => {
  describe('Core Service Integration', () => {
    test('should integrate chat service with context manager', () => {
      const contextManager = new DynamicContextManager();
      const sessionId = 'test-integration';
      const userMessage = 'How do I filter arrays?';

      // Add to chat service
      chatService.addTurn(sessionId, 'user', userMessage);
      const chatHistory = chatService.getHistory(sessionId);

      // Convert to context manager format
      const history = chatHistory.map(turn => ({
        role: turn.role,
        content: turn.content,
        timestamp: new Date(turn.timestamp)
      }));

      // Calculate budget
      const budget = contextManager.calculateOptimalBudget(userMessage, history, false);

      expect(chatHistory.length).toBe(1);
      expect(budget.knowledgeCards).toBeGreaterThan(0);
      expect(budget.userMessage).toBeGreaterThan(0);
    });

    test('should integrate state manager with prompt builder', () => {
      const stateManager = new ConversationStateManager();
      const promptBuilder = new EnhancedPromptBuilder();
      const sessionId = 'test-state-prompt';
      const userMessage = 'Show me examples';

      // Update state
      const userProfile = stateManager.updateUserProfile(sessionId, userMessage);
      const conversationContext = stateManager.updateConversationContext(sessionId, userMessage, []);
      const simpleResponse = stateManager.generateSimpleResponse(sessionId, userMessage);

      // Build prompt
      const promptResult = promptBuilder.buildSimplePrompt(
        userMessage,
        [],
        [],
        simpleResponse,
        userProfile,
        conversationContext
      );

      expect(userProfile.totalQueries).toBe(1);
      expect(promptResult.prompt).toContain('ZEN DSL');
      expect(promptResult.totalTokens).toBeGreaterThan(0);
    });

    test('should integrate JSON optimizer with context manager', () => {
      const jsonOptimizer = new JSONContextOptimizer();
      const contextManager = new DynamicContextManager();
      const userMessage = 'Process this data';

      // Calculate budget with JSON context
      const budget = contextManager.calculateOptimalBudget(userMessage, [], true);

      // Optimize JSON within budget
      const jsonData = { items: [1, 2, 3] };
      const optimization = jsonOptimizer.optimizeForQuery(
        jsonData,
        userMessage,
        budget.jsonContext
      );

      expect(budget.jsonContext).toBeGreaterThan(0);
      expect(optimization.content).toBeDefined();
      expect(optimization.tokensUsed).toBeGreaterThanOrEqual(0);
    });

    test('should handle complete flow without dependencies', () => {
      const contextManager = new DynamicContextManager();
      const promptBuilder = new EnhancedPromptBuilder();
      const stateManager = new ConversationStateManager();
      const jsonOptimizer = new JSONContextOptimizer();

      const sessionId = 'complete-flow-test';
      const userMessage = 'Filter my data';
      const jsonData = { users: [{ name: 'test', age: 25 }] };

      // 1. Chat history
      chatService.addTurn(sessionId, 'user', userMessage);
      const chatHistory = chatService.getHistory(sessionId);
      const history = chatHistory.map(turn => ({
        role: turn.role,
        content: turn.content,
        timestamp: new Date(turn.timestamp)
      }));

      // 2. Context budget
      const budget = contextManager.calculateOptimalBudget(userMessage, history, true);

      // 3. JSON optimization
      const jsonOptimization = jsonOptimizer.optimizeForQuery(
        jsonData,
        userMessage,
        budget.jsonContext
      );

      // 4. State management
      const userProfile = stateManager.updateUserProfile(sessionId, userMessage);
      const conversationContext = stateManager.updateConversationContext(sessionId, userMessage, history);
      const simpleResponse = stateManager.generateSimpleResponse(sessionId, userMessage);

      // 5. Prompt building
      const promptResult = promptBuilder.buildSimplePrompt(
        userMessage,
        [],
        history,
        simpleResponse,
        userProfile,
        conversationContext,
        jsonOptimization.content
      );

      // Validate complete integration
      expect(history.length).toBe(1);
      expect(budget.knowledgeCards).toBeGreaterThan(0);
      expect(userProfile.totalQueries).toBe(1);
      expect(conversationContext.turnCount).toBe(1);
      expect(promptResult.prompt).toBeDefined();
      expect(promptResult.totalTokens).toBeGreaterThan(0);
    });

    test('should handle performance requirements', () => {
      const startTime = Date.now();

      // Simulate typical operations
      const contextManager = new DynamicContextManager();
      const promptBuilder = new EnhancedPromptBuilder();
      const stateManager = new ConversationStateManager();

      const sessionId = 'perf-test';
      const message = 'Performance test message';

      chatService.addTurn(sessionId, 'user', message);
      const budget = contextManager.calculateOptimalBudget(message, [], false);
      const userProfile = stateManager.updateUserProfile(sessionId, message);
      const simpleResponse = stateManager.generateSimpleResponse(sessionId, message);
      const promptResult = promptBuilder.buildSimplePrompt(message, [], [], simpleResponse, userProfile);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should be very fast without AI calls
      expect(promptResult.totalTokens).toBeGreaterThan(0);
    });

    test('should handle error conditions gracefully', () => {
      const contextManager = new DynamicContextManager();
      const promptBuilder = new EnhancedPromptBuilder();
      const stateManager = new ConversationStateManager();

      // Test with edge cases
      expect(() => {
        contextManager.calculateOptimalBudget('', [], false);
      }).not.toThrow();

      expect(() => {
        stateManager.generateSimpleResponse('', '');
      }).not.toThrow();

      expect(() => {
        promptBuilder.buildSimplePrompt('', [], [], { estimatedUserNeed: '', suggestedFollowUps: [] });
      }).not.toThrow();
    });
  });
}); 