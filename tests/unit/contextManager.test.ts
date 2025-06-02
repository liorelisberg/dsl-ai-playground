import { DynamicContextManager, ChatTurn, ContextBudget } from '../../apps/server/src/services/contextManager';

describe('DynamicContextManager', () => {
  let contextManager: DynamicContextManager;

  beforeEach(() => {
    contextManager = new DynamicContextManager();
  });

  describe('Basic functionality', () => {
    test('should create context manager instance', () => {
      expect(contextManager).toBeDefined();
    });

    test('should calculate optimal budget', () => {
      const budget = contextManager.calculateOptimalBudget(
        'How do I filter arrays?',
        [],
        false
      );

      expect(budget).toHaveProperty('staticHeader');
      expect(budget).toHaveProperty('knowledgeCards');
      expect(budget).toHaveProperty('chatHistory');
      expect(budget).toHaveProperty('jsonContext');
      expect(budget).toHaveProperty('userMessage');
      expect(budget).toHaveProperty('reserve');
      expect(typeof budget.staticHeader).toBe('number');
      expect(typeof budget.knowledgeCards).toBe('number');
    });

    test('should handle learning flow budget allocation', () => {
      const budget = contextManager.calculateOptimalBudget(
        'What is ZEN DSL and how does it work?',
        [],
        false,
        'moderate'
      );

      expect(budget.knowledgeCards).toBeGreaterThan(0);
      expect(budget.chatHistory).toBeGreaterThan(-1); // Can be 0 for new conversation
    });

    test('should optimize chat history within token budget', () => {
      const history: ChatTurn[] = [
        { role: 'user', content: 'Hello', timestamp: new Date() },
        { role: 'assistant', content: 'Hi there!', timestamp: new Date() },
        { role: 'user', content: 'How do I filter arrays?', timestamp: new Date() }
      ];

      const optimized = contextManager.optimizeHistory(history, 200);
      
      expect(Array.isArray(optimized)).toBe(true);
      expect(optimized.length).toBeLessThanOrEqual(history.length);
    });

    test('should assess query complexity', () => {
      const simpleComplexity = contextManager.assessQueryComplexity('What is len()?');
      const complexComplexity = contextManager.assessQueryComplexity(
        'How do I create a complex nested filter with multiple conditions and transformations?'
      );

      expect(['simple', 'moderate', 'complex']).toContain(simpleComplexity);
      expect(['simple', 'moderate', 'complex']).toContain(complexComplexity);
    });

    test('should generate optimization metrics', () => {
      const budget: ContextBudget = {
        staticHeader: 300,
        knowledgeCards: 2000,
        chatHistory: 1000,
        jsonContext: 500,
        userMessage: 100,
        reserve: 400
      };

      const metrics = contextManager.generateOptimizationMetrics(5000, budget, 3800);

      expect(metrics).toHaveProperty('originalTokenEstimate');
      expect(metrics).toHaveProperty('optimizedTokenUsage');
      expect(metrics).toHaveProperty('efficiency');
      expect(metrics).toHaveProperty('knowledgeCardCount');
      expect(metrics).toHaveProperty('historyTurnCount');
      expect(typeof metrics.efficiency).toBe('number');
    });

    test('should estimate tokens for text', () => {
      const tokens = contextManager.estimateTokens('This is a test message');
      
      expect(typeof tokens).toBe('number');
      expect(tokens).toBeGreaterThan(0);
    });

    test('should get budget summary', () => {
      const budget: ContextBudget = {
        staticHeader: 300,
        knowledgeCards: 2000,
        chatHistory: 1000,
        jsonContext: 500,
        userMessage: 100,
        reserve: 400
      };

      const summary = contextManager.getBudgetSummary(budget);
      
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });

    test('should validate budget', () => {
      const validBudget: ContextBudget = {
        staticHeader: 300,
        knowledgeCards: 2000,
        chatHistory: 1000,
        jsonContext: 500,
        userMessage: 100,
        reserve: 400
      };

      const isValid = contextManager.validateBudget(validBudget);
      expect(typeof isValid).toBe('boolean');
    });

    test('should handle conversation flow detection', () => {
      const learningMessage = 'What is ZEN DSL and how do I learn it?';
      const problemMessage = 'I have an error in my filter expression';
      const explorationMessage = 'Let me try different ways to process this data';

      const learningBudget = contextManager.calculateOptimalBudget(learningMessage, [], false);
      const problemBudget = contextManager.calculateOptimalBudget(problemMessage, [], false);
      const explorationBudget = contextManager.calculateOptimalBudget(explorationMessage, [], false);

      // Learning flow should prioritize knowledge cards
      expect(learningBudget.knowledgeCards).toBeGreaterThan(0);
      
      // All budgets should be valid
      expect(contextManager.validateBudget(learningBudget)).toBe(true);
      expect(contextManager.validateBudget(problemBudget)).toBe(true);
      expect(contextManager.validateBudget(explorationBudget)).toBe(true);
    });

    test('should handle complex queries with enhanced allocation', () => {
      const complexMessage = 'I need to create a multi-step data transformation with nested filters, conditional logic, and complex mathematical operations on arrays';
      
      const budget = contextManager.calculateOptimalBudget(
        complexMessage, 
        [], 
        true, // hasJsonContext
        'complex'
      );

      expect(budget.knowledgeCards).toBeGreaterThan(1000); // Complex queries get more knowledge
      expect(budget.jsonContext).toBeGreaterThan(0); // JSON context should be allocated
    });
  });
}); 