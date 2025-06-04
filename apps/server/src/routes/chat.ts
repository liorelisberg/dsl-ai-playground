import { Router, Request, Response } from 'express';
import { geminiService } from '../services/gemini';
import { vectorStore } from '../services/vectorStore';
import { chatService } from '../services/chat';
import { rateLimiter, lengthGuard, tpmGuard } from '../middleware/rate-limiter';
import { attachSession } from '../middleware/session';
import { DynamicContextManager, ChatTurn } from '../services/contextManager';
import { KnowledgeOptimizer } from '../services/knowledgeOptimizer';
import { jsonStore } from '../api/upload';

const router: Router = Router();

// Initialize optimization services
const contextManager = new DynamicContextManager();
const knowledgeOptimizer = new KnowledgeOptimizer();

/**
 * Enhanced chat endpoint with dynamic token optimization
 */
const chatHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ 
        error: 'Message is required and must be a string',
        code: 'INVALID_MESSAGE'
      });
      return;
    }

    console.log(`💬 Processing enhanced chat message for session: ${req.sessionId}`);
    console.log(`📝 Message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`);

    const startTime = Date.now();

    // Get conversation history
    const serverHistory = chatService.getHistory(req.sessionId);
    const chatHistory: ChatTurn[] = serverHistory.map(turn => ({
      role: turn.role as 'user' | 'assistant',
      content: turn.content,
      timestamp: new Date(turn.timestamp)
    }));

    // Detect JSON context request and complexity
    const hasJsonContext = message.toLowerCase().includes('@fulljson');
    const queryComplexity = contextManager.assessQueryComplexity(message);

    // Calculate optimal token budget
    const budget = contextManager.calculateOptimalBudget(
      message,
      chatHistory,
      hasJsonContext,
      queryComplexity
    );

    console.log(`💰 Budget allocation: ${contextManager.getBudgetSummary(budget)}`);

    // Retrieve knowledge with dynamic optimization
    const retrievalStart = Date.now();
    const allKnowledgeResults = await vectorStore.search(message, 12); // Get more candidates
    const knowledgeCards = vectorStore.searchResultsToKnowledgeCards(allKnowledgeResults);

    const { cards: optimizedKnowledgeCards, metrics: knowledgeMetrics } = knowledgeOptimizer.selectOptimalCards(
      knowledgeCards,
      message,
      chatHistory,
      budget.knowledgeCards
    );

    const retrievalTime = Date.now() - retrievalStart;
    console.log(`🔍 Knowledge retrieval: ${retrievalTime}ms, efficiency: ${(knowledgeMetrics.averageRelevance * 100).toFixed(1)}%`);

    // Optimize conversation history
    const optimizedHistory = contextManager.optimizeHistory(chatHistory, budget.chatHistory);

    // Handle JSON context with simple processing
    let jsonContext: unknown = null;
    if (hasJsonContext && budget.jsonContext > 0) {
      const uploadedData = jsonStore.get(req.sessionId);
      
      if (uploadedData) {
        jsonContext = uploadedData;
        console.log(`📄 JSON context: Using full uploaded data`);
      } else {
        console.log('⚠️  JSON context requested but no data uploaded');
      }
    }

    // Convert history for Gemini service (timestamp as number)
    const geminiHistory = optimizedHistory.map(turn => ({
      role: turn.role,
      content: turn.content,
      timestamp: turn.timestamp.getTime()
    }));

    // Generate response using Gemini service with JSON context
    const generationStart = Date.now();
    const geminiResponse = await geminiService.generateContextualResponse(
      message,
      geminiHistory,
      optimizedKnowledgeCards,
      jsonContext
    );
    const generationTime = Date.now() - generationStart;

    // Extract response text
    const responseText = geminiResponse.text || geminiResponse.toString();

    // Calculate actual token usage estimate
    const enhancedPrompt = buildOptimizedPrompt(
      message,
      optimizedHistory,
      optimizedKnowledgeCards,
      jsonContext ? JSON.stringify(jsonContext, null, 2) : ''
    );
    const actualTokens = contextManager.estimateTokens(enhancedPrompt);
    const totalTime = Date.now() - startTime;

    // Generate optimization metrics
    const originalEstimate = 2000; // Old system average
    const optimizationMetrics = contextManager.generateOptimizationMetrics(
      originalEstimate,
      budget,
      actualTokens
    );

    // Store conversation turn
    chatService.addTurn(req.sessionId, 'user', message);
    chatService.addTurn(req.sessionId, 'assistant', responseText);

    // Log performance metrics
    console.log(`📊 Performance Metrics:`);
    console.log(`  Total time: ${totalTime}ms`);
    console.log(`  Token efficiency: ${(optimizationMetrics.efficiency * 100).toFixed(1)}% (${actualTokens}/${originalEstimate})`);
    console.log(`  Knowledge cards: ${optimizedKnowledgeCards.length} (avg relevance: ${(knowledgeMetrics.averageRelevance * 100).toFixed(1)}%)`);
    console.log(`  History turns: ${optimizedHistory.length}/${chatHistory.length}`);

    res.json({
      text: responseText,
      metadata: {
        sessionId: req.sessionId,
        timestamp: new Date().toISOString(),
        performance: {
          totalTime,
          retrievalTime,
          generationTime,
          tokenEfficiency: optimizationMetrics.efficiency
        },
        optimization: {
          budgetUsed: actualTokens,
          budgetAllocated: Object.values(budget).reduce((sum, val) => sum + val, 0),
          knowledgeCards: optimizedKnowledgeCards.length,
          historyTurns: optimizedHistory.length,
          complexity: queryComplexity
        }
      }
    });

  } catch (error) {
    console.error('Enhanced chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      code: 'CHAT_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Build optimized prompt using budget-allocated components
 */
function buildOptimizedPrompt(
  userMessage: string,
  history: ChatTurn[],
  knowledgeCards: Array<{ category: string; source: string; content: string }>,
  jsonContext: string
): string {
  const sections: string[] = [];

  // 1. Static DSL Header (budget.staticHeader tokens)
  sections.push(`You are a DSL (Domain Specific Language) expert assistant specialized in a JavaScript-like expression language.

Key DSL capabilities: Math operations, Array manipulation, String operations, Date/time calculations, Boolean logic, Object property access, Type checking.

Provide accurate, helpful responses using the knowledge base and context provided below.`);

  // 2. Knowledge Cards (budget.knowledgeCards tokens)
  if (knowledgeCards.length > 0) {
    sections.push('**Relevant DSL Documentation:**');
    knowledgeCards.forEach((card, index) => {
      sections.push(`${index + 1}. **${card.category}** (${card.source}):`);
      sections.push(card.content);
    });
  }

  // 3. Conversation History (budget.chatHistory tokens)
  if (history.length > 0) {
    sections.push('**Conversation History:**');
    history.forEach(turn => {
      sections.push(`${turn.role.toUpperCase()}: ${turn.content}`);
    });
  }

  // 4. JSON Context (budget.jsonContext tokens)
  if (jsonContext) {
    sections.push('**Data Context:**');
    sections.push(jsonContext);
  }

  // 5. Current Question
  sections.push('**Current Question:**');
  sections.push(userMessage);

  return sections.join('\n\n');
}

// Route with middleware
// @ts-expect-error - Express v5 typing issue
router.post('/chat', attachSession, lengthGuard, tpmGuard, rateLimiter, chatHandler);

export default router; 