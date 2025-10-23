import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, pageSlug, metadata }: {
      name?: string;
      email: string;
      pageSlug: string;
      metadata?: any;
    } = await request.json();

    if (!email || !pageSlug) {
      return NextResponse.json(
        { error: 'Email and pageSlug are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create lead record
    const lead = await createLead(pageSlug, email, name, metadata);

    // TODO: Optional - Send email notification
    // if (process.env.SENDER_EMAIL) {
    //   await sendLeadNotification(lead);
    // }

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        email: lead.email,
        name: lead.name,
        created_at: lead.created_at,
      },
    });
  } catch (error) {
    console.error('Lead creation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}
