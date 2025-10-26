'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { GeneratedPageData } from '@/lib/openai';
import LeadForm from './LeadForm';
import PaymentBlock from './PaymentBlock';
import BookingBlock from './BookingBlock';

interface GeneratedPageProps {
  data: GeneratedPageData;
  pageSlug?: string;
  isPreview?: boolean;
}

type ThemeKey = 'minimalist' | 'gradient' | 'dark' | 'elegant' | 'playful';

interface Theme {
  heroBg: string;
  heroText: string;
  heroButton: string;
  sectionBg: string;
  sectionText: string;
  sectionSubtext: string;
  footerBg: string;
  footerText: string;
  cardBg?: string;
  cardShadow?: string;
  font?: string;
}

const themes: Record<ThemeKey, Theme> = {
  minimalist: {
    heroBg: 'bg-white',
    heroText: 'text-gray-900',
    heroButton: 'bg-black text-white hover:bg-gray-900',
    sectionBg: 'bg-white',
    sectionText: 'text-gray-900',
    sectionSubtext: 'text-gray-600',
    footerBg: 'bg-gray-100',
    footerText: 'text-gray-900',
    cardBg: 'bg-white',
    cardShadow: 'shadow-md',
    font: 'font-inter',
  },
  gradient: {
    heroBg: 'bg-gradient-to-br from-indigo-600 to-fuchsia-500',
    heroText: 'text-white',
    heroButton: 'bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:opacity-95',
    sectionBg: 'bg-gray-50',
    sectionText: 'text-gray-900',
    sectionSubtext: 'text-gray-700',
    footerBg: 'bg-indigo-700',
    footerText: 'text-white',
    cardBg: 'bg-white',
    cardShadow: 'shadow-lg',
    font: 'font-poppins',
  },
  dark: {
    heroBg: 'bg-neutral-950',
    heroText: 'text-gray-100',
    heroButton: 'bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-medium text-white',
    sectionBg: 'bg-neutral-900',
    sectionText: 'text-gray-100',
    sectionSubtext: 'text-gray-400',
    footerBg: 'bg-black',
    footerText: 'text-white',
    cardBg: 'bg-gray-800',
    cardShadow: 'shadow-[0_10px_40px_rgba(2,6,23,0.7)]',
    font: 'font-satoshi',
  },
  elegant: {
    heroBg: 'bg-gray-50',
    heroText: 'text-gray-900',
    heroButton: 'bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700',
    sectionBg: 'bg-gray-50',
    sectionText: 'text-gray-900',
    sectionSubtext: 'text-gray-600',
    footerBg: 'bg-gray-100',
    footerText: 'text-gray-900',
    cardBg: 'bg-white',
    cardShadow: 'shadow-lg',
    font: 'font-sans',
  },
  playful: {
    heroBg: 'bg-yellow-50',
    heroText: 'text-gray-900',
    heroButton: 'bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold',
    sectionBg: 'bg-yellow-50',
    sectionText: 'text-gray-900',
    sectionSubtext: 'text-gray-700',
    footerBg: 'bg-yellow-100',
    footerText: 'text-gray-900',
    cardBg: 'bg-white',
    cardShadow: 'shadow-md',
    font: 'font-rubik',
  },
};

// helper to pick random theme if none selected
function getRandomTheme(): ThemeKey {
  const keys: ThemeKey[] = Object.keys(themes) as ThemeKey[];
  return keys[Math.floor(Math.random() * keys.length)];
}

export default function GeneratedPage({ data, pageSlug, isPreview = false }: GeneratedPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (!pageSlug) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/publish-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageJson: data }),
      });
      if (!response.ok) throw new Error('Failed to publish page');
      const result = await response.json();
      alert(`Page published! URL copied to clipboard: ${result.url}`);
      await navigator.clipboard.writeText(result.url);
    } catch (error) {
      console.error(error);
      alert('Failed to publish page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const themeKey = (data.metadata.theme as ThemeKey) || getRandomTheme();
  const theme = themes[themeKey];

  return (
    <div className={clsx('min-h-screen flex flex-col', theme.font)}>
      {/* Hero */}
      <section className={clsx(theme.heroBg, 'py-20 px-4')}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className={clsx(theme.heroText, 'text-4xl md:text-6xl font-bold')}>
            {data.headline}
          </h1>
          <p className={clsx(theme.heroText, 'text-xl md:text-2xl opacity-90')}>
            {data.subheadline}
          </p>

          {/* CTA */}
          <div className="mt-6">
            {data.goalType === 'lead' && pageSlug ? (
              <LeadForm pageSlug={pageSlug} />
            ) : data.goalType === 'payment' ? (
              <PaymentBlock data={data} pageSlug={pageSlug} />
            ) : data.goalType === 'booking' ? (
              <BookingBlock data={data} />
            ) : (
              <button
                className={clsx(theme.heroButton, 'px-8 py-4 rounded-lg text-lg font-semibold transition-colors')}
              >
                {data.cta}
              </button>
            )}
          </div>

          {data.metadata.imgPrompt && (
            <div className="mt-12">
              <img
                src={`https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&${encodeURIComponent(data.metadata.imgPrompt)}`}
                alt={data.headline}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Sections */}
      {data.sections.map((section, idx) => (
        <section key={idx} className={clsx(theme.sectionBg, 'py-16 px-4')}>
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className={clsx(theme.sectionText, 'text-3xl md:text-4xl font-bold')}>
              {section.title}
            </h2>
            <p className={clsx(theme.sectionSubtext, 'text-lg leading-relaxed')}>
              {section.content}
            </p>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className={clsx(theme.footerBg, 'py-12 px-4 mt-auto')}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className={clsx(theme.footerText, 'text-2xl font-bold')}>
            {data.title}
          </h3>
          <p className={clsx(theme.footerText, 'text-gray-400')}>
            Generated with LaunchPage AI
          </p>

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
