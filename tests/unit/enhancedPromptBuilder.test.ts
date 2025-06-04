import { EnhancedPromptBuilder, EnhancedPromptResult } from '../../apps/server/src/services/enhancedPromptBuilder';
import { SimpleResponse, UserProfile, ConversationContext } from '../../apps/server/src/services/conversationStateManager';
import { ChatTurn } from '../../apps/server/src/services/contextManager';
import { KnowledgeCard } from '../../apps/server/src/services/vectorStore';

describe('EnhancedPromptBuilder', () => {
  let promptBuilder: EnhancedPromptBuilder;

  beforeEach(() => {
    promptBuilder = new EnhancedPromptBuilder();
  });

  describe('Basic functionality', () => {
    test('should create prompt builder instance', () => {
      expect(promptBuilder).toBeDefined();
    });

    test('should build simple prompt', () => {
      const mockKnowledgeCards: KnowledgeCard[] = [
        {
          id: 'test-1',
          content: 'ZEN DSL filter function example',
          category: 'arrays',
          source: 'arrays.md',
          relevanceScore: 0.9
        }
      ];

      const mockHistory: ChatTurn[] = [
        { role: 'user', content: 'Hello', timestamp: new Date() }
      ];

      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'General DSL guidance',
        suggestedFollowUps: []
      };

      const result = promptBuilder.buildSimplePrompt(
        'How do I filter arrays?',
        mockKnowledgeCards,
        mockHistory,
        mockSimpleResponse
      );

      expect(result).toHaveProperty('prompt');
      expect(result).toHaveProperty('sections');
      expect(result).toHaveProperty('totalTokens');
      expect(result).toHaveProperty('adaptations');
      expect(typeof result.prompt).toBe('string');
      expect(Array.isArray(result.sections)).toBe(true);
      expect(typeof result.totalTokens).toBe('number');
    });

    test('should handle empty knowledge cards', () => {
      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'General DSL guidance',
        suggestedFollowUps: []
      };

      const result = promptBuilder.buildSimplePrompt(
        'What is ZEN DSL?',
        [],
        [],
        mockSimpleResponse
      );

      expect(result.prompt).toBeDefined();
      expect(result.sections.length).toBeGreaterThan(0);
      expect(result.totalTokens).toBeGreaterThan(0);
    });

    test('should include system prompt section', () => {
      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'General DSL guidance',
        suggestedFollowUps: []
      };

      const result = promptBuilder.buildSimplePrompt(
        'Test message',
        [],
        [],
        mockSimpleResponse
      );

      const systemSection = result.sections.find(section => section.name === 'system');
      expect(systemSection).toBeDefined();
      expect(systemSection?.content).toContain('ZEN DSL');
      expect(systemSection?.priority).toBe('high');
    });

    test('should handle knowledge cards with different categories', () => {
      const mockKnowledgeCards: KnowledgeCard[] = [
        {
          id: 'arrays-1',
          content: 'Array filtering with ZEN DSL',
          category: 'arrays',
          source: 'arrays.md',
          relevanceScore: 0.9
        },
        {
          id: 'strings-1',
          content: 'String manipulation functions',
          category: 'strings',
          source: 'strings.md',
          relevanceScore: 0.8
        }
      ];

      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'Learning about data processing',
        suggestedFollowUps: ['Try filtering examples', 'Learn string functions']
      };

      const result = promptBuilder.buildSimplePrompt(
        'How do I process data?',
        mockKnowledgeCards,
        [],
        mockSimpleResponse
      );

      expect(result.sections.length).toBeGreaterThan(1);
      expect(result.prompt).toContain('Array filtering');
      expect(result.prompt).toContain('String manipulation');
    });

    test('should validate prompt results', () => {
      const mockResult: EnhancedPromptResult = {
        prompt: 'Test prompt content',
        sections: [
          {
            name: 'system',
            content: 'System prompt',
            tokenEstimate: 100,
            priority: 'high'
          }
        ],
        totalTokens: 100,
        adaptations: []
      };

      const validation = promptBuilder.validatePrompt(mockResult, 200);

      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('issues');
      expect(validation).toHaveProperty('suggestions');
      expect(typeof validation.isValid).toBe('boolean');
      expect(Array.isArray(validation.issues)).toBe(true);
      expect(Array.isArray(validation.suggestions)).toBe(true);
    });

    test('should handle conversation context', () => {
      const mockConversationContext: ConversationContext = {
        sessionId: 'test-session',
        currentTopic: 'arrays',
        topicDepth: 2,
        turnCount: 3,
        conceptsDiscussed: new Set(['filter', 'map']),
        lastActivity: new Date(),
        codeExamples: ['filter(data, condition)', 'map(data, transform)']
      };

      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'Advanced array operations',
        suggestedFollowUps: ['Try complex filters']
      };

      const result = promptBuilder.buildSimplePrompt(
        'Show me advanced filtering',
        [],
        [],
        mockSimpleResponse,
        undefined,
        mockConversationContext
      );

      expect(result.prompt).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(0);
    });

    test('should handle user profile', () => {
      const mockUserProfile: UserProfile = {
        sessionId: 'test-user',
        sessionCount: 5,
        totalQueries: 20,
        lastActiveDate: new Date(),
        conversationTopics: ['arrays', 'strings'],
        queryPatterns: ['how to filter', 'string functions']
      };

      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'Building on previous knowledge',
        suggestedFollowUps: []
      };

      const result = promptBuilder.buildSimplePrompt(
        'More advanced examples please',
        [],
        [],
        mockSimpleResponse,
        mockUserProfile
      );

      expect(result.prompt).toBeDefined();
      expect(result.adaptations).toBeDefined();
    });

    test('should handle JSON context', () => {
      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'Data processing with JSON',
        suggestedFollowUps: []
      };

      const jsonContext = '{"users": [{"name": "Alice", "age": 30}]}';

      const result = promptBuilder.buildSimplePrompt(
        'How do I process this JSON data?',
        [],
        [],
        mockSimpleResponse,
        undefined,
        undefined,
        jsonContext
      );

      expect(result.prompt).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(0);
    });

    test('should handle chat history', () => {
      const mockHistory: ChatTurn[] = [
        { role: 'user', content: 'What is filter()?', timestamp: new Date() },
        { role: 'assistant', content: 'Filter is used to select items...', timestamp: new Date() },
        { role: 'user', content: 'Can you show examples?', timestamp: new Date() }
      ];

      const mockSimpleResponse: SimpleResponse = {
        estimatedUserNeed: 'Practical examples',
        suggestedFollowUps: []
      };

      const result = promptBuilder.buildSimplePrompt(
        'Show me more filter examples',
        [],
        mockHistory,
        mockSimpleResponse
      );

      expect(result.prompt).toBeDefined();
      expect(result.sections.some(section => section.name.includes('history') || section.content.includes('filter'))).toBe(true);
    });
  });
}); 