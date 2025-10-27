import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

/**
 * Chat API Route - Handles OpenAI chat completions with conversation context
 *
 * POST /api/chat
 * Body: { messages: ChatMessage[] }
 *
 * Features:
 * - Maintains full conversation context via messages array
 * - Uses OpenAI Chat Completions API
 * - Server-side only (keeps API key secure)
 * - Supports follow-up prompts with full context
 */
export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const { messages } = await request.json();

    // Validate messages array
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages must be an array' },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'at least one message is required' },
        { status: 400 }
      );
    }

    // Validate each message structure
    for (const msg of messages) {
      if (!msg.role || !['system', 'user', 'assistant'].includes(msg.role)) {
        return NextResponse.json(
          { error: 'invalid message role' },
          { status: 400 }
        );
      }
      if (!msg.content || typeof msg.content !== 'string') {
        return NextResponse.json(
          { error: 'message content must be a string' },
          { status: 400 }
        );
      }
    }

    // Call OpenAI Chat Completions API with full message history
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
      }>,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract assistant response
    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    // Return assistant message content
    return NextResponse.json({ content: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle OpenAI API errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

