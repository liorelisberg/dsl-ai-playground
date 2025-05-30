import { Router, Request, Response } from 'express';
import { chatService } from '../services/chat';
import { geminiService } from '../services/gemini';
import { vectorStore } from '../services/vectorStore';
import { rateLimiter, lengthGuard, tpmGuard } from '../middleware/rate-limiter';
import { attachSession } from '../middleware/session';
import { jsonStore } from './upload';

const router: Router = Router();

const chatHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid message' });
      return;
    }

    // Get chat history
    const history = chatService.getHistory(req.sessionId);

    // 🎯 NEW: Retrieve relevant knowledge from vector store
    const knowledgeCards = await retrieveKnowledgeCards(message);
    
    // 🎯 NEW: Get uploaded JSON context if available
    const jsonContext = jsonStore.get(req.sessionId);
    
    // 🎯 NEW: Generate context-enhanced response with JSON context
    const geminiResponse = await geminiService.generateContextualResponse(
      message, 
      history, 
      knowledgeCards,
      jsonContext
    );
    
    if (geminiResponse.error) {
      console.error('Gemini API Error:', geminiResponse.error);
      // Still return the fallback response to user
    }

    // Store the interaction
    chatService.addTurn(req.sessionId, 'user', message);
    chatService.addTurn(req.sessionId, 'assistant', geminiResponse.text);

    res.json({ text: geminiResponse.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieve relevant knowledge cards for the user's query
 */
async function retrieveKnowledgeCards(query: string): Promise<KnowledgeCard[]> {
  try {
    const searchResults = await vectorStore.search(query, 6);
    const knowledgeCards = vectorStore.searchResultsToKnowledgeCards(searchResults);
    
    console.log(`Retrieved ${knowledgeCards.length} knowledge cards for query: "${query.substring(0, 50)}..."`);
    return knowledgeCards;
  } catch (error) {
    console.error('Failed to retrieve knowledge cards:', error);
    return []; // Return empty array on error - graceful degradation
  }
}

// Knowledge card interface for type safety
interface KnowledgeCard {
  id: string;
  content: string;
  source: string;
  category: string;
  relevanceScore: number;
}

// @ts-ignore - Express v5 typing issue
router.post('/chat', attachSession, lengthGuard, tpmGuard, rateLimiter, chatHandler);

export default router; 