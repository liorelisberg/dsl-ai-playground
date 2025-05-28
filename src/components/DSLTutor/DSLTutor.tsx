import React, { useState } from 'react';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import { ChatMessage } from '../../types/chat';

const DSLTutor = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Welcome to DSL Tutor! I\'m here to help you learn and experiment with our JavaScript-like domain-specific language for data parsing and transformation. Feel free to ask questions or try out expressions in the code editor.',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleNewMessage = (message: ChatMessage) => {
    setChatHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only last 8 messages (4 conversation turns)
      return newHistory.slice(-8);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">DSL Tutor</h1>
        <p className="text-sm text-gray-600 mt-1">Learn and experiment with domain-specific language expressions</p>
      </header>
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Chat Panel - Left Side */}
        <div className="w-full lg:w-1/2 border-r border-gray-200">
          <ChatPanel 
            chatHistory={chatHistory} 
            onNewMessage={handleNewMessage}
          />
        </div>
        
        {/* Code Editor - Right Side */}
        <div className="w-full lg:w-1/2">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
};

export default DSLTutor;
