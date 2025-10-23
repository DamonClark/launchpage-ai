import { NextRequest, NextResponse } from 'next/server';
import { createPage } from '@/lib/supabase';
import { GeneratedPageData } from '@/lib/openai';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function generateSlug(headline: string): string {
  const baseSlug = slugify(headline);
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomId}`;
}

export async function POST(request: NextRequest) {
  try {
    const { pageJson, desiredSlug, userId }: {
      pageJson: GeneratedPageData;
      desiredSlug?: string;
      userId?: string;
    } = await request.json();

    if (!pageJson || !pageJson.title || !pageJson.headline) {
      return NextResponse.json(
        { error: 'Invalid page data provided' },
        { status: 400 }
      );
    }

    // Generate slug
    let slug: string;
    if (desiredSlug && desiredSlug.trim()) {
      slug = slugify(desiredSlug.trim());
      if (slug.length === 0) {
        slug = generateSlug(pageJson.headline);
      }
    } else {
      slug = generateSlug(pageJson.headline);
    }

    // Ensure slug is unique by appending random suffix if needed
    let finalSlug = slug;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        await createPage(finalSlug, pageJson.title, pageJson);
        break;
      } catch (error: any) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          // Slug already exists, try with a different suffix
          finalSlug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
          attempts++;
        } else {
          throw error;
        }
      }
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Unable to generate unique slug. Please try again.' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseUrl}/${finalSlug}`;

    return NextResponse.json({
      slug: finalSlug,
      url,
    });
  } catch (error) {
    console.error('Publish page error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to publish page' },
      { status: 500 }
    );
  }
}
