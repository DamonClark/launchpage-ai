/**
 * Simple token estimation utility for debugging conversation length
 *
 * This is a rough heuristic: ~1 token ≈ 4 characters for English text
 * More accurate tokenizers exist (e.g., tiktoken) but this is lightweight
 * for development debugging.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Estimate approximate token count for a single message
 * Uses a simple 4-characters-per-token heuristic
 */
export function estimateTokens(message: ChatMessage): number {
  const content = message.content || '';
  const role = message.role || '';

  // Count content chars (approximately 4 chars = 1 token)
  const contentTokens = Math.ceil(content.length / 4);

  // Count role/metadata (always present in API calls)
  const overheadTokens = 5; // role, formatting, etc.

  return contentTokens + overheadTokens;
}

/**
 * Estimate total tokens for a conversation
 */
export function estimateConversationTokens(messages: ChatMessage[]): number {
  return messages.reduce((total, message) => {
    return total + estimateTokens(message);
  }, 0);
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) {
    return `${tokens} tokens`;
  }
  return `${(tokens / 1000).toFixed(1)}k tokens`;
}

