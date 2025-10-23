'use client';

import { useState } from 'react';
import { GeneratedPageData } from '@/lib/openai';
import LeadForm from './LeadForm';

// Lean MVP focuses on email capture only - removed Payment and Booking components

interface GeneratedPageProps {
  data: GeneratedPageData;
  pageSlug?: string;
  isPreview?: boolean;
}

/**
 * GeneratedPage component renders a landing page based on AI-generated data
 * The goalType in data determines which conversion component to render:
 * - 'lead' → LeadForm (email capture)
 * - 'payment' → PaymentBlock (Stripe checkout)
 * - 'booking' → BookingBlock (Calendly embed)
 */
export default function GeneratedPage({ data, pageSlug, isPreview = false }: GeneratedPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Handle publishing the generated page to Supabase
   * After successful publish, redirect to the published page
   */
  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      // Send page JSON to publish API
      const response = await fetch('/api/publish-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageJson: data, // Send the entire generated page data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to publish page');
      }

      const result = await response.json();
      setShowSuccess(true);

      // Copy URL to clipboard
      if (result.url) {
        await navigator.clipboard.writeText(result.url).catch(() => {
          // Clipboard API might fail in some contexts, ignore silently
        });
      }

      // Redirect to the published page immediately
      if (result.slug) {
        window.location.href = `/${result.slug}`;
      }
    } catch (error) {
      console.error('Publish error:', error);
      // Show error alert to user
      alert(`Failed to publish page: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Dynamic color scheme mapping - creates variety in generated pages
   * Uses complete Tailwind class names for JIT compilation compatibility
   */
  const getColorClasses = (colorScheme?: { primary: string; accent: string; style: string }) => {
    // Default to indigo if no color scheme provided
    if (!colorScheme) {
        return {
        hero: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
        heroText: 'text-gray-900',
        subheadText: 'text-gray-700',
        button: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg',
        sectionLight: 'bg-white',
        sectionDark: 'bg-gray-50',
      };
    }

    const { primary, accent, style } = colorScheme;

    // Complete Tailwind class combinations for each color pair
    const gradientMap: Record<string, Record<string, { gradient: string; bold: string; minimal: string }>> = {
      // Primary: indigo
      indigo: {
        pink: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-indigo-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        orange: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-orange-50', bold: 'bg-gradient-to-r from-indigo-100 to-orange-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        cyan: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-indigo-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        lime: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-lime-50', bold: 'bg-gradient-to-r from-indigo-100 to-lime-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        violet: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-violet-50', bold: 'bg-gradient-to-r from-indigo-100 to-violet-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        fuchsia: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50', bold: 'bg-gradient-to-r from-indigo-100 to-fuchsia-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        sky: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-sky-50', bold: 'bg-gradient-to-r from-indigo-100 to-sky-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
        yellow: { gradient: 'bg-gradient-to-br from-indigo-50 via-white to-yellow-50', bold: 'bg-gradient-to-r from-indigo-100 to-yellow-100', minimal: 'bg-gradient-to-b from-white to-indigo-50' },
      },
      // Primary: purple
      purple: {
        pink: { gradient: 'bg-gradient-to-br from-purple-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-purple-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-purple-50' },
        orange: { gradient: 'bg-gradient-to-br from-purple-50 via-white to-orange-50', bold: 'bg-gradient-to-r from-purple-100 to-orange-100', minimal: 'bg-gradient-to-b from-white to-purple-50' },
        cyan: { gradient: 'bg-gradient-to-br from-purple-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-purple-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-purple-50' },
        lime: { gradient: 'bg-gradient-to-br from-purple-50 via-white to-lime-50', bold: 'bg-gradient-to-r from-purple-100 to-lime-100', minimal: 'bg-gradient-to-b from-white to-purple-50' },
        fuchsia: { gradient: 'bg-gradient-to-br from-purple-50 via-white to-fuchsia-50', bold: 'bg-gradient-to-r from-purple-100 to-fuchsia-100', minimal: 'bg-gradient-to-b from-white to-purple-50' },
      },
      // Primary: blue
      blue: {
        pink: { gradient: 'bg-gradient-to-br from-blue-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-blue-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-blue-50' },
        cyan: { gradient: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-blue-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-blue-50' },
        sky: { gradient: 'bg-gradient-to-br from-blue-50 via-white to-sky-50', bold: 'bg-gradient-to-r from-blue-100 to-sky-100', minimal: 'bg-gradient-to-b from-white to-blue-50' },
        indigo: { gradient: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50', bold: 'bg-gradient-to-r from-blue-100 to-indigo-100', minimal: 'bg-gradient-to-b from-white to-blue-50' },
      },
      // Primary: emerald
      emerald: {
        lime: { gradient: 'bg-gradient-to-br from-emerald-50 via-white to-lime-50', bold: 'bg-gradient-to-r from-emerald-100 to-lime-100', minimal: 'bg-gradient-to-b from-white to-emerald-50' },
        cyan: { gradient: 'bg-gradient-to-br from-emerald-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-emerald-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-emerald-50' },
        yellow: { gradient: 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50', bold: 'bg-gradient-to-r from-emerald-100 to-yellow-100', minimal: 'bg-gradient-to-b from-white to-emerald-50' },
      },
      // Primary: rose
      rose: {
        pink: { gradient: 'bg-gradient-to-br from-rose-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-rose-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-rose-50' },
        orange: { gradient: 'bg-gradient-to-br from-rose-50 via-white to-orange-50', bold: 'bg-gradient-to-r from-rose-100 to-orange-100', minimal: 'bg-gradient-to-b from-white to-rose-50' },
        fuchsia: { gradient: 'bg-gradient-to-br from-rose-50 via-white to-fuchsia-50', bold: 'bg-gradient-to-r from-rose-100 to-fuchsia-100', minimal: 'bg-gradient-to-b from-white to-rose-50' },
      },
      // Primary: cyan
      cyan: {
        purple: { gradient: 'bg-gradient-to-br from-cyan-50 via-white to-purple-50', bold: 'bg-gradient-to-r from-cyan-100 to-purple-100', minimal: 'bg-gradient-to-b from-white to-cyan-50' },
        violet: { gradient: 'bg-gradient-to-br from-cyan-50 via-white to-violet-50', bold: 'bg-gradient-to-r from-cyan-100 to-violet-100', minimal: 'bg-gradient-to-b from-white to-cyan-50' },
        pink: { gradient: 'bg-gradient-to-br from-cyan-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-cyan-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-cyan-50' },
        sky: { gradient: 'bg-gradient-to-br from-cyan-50 via-white to-sky-50', bold: 'bg-gradient-to-r from-cyan-100 to-sky-100', minimal: 'bg-gradient-to-b from-white to-cyan-50' },
      },
      // Primary: teal
      teal: {
        cyan: { gradient: 'bg-gradient-to-br from-teal-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-teal-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-teal-50' },
        lime: { gradient: 'bg-gradient-to-br from-teal-50 via-white to-lime-50', bold: 'bg-gradient-to-r from-teal-100 to-lime-100', minimal: 'bg-gradient-to-b from-white to-teal-50' },
        emerald: { gradient: 'bg-gradient-to-br from-teal-50 via-white to-emerald-50', bold: 'bg-gradient-to-r from-teal-100 to-emerald-100', minimal: 'bg-gradient-to-b from-white to-teal-50' },
      },
      // Primary: pink
      pink: {
        orange: { gradient: 'bg-gradient-to-br from-pink-50 via-white to-orange-50', bold: 'bg-gradient-to-r from-pink-100 to-orange-100', minimal: 'bg-gradient-to-b from-white to-pink-50' },
        fuchsia: { gradient: 'bg-gradient-to-br from-pink-50 via-white to-fuchsia-50', bold: 'bg-gradient-to-r from-pink-100 to-fuchsia-100', minimal: 'bg-gradient-to-b from-white to-pink-50' },
        violet: { gradient: 'bg-gradient-to-br from-pink-50 via-white to-violet-50', bold: 'bg-gradient-to-r from-pink-100 to-violet-100', minimal: 'bg-gradient-to-b from-white to-pink-50' },
        rose: { gradient: 'bg-gradient-to-br from-pink-50 via-white to-rose-50', bold: 'bg-gradient-to-r from-pink-100 to-rose-100', minimal: 'bg-gradient-to-b from-white to-pink-50' },
      },
      // Primary: violet
      violet: {
        fuchsia: { gradient: 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50', bold: 'bg-gradient-to-r from-violet-100 to-fuchsia-100', minimal: 'bg-gradient-to-b from-white to-violet-50' },
        purple: { gradient: 'bg-gradient-to-br from-violet-50 via-white to-purple-50', bold: 'bg-gradient-to-r from-violet-100 to-purple-100', minimal: 'bg-gradient-to-b from-white to-violet-50' },
        pink: { gradient: 'bg-gradient-to-br from-violet-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-violet-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-violet-50' },
      },
      // Primary: amber
      amber: {
        yellow: { gradient: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50', bold: 'bg-gradient-to-r from-amber-100 to-yellow-100', minimal: 'bg-gradient-to-b from-white to-amber-50' },
        orange: { gradient: 'bg-gradient-to-br from-amber-50 via-white to-orange-50', bold: 'bg-gradient-to-r from-amber-100 to-orange-100', minimal: 'bg-gradient-to-b from-white to-amber-50' },
      },
      // Primary: orange
      orange: {
        pink: { gradient: 'bg-gradient-to-br from-orange-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-orange-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-orange-50' },
        yellow: { gradient: 'bg-gradient-to-br from-orange-50 via-white to-yellow-50', bold: 'bg-gradient-to-r from-orange-100 to-yellow-100', minimal: 'bg-gradient-to-b from-white to-orange-50' },
        amber: { gradient: 'bg-gradient-to-br from-orange-50 via-white to-amber-50', bold: 'bg-gradient-to-r from-orange-100 to-amber-100', minimal: 'bg-gradient-to-b from-white to-orange-50' },
      },
      // Primary: lime
      lime: {
        emerald: { gradient: 'bg-gradient-to-br from-lime-50 via-white to-emerald-50', bold: 'bg-gradient-to-r from-lime-100 to-emerald-100', minimal: 'bg-gradient-to-b from-white to-lime-50' },
        cyan: { gradient: 'bg-gradient-to-br from-lime-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-lime-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-lime-50' },
        yellow: { gradient: 'bg-gradient-to-br from-lime-50 via-white to-yellow-50', bold: 'bg-gradient-to-r from-lime-100 to-yellow-100', minimal: 'bg-gradient-to-b from-white to-lime-50' },
      },
      // Primary: sky
      sky: {
        cyan: { gradient: 'bg-gradient-to-br from-sky-50 via-white to-cyan-50', bold: 'bg-gradient-to-r from-sky-100 to-cyan-100', minimal: 'bg-gradient-to-b from-white to-sky-50' },
        blue: { gradient: 'bg-gradient-to-br from-sky-50 via-white to-blue-50', bold: 'bg-gradient-to-r from-sky-100 to-blue-100', minimal: 'bg-gradient-to-b from-white to-sky-50' },
        indigo: { gradient: 'bg-gradient-to-br from-sky-50 via-white to-indigo-50', bold: 'bg-gradient-to-r from-sky-100 to-indigo-100', minimal: 'bg-gradient-to-b from-white to-sky-50' },
      },
      // Primary: fuchsia
      fuchsia: {
        pink: { gradient: 'bg-gradient-to-br from-fuchsia-50 via-white to-pink-50', bold: 'bg-gradient-to-r from-fuchsia-100 to-pink-100', minimal: 'bg-gradient-to-b from-white to-fuchsia-50' },
        violet: { gradient: 'bg-gradient-to-br from-fuchsia-50 via-white to-violet-50', bold: 'bg-gradient-to-r from-fuchsia-100 to-violet-100', minimal: 'bg-gradient-to-b from-white to-fuchsia-50' },
        purple: { gradient: 'bg-gradient-to-br from-fuchsia-50 via-white to-purple-50', bold: 'bg-gradient-to-r from-fuchsia-100 to-purple-100', minimal: 'bg-gradient-to-b from-white to-fuchsia-50' },
      },
    };

    // Button color mappings
    const buttonMap: Record<string, string> = {
      indigo: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg',
      purple: 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg',
      blue: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
      emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg',
      rose: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg',
      amber: 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg',
      cyan: 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg',
      teal: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg',
      pink: 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg',
      violet: 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg',
      fuchsia: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-lg',
      lime: 'bg-lime-600 text-white hover:bg-lime-700 shadow-lg',
      sky: 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg',
      orange: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg',
    };

    // Get the gradient combination
    const gradientCombo = gradientMap[primary]?.[accent];
    const heroGradient = gradientCombo ? gradientCombo[style as keyof typeof gradientCombo] || gradientCombo.gradient : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';
    const buttonClasses = buttonMap[primary] || buttonMap.indigo;

    return {
      hero: heroGradient,
      heroText: 'text-gray-900',
      subheadText: 'text-gray-700',
      button: buttonClasses,
      sectionLight: 'bg-white',
      sectionDark: 'bg-gray-50',
    };
  };

  const theme = getColorClasses(data.metadata.colorScheme);
  const heroStyle = data.metadata.heroStyle || 'centered';

  // Render dynamic hero based on heroStyle
  const renderHero = () => {
    const baseClasses = `${theme.hero} px-4 md:px-8 relative overflow-hidden`;

    if (heroStyle === 'centered') {
      // Classic centered hero
      return (
        <section className={`${baseClasses} py-24 md:py-32 lg:py-40`}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className={`${theme.heroText} text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight`}>
              {data.headline}
            </h1>
            <p className={`${theme.subheadText} text-xl md:text-2xl lg:text-3xl mb-14 leading-relaxed max-w-4xl mx-auto font-light`}>
              {data.subheadline}
            </p>
            <div className="max-w-xl mx-auto mb-8">
              {pageSlug ? <LeadForm pageSlug={pageSlug} /> : (
                <button className={`${theme.button} px-10 py-5 rounded-xl text-xl font-bold transition-all transform hover:scale-105 hover:shadow-2xl`}>
                  {data.cta}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-6 font-medium">
              ✨ No credit card required • Free forever • 2 min setup
            </p>
          </div>
        </section>
      );
    } else if (heroStyle === 'split') {
      // Two-column hero with visual area
      return (
        <section className={`${baseClasses} py-20 md:py-28`}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-left">
              <h1 className={`${theme.heroText} text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight`}>
                {data.headline}
              </h1>
              <p className={`${theme.subheadText} text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed`}>
                {data.subheadline}
              </p>
              <div className="mb-6">
                {pageSlug ? <LeadForm pageSlug={pageSlug} /> : (
                  <button className={`${theme.button} px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105`}>
                    {data.cta}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-600 font-medium">
                ✨ No credit card • Free forever
              </p>
            </div>
            <div className={`${theme.hero} rounded-3xl p-16 flex items-center justify-center shadow-2xl`}>
              <span className="text-9xl">✨</span>
            </div>
          </div>
        </section>
      );
    } else if (heroStyle === 'minimal') {
      // Ultra-clean, spacious hero
  return (
        <section className={`${baseClasses} py-32 md:py-44`}>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className={`${theme.heroText} text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-tight`}>
            {data.headline}
          </h1>
            <p className={`${theme.subheadText} text-2xl md:text-3xl mb-16 leading-relaxed max-w-3xl mx-auto`}>
            {data.subheadline}
          </p>
            <div className="max-w-2xl mx-auto">
              {pageSlug ? <LeadForm pageSlug={pageSlug} /> : (
                <button className={`${theme.button} px-12 py-6 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105`}>
                {data.cta}
              </button>
            )}
            </div>
          </div>
        </section>
      );
    } else {
      // Bold - Large, dramatic with more content
      return (
        <section className={`${baseClasses} py-28 md:py-36`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className={`inline-block px-6 py-3 rounded-full ${theme.button} text-sm font-bold mb-8`}>
              🚀 New & Improved
            </div>
            <h1 className={`${theme.heroText} text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight`}>
              {data.headline}
            </h1>
            <p className={`${theme.subheadText} text-xl md:text-2xl lg:text-3xl mb-12 leading-relaxed max-w-4xl mx-auto`}>
              {data.subheadline}
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              {pageSlug ? <LeadForm pageSlug={pageSlug} /> : (
                <button className={`${theme.button} px-12 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 hover:shadow-2xl`}>
                  {data.cta}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-8 font-medium">
              ⭐ Trusted by 10,000+ users • ✨ No credit card required • 🚀 2 min setup
            </p>
          </div>
        </section>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHero()}

      {/* Content Sections - Dynamic layouts based on AI selection */}
      {data.sections.map((section, index) => {
        const isEven = index % 2 === 0;
        const layout = section.layout || 'centered';
        const icon = section.icon || '✨';

        return (
          <section
            key={index}
            className={`${isEven ? theme.sectionLight : theme.sectionDark} py-20 md:py-28 px-4 md:px-8 relative`}
          >
            <div className="max-w-6xl mx-auto">
              {layout === 'centered' && (
                // Centered layout with icon badge
                <div className="text-center max-w-4xl mx-auto">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${theme.button} mb-6`}>
                    <span className="text-3xl">{icon}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {section.title}
                  </h2>
                  <div className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    {section.content}
                  </div>
                </div>
              )}

              {layout === 'split' && (
                // Two-column split layout
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${theme.button}`}>
                      Featured
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {section.title}
                    </h2>
                    <div className="text-lg text-gray-700 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                  <div className={`${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className={`aspect-square rounded-3xl ${theme.hero} p-12 flex items-center justify-center shadow-xl`}>
                      <span className="text-8xl">{icon}</span>
                    </div>
                  </div>
                </div>
              )}

              {layout === 'card' && (
                // Card layout with side icon
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-gray-200">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${theme.button} flex items-center justify-center`}>
                        <span className="text-2xl">{icon}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                          {section.title}
                        </h2>
                        <div className="text-lg text-gray-700 leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {layout === 'feature' && (
                // Highlighted feature
                <div className="max-w-5xl mx-auto">
                  <div className={`${theme.hero} rounded-3xl p-12 md:p-16 shadow-2xl`}>
                    <div className="text-center">
                      <span className="text-6xl mb-6 block">{icon}</span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {section.title}
                      </h2>
                      <div className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {layout === 'list' && (
                // List-style layout
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start gap-6">
                    <span className="text-5xl flex-shrink-0">{icon}</span>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {section.title}
                      </h2>
                      <div className="text-lg text-gray-700 leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {layout === 'highlight' && (
                // Emphasized callout section
                <div className="max-w-5xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-20 shadow-2xl text-center">
                    <span className="text-6xl mb-6 block">{icon}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                      {section.title}
                    </h2>
                    <div className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                      {section.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Final CTA Section - One more conversion opportunity */}
      {!isPreview && (
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-24 md:py-32 px-4 md:px-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to get started?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of users who are already using {data.title}
            </p>

            {pageSlug && (
              <div className="max-w-2xl mx-auto">
                <LeadForm pageSlug={pageSlug} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer - Clean, minimal design */}
      <footer className="bg-black text-white py-12 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Publish Button for Preview Mode - Prominent, styled */}
          {isPreview ? (
            <div className="text-center">
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3 justify-center">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  '🚀 Publish This Page'
                )}
            </button>
              <p className="text-gray-500 text-sm mt-4">
                Your page will be live in seconds
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                <p className="text-gray-400 text-sm">
                  Powered by LaunchPage AI ✨
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-500 text-sm">
                  © 2025 All rights reserved
                </p>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
