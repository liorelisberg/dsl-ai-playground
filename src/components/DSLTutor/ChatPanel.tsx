import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Clock,
  Copy,
  Check,
  RefreshCw,
  X,
  ChevronUp,
  MessageCircle,
  Loader2,
  Brain,
  FileJson
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { ChatMessage, ChatResponse } from '@/types/chat';
import { JsonMetadata } from './JsonUpload';
import { sendChatMessage } from '@/services/chatService';
import { useSession, useSessionControls } from '@/contexts/SessionContext';
import DSLCodeBlock from './DSLCodeBlock';
import { UPLOAD_CONFIG } from '@/config/upload';
import { 
  validateMessageAttachment, 
  compressJson,
  validateJsonContent,
  registerAttachment,
  consumeAttachment,
  estimateTokenization
} from '@/config/upload';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
  isOnline: boolean;
  isApiHealthy: boolean;
  currentJsonFile?: JsonMetadata | null;
  onJsonUploadSuccess?: (metadata: JsonMetadata) => void;
  onJsonUploadError?: (error: string) => void;
  onClearJsonFile?: () => void;
  onChatToParser?: (expression: string, input: string) => void;
  onSetInputMessage?: (setter: React.Dispatch<React.SetStateAction<string>>) => void;
}

interface UploadedFile {
  name: string;
  content: unknown;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  chatHistory, 
  onNewMessage, 
  isOnline, 
  isApiHealthy,
  currentJsonFile,
  onJsonUploadSuccess,
  onJsonUploadError,
  onClearJsonFile,
  onChatToParser,
  onSetInputMessage
}) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [jsonProcessingMode, setJsonProcessingMode] = useState<'full' | 'compressed'>('compressed');
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [inputAreaHeight, setInputAreaHeight] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate JSON component height dynamically
  const jsonComponentHeight = uploadedFile ? 60 : 0; // JSON component adds ~60px when visible
  
  // Frontend-only message history (separate from AI context)
  const [frontendMessageHistory, setFrontendMessageHistory] = useState<ChatMessage[]>([]);
  const [visibleMessageCount, setVisibleMessageCount] = useState(10); // Show last 10 messages by default
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [currentMessageId] = useState(() => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Session management
  const { sessionId, sessionMetrics, isSessionValid } = useSession();
  const { clearSession, updateActivity } = useSessionControls();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_FILE_SIZE = UPLOAD_CONFIG.json.maxSizeBytes; // 256KB (from centralized config)
  const MAX_CHARS = 2000;
  const LOAD_OLDER_BATCH_SIZE = 5; // Load 5 more messages at a time
  
  // Ensure inputMessage is always a string, never null
  const safeInputMessage = inputMessage || '';
  const charCount = safeInputMessage.length;

  // Synchronize frontend message history with parent chatHistory
  useEffect(() => {
    // Add new messages from parent to frontend history
    chatHistory.forEach(message => {
      setFrontendMessageHistory(prev => {
        // Check if this message already exists in frontend history
        const exists = prev.some(existing => 
          existing.content === message.content && 
          existing.role === message.role && 
          existing.timestamp === message.timestamp
        );
        
        if (!exists) {
          return [...prev, message];
        }
        return prev;
      });
    });
  }, [chatHistory]);

  // Calculate which messages to display
  const displayMessages = frontendMessageHistory.slice(-visibleMessageCount);
  const hasOlderMessages = frontendMessageHistory.length > visibleMessageCount;
  const olderMessagesCount = frontendMessageHistory.length - visibleMessageCount;

  // Load older messages function
  const handleLoadOlderMessages = useCallback(() => {
    setLoadingOlderMessages(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleMessageCount(prev => Math.min(prev + LOAD_OLDER_BATCH_SIZE, frontendMessageHistory.length));
      setLoadingOlderMessages(false);
    }, 300);
  }, [frontendMessageHistory.length]);

  // Reset visible messages when session is cleared
  useEffect(() => {
    if (frontendMessageHistory.length === 0) {
      setVisibleMessageCount(10);
    }
  }, [frontendMessageHistory.length]);

  // Clear frontend history when session is cleared externally
  useEffect(() => {
    if (!sessionId && frontendMessageHistory.length > 0) {
      setFrontendMessageHistory([]);
      setVisibleMessageCount(10);
    }
  }, [sessionId, frontendMessageHistory.length]);

  const getCharCounterColor = () => {
    if (charCount === 0) return 'text-slate-400';
    if (charCount <= 450) return 'text-green-600';
    if (charCount < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Check if send button should be disabled
  const isSendDisabled = !safeInputMessage.trim() || isLoading || charCount >= MAX_CHARS || !sessionId;

  // Format session age for display
  const formatSessionAge = useCallback((age: number) => {
    const minutes = Math.floor(age / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }, []);

  // Handle session refresh
  const handleSessionRefresh = useCallback(() => {
    clearSession();
    // Clear frontend message history as well
    setFrontendMessageHistory([]);
    setVisibleMessageCount(10);
    toast({
      title: "Session Refreshed",
      description: "Started a new conversation session",
    });
  }, [clearSession]);

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Safe wrapper for setInputMessage that ensures never null
  const safeSetInputMessage = useCallback((value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      setInputMessage(prev => {
        const result = value(prev || '');
        return result || '';
      });
    } else {
      setInputMessage(value || '');
    }
  }, []);

  // Handle external input message updates - expose setInputMessage through callback
  useEffect(() => {
    if (onSetInputMessage) {
      onSetInputMessage(safeSetInputMessage);
    }
  }, [onSetInputMessage, safeSetInputMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newInputHeight = containerRect.bottom - e.clientY;
      
      // Set min/max limits for input area (100px to 400px)
      const minHeight = 100;
      const maxHeight = Math.min(400, containerRect.height - 200); // Leave at least 200px for messages
      
      const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newInputHeight));
      setInputAreaHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    if (!file.name.toLowerCase().endsWith('.json')) {
      const errorMsg = "Please upload a JSON file (.json)";
      onJsonUploadError?.(errorMsg);
      toast({
        title: "Invalid File Type",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    // Validate file size (256KB for backend compatibility)
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = "File size must be less than 256KB";
      onJsonUploadError?.(errorMsg);
      toast({
        title: "File Too Large",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    try {
      // Read and validate JSON content BEFORE uploading
      const fileContent = await file.text();
      const contentValidation = await validateJsonContent(fileContent);
      
      if (!contentValidation.isValid) {
        const errorMsg = contentValidation.errors[0] || "Invalid JSON format";
        onJsonUploadError?.(errorMsg);
        toast({
          title: "Invalid JSON Format",
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }

      // Show warnings if any
      if (contentValidation.warnings.length > 0) {
        toast({
          title: "JSON Validation Warnings",
          description: contentValidation.warnings[0],
          variant: "default"
        });
      }

      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId); // Include the frontend session ID

      const response = await fetch('/api/upload-json', {
        method: 'POST',
        body: formData,
        // Remove credentials: 'include' since we're explicitly sending sessionId
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Use validated parsed JSON instead of re-parsing
      const content = contentValidation.parsedJson!;
      setUploadedFile({ name: file.name, content });

      // Create enhanced metadata with validation info
      const metadata: JsonMetadata = {
        filename: file.name,
        sizeBytes: result.sizeBytes,
        topLevelKeys: result.topLevelKeys || contentValidation.metadata.topLevelKeys,
        uploadTime: new Date().toISOString(),
        complexity: contentValidation.metadata.complexity,
        estimatedTokens: contentValidation.metadata.estimatedTokens,
        depth: contentValidation.metadata.depth
      };

      onJsonUploadSuccess?.(metadata);
      
      // Register attachment for message-specific validation
      registerAttachment(file.name, currentMessageId);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} uploaded and validated - AI now has context about your data`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error instanceof Error ? error.message : "Failed to upload file";
      
      // Clear any uploaded file state on error
      setUploadedFile(null);
      onClearJsonFile?.();
      
      onJsonUploadError?.(errorMsg);
      toast({
        title: "Upload Failed", 
        description: errorMsg,
        variant: "destructive"
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!sessionId) {
      toast({
        title: "Session Required",
        description: "Please start a new session to send messages",
        variant: "destructive"
      });
      return;
    }

    if (safeInputMessage.trim() === '') return;

    setIsLoading(true);
    
    try {
      updateActivity(); // Track user activity
      
      const messageContent = safeInputMessage.trim();

      // Validate JSON attachment for current message
      if (uploadedFile && currentJsonFile) {
        const validation = validateMessageAttachment(currentJsonFile.filename, currentMessageId);
        if (!validation.isValid) {
          toast({
            title: "Attachment Error",
            description: validation.error || "JSON file is not properly attached to this message",
            variant: "destructive"
          });
          return;
        }

        // Check if estimated tokens exceed limits with dynamic calculation based on processing mode
        if (uploadedFile && currentJsonFile) {
          // Calculate dynamic token estimate based on current processing mode
          const originalContent = JSON.stringify(uploadedFile.content);
          const tokenEstimate = estimateTokenization(originalContent, jsonProcessingMode);
          const estimatedTokens = tokenEstimate.tokens + tokenEstimate.overhead;
          
          if (estimatedTokens > 15000) {
            const modeDescription = jsonProcessingMode === 'compressed' ? 'Compressed' : 'Full JSON';
            const proceed = window.confirm(
              `This JSON file in ${modeDescription} mode may use ~${estimatedTokens} tokens, which could exceed limits. Continue anyway?`
            );
            if (!proceed) {
              setIsLoading(false);
              return;
            }
          }
        }
      }
      
      // Calculate dynamic token estimate for user message metadata
      let userMessageTokens = undefined;
      if (uploadedFile) {
        const originalContent = JSON.stringify(uploadedFile.content);
        const tokenEstimate = estimateTokenization(originalContent, jsonProcessingMode);
        userMessageTokens = tokenEstimate.tokens + tokenEstimate.overhead;
      }
      
      // Create user message with enhanced attachment metadata
      const userMessage: ChatMessage = {
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString(),
        metadata: uploadedFile ? {
          attachedFile: {
            filename: uploadedFile.name,
            type: 'json',
            mode: jsonProcessingMode,
            sizeBytes: currentJsonFile?.sizeBytes,
            topLevelKeys: currentJsonFile?.topLevelKeys,
            complexity: currentJsonFile?.complexity,
            estimatedTokens: userMessageTokens,
            messageId: currentMessageId
          }
        } : undefined
      };
      
      // Add user message immediately
      onNewMessage(userMessage);
      setInputMessage('');
      
      // Capture uploaded file content before clearing UI state
      const capturedUploadedFile = uploadedFile;
      
      // Clear uploaded file immediately after sending user message (JSON is now "consumed")
      if (uploadedFile) {
        // Mark attachment as consumed to prevent reuse
        consumeAttachment(uploadedFile.name);
        setUploadedFile(null);
        onClearJsonFile?.();
      }
      
      // Prepare context for AI based on processing mode
      let messageWithContext = messageContent;
      let jsonContextData = capturedUploadedFile?.content;

      if (capturedUploadedFile && jsonProcessingMode !== 'full') {
        try {
          if (jsonProcessingMode === 'compressed') {
            // Use compressed JSON with validation
            const compressionResult = compressJson(capturedUploadedFile.content, 'structured');
            
            // Validate compression effectiveness
            if (compressionResult.compressionRatio >= 0.95) {
              console.warn('Minimal compression achieved:', compressionResult);
              toast({
                title: "Compression Notice",
                description: `Compression only reduced size by ${((1 - compressionResult.compressionRatio) * 100).toFixed(1)}%`,
                variant: "default"
              });
            }
            
            jsonContextData = JSON.parse(compressionResult.compressed);
            messageWithContext = `${messageContent}\n\n[Compressed JSON Context: ${compressionResult.compressed}]`;
            
            console.log(`✅ Compression successful: ${compressionResult.originalSize}B → ${compressionResult.compressedSize}B (${(compressionResult.compressionRatio * 100).toFixed(1)}% of original)`);
          }
        } catch (error) {
          console.error('JSON processing failed:', error);
          toast({
            title: "Processing Error",
            description: "Failed to process JSON file. Using original format.",
            variant: "default"
          });
          // Fall back to original content
          jsonContextData = capturedUploadedFile.content;
          messageWithContext = `${messageContent}\n\n[JSON Context: ${JSON.stringify(capturedUploadedFile.content, null, 2)}]`;
        }
      } else if (capturedUploadedFile && jsonProcessingMode === 'full') {
        // Use full JSON content with size validation
        const fullJsonString = JSON.stringify(capturedUploadedFile.content, null, 2);
        const fullJsonSize = fullJsonString.length;
        
        if (fullJsonSize > 50000) { // 50KB warning threshold
          console.warn(`Large JSON size: ${fullJsonSize} bytes`);
          toast({
            title: "Large JSON Warning",
            description: `Full JSON is ${Math.round(fullJsonSize / 1024)}KB. This may consume significant tokens.`,
            variant: "default"
          });
        }
        
        messageWithContext = `${messageContent}\n\n[JSON Context: ${fullJsonString}]`;
        console.log(`✅ Full JSON mode: ${fullJsonSize}B`);
      }
      
      // Calculate dynamic token estimate for API call
      let contextTokens = 0;
      if (capturedUploadedFile) {
        const originalContent = JSON.stringify(capturedUploadedFile.content);
        const tokenEstimate = estimateTokenization(originalContent, jsonProcessingMode);
        contextTokens = tokenEstimate.tokens + tokenEstimate.overhead;
      }
      
      // Send to AI with processed context
      const response: ChatResponse = await sendChatMessage(messageWithContext, chatHistory, {
        sessionId,
        jsonContext: jsonContextData,
        maxTokens: contextTokens > 10000 ? 16000 : undefined
      });
      
      // Add AI response with processing metadata
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
        metadata: {
          timestamp: new Date().toISOString(),
          processingMode: capturedUploadedFile ? jsonProcessingMode : undefined,
          contextTokens: contextTokens || undefined,
          sessionId: response.sessionId
        }
      };
      
      onNewMessage(aiMessage);
      
      // Validate that JSON context was properly processed
      if (capturedUploadedFile && !response.text.toLowerCase().includes('json')) {
        toast({
          title: "Context Warning",
          description: "AI response may not have used JSON context. Please verify the response.",
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: `Failed to connect to the AI service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    onClearJsonFile?.();
  };

  const copyToClipboard = async (content: string, messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(messageIndex);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy message to clipboard",
        variant: "destructive"
      });
    }
  };

  // Render simple time display
  const renderTimeDisplay = (timestamp?: string) => {
    if (!timestamp) return null;

    const time = new Date(timestamp);
    const timeString = time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    return (
      <div className="text-xs text-gray-500 mt-2">
        🕐 {timeString}
      </div>
    );
  };

  // Calculate file size based on processing mode
  const calculateProcessedFileSize = (attachedFile: { sizeBytes?: number; mode?: string }) => {
    if (!attachedFile) return '';
    
    const originalSizeKB = attachedFile.sizeBytes ? Math.round(attachedFile.sizeBytes / 1024) : 0;
    
    // Estimate sizes for different processing modes
    switch (attachedFile.mode) {
      case 'full':
        return `${originalSizeKB}KB`;
      case 'compressed':
        // Compressed is typically 30-50% of original
        return `${Math.max(1, Math.round(originalSizeKB * 0.4))}KB`;
      default:
        return `${originalSizeKB}KB`;
    }
  };

  // Render enhanced time and attachment display for user messages
  const renderUserMessageMetadata = (message: ChatMessage) => {
    if (!message.timestamp) return null;

    const time = new Date(message.timestamp);
    const timeString = time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    return (
      <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{timeString}</span>
        </div>
        {message.metadata?.attachedFile && (
          <>
            <div className="flex items-center space-x-1">
              <FileJson className="h-3 w-3" />
              <span>{message.metadata.attachedFile.filename}</span>
            </div>
            <span className="font-semibold">{message.metadata.attachedFile.mode}</span>
            <span>{calculateProcessedFileSize(message.metadata.attachedFile)}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Chat Header - Updated with Context Indicator */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                Intelligent AI Assistant
                {currentJsonFile && (
                  <Badge variant="outline" className="ml-2 text-xs flex items-center">
                    <FileJson className="h-3 w-3 mr-1" />
                    {currentJsonFile.filename}
                  </Badge>
                )}
                {sessionId && (
                  <Badge variant={isSessionValid ? "default" : "destructive"} className="ml-2 text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {sessionMetrics.conversationCount} msgs
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AI that learns from your data and conversation patterns
                {currentJsonFile && currentJsonFile.topLevelKeys && (
                  <span className="text-blue-600 dark:text-blue-400">
                    {' '}• Using {currentJsonFile.topLevelKeys.length} data keys for context
                  </span>
                )}
                {sessionId && (
                  <span className="text-green-600 dark:text-green-400">
                    {' '}• Session: {formatSessionAge(sessionMetrics.age)}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Connection Status and Session Controls */}
          <div className="flex items-center space-x-4">
            {/* Session Controls */}
            {sessionId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSessionRefresh}
                    className="h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">Refresh Session</p>
                    <p className="text-xs">Start a new conversation</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {sessionMetrics.conversationCount} messages, {formatSessionAge(sessionMetrics.age)} old
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Connection Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isOnline && isApiHealthy 
                      ? 'bg-green-500 shadow-green-500/50 shadow-sm scale-110' 
                      : 'bg-red-500 animate-pulse scale-90'
                  }`} />
                  <span className={`text-xs transition-colors duration-300 ${
                    isOnline && isApiHealthy 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {isOnline && isApiHealthy ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>{isOnline && isApiHealthy 
                    ? 'Intelligent AI service is online and ready' 
                    : 'Establishing connection to AI service...'
                  }</p>
                  {sessionId && (
                    <p className="text-xs text-muted-foreground">
                      Session ID: {sessionId.split('_')[2]}...
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Chat Messages - Dynamic Height */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6"
        style={{ height: `calc(100% - ${inputAreaHeight + jsonComponentHeight + 120}px)` }}
      >
        {/* Load Older Messages Button */}
        {hasOlderMessages && (
          <div className="flex justify-center pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadOlderMessages}
              disabled={loadingOlderMessages}
              className="group flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full transition-all duration-200"
            >
              {loadingOlderMessages ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">
                    Load {Math.min(LOAD_OLDER_BATCH_SIZE, olderMessagesCount)} older message{Math.min(LOAD_OLDER_BATCH_SIZE, olderMessagesCount) !== 1 ? 's' : ''}
                  </span>
                  <Badge variant="secondary" className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                    {olderMessagesCount}
                  </Badge>
                </>
              )}
            </Button>
          </div>
        )}
        
        {displayMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start space-x-3 max-w-[85%] min-w-0">
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="relative group min-w-0 flex-1">
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm overflow-hidden ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white ml-auto'
                      : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-full dark:prose-invert prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:text-xs prose-code:text-xs prose-code:break-words">
                      <DSLCodeBlock 
                        content={message.content}
                        onChatToParser={onChatToParser}
                      />
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-full break-words">
                      {message.content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className={`mb-2 last:mb-0 break-words ${message.role === 'user' ? 'text-white' : ''}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Timestamp for both User and Assistant Messages */}
                {message.role === 'assistant' ? (
                  message.metadata && renderTimeDisplay(message.metadata.timestamp)
                ) : (
                  <>
                    {renderUserMessageMetadata(message)}
                  </>
                )}
                
                {/* Copy Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.content, index)}
                  className={`absolute -bottom-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                    message.role === 'user' 
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500'
                  }`}
                >
                  {copiedMessageIndex === index ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-slate-600 dark:bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Uploaded File Indicator - Positioned ABOVE drag bar */}
      {uploadedFile && (
        <div className="px-2 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <FileJson className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{uploadedFile.name}</span>
              <Badge variant="outline" className="text-xs">
                {currentJsonFile?.sizeBytes ? `${Math.round(currentJsonFile.sizeBytes / 1024)}KB` : 'JSON'}
              </Badge>
              
              {/* JSON Processing Mode Toggle */}
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Mode:</span>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="jsonProcessingMode"
                    value="compressed"
                    checked={jsonProcessingMode === 'compressed'}
                    onChange={(e) => setJsonProcessingMode(e.target.value as 'compressed')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-blue-700 dark:text-blue-300">Compressed</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="jsonProcessingMode"
                    value="full"
                    checked={jsonProcessingMode === 'full'}
                    onChange={(e) => setJsonProcessingMode(e.target.value as 'full')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-blue-700 dark:text-blue-300">Full</span>
                </label>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeUploadedFile}
              className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Resize Handle */}
      <div 
        className={`flex items-center justify-center h-1 bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500 cursor-row-resize hover:bg-slate-300 dark:hover:bg-slate-500 transition-all duration-150 group ${isDragging ? 'bg-slate-300 dark:bg-slate-500' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-8 h-0.5 bg-slate-400 dark:bg-slate-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Message Input - Fixed Height */}
      <div 
        className="border-t border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 flex-shrink-0 mb-3"
        style={{ height: `${inputAreaHeight}px` }}
      >        
        <div className="flex space-x-2 items-start mt-3 mb-3">
          {/* Text Input */}
          <div className="flex-1 relative mx-2">
            <Textarea
              value={safeInputMessage}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInputMessage(e.target.value || ''); // Ensure never null
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isSendDisabled) {
                    handleSendMessage();
                  }
                }
              }}
              placeholder="Ask about DSL syntax, examples, or concepts..."
              disabled={isLoading}
              className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none w-full"
              style={{ 
                height: `${Math.max(inputAreaHeight - 30, 50)}px`
              }}
              maxLength={MAX_CHARS}
            />
          </div>
          
          {/* Right Controls: Upload & Counter above Send */}
          <div className="flex flex-col space-y-2 w-24">
            {/* Top Row: Upload Button and Character Counter */}
            <div className="flex space-x-2">
              {/* Enhanced File Upload Button with Drag & Drop Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-8 h-8 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 p-1"
                  >
                    <Paperclip className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Upload JSON Data</p>
                    <p className="text-xs">Click to browse files or drag & drop anywhere on the window</p>
                    <p className="text-xs text-muted-foreground">Max 256KB • .json files only</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Character Counter */}
              <div className={`flex-1 h-8 flex items-center justify-center text-xs font-medium border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 ${getCharCounterColor()}`}>
                {charCount}/{MAX_CHARS}
              </div>
            </div>
            
            {/* Send Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleSendMessage}
                  disabled={isSendDisabled}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-2 py-1 text-sm"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {charCount >= MAX_CHARS 
                    ? charCount === MAX_CHARS 
                      ? 'At character limit - remove 1 character to send'
                      : `Remove ${charCount - MAX_CHARS + 1} characters to send`
                    : "Send message to AI assistant (Enter)"
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
