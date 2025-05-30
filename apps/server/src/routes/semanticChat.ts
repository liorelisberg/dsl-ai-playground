// Semantic Chat Route - Phase 2 Integration
// Combines semantic vector store, conversation state, and enhanced prompts

import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/environment';
import { SemanticVectorStore } from '../services/semanticVectorStore';
import { ConversationStateManager } from '../services/conversationStateManager';
import { EnhancedPromptBuilder } from '../services/enhancedPromptBuilder';
import { DynamicContextManager, ChatTurn } from '../services/contextManager';
import { JSONContextOptimizer } from '../services/jsonOptimizer';

const router: Router = Router();

// Initialize services
const semanticStore = new SemanticVectorStore();
const stateManager = new ConversationStateManager();
const promptBuilder = new EnhancedPromptBuilder();
const contextManager = new DynamicContextManager();
const jsonOptimizer = new JSONContextOptimizer();

// Session storage for conversation history
const sessionHistories = new Map<string, ChatTurn[]>();

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;
if (config.gemini.apiKey) {
  genAI = new GoogleGenerativeAI(config.gemini.apiKey);
}

interface SemanticChatRequest {
  message: string;
  sessionId?: string;
  jsonContext?: any;
  maxTokens?: number;
}

interface SemanticChatResponse {
  response: string;
  sessionId: string;
  metadata: {
    semanticMatches: number;
    userExpertise: string;
    conversationFlow: string;
    adaptations: string[];
    personalizations: string[];
    tokenEfficiency: number;
    processingTime: number;
    semanticSimilarity: number;
  };
}

/**
 * Semantic Chat Handler with Phase 2 enhancements
 */
async function handleSemanticChat(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  
  try {
    const { message, sessionId = generateSessionId(), jsonContext, maxTokens = 2000 } = req.body as SemanticChatRequest;

    if (!message?.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!genAI) {
      res.status(500).json({ error: 'Gemini AI not configured' });
      return;
    }

    console.log(`🚀 Semantic chat request: "${message.substring(0, 50)}..." (session: ${sessionId})`);

    // 1. Get conversation history
    const conversationHistory = sessionHistories.get(sessionId) || [];

    // 2. Update user profile and conversation context
    const userProfile = stateManager.updateUserProfile(sessionId, message);
    const conversationContext = stateManager.updateConversationContext(sessionId, message, conversationHistory);

    // 3. Generate adaptive response strategy
    const adaptiveStrategy = stateManager.generateAdaptiveStrategy(sessionId, message);
    console.log(`🎯 Strategy: ${adaptiveStrategy.complexityLevel} complexity, ${adaptiveStrategy.estimatedUserNeed}`);

    // 4. Assess query complexity and calculate optimal token budget
    const queryComplexity = contextManager.assessQueryComplexity(message);
    const tokenBudget = contextManager.calculateOptimalBudget(
      message,
      conversationHistory,
      !!jsonContext,
      queryComplexity
    );

    // 5. Semantic knowledge retrieval
    const semanticResults = await semanticStore.search(message, Math.ceil(tokenBudget.knowledgeCards / 150));
    const knowledgeCards = semanticStore.searchResultsToKnowledgeCards(semanticResults);
    
    console.log(`🧠 Found ${semanticResults.length} semantic matches with avg similarity: ${
      semanticResults.length > 0 ? (semanticResults.reduce((sum, r) => sum + r.similarity, 0) / semanticResults.length * 100).toFixed(1) : 0
    }%`);

    // 6. Optimize conversation history
    const optimizedHistory = contextManager.optimizeHistory(conversationHistory, tokenBudget.chatHistory);

    // 7. Optimize JSON context if provided
    let optimizedJsonContext: string | undefined;
    if (jsonContext) {
      const jsonResult = jsonOptimizer.optimizeForQuery(jsonContext, message, tokenBudget.jsonContext);
      optimizedJsonContext = jsonResult.content;
    }

    // 8. Build adaptive prompt
    const promptResult = promptBuilder.buildAdaptivePrompt(
      message,
      knowledgeCards,
      optimizedHistory,
      adaptiveStrategy,
      userProfile,
      conversationContext,
      optimizedJsonContext
    );

    // 9. Validate prompt
    const validation = promptBuilder.validatePrompt(promptResult, maxTokens);
    if (!validation.isValid) {
      console.warn('⚠️  Prompt validation issues:', validation.issues);
    }

    // 10. Generate response with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(promptResult.prompt);
    const response = result.response.text();

    // 11. Update conversation history
    const userTurn: ChatTurn = { role: 'user', content: message, timestamp: new Date() };
    const assistantTurn: ChatTurn = { role: 'assistant', content: response, timestamp: new Date() };
    
    const updatedHistory = [...conversationHistory, userTurn, assistantTurn];
    sessionHistories.set(sessionId, updatedHistory);

    // 12. Calculate metrics
    const processingTime = Date.now() - startTime;
    const tokenEfficiency = (promptResult.totalTokens / maxTokens) * 100;
    const avgSimilarity = semanticResults.length > 0 ? 
      semanticResults.reduce((sum, r) => sum + r.similarity, 0) / semanticResults.length : 0;

    // 13. Generate response metadata
    const metadata = {
      semanticMatches: semanticResults.length,
      userExpertise: userProfile.expertiseLevel,
      conversationFlow: conversationContext.conversationFlow,
      adaptations: promptResult.adaptations,
      personalizations: promptResult.personalizations,
      tokenEfficiency: Math.round(tokenEfficiency),
      processingTime,
      semanticSimilarity: Math.round(avgSimilarity * 100)
    };

    console.log(`✅ Semantic response generated in ${processingTime}ms (${tokenEfficiency.toFixed(1)}% token efficiency)`);

    const chatResponse: SemanticChatResponse = {
      response,
      sessionId,
      metadata
    };

    res.json(chatResponse);

  } catch (error) {
    console.error('❌ Semantic chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process semantic chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Initialize semantic services
 */
async function initializeSemanticServices(): Promise<void> {
  try {
    console.log('🔧 Initializing semantic services...');
    
    // Initialize semantic vector store
    await semanticStore.initialize();
    
    // Load knowledge base from the same source as regular vector store
    console.log('📚 Loading DSL knowledge base into semantic store...');
    await loadKnowledgeBaseIntoSemanticStore();
    
    console.log('📚 Semantic services initialized');
    
  } catch (error) {
    console.error('❌ Failed to initialize semantic services:', error);
  }
}

/**
 * Load knowledge base into semantic store
 */
async function loadKnowledgeBaseIntoSemanticStore(): Promise<void> {
  try {
    // Import required services
    const { fileProcessor } = await import('../utils/fileProcessor');
    
    // Process DSL rule files from the same directory as regular store
    const rulesDirectory = '../../docs/dsl-rules';
    const processedFiles = await fileProcessor.readRuleFiles(rulesDirectory);
    
    if (processedFiles.length === 0) {
      console.log('⚠️  No DSL rule files found for semantic store');
      return;
    }

    // Convert to documents (same format as regular store)
    const documents = fileProcessor.processedFilesToDocuments(processedFiles);
    
    console.log(`🔄 Processing ${documents.length} documents for semantic embeddings...`);
    
    // Upsert documents into semantic store (this will generate embeddings)
    await semanticStore.upsertDocuments(documents);
    
    const stats = fileProcessor.getProcessingStats(processedFiles);
    const collectionInfo = semanticStore.getCollectionInfo();
    
    console.log(`✅ Semantic knowledge base loaded:`);
    console.log(`   📄 Files: ${stats.totalFiles}`);
    console.log(`   🧩 Documents: ${collectionInfo.count}`);
    console.log(`   🔢 Source Tokens: ${stats.totalTokens}`);
    console.log(`   🧠 Embeddings: ${collectionInfo.hasEmbeddings ? 'Generated' : 'Fallback mode'}`);
    
  } catch (error) {
    console.error('❌ Failed to load knowledge base into semantic store:', error);
    console.log('⚠️  Semantic store will continue with empty knowledge base (fallback mode)');
    // Don't throw - let semantic services continue with fallback
  }
}

/**
 * Get semantic system status
 */
async function getSemanticStatus(req: Request, res: Response): Promise<void> {
  try {
    const vectorStoreInfo = semanticStore.getCollectionInfo();
    const embeddingStats = semanticStore.getStats();
    
    const status = {
      status: 'operational',
      services: {
        semanticVectorStore: {
          initialized: true,
          documentCount: vectorStoreInfo.count,
          hasEmbeddings: vectorStoreInfo.hasEmbeddings,
          avgEmbeddingTime: Math.round(embeddingStats.avgEmbeddingTime),
          lastUpdated: embeddingStats.lastUpdated
        },
        conversationStateManager: {
          initialized: true,
          activeProfiles: 'available'
        },
        enhancedPromptBuilder: {
          initialized: true,
          adaptiveFeatures: 'enabled'
        }
      },
      capabilities: {
        semanticSearch: true,
        userProfiling: true,
        adaptivePrompts: true,
        conversationContinuity: true
      }
    };

    res.json(status);
  } catch (error) {
    console.error('❌ Status check failed:', error);
    res.status(500).json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get user session metrics
 */
async function getSessionMetrics(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      res.status(400).json({ error: 'Session ID required' });
      return;
    }

    const metrics = stateManager.getSessionMetrics(sessionId);
    const stateSummary = stateManager.getStateSummary(sessionId);
    
    res.json({
      sessionId,
      metrics,
      stateSummary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Session metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to get session metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Clear session data
 */
async function clearSession(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      res.status(400).json({ error: 'Session ID required' });
      return;
    }

    sessionHistories.delete(sessionId);
    // Note: User profiles are managed by ConversationStateManager
    // and cleaned up automatically based on age
    
    res.json({ 
      message: 'Session cleared successfully',
      sessionId 
    });
    
  } catch (error) {
    console.error('❌ Clear session error:', error);
    res.status(500).json({ 
      error: 'Failed to clear session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Utility functions
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Routes
router.post('/semantic', handleSemanticChat);
router.get('/semantic/status', getSemanticStatus);
router.get('/semantic/session/:sessionId/metrics', getSessionMetrics);
router.delete('/semantic/session/:sessionId', clearSession);

// Initialize services on module load
initializeSemanticServices();

export default router; 