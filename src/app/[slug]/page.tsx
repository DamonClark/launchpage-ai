import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/supabase';
import GeneratedPage from '@/components/GeneratedPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise and must be awaited
  const { slug } = await params;

  try {
    const page = await getPageBySlug(slug);

    if (!page) {
      notFound();
    }

    return (
      <GeneratedPage
        data={page.json}
        pageSlug={slug}
        isPreview={false}
      />
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  // Await params Promise in Next.js 15+
  const { slug } = await params;

  try {
    const page = await getPageBySlug(slug);

    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.json.title || page.title,
      description: page.json.subheadline || 'Generated with LaunchPage AI',
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}
