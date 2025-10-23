'use client';

import { useState } from 'react';
import { GeneratedPageData } from '@/lib/openai';
import LeadForm from './LeadForm';
import PaymentBlock from './PaymentBlock';
import BookingBlock from './BookingBlock';

interface GeneratedPageProps {
  data: GeneratedPageData;
  pageSlug?: string;
  isPreview?: boolean;
}

export default function GeneratedPage({ data, pageSlug, isPreview = false }: GeneratedPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = async () => {
    if (!pageSlug) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/publish-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageJson: data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish page');
      }

      const result = await response.json();
      setShowSuccess(true);

      // Copy URL to clipboard
      await navigator.clipboard.writeText(result.url);

      // Show success message
      alert(`Page published! URL copied to clipboard: ${result.url}`);
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeClasses = () => {
    switch (data.metadata.theme) {
      case 'bold':
        return {
          hero: 'bg-gradient-to-br from-purple-600 to-blue-600',
          text: 'text-white',
          button: 'bg-white text-purple-600 hover:bg-gray-100',
          section: 'bg-gray-50',
        };
      case 'minimal':
        return {
          hero: 'bg-white border-b border-gray-200',
          text: 'text-gray-900',
          button: 'bg-black text-white hover:bg-gray-800',
          section: 'bg-white',
        };
      default: // simple
        return {
          hero: 'bg-blue-600',
          text: 'text-white',
          button: 'bg-white text-blue-600 hover:bg-gray-100',
          section: 'bg-gray-50',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className={`${theme.hero} py-20 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`${theme.text} text-4xl md:text-6xl font-bold mb-6`}>
            {data.headline}
          </h1>
          <p className={`${theme.text} text-xl md:text-2xl mb-8 opacity-90`}>
            {data.subheadline}
          </p>

          {/* CTA Button */}
          <div className="mb-8">
            {data.goalType === 'lead' && pageSlug ? (
              <LeadForm pageSlug={pageSlug} />
            ) : data.goalType === 'payment' ? (
              <PaymentBlock data={data} pageSlug={pageSlug} />
            ) : data.goalType === 'booking' ? (
              <BookingBlock data={data} />
            ) : (
              <button className={`${theme.button} px-8 py-4 rounded-lg text-lg font-semibold transition-colors`}>
                {data.cta}
              </button>
            )}
          </div>

          {/* Hero Image */}
          {data.metadata.imgPrompt && (
            <div className="mt-12">
              <img
                src={`https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&${encodeURIComponent(data.metadata.imgPrompt)}`}
                alt={data.headline}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback to a generic business image
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Content Sections */}
      {data.sections.map((section, index) => (
        <section key={index} className={`${theme.section} py-16 px-4`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              {section.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              {section.content}
            </p>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">{data.title}</h3>
          <p className="text-gray-400 mb-6">
            Generated with LaunchPage AI
          </p>

          {/* Publish Button for Preview Mode */}
          {isPreview && (
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Page'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
