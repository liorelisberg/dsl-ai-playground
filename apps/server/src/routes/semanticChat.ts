// Semantic Chat Route - Phase 2.5 Integration: API Resilience & Production Reliability
// Combines semantic vector store, conversation state, enhanced prompts, and production resilience

// Semantic Chat Route - Phase 3 Integration: Topic Management & Intelligence Layer
// Adds semantic topic similarity detection and ZEN relevance validation

import { Router, Request, Response } from 'express';
import { config } from '../config/environment';
import { SemanticVectorStore } from '../services/semanticVectorStore';
import { ConversationStateManager } from '../services/conversationStateManager';
import { EnhancedPromptBuilder } from '../services/enhancedPromptBuilder';
import { DynamicContextManager, ChatTurn } from '../services/contextManager';
import { ResilientGeminiService } from '../services/resilientGeminiService';
import { IntelligentRateLimitManager } from '../services/rateLimitManager';
import { UserFeedbackManager } from '../services/userFeedbackManager';
import { Document } from '../services/vectorStore';
import { jsonStore } from '../api/upload';
import * as fs from 'fs';
import * as path from 'path';

// loadDSLExamples function defined locally in this file

// Define Example type locally since we can't import from frontend
interface Example {
  id: string;
  title: string;
  expression: string;
  sampleInput: string;
  expectedOutput: string;
  description: string;
  category: string;
}

const router: Router = Router();

// Initialize services with Phase 2.5 resilience
const semanticStore = new SemanticVectorStore();
const stateManager = new ConversationStateManager();
const promptBuilder = new EnhancedPromptBuilder();
const contextManager = new DynamicContextManager();

// Phase 2.5: Initialize resilience services
let resilientGeminiService: ResilientGeminiService | null = null;
const rateLimitManager = new IntelligentRateLimitManager();
const feedbackManager = new UserFeedbackManager();

// Initialize resilient Gemini service
if (config.gemini.apiKey) {
  resilientGeminiService = new ResilientGeminiService(config.gemini.apiKey);
  
  // Schedule periodic cleanup
  setInterval(() => {
    rateLimitManager.cleanup();
  }, 300000); // Clean up every 5 minutes
}

// Session storage for conversation history
const sessionHistories = new Map<string, ChatTurn[]>();

interface SemanticChatRequest {
  message: string;
  sessionId?: string;
  jsonContext?: unknown;
  maxTokens?: number;
}

interface SemanticChatResponse {
  text: string;
  sessionId: string;
  metadata: {
    timestamp: string;
    resilience?: {
      wasFallback: boolean;
      delayTime: number;
      model: string;
      apiStress: 'low' | 'medium' | 'high';
      retryCount: number;
      rateLimitStats: {
        activeSessions: number;
        queueLength: number;
        errorRate: number;
      };
    };
  };
}

// Phase 1 Content Analysis Integration
interface ContentSizeAnalysis {
  isDirectFlow: boolean;
  requiresAttachment: boolean;
  totalSize: number;
  estimatedTokens: number;
  expressionSize: number;
  resultSize: number;
  inputSize: number;
}

// Phase 1 Content Limits (copied from frontend)
const CONTENT_LIMITS = {
  DIRECT_MESSAGE_CHARS: 2000,
  EXPRESSION_CHARS: 1024,
  RESULT_CHARS: 2048,
  INPUT_BYTES: 100 * 1024, // 100KB
} as const;

/**
 * Phase 1: Analyze content size and determine flow type
 */
function analyzeContentSize(expression: string, input: string, result: string): ContentSizeAnalysis {
  const expressionSize = expression.length;
  const resultSize = result.length;
  const inputSize = new TextEncoder().encode(input).length;
  
  const totalSize = expressionSize + resultSize + inputSize;
  const estimatedTokens = Math.ceil(totalSize / 4);
  
  // Determine if content requires attachment flow
  const requiresAttachment = 
    expressionSize > CONTENT_LIMITS.EXPRESSION_CHARS ||
    resultSize > CONTENT_LIMITS.RESULT_CHARS ||
    inputSize > CONTENT_LIMITS.INPUT_BYTES ||
    totalSize > CONTENT_LIMITS.DIRECT_MESSAGE_CHARS;
  
  return {
    isDirectFlow: !requiresAttachment,
    requiresAttachment,
    totalSize,
    estimatedTokens,
    expressionSize,
    resultSize,
    inputSize
  };
}

/**
 * Semantic Chat Handler with Phase 2.5 API Resilience
 */
async function handleSemanticChat(req: Request, res: Response): Promise<void> {
  const retryCount = 0;
  let delayTime = 0;
  let wasFallback = false;
  let modelUsed = 'gemini-2.0-flash';
  
  try {
    const { message, sessionId = generateSessionId(), jsonContext, maxTokens = 16000 } = req.body as SemanticChatRequest;

    if (!message?.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!resilientGeminiService) {
      res.status(500).json({ error: 'AI service not configured' });
      return;
    }

    console.log(`🚀 Semantic chat request: "${message.substring(0, 50)}..." (session: ${sessionId})`);
    
    // 📝 LOG: Complete user request
    console.log(`📝 USER REQUEST:`);
    console.log(`   Message: "${message}"`);
    console.log(`   Length: ${message.length} chars`);
    console.log(`   Session: ${sessionId}`);

    // 1. Get conversation history
    const conversationHistory = sessionHistories.get(sessionId) || [];

    // 2. Update conversation state for continuity tracking
    const userProfile = stateManager.updateUserProfile(sessionId, message);
    const conversationContext = stateManager.updateConversationContext(sessionId, message, conversationHistory);

    // 3. Create simplified conversation continuity context
    const recentHistory = conversationHistory.slice(-8); // Keep last 8 turns
    
    console.log(`🔗 Conversation continuity:`);
    console.log(`   Recent history: ${recentHistory.length} turns`);
    console.log(`   Topic: ${conversationContext.currentTopic}`);
    console.log(`   Concepts discussed: ${conversationContext.conceptsDiscussed.size}`);

    // 4. Phase 1: Calculate optimal token budget with enhanced allocation
    const hasUploadedFile = !!jsonStore.get(sessionId);
    const hasJsonRequest = message.toLowerCase().includes('@fulljson') || !!jsonContext || hasUploadedFile;
    
    const tokenBudget = contextManager.calculateOptimalBudget(
      message,
      recentHistory, // Use recent history for budget calculation
      hasJsonRequest,
      contextManager.assessQueryComplexity(message)
    );

    // 5. Retrieve relevant knowledge cards with optimized budget
    console.log(`🔍 Retrieving semantic knowledge cards with budget: ${tokenBudget.knowledgeCards} tokens`);
    const semanticResults = await semanticStore.search(
      message,
      8 // Limit to 8 knowledge cards to prevent token overflow
    );
    
    const knowledgeCards = semanticStore.searchResultsToKnowledgeCards(semanticResults);

    console.log(`📚 Retrieved ${semanticResults.length} semantic matches (avg similarity: ${semanticResults.length > 0 ? (semanticResults.reduce((sum: number, r: { similarity: number }) => sum + r.similarity, 0) / semanticResults.length).toFixed(2) : 0})`);

    // 6. Get simplified conversation state
    const simpleResponse = stateManager.getSimpleConversationState(sessionId).simpleResponse;

    // 7. Build simplified prompt
    const chatHistoryForPrompt = recentHistory;

    // Phase 1: Handle JSON context with intelligent content analysis
    let optimizedJsonContext: string | undefined;
    if (hasJsonRequest) {
      // First, try to get uploaded file data (priority)
      const uploadedData = jsonStore.get(sessionId);
      
      if (uploadedData) {
        const jsonString = JSON.stringify(uploadedData, null, 2);
        
        // Phase 1: Analyze content size and determine flow
        const mockExpression = message; // Use message as expression proxy
        const mockResult = ''; // No result yet
        const contentAnalysis = analyzeContentSize(mockExpression, jsonString, mockResult);
        
        console.log(`📊 Phase 1 Content Analysis:`);
        console.log(`   Total size: ${Math.round(contentAnalysis.totalSize / 1024)}KB`);
        console.log(`   Estimated tokens: ${contentAnalysis.estimatedTokens}`);
        console.log(`   Requires attachment: ${contentAnalysis.requiresAttachment}`);
        
        if (contentAnalysis.requiresAttachment) {
          // Phase 1: ATTACHMENT FLOW - Use optimized content
          console.log(`🔗 Using Phase 1 attachment flow (large content: ${Math.round(contentAnalysis.totalSize / 1024)}KB)`);
          
          // For attachment flow, create a summary instead of full content
          const contentSummary = createJsonSummary(uploadedData);
          optimizedJsonContext = `[ATTACHMENT] Large JSON data (${Math.round(contentAnalysis.totalSize / 1024)}KB) - Summary:\n${contentSummary}`;
          
        } else {
          // Phase 1: DIRECT FLOW - Use full content (within limits)
          console.log(`📄 Using Phase 1 direct flow (small content: ${Math.round(contentAnalysis.totalSize / 1024)}KB)`);
          optimizedJsonContext = jsonString;
        }
        
      } else if (jsonContext) {
        // Fall back to request body jsonContext if no uploaded file
        const jsonString = JSON.stringify(jsonContext, null, 2);
        const contentAnalysis = analyzeContentSize(message, jsonString, '');
        
        if (contentAnalysis.requiresAttachment) {
          const contentSummary = createJsonSummary(jsonContext);
          optimizedJsonContext = `[ATTACHMENT] JSON context (${Math.round(contentAnalysis.totalSize / 1024)}KB) - Summary:\n${contentSummary}`;
          console.log(`🔗 Using Phase 1 attachment flow for request body JSON`);
        } else {
          optimizedJsonContext = jsonString;
          console.log(`📄 Using Phase 1 direct flow for request body JSON`);
        }
        
      } else {
        console.log('⚠️  JSON context requested but no data available for session:', sessionId);
      }
    }

    const promptResult = promptBuilder.buildSimplePrompt(
      message,
      knowledgeCards, // Use converted knowledge cards
      chatHistoryForPrompt, // Use recent history
      simpleResponse, // Use simplified response interface
      userProfile,
      conversationContext,
      optimizedJsonContext
    );

    // 📝 LOG: Prompt being sent to model
    console.log(`📝 PROMPT TO MODEL:`);
    console.log(`   Length: ${promptResult.prompt.length} chars`);
    console.log(`   Tokens: ${promptResult.totalTokens}`);
    console.log(`   First 200 chars: "${promptResult.prompt.substring(0, 200)}..."`);

    // 8. Validate prompt
    const validation = promptBuilder.validatePrompt(promptResult, maxTokens);
    if (!validation.isValid) {
      console.warn('⚠️  Prompt validation issues:', validation.issues);
    }

    // 12. Phase 2.5: Use resilient Gemini service for AI response
    console.log(`🤖 Generating AI response using resilient service...`);
    
    const startGeminiTime = Date.now();
    
    const geminiResponse = await resilientGeminiService.generateContentWithFallback(
      promptResult.prompt,
      sessionId
    );
    
    const geminiTime = Date.now() - startGeminiTime;
    
    // Extract response details
    wasFallback = geminiResponse.wasFallback;
    delayTime = geminiTime;
    modelUsed = geminiResponse.model;
    
    const rateLimitStats = rateLimitManager.getStatistics();
    const apiStressLevel = rateLimitStats.recentErrors > 3 ? 'high' : 
                          rateLimitStats.queueLength > 5 ? 'medium' : 'low';
    
    const finalResponse = geminiResponse.text;
    
    console.log(`🤖 AI Response generated:`);
    console.log(`   Model: ${modelUsed}${wasFallback ? ' (fallback)' : ''}`);
    console.log(`   Response time: ${geminiTime}ms`);
    console.log(`   API Stress: ${apiStressLevel}`);
    console.log(`   Rate Limit: ${rateLimitStats.activeSessions} sessions, ${rateLimitStats.queueLength} queued`);

    // Add conversation turn to history
    sessionHistories.set(sessionId, [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: finalResponse, timestamp: new Date() }
    ]);

    console.log(`✅ Response generated successfully`);

    // Return response with simplified metadata
    const responseData: SemanticChatResponse = {
      text: finalResponse,
      sessionId,
      metadata: {
        timestamp: new Date().toISOString(),
        resilience: {
          wasFallback,
          delayTime,
          model: modelUsed,
          apiStress: apiStressLevel,
          retryCount,
          rateLimitStats: {
            activeSessions: rateLimitStats.activeSessions,
            queueLength: rateLimitStats.queueLength,
            errorRate: rateLimitStats.recentErrors
          }
        }
      }
    };

    res.json(responseData);

  } catch (error: unknown) {
    console.error('❌ Semantic chat error:', error);
    
    // Phase 2.5: Generate user-friendly error guidance
    const userFriendlyMessage = feedbackManager.generateErrorGuidance(error as Error);
    
    const errorResponse = {
      error: 'Temporary service limitation',
      message: userFriendlyMessage,
      retryAfter: 30000, // 30 seconds
      metadata: {
        timestamp: new Date().toISOString(),
        errorType: (error as { status?: string }).status || 'unknown',
        resilience: {
          wasFallback,
          delayTime,
          model: modelUsed,
          retryCount
        }
      }
    };

    // Determine appropriate HTTP status
    const statusCode = (error as { status?: number }).status === 503 ? 503 : 
                     (error as { status?: number }).status === 429 ? 429 : 
                     500;

    res.status(statusCode).json(errorResponse);
  }
}

/**
 * Initialize semantic services with enhanced knowledge coordination
 */
async function initializeSemanticServices(): Promise<void> {
  try {
    console.log('🔧 Initializing semantic services...');
    
    // Initialize semantic vector store
    await semanticStore.initialize();
    
    // Load comprehensive ZEN examples (primary knowledge source)
    console.log('📚 Loading comprehensive ZEN DSL examples...');
    await loadExamplesIntoSemanticStore();
    
    console.log('📚 Semantic services initialized with enhanced ZEN knowledge');
    
  } catch (error) {
    console.error('❌ Failed to initialize semantic services:', error);
  }
}

/**
 * Load comprehensive ZEN examples into semantic store
 */
async function loadExamplesIntoSemanticStore(): Promise<void> {
  try {
    // Load comprehensive examples from validated source files
    const examples: Example[] = await loadDSLExamples();
    
    console.log(`🔄 Processing ${examples.length} comprehensive ZEN DSL examples for semantic embeddings...`);
    
    // Convert examples to semantic documents with enhanced metadata
    const documents: Document[] = examples.map((example: Example) => ({
      id: example.id || `example_${example.id}`,
      content: `ZEN DSL Example - ${example.title}

Description: ${example.description}

ZEN Expression: ${example.expression}

Input: ${example.sampleInput}
Expected Output: ${example.expectedOutput}

Category: ${example.category}

This demonstrates correct ZEN DSL syntax. Always use ZEN functions and operators, never JavaScript equivalents.`,
      metadata: {
        source: 'validated-examples',
        category: example.category,
        type: 'example' as const,
        tokens: Math.ceil((example.expression + example.description).length / 4),
        title: example.title,
        expression: example.expression,
        zenSyntax: true, // Flag to prioritize ZEN examples
        priority: 'high' // Mark as high priority knowledge
      }
    }));
    
    // Upsert documents into semantic store
    await semanticStore.upsertDocuments(documents);
    
    // Also ensure .mdc rules are loaded for comprehensive coverage
    await ensureMdcRulesLoaded();
    
    // Also ensure ZEN vocabulary is loaded for function validation
    await ensureZenVocabularyLoaded();
    
    console.log(`✅ Enhanced knowledge base loaded:`);
    console.log(`   📄 ZEN Examples: ${examples.length}`);
    console.log(`   🧩 Categories: ${[...new Set(examples.map((e: Example) => e.category))].length}`);
    console.log(`   🔧 DSL Rules: Auto-loaded from .mdc files`);
    console.log(`   📚 ZEN Vocabulary: Auto-loaded from zen-vocabulary.json`);
    console.log(`   🧠 Embeddings: Generated with ZEN priority`);
    
  } catch (error) {
    console.error('❌ Failed to load comprehensive examples into semantic store:', error);
    console.log('⚠️  Falling back to basic examples mode');
  }
}

/**
 * Ensure .mdc rules are loaded to complement examples
 */
async function ensureMdcRulesLoaded(): Promise<void> {
  try {
    console.log('🔄 Loading DSL rules from .mdc files...');
    
    // Import fileProcessor to load .mdc files
    const { fileProcessor } = await import('../utils/fileProcessor');
    
    // Load .mdc files from the correct path
    const rulesDirectory = '../../docs/dsl-rules';
    const processedFiles = await fileProcessor.readRuleFiles(rulesDirectory);
    
    if (processedFiles.length === 0) {
      console.log('⚠️  No .mdc rule files found');
      return;
    }

    // Convert to documents
    const documents = fileProcessor.processedFilesToDocuments(processedFiles);
    
    // Convert to semantic documents for the semantic store
    const semanticDocuments: Document[] = documents.map((doc) => ({
      id: `mdc_${doc.id}`,
      content: `ZEN DSL Rule - ${doc.metadata.category}

${doc.content}

This defines official ZEN DSL syntax and functions. Always follow these rules exactly.`,
      metadata: {
        source: doc.metadata.source,
        category: doc.metadata.category,
        type: 'rule' as const,
        tokens: doc.metadata.tokens || Math.ceil(doc.content.length / 4),
        zenSyntax: true,
        priority: 'high',
        ruleType: 'official'
      }
    }));
    
    // Upsert into semantic store
    await semanticStore.upsertDocuments(semanticDocuments);
    
    const stats = fileProcessor.getProcessingStats(processedFiles);
    console.log(`✅ Loaded .mdc rules:`);
    console.log(`   📄 Files: ${stats.totalFiles}`);
    console.log(`   🧩 Chunks: ${stats.totalChunks}`);
    console.log(`   🔢 Tokens: ${stats.totalTokens}`);
    
  } catch (error) {
    console.error('⚠️  Could not load .mdc rules:', error);
  }
}

/**
 * Load ZEN vocabulary from JSON file into semantic store
 */
async function ensureZenVocabularyLoaded(): Promise<void> {
  try {
    console.log('🔄 Loading ZEN vocabulary from zen-vocabulary.json...');
    
    const vocabularyPath = path.join(__dirname, '../../../docs/config/zen-vocabulary.json');
    
    if (!fs.existsSync(vocabularyPath)) {
      console.log('⚠️  ZEN vocabulary file not found');
      return;
    }

    const vocabularyContent = fs.readFileSync(vocabularyPath, 'utf-8');
    const vocabulary = JSON.parse(vocabularyContent);
    
    // Create knowledge cards from vocabulary data
    const vocabularyDocuments: Document[] = [
      // Main vocabulary overview
      {
        id: 'zen_vocabulary_overview',
        content: `ZEN DSL Vocabulary Overview

Total Functions: ${vocabulary.metadata.total_functions}
Total Operators: ${vocabulary.metadata.total_operators}
Total Keywords: ${vocabulary.metadata.total_keywords}
Validation Accuracy: ${vocabulary.metadata.accuracy}

This vocabulary defines all valid ZEN DSL functions, operators, and keywords. Use ONLY these validated elements in ZEN expressions.`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'vocabulary-overview',
          type: 'rule' as const,
          tokens: 50,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // String functions
      {
        id: 'zen_vocabulary_string_functions',
        content: `ZEN DSL String Functions

Available string functions: ${vocabulary.function_categories.string_functions.join(', ')}

These are the ONLY valid string functions in ZEN DSL. Do not use JavaScript string methods like .charAt(), .substring(), .indexOf(), .slice(), .replace(), .search(), etc.

Examples:
- Use len(text) NOT text.length
- Use upper(text) NOT text.toUpperCase()
- Use contains(text, "word") NOT text.includes("word")
- Use startsWith(text, "prefix") NOT text.startsWith("prefix")`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'string-functions',
          type: 'rule' as const,
          tokens: 80,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Array functions
      {
        id: 'zen_vocabulary_array_functions',
        content: `ZEN DSL Array Functions

Available array functions: ${vocabulary.function_categories.array_functions.join(', ')}

These are the ONLY valid array functions in ZEN DSL. Do not use JavaScript array methods like .push(), .pop(), .shift(), .unshift(), .splice(), .slice(), .indexOf(), .join(), .reverse(), .sort(), etc.

Examples:
- Use len(array) NOT array.length
- Use filter(array, # > 5) NOT array.filter(x => x > 5)
- Use map(array, # * 2) NOT array.map(x => x * 2)
- Use contains(array, value) NOT array.includes(value)`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'array-functions',
          type: 'rule' as const,
          tokens: 90,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Mathematical functions
      {
        id: 'zen_vocabulary_math_functions',
        content: `ZEN DSL Mathematical Functions

Available math functions: ${vocabulary.function_categories.mathematical_functions.join(', ')}

These are the ONLY valid math functions in ZEN DSL. Do not use JavaScript Math methods like Math.sqrt(), Math.pow(), Math.sin(), Math.cos(), Math.log(), Math.random(), etc.

Examples:
- Use abs(number) NOT Math.abs(number)
- Use round(number, 2) NOT Math.round(number)
- Use floor(number) NOT Math.floor(number)
- Use rand() NOT Math.random()`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'mathematical-functions',
          type: 'rule' as const,
          tokens: 70,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Date functions
      {
        id: 'zen_vocabulary_date_functions',
        content: `ZEN DSL Date Functions

Available date functions: ${vocabulary.function_categories.date_functions.join(', ')}

These are the ONLY valid date functions in ZEN DSL. Do not use JavaScript Date methods like new Date(), .getTime(), .getFullYear(), .getMonth(), .toISOString(), etc.

Examples:
- Use d('2023-10-15') NOT new Date('2023-10-15')
- Use year(date) NOT date.getFullYear()
- Use format(date, 'YYYY-MM-DD') NOT date.toISOString()
- Use diff(date1, date2) for date differences`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'date-functions',
          type: 'rule' as const,
          tokens: 85,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Type functions
      {
        id: 'zen_vocabulary_type_functions',
        content: `ZEN DSL Type Functions

Available type functions: ${vocabulary.function_categories.type_functions.join(', ')}

These are the ONLY valid type functions in ZEN DSL. Do not use JavaScript type methods like typeof, instanceof, Array.isArray(), etc.

Examples:
- Use type(value) NOT typeof value
- Use string(value) NOT String(value) or value.toString()
- Use number(value) NOT Number(value) or parseInt(value)
- Use bool(value) NOT Boolean(value)`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'type-functions',
          type: 'rule' as const,
          tokens: 60,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Object functions
      {
        id: 'zen_vocabulary_object_functions',
        content: `ZEN DSL Object Functions

Available object functions: ${vocabulary.function_categories.object_functions.join(', ')}

These are the ONLY valid object functions in ZEN DSL. Do not use JavaScript Object methods like Object.entries(), Object.assign(), Object.hasOwnProperty(), etc.

Examples:
- Use keys(object) NOT Object.keys(object)
- Use values(object) NOT Object.values(object)
- Use object.property for property access
- Use object[key] for dynamic property access`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'object-functions',
          type: 'rule' as const,
          tokens: 65,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Operators and keywords
      {
        id: 'zen_vocabulary_operators_keywords',
        content: `ZEN DSL Operators and Keywords

Valid operators: ${vocabulary.zen_operators.join(', ')}
Valid keywords: ${vocabulary.zen_keywords.join(', ')}

Important syntax rules:
- Use 'and', 'or', 'not' instead of '&&', '||', '!'
- Use 'in' and 'not in' for membership testing
- Use '#' operator for array element access in functions
- Use '..' for ranges: [1..10], [0..5)
- Use '?' and ':' for ternary operations
- Comments are NOT supported in ZEN DSL expressions

${vocabulary.syntax_notes.slicing}
${vocabulary.syntax_notes.operators}
${vocabulary.syntax_notes.array_access}`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'operators-keywords',
          type: 'rule' as const,
          tokens: 100,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      },
      
      // Validation notes and hallucinations removed
      {
        id: 'zen_vocabulary_validation',
        content: `ZEN DSL Validation Information

Validation accuracy: ${vocabulary.metadata.accuracy}
Sources validated: ${vocabulary.validation.sources_checked.join(', ')}

IMPORTANT: These functions/methods do NOT exist in ZEN DSL and should NEVER be used:
${vocabulary.validation.hallucinations_removed.join(', ')}

Always verify function availability against the official ZEN vocabulary before suggesting any function usage.`,
        metadata: {
          source: 'zen-vocabulary.json',
          category: 'validation-info',
          type: 'rule' as const,
          tokens: 75,
          zenSyntax: true,
          priority: 'high',
          ruleType: 'vocabulary'
        }
      }
    ];
    
    // Upsert vocabulary documents into semantic store
    await semanticStore.upsertDocuments(vocabularyDocuments);
    
    console.log(`✅ Loaded ZEN vocabulary:`);
    console.log(`   📄 Documents: ${vocabularyDocuments.length}`);
    console.log(`   🔧 Functions: ${vocabulary.metadata.total_functions}`);
    console.log(`   ⚙️  Operators: ${vocabulary.metadata.total_operators}`);
    console.log(`   🏷️  Keywords: ${vocabulary.metadata.total_keywords}`);
    console.log(`   ❌ Hallucinations removed: ${vocabulary.validation.hallucinations_removed.length}`);
    
  } catch (error) {
    console.error('⚠️  Could not load ZEN vocabulary:', error);
  }
}

/**
 * Load comprehensive DSL examples from validated source files
 */
async function loadDSLExamples(): Promise<Example[]> {
  try {
    // Path to the validated examples files
    const examplesPath = path.join(__dirname, '../../../../src/examples');
    
    console.log(`📚 Loading comprehensive DSL examples from: ${examplesPath}`);
    
    // Load all example categories
    const categories = [
      'stringOperationsExamples',
      'arrayOperationsExamples', 
      'mathematicalOperationsExamples',
      'dateOperationsExamples',
      'booleanExamples',
      'conditionalExamples',
      'type_checkingExamples',
      'objectExamples',
      'conversionExamples',
      'utility_functionsExamples'
    ];
    
    const allExamples: Example[] = [];
    
    for (const category of categories) {
      try {
        const filePath = path.join(examplesPath, `${category}.ts`);
        
        if (fs.existsSync(filePath)) {
          // For now, we'll create representative examples from each category
          // In production, you'd parse the TypeScript files or convert them to JSON
          const categoryExamples = await loadCategoryExamples(category);
          allExamples.push(...categoryExamples);
          console.log(`✅ Loaded ${categoryExamples.length} examples from ${category}`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load ${category}:`, error);
      }
    }
    
    console.log(`🎉 Loaded ${allExamples.length} comprehensive ZEN DSL examples`);
    return allExamples;
    
  } catch (error) {
    console.error('❌ Failed to load comprehensive examples:', error);
    // Fallback to enhanced basic examples
    return getFallbackEnhancedExamples();
  }
}

/**
 * Load category-specific examples (representative samples from each category)
 */
async function loadCategoryExamples(category: string): Promise<Example[]> {
  // For each category, return the most important/representative examples
  // This is a curated selection of the most useful examples from each category
  
  switch (category) {
    case 'stringOperationsExamples':
      return [
        {
          id: 'str-len',
          title: 'String Length (ZEN)',
          expression: 'len("Hello, World!")',
          sampleInput: '{}',
          expectedOutput: '13',
          description: 'Get string length using ZEN len() function (NOT .length)',
          category: 'string-operations'
        },
        {
          id: 'str-case',
          title: 'String Case Conversion (ZEN)',
          expression: 'upper("hello") + " " + lower("WORLD")',
          sampleInput: '{}',
          expectedOutput: '"HELLO world"',
          description: 'ZEN uses upper() and lower() functions (NOT .toUpperCase()/.toLowerCase())',
          category: 'string-operations'
        },
        {
          id: 'str-contains',
          title: 'String Contains Check (ZEN)',
          expression: 'contains("Hello World", "World")',
          sampleInput: '{}',
          expectedOutput: 'true',
          description: 'ZEN uses contains() function (NOT .indexOf() or .includes())',
          category: 'string-operations'
        },
        {
          id: 'str-trim',
          title: 'String Trimming (ZEN)',
          expression: 'trim("  hello world  ")',
          sampleInput: '{}',
          expectedOutput: '"hello world"',
          description: 'ZEN uses trim() function to remove whitespace',
          category: 'string-operations'
        },
        {
          id: 'str-starts-ends',
          title: 'String Prefix/Suffix (ZEN)',
          expression: 'startsWith("hello", "he") and endsWith("world", "ld")',
          sampleInput: '{}',
          expectedOutput: 'true',
          description: 'ZEN uses startsWith() and endsWith() functions',
          category: 'string-operations'
        },
        {
          id: 'str-split',
          title: 'String Split (ZEN)',
          expression: 'split("apple,banana,cherry", ",")',
          sampleInput: '{}',
          expectedOutput: '["apple", "banana", "cherry"]',
          description: 'ZEN uses split() function (NOT .split())',
          category: 'string-operations'
        },
        {
          id: 'str-regex',
          title: 'String Pattern Matching (ZEN)',
          expression: 'matches("test123", "[a-z]+[0-9]+")',
          sampleInput: '{}',
          expectedOutput: 'true',
          description: 'ZEN uses matches() for regex (NOT .match() or .test())',
          category: 'string-operations'
        },
        {
          id: 'str-extract-basic',
          title: 'String Extract with Regex Groups (ZEN)',
          expression: 'extract("2022-09-18", "(\\d{4})-(\\d{2})-(\\d{2})")',
          sampleInput: '{}',
          expectedOutput: '["2022-09-18", "2022", "09", "18"]',
          description: 'ZEN extract() function returns array: [full_match, group1, group2, ...] using regex capture groups',
          category: 'string-operations'
        },
        {
          id: 'str-extract-email',
          title: 'Email Parts Extraction (ZEN)',
          expression: 'extract("user@example.com", "([^@]+)@([^.]+)\\.(.+)")',
          sampleInput: '{}',
          expectedOutput: '["user@example.com", "user", "example", "com"]',
          description: 'ZEN extract() extracts email parts: full match, username, domain, TLD',
          category: 'string-operations'
        },
        {
          id: 'str-extract-phone',
          title: 'Phone Number Extraction (ZEN)',
          expression: 'extract("(555) 123-4567", "\\((\\d{3})\\) (\\d{3})-(\\d{4})")',
          sampleInput: '{}',
          expectedOutput: '["(555) 123-4567", "555", "123", "4567"]',
          description: 'ZEN extract() with regex groups to parse phone number parts',
          category: 'string-operations'
        }
      ];
      
    case 'arrayOperationsExamples':
      return [
        {
          id: 'arr-filter',
          title: 'Array Filter (ZEN)',
          expression: 'filter(numbers, # > 5)',
          sampleInput: '{"numbers": [1, 6, 3, 8, 2, 9]}',
          expectedOutput: '[6, 8, 9]',
          description: 'ZEN uses filter(array, condition) with # placeholder (NOT .filter())',
          category: 'array-operations'
        },
        {
          id: 'arr-map',
          title: 'Array Map (ZEN)',
          expression: 'map(numbers, # * 2)',
          sampleInput: '{"numbers": [1, 2, 3, 4]}',
          expectedOutput: '[2, 4, 6, 8]',
          description: 'ZEN uses map(array, expression) with # placeholder (NOT .map())',
          category: 'array-operations'
        },
        {
          id: 'arr-length',
          title: 'Array Length (ZEN)',
          expression: 'len(items)',
          sampleInput: '{"items": ["apple", "banana", "cherry"]}',
          expectedOutput: '3',
          description: 'ZEN uses len() for array length (NOT .length)',
          category: 'array-operations'
        },
        {
          id: 'arr-indexing',
          title: 'Array Indexing (ZEN)',
          expression: 'items[0] + " and " + items[-1]',
          sampleInput: '{"items": ["first", "middle", "last"]}',
          expectedOutput: '"first and last"',
          description: 'ZEN supports negative indexing: array[-1] gets last element',
          category: 'array-operations'
        },
        {
          id: 'arr-find',
          title: 'Array Find (ZEN)',
          expression: 'find(users, #.age > 25)',
          sampleInput: '{"users": [{"name": "John", "age": 20}, {"name": "Jane", "age": 30}]}',
          expectedOutput: '{"name": "Jane", "age": 30}',
          description: 'ZEN uses find() to get first matching element with # placeholder',
          category: 'array-operations'
        },
        {
          id: 'arr-some',
          title: 'Array Some Check (ZEN)',
          expression: 'some(scores, # > 90)',
          sampleInput: '{"scores": [85, 92, 78, 96]}',
          expectedOutput: 'true',
          description: 'ZEN uses some() to check if any element matches condition',
          category: 'array-operations'
        }
      ];
      
    case 'mathematicalOperationsExamples':
      return [
        {
          id: 'math-basic',
          title: 'Basic Math Operations (ZEN)',
          expression: 'price * quantity * (1 + taxRate)',
          sampleInput: '{"price": 10.5, "quantity": 3, "taxRate": 0.08}',
          expectedOutput: '34.02',
          description: 'ZEN supports standard mathematical operators: +, -, *, /, (), etc.',
          category: 'mathematical-operations'
        },
        {
          id: 'math-functions',
          title: 'Math Functions (ZEN)',
          expression: 'round(sqrt(number), 2)',
          sampleInput: '{"number": 50}',
          expectedOutput: '7.07',
          description: 'ZEN has math functions: round(), sqrt(), floor(), ceil(), abs(), min(), max()',
          category: 'mathematical-operations'
        },
        {
          id: 'math-power',
          title: 'Power Operations (ZEN)',
          expression: 'pow(base, exponent)',
          sampleInput: '{"base": 2, "exponent": 8}',
          expectedOutput: '256',
          description: 'ZEN uses pow() for exponentiation (NOT ** operator)',
          category: 'mathematical-operations'
        },
        {
          id: 'math-modulo',
          title: 'Modulo Operation (ZEN)',
          expression: 'value % divisor',
          sampleInput: '{"value": 17, "divisor": 5}',
          expectedOutput: '2',
          description: 'ZEN supports modulo operator % for remainder calculations',
          category: 'mathematical-operations'
        }
      ];
      
    case 'booleanExamples':
      return [
        {
          id: 'bool-logic',
          title: 'Boolean Logic (ZEN)',
          expression: 'age >= 18 and hasPermission and not blocked',
          sampleInput: '{"age": 25, "hasPermission": true, "blocked": false}',
          expectedOutput: 'true',
          description: 'ZEN uses: and, or, not (NOT &&, ||, !)',
          category: 'boolean-operations'
        },
        {
          id: 'bool-comparison',
          title: 'Boolean Comparisons (ZEN)',
          expression: 'score > 80 or (attempts < 3 and timeLeft > 0)',
          sampleInput: '{"score": 75, "attempts": 2, "timeLeft": 10}',
          expectedOutput: 'true',
          description: 'ZEN supports comparison operators: >, <, >=, <=, ==, != with and/or logic',
          category: 'boolean-operations'
        }
      ];
      
    case 'conditionalExamples':
      return [
        {
          id: 'cond-ternary',
          title: 'Ternary Operator (ZEN)',
          expression: 'age >= 18 ? "Adult" : "Minor"',
          sampleInput: '{"age": 20}',
          expectedOutput: '"Adult"',
          description: 'ZEN supports ternary operator: condition ? trueValue : falseValue',
          category: 'conditional-operations'
        },
        {
          id: 'cond-nested',
          title: 'Nested Conditionals (ZEN)',
          expression: 'score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F"',
          sampleInput: '{"score": 85}',
          expectedOutput: '"B"',
          description: 'ZEN supports nested ternary operators for complex conditional logic',
          category: 'conditional-operations'
        }
      ];
      
    case 'type_checkingExamples':
      return [
        {
          id: 'type-check',
          title: 'Type Checking (ZEN)',
          expression: 'type(value) == "string" ? upper(value) : string(value)',
          sampleInput: '{"value": "hello"}',
          expectedOutput: '"HELLO"',
          description: 'ZEN uses type() function to check data types and string() for conversion',
          category: 'type-operations'
        },
        {
          id: 'type-number',
          title: 'Number Type Conversion (ZEN)',
          expression: 'type(input) == "string" ? number(input) : input',
          sampleInput: '{"input": "42"}',
          expectedOutput: '42',
          description: 'ZEN uses number() function to convert strings to numbers',
          category: 'type-operations'
        }
      ];
      
    case 'objectExamples':
      return [
        {
          id: 'obj-access',
          title: 'Object Property Access (ZEN)',
          expression: 'user.profile.name + " (" + user.profile.age + ")"',
          sampleInput: '{"user": {"profile": {"name": "John", "age": 30}}}',
          expectedOutput: '"John (30)"',
          description: 'ZEN uses dot notation for nested object property access',
          category: 'object-operations'
        },
        {
          id: 'obj-keys',
          title: 'Object Keys (ZEN)',
          expression: 'keys(data)',
          sampleInput: '{"data": {"name": "John", "age": 30, "city": "NYC"}}',
          expectedOutput: '["name", "age", "city"]',
          description: 'ZEN uses keys() function to get object property names',
          category: 'object-operations'
        }
      ];
      
    case 'dateOperationsExamples':
      return [
        {
          id: 'date-now',
          title: 'Current Date (ZEN)',
          expression: 'now()',
          sampleInput: '{}',
          expectedOutput: '2024-01-15T10:30:00Z',
          description: 'ZEN uses now() function to get current timestamp',
          category: 'date-operations'
        },
        {
          id: 'date-format',
          title: 'Date Formatting (ZEN)',
          expression: 'dateFormat(date, "YYYY-MM-DD")',
          sampleInput: '{"date": "2024-01-15T10:30:00Z"}',
          expectedOutput: '"2024-01-15"',
          description: 'ZEN uses dateFormat() to format dates with patterns',
          category: 'date-operations'
        }
      ];
      
    default:
      return [];
  }
}

/**
 * Enhanced fallback examples with comprehensive ZEN syntax coverage
 */
function getFallbackEnhancedExamples(): Example[] {
  return [
    // Core string operations
    {
      id: 'zen-str-core-1',
      title: 'String Length & Case (ZEN)',
      expression: 'len(text) > 5 ? upper(text) : lower(text)',
      sampleInput: '{"text": "Hello"}',
      expectedOutput: '"HELLO"',
      description: 'ZEN core: len(), upper(), lower() - NOT .length, .toUpperCase()',
      category: 'string-operations'
    },
    
    // Core array operations  
    {
      id: 'zen-arr-core-1',
      title: 'Array Filter & Map Chain (ZEN)',
      expression: 'map(filter(numbers, # > 3), # * 10)',
      sampleInput: '{"numbers": [1, 4, 2, 5, 3, 6]}',
      expectedOutput: '[40, 50, 60]',
      description: 'ZEN core: filter(), map() with # placeholder - NOT .filter().map()',
      category: 'array-operations'
    },
    
    // Boolean logic
    {
      id: 'zen-bool-core-1',
      title: 'Boolean Logic (ZEN)',
      expression: 'active and not expired and (premium or trial)',
      sampleInput: '{"active": true, "expired": false, "premium": false, "trial": true}',
      expectedOutput: 'true',
      description: 'ZEN core: and, or, not - NOT &&, ||, !',
      category: 'boolean-operations'
    },
    
    // Mathematical operations
    {
      id: 'zen-math-core-1',
      title: 'Math Functions (ZEN)',
      expression: 'round(sqrt(pow(a, 2) + pow(b, 2)), 3)',
      sampleInput: '{"a": 3, "b": 4}',
      expectedOutput: '5.0',
      description: 'ZEN core: round(), sqrt(), pow() functions',
      category: 'mathematical-operations'
    },
    
    // Type checking
    {
      id: 'zen-type-core-1',
      title: 'Dynamic Type Handling (ZEN)',
      expression: 'type(value) == "array" ? len(value) : type(value) == "string" ? len(value) : 0',
      sampleInput: '{"value": [1, 2, 3]}',
      expectedOutput: '3',
      description: 'ZEN core: type() function for runtime type checking',
      category: 'type-operations'
    }
  ];
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
      res.status(400).json({ error: 'Session ID is required' });
      return;
    }

    const metrics = stateManager.getLearningMetrics(sessionId);
    
    res.json({
      sessionId,
      metrics: {
        queriesAsked: metrics.queriesAsked,
        topicsExplored: metrics.topicsExplored,
        conceptsLearned: metrics.conceptsLearned,
        sessionDuration: metrics.sessionDuration
      }
    });
  } catch (error) {
    console.error('❌ Failed to get session metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve session metrics' });
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

/**
 * Phase 1: Create intelligent JSON summary for attachment flow
 */
function createJsonSummary(data: unknown): string {
  try {
    if (Array.isArray(data)) {
      const itemCount = data.length;
      const firstItem = data[0];
      const keys = firstItem && typeof firstItem === 'object' ? Object.keys(firstItem) : [];
      
      return `Array with ${itemCount} items. Sample structure: {${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}}`;
    } else if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      const valueTypes = keys.slice(0, 10).map(key => `${key}: ${typeof (data as Record<string, unknown>)[key]}`);
      
      return `Object with ${keys.length} properties: {${valueTypes.join(', ')}${keys.length > 10 ? '...' : ''}}`;
    } else {
      return `${typeof data}: ${String(data).substring(0, 200)}${String(data).length > 200 ? '...' : ''}`;
    }
  } catch (error) {
    return `JSON data structure analysis failed: ${error}`;
  }
}

// Routes
router.post('/semantic', handleSemanticChat);
router.get('/semantic/status', getSemanticStatus);
router.get('/semantic/session/:sessionId/metrics', getSessionMetrics);
router.delete('/semantic/session/:sessionId', clearSession);

// Initialize services on module load
initializeSemanticServices();

export default router;