import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import { JsonMetadata } from './JsonUpload';
import { GlobalDragDropZone } from './GlobalDragDropZone';
import { ThemeToggle } from '../ui/theme-toggle';
import { ChatMessage } from '../../types/chat';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import { sendChatMessage } from '../../services/chatService';
import { useToast } from '../../hooks/use-toast';

// Interface for CodeEditor ref methods
interface CodeEditorRef {
  handleChatTransfer: (expression: string, input: string) => void;
}

// Add interface for queued parser communications
interface QueuedParserMessage {
  expression: string;
  input: string;
  result: string;
  isSuccess: boolean;
  isEmpty?: boolean;
}

const DSLTutor = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Welcome to the ZEN DSL AI Playground! 🚀\n\nI\'m your intelligent DSL assistant, here to help you master ZEN expressions and data processing.\n',
      // **What I can help with:**\n- ZEN DSL syntax and functions\n- Data transformation with arrays, strings, numbers\n- Interactive examples with your JSON data\n- Best practices and optimization tips\n- Debugging expressions and learning concepts\n\n**Enhanced Features:**\n- Smart conversation that understands context\n- Personalized examples based on your data\n- Session continuity for seamless learning\n\nFeel free to ask questions or upload JSON data to get started!',
      timestamp: new Date().toISOString()
    }
  ]);

  const [currentJsonFile, setCurrentJsonFile] = useState<JsonMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isOnline, isApiHealthy } = useConnectionStatus();
  const { toast } = useToast();
  
  // Store the chat input setter function
  const [chatInputSetter, setChatInputSetter] = useState<React.Dispatch<React.SetStateAction<string>> | null>(null);

  // Add queue for parser messages that arrive before chatInputSetter is ready
  const [parserMessageQueue, setParserMessageQueue] = useState<QueuedParserMessage[]>([]);

  // Store refs for accessing current state in async operations
  const chatInputSetterRef = useRef<React.Dispatch<React.SetStateAction<string>> | null>(null);
  const parserMessageQueueRef = useRef<QueuedParserMessage[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    chatInputSetterRef.current = chatInputSetter;
  }, [chatInputSetter]);

  useEffect(() => {
    parserMessageQueueRef.current = parserMessageQueue;
  }, [parserMessageQueue]);

  const handleNewMessage = (message: ChatMessage) => {
    setChatHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only last 8 messages (4 conversation turns)
      return newHistory.slice(-8);
    });
  };

  // Handler for parser to populate chat input instead of sending directly
  const handleParserToChat = async (expression: string, input: string, result: string, isSuccess: boolean, isEmpty?: boolean) => {
    console.log('🔧→💬 Parser to Chat triggered:', { expression, input, result, isSuccess, isEmpty });
    console.log('🔧→💬 chatInputSetter available:', !!chatInputSetter);
    
    // If chatInputSetter is not ready, queue the message
    if (!chatInputSetter) {
      console.log('🔧→💬 Queueing message until chat input setter is ready');
      setParserMessageQueue(prev => {
        const newQueue = [...prev, { expression, input, result, isSuccess, isEmpty }];
        console.log('🔧→💬 Queue updated, new length:', newQueue.length);
        return newQueue;
      });
      return;
    }

    // Process the message immediately
    await processParserMessage({ expression, input, result, isSuccess, isEmpty });
  };

  // Helper function to process a parser message - memoized with useCallback
  const processParserMessage = useCallback(async ({ expression, input, result, isSuccess, isEmpty }: QueuedParserMessage) => {
    let prompt: string;
    
    if (!isSuccess) {
      // Error case - ask AI to debug
      prompt = `I have a failing expression, explain why it fails.\n\nExpression: ${expression}\n\nInput: ${input}\n\nError: ${result}`;
    } else if (isEmpty) {
      // Empty result case - ask AI to explain WHY it's empty
      prompt = `I have an expression that runs successfully but returns an empty result. Please explain why the result is empty and how to fix it.\n\nExpression: ${expression}\n\nInput: ${input}\n\nResult: ${result}\n\nThe expression executed without errors but produced an empty/null result. What could be the reasons and how can I modify the expression to get the expected data?`;
    } else {
      // Success case - ask AI to explain how it works
      prompt = `I have a working expression, explain it.\n\nExpression: ${expression}\n\nInput: ${input}\n\nResult: ${result}`;
    }

    console.log('🔧→💬 Generated prompt:', prompt.substring(0, 100) + '...');

    // Set the chat input
    if (chatInputSetter) {
      console.log('🔧→💬 Setting chat input...');
      chatInputSetter(prompt);
      
      // Show feedback toast
      toast({
        title: "Prompt Ready",
        description: "Review and send the generated prompt in the chat input area",
      });
    } else {
      console.error('🔧→💬 ERROR: chatInputSetter is null!');
      toast({
        title: "Connection Error",
        description: "Chat input connection not ready. Please try again.",
        variant: "destructive"
      });
    }
  }, [chatInputSetter, toast]);

  // Handler to capture the chat input setter
  const handleSetInputMessage = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    console.log('💬→🔧 Chat input setter captured:', !!setter);
    setChatInputSetter(setter);
    
    // Manually process any queued messages immediately when setter becomes available
    setTimeout(() => {
      const currentQueue = parserMessageQueueRef.current;
      const currentSetter = chatInputSetterRef.current;
      
      console.log('🔧→💬 Manual queue check after setter capture:', currentQueue.length);
      
      if (currentQueue.length > 0 && currentSetter) {
        const firstMessage = currentQueue[0];
        console.log('🔧→💬 Manually processing queued message:', firstMessage.expression);
        
        // Process the message
        processParserMessage(firstMessage);
        
        // Remove from queue
        setParserMessageQueue(prev => prev.slice(1));
      }
    }, 0);
  };

  // Process queued parser messages when chatInputSetter becomes available
  useEffect(() => {
    console.log('🔧→💬 useEffect triggered:', { 
      hasChatInputSetter: !!chatInputSetter, 
      queueLength: parserMessageQueue.length,
      queueContents: parserMessageQueue.map(m => ({ expr: m.expression, success: m.isSuccess }))
    });
    
    if (chatInputSetter && parserMessageQueue.length > 0) {
      console.log('🔧→💬 Processing queued parser messages:', parserMessageQueue.length);
      
      // Process the first message in the queue
      const firstMessage = parserMessageQueue[0];
      console.log('🔧→💬 Processing message:', { expr: firstMessage.expression, success: firstMessage.isSuccess });
      
      processParserMessage(firstMessage);
      
      // Remove the processed message from the queue
      setParserMessageQueue(prev => {
        const newQueue = prev.slice(1);
        console.log('🔧→💬 Queue after processing:', newQueue.length);
        return newQueue;
      });
      
      // Show toast for multiple queued messages
      if (parserMessageQueue.length > 1) {
        toast({
          title: "Processing Queue",
          description: `${parserMessageQueue.length - 1} more messages waiting to be processed`,
        });
      }
    }
  }, [chatInputSetter, parserMessageQueue, processParserMessage, toast]);

  // Debug useEffect to track individual state changes
  useEffect(() => {
    console.log('🔧→💬 chatInputSetter changed:', !!chatInputSetter);
  }, [chatInputSetter]);

  useEffect(() => {
    console.log('🔧→💬 parserMessageQueue changed:', parserMessageQueue.length, parserMessageQueue);
  }, [parserMessageQueue]);

  // NEW: Handler for chat to transfer expressions to parser  
  const handleChatToParser = (expression: string, input: string) => {
    // This will be handled by CodeEditor to update its state
    // We'll pass this callback to ChatPanel, and CodeEditor will receive the data via props
    console.log('💬→🔧 Chat to Parser transfer:', { expression, input });
    
    // For now, we'll use a ref to directly update CodeEditor
    // In a production app, we'd use a more sophisticated state management solution
    if (codeEditorRef.current) {
      codeEditorRef.current.handleChatTransfer(expression, input);
    }
  };

  const handleJsonUploadSuccess = (metadata: JsonMetadata) => {
    setCurrentJsonFile(metadata);
    
    // Add a system message about the upload
    const systemMessage: ChatMessage = {
      role: 'assistant',
      content: `✅ **JSON Context Added!**\n\nI now have access to your **${metadata.filename}** file with ${metadata.topLevelKeys?.length || 0} top-level keys. This will help me provide more relevant DSL examples and suggestions tailored to your data structure.\n\n**Available keys:** ${(metadata.topLevelKeys || []).slice(0, 5).join(', ')}${(metadata.topLevelKeys?.length || 0) > 5 ? ` and ${(metadata.topLevelKeys?.length || 0) - 5} more` : ''}`,
      timestamp: new Date().toISOString()
    };
    
    handleNewMessage(systemMessage);
  };

  const handleJsonUploadError = (error: string) => {
    const errorMessage: ChatMessage = {
      role: 'assistant',
      content: `❌ **Upload Failed:** ${error}\n\nPlease try uploading a valid JSON file (max 50KB). I can help you better when I have context about your data structure.`,
      timestamp: new Date().toISOString()
    };
    
    handleNewMessage(errorMessage);
  };

  const handleClearJsonFile = () => {
    setCurrentJsonFile(null);
    
    const clearMessage: ChatMessage = {
      role: 'assistant',
      content: '🔄 **Context Cleared** - Starting fresh without previous JSON context. Feel free to upload new data or continue with general DSL questions.',
      timestamp: new Date().toISOString()
    };
    
    handleNewMessage(clearMessage);
  };

  // Global drag & drop handlers
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only hide if dragging out of the window entirely
      if (e.clientX === 0 && e.clientY === 0) {
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

  // Ref to access CodeEditor methods
  const codeEditorRef = useRef<CodeEditorRef | null>(null);

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              DSL AI Playground
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Intelligent language learning with context awareness
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content - Balanced 2-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - 58% of space */}
        <div className="flex flex-col bg-white dark:bg-slate-800 min-w-0" style={{ flex: '0 0 58%' }}>
          <ChatPanel
            chatHistory={chatHistory}
            onNewMessage={handleNewMessage}
            isOnline={isOnline}
            isApiHealthy={isApiHealthy}
            currentJsonFile={currentJsonFile}
            onJsonUploadSuccess={handleJsonUploadSuccess}
            onJsonUploadError={handleJsonUploadError}
            onClearJsonFile={handleClearJsonFile}
            onChatToParser={handleChatToParser}
            onSetInputMessage={handleSetInputMessage}
          />
        </div>

        {/* Expression Workbench - 42% of space */}
        <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-900 min-w-0 border-l border-slate-200 dark:border-slate-700" style={{ flex: '0 0 42%' }}>
          <CodeEditor
            ref={codeEditorRef}
            onParserToChat={handleParserToChat}
          />
        </div>
      </div>

      {/* Global Drag & Drop Modal - Only shows when dragging */}
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

export default DSLTutor;
