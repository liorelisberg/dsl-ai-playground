interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatHistory {
  turns: ChatTurn[];
  lastAccess: number;
}

class ChatService {
  private histories: Map<string, ChatHistory> = new Map();
  private readonly MAX_TURNS = 4;
  private readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Cleanup old sessions periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  public addTurn(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const history = this.histories.get(sessionId) || { turns: [], lastAccess: Date.now() };
    
    history.turns.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Keep only the last MAX_TURNS
    if (history.turns.length > this.MAX_TURNS) {
      history.turns = history.turns.slice(-this.MAX_TURNS);
    }

    history.lastAccess = Date.now();
    this.histories.set(sessionId, history);
  }

  public getHistory(sessionId: string): ChatTurn[] {
    const history = this.histories.get(sessionId);
    if (!history) return [];
    
    history.lastAccess = Date.now();
    return [...history.turns];
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [sessionId, history] of this.histories.entries()) {
      if (now - history.lastAccess > this.CLEANUP_INTERVAL) {
        this.histories.delete(sessionId);
      }
    }
  }
}

export const chatService = new ChatService(); 