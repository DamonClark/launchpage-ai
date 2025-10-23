import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { pageSlug, priceId, successUrl, cancelUrl }: {
      pageSlug: string;
      priceId: string;
      successUrl?: string;
      cancelUrl?: string;
    } = await request.json();

    if (!pageSlug || !priceId) {
      return NextResponse.json(
        { error: 'pageSlug and priceId are required' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      pageSlug,
      priceId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
