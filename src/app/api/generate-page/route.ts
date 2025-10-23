import { NextRequest, NextResponse } from 'next/server';
import { generatePageFromPrompt } from '@/lib/openai';

// Define valid goal types
type GoalType = 'lead' | 'payment' | 'booking';

export async function POST(request: NextRequest) {
  try {
    // Accept both prompt AND goalType from request
    const { prompt, goalType } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Validate goalType
    const validGoalTypes: GoalType[] = ['lead', 'payment', 'booking'];
    if (!goalType || !validGoalTypes.includes(goalType)) {
      return NextResponse.json(
        { error: 'goalType is required and must be one of: lead, payment, booking' },
        { status: 400 }
      );
    }

    // Generate page with user-selected goalType
    const generatedPage = await generatePageFromPrompt(prompt.trim(), goalType);

    return NextResponse.json(generatedPage);
  } catch (error) {
    console.error('Generate page error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate landing page' },
      { status: 500 }
    );
  }
}
