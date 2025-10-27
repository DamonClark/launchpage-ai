'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';

/**
 * Chat Page - AI conversation interface with follow-up support
 *
 * Features:
 * - Maintains conversation context across multiple messages
 * - Auto-scrolls to bottom when new messages arrive
 * - Shows loading state during API calls
 * - Displays error messages with retry option
 * - Token count debugging (hidden behind dev toggle)
 * - TailwindCSS styling with message bubbles
 */
export default function ChatPage() {
  const { messages, sendMessage, resetConversation, isLoading, error, tokenCountString } = useChat();
  const [input, setInput] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header - Modern professional header */}
      <div className="border-b-2 border-gray-200 bg-white px-4 md:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">AI Chat</h1>
            <p className="text-sm text-gray-600">Conversation with context support</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-300"
              title="Toggle debug info"
            >
              Debug
            </button>
            <button
              onClick={resetConversation}
              disabled={messages.length === 0}
              className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white hover:from-red-700 hover:to-red-600 disabled:bg-gray-300 disabled:text-gray-500 transition-all shadow-md"
            >
              Reset
            </button>
          </div>
        </div>
        {showDebug && (
          <div className="mt-3 rounded-xl bg-gray-100 border border-gray-300 px-4 py-2.5 text-xs">
            <div className="font-mono text-gray-700">
              Messages: {messages.length} | Est. Tokens: {tokenCountString}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Area - Modern message bubbles */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-6 text-6xl">💬</div>
              <h2 className="mb-3 text-2xl md:text-3xl font-bold text-gray-900">Start a Conversation</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Send a message to begin. Your conversation history is maintained.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white'
                      : 'bg-white text-gray-800 shadow-md border border-gray-200'
                  }`}
                >
                  <div className="text-xs font-semibold mb-2 opacity-80">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Error Banner - Modern alert */}
      {error && (
        <div className="border-t-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 md:px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="text-sm font-semibold text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => sendMessage(input)}
              className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white hover:from-red-700 hover:to-red-600 transition-all shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Modern input design */}
      <div className="border-t-2 border-gray-200 bg-white px-4 md:px-6 py-6 shadow-lg">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 rounded-xl border-2 border-gray-300 px-5 py-3.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3.5 font-semibold text-white hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-300 disabled:text-gray-500 transition-all shadow-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

