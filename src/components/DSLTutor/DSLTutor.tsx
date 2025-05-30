import React, { useState, useEffect } from 'react';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import { JsonMetadata } from './JsonUpload';
import { GlobalDragDropZone } from './GlobalDragDropZone';
import { ThemeToggle } from '../ui/theme-toggle';
import { ChatMessage } from '../../types/chat';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

const DSLTutor = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Welcome to the **Intelligent DSL Tutor**! I\'m an AI assistant that learns from your data and conversation patterns to provide personalized help.\n\n🧠 **How I help you:**\n- Upload JSON data for context-aware suggestions\n- Learn your expertise level and adapt responses\n- Remember conversation topics for better continuity\n- Provide DSL examples tailored to your specific data\n\nFeel free to ask questions or upload JSON data to get started!',
      timestamp: new Date().toISOString()
    }
  ]);

  const [currentJsonFile, setCurrentJsonFile] = useState<JsonMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isOnline, isApiHealthy } = useConnectionStatus();

  const handleNewMessage = (message: ChatMessage) => {
    setChatHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only last 8 messages (4 conversation turns)
      return newHistory.slice(-8);
    });
  };

  const handleJsonUploadSuccess = (metadata: JsonMetadata) => {
    setCurrentJsonFile(metadata);
    
    // Add a system message about the upload
    const systemMessage: ChatMessage = {
      role: 'assistant',
      content: `✅ **JSON Context Added!**\n\nI now have access to your **${metadata.filename}** file with ${metadata.topLevelKeys.length} top-level keys. This will help me provide more relevant DSL examples and suggestions tailored to your data structure.\n\n**Available keys:** ${metadata.topLevelKeys.slice(0, 5).join(', ')}${metadata.topLevelKeys.length > 5 ? ` and ${metadata.topLevelKeys.length - 5} more` : ''}`,
      timestamp: new Date().toISOString(),
      metadata: {
        contextUsed: true,
        semanticMatches: metadata.topLevelKeys.length
      }
    };
    
    handleNewMessage(systemMessage);
  };

  const handleJsonUploadError = (error: string) => {
    const errorMessage: ChatMessage = {
      role: 'assistant',
      content: `❌ **Upload Failed:** ${error}\n\nPlease try uploading a valid JSON file (max 256KB). I can help you better when I have context about your data structure.`,
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
          />
        </div>

        {/* Expression Workbench - 42% of space */}
        <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-900 min-w-0 border-l border-slate-200 dark:border-slate-700" style={{ flex: '0 0 42%' }}>
          <CodeEditor />
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
