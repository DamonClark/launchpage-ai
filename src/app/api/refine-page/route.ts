import { NextRequest, NextResponse } from 'next/server';
import { refinePageFromChat } from '@/lib/openai';
import { GeneratedPageData } from '@/lib/openai';

/**
 * Page Refinement API Route
 *
 * POST /api/refine-page
 * Body: { originalPrompt, currentPageData, refinementPrompt, conversationHistory }
 *
 * This endpoint refines an existing generated page based on user feedback.
 * It uses conversation history to maintain context across multiple refinements.
 */
export async function POST(request: NextRequest) {
  try {
    const { originalPrompt, currentPageData, refinementPrompt, conversationHistory } = await request.json();

    // Validate required fields
    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return NextResponse.json(
        { error: 'originalPrompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!currentPageData || typeof currentPageData !== 'object') {
      return NextResponse.json(
        { error: 'currentPageData is required and must be an object' },
        { status: 400 }
      );
    }

    if (!refinementPrompt || typeof refinementPrompt !== 'string') {
      return NextResponse.json(
        { error: 'refinementPrompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate conversation history if provided
    if (conversationHistory && !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'conversationHistory must be an array' },
        { status: 400 }
      );
    }

    // Refine the page
    const refinedPage = await refinePageFromChat(
      originalPrompt,
      currentPageData as GeneratedPageData,
      refinementPrompt,
      conversationHistory || []
    );

    return NextResponse.json(refinedPage);
  } catch (error) {
    console.error('Refine page error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to refine landing page' },
      { status: 500 }
    );
  }
}

