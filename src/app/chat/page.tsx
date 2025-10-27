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
      {/* Header */}
      <div className="border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
            <p className="text-sm text-gray-500">Conversation with context support</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              title="Toggle debug info"
            >
              Debug
            </button>
            <button
              onClick={resetConversation}
              disabled={messages.length === 0}
              className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              Reset
            </button>
          </div>
        </div>
        {showDebug && (
          <div className="mt-2 rounded bg-gray-100 px-3 py-2 text-xs">
            <div className="font-mono text-gray-700">
              Messages: {messages.length} | Est. Tokens: {tokenCountString}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-4xl">💬</div>
              <h2 className="mb-2 text-xl font-semibold text-gray-700">Start a Conversation</h2>
              <p className="text-gray-500">
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <div className="text-sm font-medium mb-1 opacity-70">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
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

      {/* Error Banner */}
      {error && (
        <div className="border-t bg-red-50 px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => sendMessage(input)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white px-4 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

