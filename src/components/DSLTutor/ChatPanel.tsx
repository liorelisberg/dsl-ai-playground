import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageCircle, Bot, Paperclip, X } from 'lucide-react';
import { ChatMessage, ChatResponse } from '../../types/chat';
import { sendChatMessage } from '../../services/chatService';
import { useToast } from '@/hooks/use-toast';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, onNewMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: unknown } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isOnline, isApiHealthy } = useConnectionStatus();

  const MAX_FILE_SIZE = 50 * 1024; // 50KB

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${MAX_FILE_SIZE / 1024}KB`,
        variant: "destructive"
      });
      return;
    }

    // Read and parse JSON
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setUploadedFile({ name: file.name, content });
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "The file contains invalid JSON format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    let messageContent = inputMessage;
    
    // Include uploaded file content if available
    if (uploadedFile) {
      messageContent += `\n\nUploaded JSON file (${uploadedFile.name}):\n\`\`\`json\n${JSON.stringify(uploadedFile.content, null, 2)}\n\`\`\``;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    onNewMessage(userMessage);
    setInputMessage('');
    setUploadedFile(null); // Clear uploaded file after sending
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(messageContent, chatHistory);
      
      // Handle both successful responses and error responses
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text, // Changed from response.response to response.text
        timestamp: new Date().toISOString()
      };

      onNewMessage(assistantMessage);

      // Show warning toast if there was an error but we still got a response
      if (response.error) {
        toast({
          title: "Warning",
          description: "There was an issue with the AI service, but I provided a fallback response.",
          variant: "default"
        });
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
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white ml-auto'
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className={`mb-2 last:mb-0 ${message.role === 'user' ? 'text-white' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>
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
      <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
        {/* Uploaded File Indicator */}
        {uploadedFile && (
          <div className="mb-3 flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300">{uploadedFile.name}</span>
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
        
        <div className="flex space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about DSL syntax, examples, or concepts..."
            disabled={isLoading}
            className="flex-1 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
          />
          
          {/* File Upload Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                <Paperclip className="h-4 w-4" />
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
          
          {/* Send Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message to AI assistant (Enter)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
