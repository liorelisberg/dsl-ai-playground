import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import { JsonMetadata } from './JsonUpload';
import { GlobalDragDropZone } from './GlobalDragDropZone';
import { ThemeToggle } from '../ui/theme-toggle';
import { ChatMessage } from '../../types/chat';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import { useToast } from '../../hooks/use-toast';
import { SessionProvider } from '../../contexts/SessionContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Interface for CodeEditor ref methods */
interface CodeEditorRef {
  handleChatTransfer: (expression: string, input: string) => void;
}

/** Parser evaluation data structure */
interface ParserEvaluationData {
  expression: string;
  input: string;
  result: string;
  isSuccess: boolean;
  isEmpty?: boolean;
}

/** Custom event detail for parser-to-chat communication */
interface ParserToChatEventDetail extends ParserEvaluationData {
  prompt: string;
}

/** Custom event for parser-to-chat communication */
type ParserToChatEvent = CustomEvent<ParserToChatEventDetail>;

// ============================================================================
// CONSTANTS
// ============================================================================

/** Event name for parser-to-chat communication */
const PARSER_TO_CHAT_EVENT = 'dsl:parser-to-chat' as const;

/** Maximum number of chat messages to keep in history */
const MAX_CHAT_HISTORY = 8;

/** Welcome message for new users */
const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Welcome to the ZEN DSL AI Playground! 🚀\n\nI\'m your intelligent DSL assistant, here to help you master ZEN expressions and data processing.',
  timestamp: new Date().toISOString()
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a contextual prompt based on expression evaluation results
 */
const generatePrompt = (data: ParserEvaluationData): string => {
  const { expression, input, result, isSuccess, isEmpty } = data;
  
  if (!isSuccess) {
    return `I have a failing expression, explain why it fails.\n\nExpression: ${expression}\n\nInput: ${input}\n\nError: ${result}`;
  }
  
  if (isEmpty) {
    return `I have an expression that runs successfully but returns an empty result. Please explain why the result is empty and how to fix it.\n\nExpression: ${expression}\n\nInput: ${input}\n\nResult: ${result}\n\nThe expression executed without errors but produced an empty/null result. What could be the reasons and how can I modify the expression to get the expected data?`;
  }
  
  return `I have a working expression, explain it.\n\nExpression: ${expression}\n\nInput: ${input}\n\nResult: ${result}`;
};

/**
 * Create a system message with consistent formatting
 */
const createSystemMessage = (content: string): ChatMessage => ({
  role: 'assistant',
  content,
  timestamp: new Date().toISOString()
});

/**
 * Format JSON keys for display
 */
const formatJsonKeys = (keys: string[]): string => {
  if (keys.length === 0) return 'none';
  if (keys.length <= 3) return keys.join(', ');
  return `${keys.slice(0, 3).join(', ')} and ${keys.length - 3} more`;
};

// ============================================================================
// MAIN COMPONENT (without SessionProvider - will be wrapped)
// ============================================================================

const DSLTutorCore: React.FC = () => {
  // ========================================================================
  // STATE & REFS
  // ========================================================================
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [currentJsonFile, setCurrentJsonFile] = useState<JsonMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { isOnline, isApiHealthy } = useConnectionStatus();
  const { toast } = useToast();
  
  const chatInputSetterRef = useRef<React.Dispatch<React.SetStateAction<string>> | null>(null);
  const codeEditorRef = useRef<CodeEditorRef | null>(null);

  // ========================================================================
  // MEMOIZED VALUES
  // ========================================================================
  
  const connectionStatus = useMemo(() => ({ isOnline, isApiHealthy }), [isOnline, isApiHealthy]);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  /**
   * Add a new message to chat history with automatic pruning
   */
  const handleNewMessage = useCallback((message: ChatMessage) => {
    setChatHistory(prev => {
      const newHistory = [...prev, message];
      return newHistory.slice(-MAX_CHAT_HISTORY);
    });
  }, []);

  /**
   * Handle parser-to-chat communication using event-driven architecture
   */
  const handleParserToChat = useCallback(async (
    expression: string, 
    input: string, 
    result: string, 
    isSuccess: boolean, 
    isEmpty?: boolean
  ) => {
    const data: ParserEvaluationData = { expression, input, result, isSuccess, isEmpty };
    const prompt = generatePrompt(data);
    
    // Dispatch custom event for loose coupling
    const event = new CustomEvent(PARSER_TO_CHAT_EVENT, {
      detail: { ...data, prompt }
    }) as ParserToChatEvent;
    
    window.dispatchEvent(event);
    
    // Note: Toast feedback is handled by CodeEditor for better UX messaging
  }, []);

  /**
   * Capture chat input setter for cross-component communication
   */
  const handleSetInputMessage = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => {
    chatInputSetterRef.current = setter;
  }, []);

  /**
   * Handle chat-to-parser expression transfer
   */
  const handleChatToParser = useCallback((expression: string, input: string) => {
    codeEditorRef.current?.handleChatTransfer(expression, input);
  }, []);

  /**
   * Handle successful JSON file upload
   */
  const handleJsonUploadSuccess = useCallback((metadata: JsonMetadata) => {
    setCurrentJsonFile(metadata);
    
    const message = createSystemMessage(
      `✅ **JSON Context Added!**\n\nI now have access to your **${metadata.filename}** file with ${metadata.topLevelKeys?.length || 0} top-level keys. This will help me provide more relevant DSL examples and suggestions tailored to your data structure.\n\n**Available keys:** ${formatJsonKeys(metadata.topLevelKeys || [])}`
    );
    
    handleNewMessage(message);
  }, [handleNewMessage]);

  /**
   * Handle JSON file upload errors
   */
  const handleJsonUploadError = useCallback((error: string) => {
    const message = createSystemMessage(
      `❌ **Upload Failed:** ${error}\n\nPlease try uploading a valid JSON file (max 256KB). I can help you better when I have context about your data structure.`
    );
    
    handleNewMessage(message);
  }, [handleNewMessage]);

  /**
   * Handle JSON context clearing
   */
  const handleClearJsonFile = useCallback(() => {
    setCurrentJsonFile(null);
    
    const message = createSystemMessage(
      '🔄 **Context Cleared** - Starting fresh without previous JSON context. Feel free to upload new data or continue with general DSL questions.'
    );
    
    handleNewMessage(message);
  }, [handleNewMessage]);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Set up parser-to-chat event listener
   */
  useEffect(() => {
    const handleParserToChatEvent = (event: Event) => {
      const { detail } = event as ParserToChatEvent;
      
      if (chatInputSetterRef.current) {
        chatInputSetterRef.current(detail.prompt);
      } else {
        toast({
          title: "Connection Error",
          description: "Chat input connection not ready. Please try again.",
          variant: "destructive"
        });
      }
    };

    window.addEventListener(PARSER_TO_CHAT_EVENT, handleParserToChatEvent);
    
    return () => {
      window.removeEventListener(PARSER_TO_CHAT_EVENT, handleParserToChatEvent);
    };
  }, [toast]);

  /**
   * Handle global drag & drop
   */
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              <span className="text-3xl text-emerald-600 dark:text-emerald-400 font-extrabold">ZAIP</span> - ZEN AI Playground
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Intelligent ZEN language learning with context awareness
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content - Balanced 2-Panel Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat Panel - 58% of space */}
        <section className="flex flex-col bg-white dark:bg-slate-800 min-w-0" style={{ flex: '0 0 58%' }}>
          <ChatPanel
            chatHistory={chatHistory}
            onNewMessage={handleNewMessage}
            {...connectionStatus}
            currentJsonFile={currentJsonFile}
            onJsonUploadSuccess={handleJsonUploadSuccess}
            onJsonUploadError={handleJsonUploadError}
            onClearJsonFile={handleClearJsonFile}
            onChatToParser={handleChatToParser}
            onSetInputMessage={handleSetInputMessage}
          />
        </section>

        {/* Expression Workbench - 42% of space */}
        <section className="flex-shrink-0 bg-slate-50 dark:bg-slate-900 min-w-0 border-l border-slate-200 dark:border-slate-700" style={{ flex: '0 0 42%' }}>
          <CodeEditor
            ref={codeEditorRef}
            onParserToChat={handleParserToChat}
          />
        </section>
      </main>

      {/* Global Drag & Drop Modal */}
      {isDragging && (
        <GlobalDragDropZone
          onUploadSuccess={handleJsonUploadSuccess}
          onUploadError={handleJsonUploadError}
          onDragComplete={() => setIsDragging(false)}
        />
      )}
    </div>
  );
};

// ============================================================================
// MAIN EXPORT WITH SESSION PROVIDER
// ============================================================================

/**
 * DSLTutor component wrapped with SessionProvider
 */
const DSLTutor: React.FC = () => {
  return (
    <SessionProvider autoRefresh={true} refreshInterval={30000}>
      <DSLTutorCore />
    </SessionProvider>
  );
};

export default DSLTutor;
