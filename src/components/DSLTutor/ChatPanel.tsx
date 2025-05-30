import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, MessageCircle, Send, Paperclip, X, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { ChatMessage, ChatResponse } from '@/types/chat';
import { sendChatMessage } from '@/services/chatService';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
  isOnline: boolean;
  isApiHealthy: boolean;
}

interface UploadedFile {
  name: string;
  content: any;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, onNewMessage, isOnline, isApiHealthy }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [includeFullJson, setIncludeFullJson] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024; // 50KB
  const MAX_CHARS = 500;
  const charCount = inputMessage.length;

  const getCharCounterColor = () => {
    if (charCount === 0) return 'text-slate-400';
    if (charCount <= 450) return 'text-green-600';
    if (charCount < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Check if send button should be disabled
  const isSendDisabled = !inputMessage.trim() || isLoading || charCount >= MAX_CHARS;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    if (!file.name.toLowerCase().endsWith('.json')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JSON file (.json)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (256KB for backend compatibility)
    if (file.size > 256 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 256KB",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-json', {
        method: 'POST',
        body: formData,
        credentials: 'include', // For session cookies
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Parse locally for display
      const content = JSON.parse(await file.text());
      setUploadedFile({ name: file.name, content });
      
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully (${result.sizeBytes} bytes)`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    let messageContent = inputMessage;
    
    // Add full JSON flag if toggled
    if (uploadedFile && includeFullJson) {
      messageContent += ' @fulljson';
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    onNewMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(messageContent, chatHistory);
      
      // Handle both successful responses and error responses
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString()
      };

      onNewMessage(assistantMessage);

      // Show specific warnings for TPM guard
      if (response.error) {
        if (response.error.includes('TPM guard') || response.error.includes('token rate limit')) {
          toast({
            title: "Rate Limited",
            description: "Large JSON requests are limited. Please wait before sending another.",
            variant: "default"
          });
        } else {
          toast({
            title: "Warning",
            description: "There was an issue with the AI service, but I provided a fallback response.",
            variant: "default"
          });
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      
      onNewMessage(errorMessage);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the AI service. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setIncludeFullJson(false);
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
      toast({
        title: "Copy Failed",
        description: "Unable to copy message to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Assistant</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Ask questions about DSL syntax and concepts</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline && isApiHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isOnline && isApiHealthy ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isOnline && isApiHealthy ? 'AI service is online and ready' : 'AI service is currently unavailable'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start space-x-3 max-w-[85%]">
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="relative group">
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white ml-auto'
                      : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className={`mb-2 last:mb-0 ${message.role === 'user' ? 'text-white' : ''}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                
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
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800">
        {/* Uploaded File Indicator */}
        {uploadedFile && (
          <div className="mb-3 flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300">{uploadedFile.name}</span>
              
              {/* Full JSON Toggle */}
              <label className="flex items-center space-x-1 ml-4">
                <input
                  type="checkbox"
                  checked={includeFullJson}
                  onChange={(e) => setIncludeFullJson(e.target.checked)}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-emerald-700 dark:text-emerald-300">Include full JSON</span>
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeUploadedFile}
              className="h-6 w-6 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <div className="flex space-x-3 items-start">
          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              value={inputMessage}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInputMessage(e.target.value);
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
              className="min-h-[80px] max-h-[140px] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none"
              maxLength={MAX_CHARS}
            />
          </div>
          
          {/* Right Controls: Upload & Counter above Send */}
          <div className="flex flex-col space-y-2 w-24">
            {/* Top Row: Upload Button and Character Counter */}
            <div className="flex space-x-2">
              {/* File Upload Button */}
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
                <TooltipContent>
                  <p>Upload JSON file (max 50KB)</p>
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
