
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm px-6 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">DSL</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              DSL Tutor
            </h1>
            <p className="text-sm text-gray-600 mt-1">Learn and experiment with domain-specific language expressions</p>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-104px)] gap-6 p-6">
        {/* Chat Panel - Left Side */}
        <div className="w-full lg:w-1/2">
          <div className="h-full bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <ChatPanel 
              chatHistory={chatHistory} 
              onNewMessage={handleNewMessage}
            />
          </div>
        </div>
        
        {/* Code Editor - Right Side */}
        <div className="w-full lg:w-1/2">
          <div className="h-full bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSLTutor;
