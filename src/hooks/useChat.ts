'use client';

import { useState, useCallback } from 'react';
import { estimateConversationTokens, formatTokenCount } from '@/utils/tokenEstimate';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UseChatOptions {
  maxMessages?: number; // Number of recent messages to keep (default: 15)
  apiEndpoint?: string; // API endpoint for chat (default: '/api/chat')
}

/**
 * useChat - Custom hook for managing AI chat conversation state
 *
 * Features:
 * - Maintains message history in React state
 * - Automatically trims older messages to manage token usage
 * - Handles loading and error states
 * - Provides token estimation for debugging
 */
export function useChat(options: UseChatOptions = {}) {
  const { maxMessages = 15, apiEndpoint = '/api/chat' } = options;

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Trim older messages from the conversation if it exceeds maxMessages
   * Keeps the most recent messages (system message always preserved if first)
   */
  const trimMessages = useCallback((msgs: ChatMessage[]): ChatMessage[] => {
    if (msgs.length <= maxMessages) {
      return msgs;
    }

    // Keep system message if present at index 0
    const systemMessage = msgs[0]?.role === 'system' ? [msgs[0]] : [];

    // Keep the most recent messages (excluding system if present)
    const recentMessages = systemMessage.length > 0
      ? msgs.slice(1).slice(-maxMessages + 1)
      : msgs.slice(-maxMessages);

    return [...systemMessage, ...recentMessages];
  }, [maxMessages]);

  /**
   * Send a user message and get an AI response
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to state
      const userMessage: ChatMessage = { role: 'user', content: content.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Call API with full conversation history
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: trimMessages(updatedMessages), // Trim before sending
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add assistant response to state
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, apiEndpoint, trimMessages]);

  /**
   * Reset the conversation to empty state
   */
  const resetConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Get estimated token count for current conversation (for debugging)
   */
  const estimatedTokens = estimateConversationTokens(messages);
  const tokenCountString = formatTokenCount(estimatedTokens);

  return {
    messages,
    sendMessage,
    resetConversation,
    isLoading,
    error,
    estimatedTokens,
    tokenCountString,
  };
}

