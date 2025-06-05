import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import ChatPanel from '@/components/DSLTutor/ChatPanel';
import { ChatMessage } from '@/types/chat';
import { JsonMetadata } from '@/components/DSLTutor/JsonUpload';
import CodeEditor from '@/components/DSLTutor/CodeEditor';
import { GlobalDragDropZone } from '@/components/DSLTutor/GlobalDragDropZone';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { useToast } from '@/hooks/use-toast';
import { SessionProvider } from '@/contexts/SessionContext';

// Phase 1 Infrastructure Imports
import {
  optimizeContentForChat,
  validateParserContent,
  generateSizeSummary,
  getFlowDescription
} from '@/lib/parserContentAnalysis';
import {
  attachInputToMessage,
  ParserAttachmentResult
} from '@/services/parserAttachmentService';
import {
  generateAttachmentPrompt,
  generateDirectPrompt,
  generatePromptPreview,
  PromptContext
} from '@/lib/attachmentPromptGenerator';

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const MAX_CHAT_HISTORY = 50;
const PARSER_TO_CHAT_EVENT = 'parser-to-chat';

interface CodeEditorRef {
  handleChatTransfer: (expression: string, input: string) => void;
}

// Enhanced interface to support attachment-based communication
interface ParserEvaluationData {
  expression: string;
  input: string;
  result: string;
  isSuccess: boolean;
  isEmpty?: boolean;
  // New attachment-related fields
  attachmentMetadata?: {
    filename: string;
    sizeBytes: number;
    type: 'json' | 'text';
  };
  contentAnalysis?: {
    totalSize: number;
    requiresAttachment: boolean;
    estimatedTokens: number;
  };
}

// Enhanced event detail interface
interface ParserToChatEventDetail extends ParserEvaluationData {
  prompt: string;
  // New fields for attachment flow
  hasAttachment?: boolean;
  flowType?: 'direct' | 'attachment';
  messageId?: string;
}

type ParserToChatEvent = CustomEvent<ParserToChatEventDetail>;

/** Welcome message for new users */
const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: `👋 **Welcome to ZAIP** - Your ZEN AI Playground!

I'm here to help you master the ZEN language. Here's what I can do:

🎯 **Smart Expression Analysis**
- Explain how your ZEN expressions work
- Debug failing expressions with context
- Suggest improvements and optimizations
- Handle large data intelligently with automatic attachments

🔧 **Interactive Learning**
- Upload JSON files for context-aware assistance
- Transfer expressions between chat and workbench
- Get real-time help as you code

💡 **Getting Started**
- Write ZEN expressions in the workbench
- Click "Ask AI" to get explanations and help
- Upload JSON files for better context
- Use the bi-directional transfer between chat and workbench

Ready to explore ZEN? Try writing an expression or ask me anything!`,
  timestamp: new Date().toISOString()
};

/**
 * Create a system message with consistent formatting
 */
const createSystemMessage = (content: string): ChatMessage => ({
  role: 'assistant',
  content,
  timestamp: new Date().toISOString()
});

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
   * Enhanced parser-to-chat communication with intelligent content handling
   * Supports both direct and attachment-based flows based on content size
   */
  const handleParserToChat = useCallback(async (
    expression: string, 
    input: string, 
    result: string, 
    isSuccess: boolean, 
    isEmpty?: boolean
  ) => {
    try {
      // Generate unique message ID for attachment tracking
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Phase 1: Content validation and analysis
      const validation = validateParserContent(expression, input, result);
      
      if (!validation.isValid) {
        // Handle validation errors
        const errorMessage = `❌ **Content Validation Failed**\n\n${validation.errors.join('\n')}\n\nPlease check your expression and data.`;
        
        toast({
          title: "Content Validation Error",
          description: validation.errors[0],
          variant: "destructive"
        });
        
        // Still dispatch a simplified event for basic error handling
        const errorEvent = new CustomEvent(PARSER_TO_CHAT_EVENT, {
          detail: {
            expression: expression.substring(0, 100) + (expression.length > 100 ? '...' : ''),
            input: '',
            result: errorMessage,
            isSuccess: false,
            isEmpty: false,
            prompt: `Error: ${validation.errors.join(', ')}`,
            flowType: 'direct',
            messageId
          }
        }) as ParserToChatEvent;
        
        window.dispatchEvent(errorEvent);
        return;
      }
      
      // Phase 2: Determine flow type based on content analysis
      const { analysis } = validation;
      let prompt: string;
      let attachmentMetadata: ParserEvaluationData['attachmentMetadata'];
      let hasAttachment = false;
      
      if (analysis.requiresAttachment) {
        // ATTACHMENT FLOW: Large content needs attachment
        try {
          // Create attachment for input data
          const attachmentResult: ParserAttachmentResult = await attachInputToMessage(input, messageId);
          
          if (!attachmentResult.success) {
            throw new Error(attachmentResult.error || 'Failed to create attachment');
          }
          
          // Optimize content for chat display
          const optimizedContent = optimizeContentForChat(expression, input, result);
          
          // Generate attachment-based prompt
          const promptContext: PromptContext = {
            expression: optimizedContent.expression,
            result: optimizedContent.result,
            isSuccess,
            isEmpty,
            attachmentFilename: optimizedContent.attachmentFilename,
            truncationInfo: optimizedContent.truncationInfo
          };
          
          prompt = generateAttachmentPrompt(promptContext);
          
          attachmentMetadata = {
            filename: attachmentResult.attachmentMetadata.filename,
            sizeBytes: attachmentResult.attachmentMetadata.sizeBytes,
            type: attachmentResult.attachmentMetadata.type
          };
          
          hasAttachment = true;
          
          // Success feedback for attachment flow
          const sizeSummary = generateSizeSummary(analysis);
          const flowDescription = getFlowDescription(analysis);
          
          toast({
            title: "Large Content Optimized",
            description: `${flowDescription} • ${sizeSummary}`,
            duration: 4000
          });
          
        } catch (attachmentError) {
          console.error('Attachment creation failed:', attachmentError);
          
          // Fallback to truncated direct flow
          const optimizedContent = optimizeContentForChat(expression, input, result);
          prompt = generateAttachmentPrompt({
            expression: optimizedContent.expression,
            result: optimizedContent.result,
            isSuccess,
            isEmpty
          });
          
          toast({
            title: "Attachment Failed",
            description: "Content was truncated for direct chat. Full data available in workbench.",
            variant: "destructive",
            duration: 5000
          });
        }
      } else {
        // DIRECT FLOW: Content fits within limits
        prompt = generateDirectPrompt(expression, input, result, isSuccess, isEmpty);
        
        // Success feedback for direct flow
        toast({
          title: "Expression Ready",
          description: generatePromptPreview(
            isSuccess ? (isEmpty ? 'empty' : 'success') : 'error',
            false,
            analysis.inputSize
          ),
          duration: 3000
        });
      }
      
      // Phase 3: Dispatch enhanced event
      const eventDetail: ParserToChatEventDetail = {
        expression,
        input,
        result,
        isSuccess,
        isEmpty,
        prompt,
        hasAttachment,
        flowType: analysis.requiresAttachment ? 'attachment' : 'direct',
        messageId,
        attachmentMetadata,
        contentAnalysis: {
          totalSize: analysis.totalSize,
          requiresAttachment: analysis.requiresAttachment,
          estimatedTokens: analysis.estimatedTokens || 0
        }
      };
      
      const event = new CustomEvent(PARSER_TO_CHAT_EVENT, {
        detail: eventDetail
      }) as ParserToChatEvent;
      
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Parser-to-chat handling failed:', error);
      
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process expression for chat",
        variant: "destructive",
        duration: 5000
      });
      
      // Dispatch minimal error event
      const errorEvent = new CustomEvent(PARSER_TO_CHAT_EVENT, {
        detail: {
          expression: expression.substring(0, 100),
          input: '',
          result: 'Processing error occurred',
          isSuccess: false,
          isEmpty: false,
          prompt: 'Error: Failed to process expression for chat',
          flowType: 'direct',
          messageId: `error-${Date.now()}`
        }
      }) as ParserToChatEvent;
      
      window.dispatchEvent(errorEvent);
    }
  }, [toast]);

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
    // Note: No automatic system message - attachment will be shown in UI instead
  }, []);

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
   * Handle JSON context clearing with attachment cleanup
   */
  const handleClearJsonFile = useCallback(() => {
    setCurrentJsonFile(null);
    // Note: No system message for clearing - just update state
  }, []);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Enhanced parser-to-chat event listener with attachment support
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
   * Component cleanup - clean up any remaining temporary attachments
   */
  useEffect(() => {
    return () => {
      // Clean up any temporary attachments when component unmounts
      // Note: cleanupExpiredAttachments is automatically called by the service
    };
  }, []);

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
