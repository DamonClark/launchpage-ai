'use client';

import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * usePageRefinement - Custom hook for managing page refinement chat
 *
 * Similar to useChat but specifically designed for refining generated pages.
 * Maintains conversation history and calls the refine-page API.
 */
export function usePageRefinement() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refine the page based on user input
   */
  const refinePage = useCallback(async (
    originalPrompt: string,
    currentPageData: any,
    userInput: string
  ): Promise<any> => {
    if (!userInput.trim()) {
      return null;
    }

    console.log('🚀 [Client] Refinement requested:', userInput);
    console.log('📦 [Client] Current page data:', currentPageData);

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to chat history
      const userMessage: ChatMessage = { role: 'user', content: userInput.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      console.log('📤 [Client] Sending to API:', {
        originalPrompt,
        refinementPrompt: userInput,
        conversationHistoryLength: updatedMessages.length,
        currentColor: currentPageData.metadata?.colorScheme?.primary
      });

      // Call refinement API
      const response = await fetch('/api/refine-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPrompt,
          currentPageData,
          refinementPrompt: userInput.trim(),
          conversationHistory: updatedMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ [Client] API error:', errorData);
        throw new Error(errorData.error || 'Failed to refine page');
      }

      const refinedData = await response.json();

      console.log('✅ [Client] Received refined data:', {
        title: refinedData.title,
        newColor: refinedData.metadata?.colorScheme?.primary,
        sectionCount: refinedData.sections?.length
      });

      // Add assistant response to chat history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I've updated your page based on your request.`,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      return refinedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Page refinement error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  /**
   * Reset the chat conversation
   */
  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    refinePage,
    resetChat,
    isLoading,
    error,
  };
}

