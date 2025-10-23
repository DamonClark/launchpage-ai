import { NextRequest, NextResponse } from 'next/server';
import { getLeadsByPageSlug } from '@/lib/supabase';

/**
 * API route to retrieve leads for a specific page
 * GET /api/leads?pageSlug=your-slug
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('pageSlug');

    if (!pageSlug) {
      return NextResponse.json(
        { error: 'pageSlug query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch leads from Supabase for this page
    const leads = await getLeadsByPageSlug(pageSlug);

    return NextResponse.json({
      pageSlug,
      count: leads.length,
      leads: leads.map(lead => ({
        id: lead.id,
        email: lead.email,
        name: lead.name,
        created_at: lead.created_at,
        metadata: lead.metadata,
      })),
    });
  } catch (error) {
    console.error('Leads retrieval error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to retrieve leads' },
      { status: 500 }
    );
  }
}
