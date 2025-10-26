'use client';

import { useState, useMemo, useEffect } from 'react';
import { GeneratedPageData } from '@/lib/openai';
import LeadForm from './LeadForm';
import PaymentBlock from './PaymentBlock';
import BookingBlock from './BookingBlock';

interface GeneratedPageProps {
  data: GeneratedPageData;
  pageSlug?: string;
  isPreview?: boolean;
}

type ThemeKey = 'indigo' | 'purple' | 'blue' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'teal' | 'pink' | 'violet';

interface Theme {
  heroBg: string;
  heroText: string;
  heroButton: string;
  sectionBg: string;
  sectionText: string;
  sectionSubtext: string;
  footerBg: string;
  footerText: string;
  accentColor: string;
}

const colorThemes: Record<ThemeKey, Theme> = {
  indigo: {
    heroBg: 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-indigo-50',
    sectionText: 'text-indigo-900',
    sectionSubtext: 'text-indigo-700',
    footerBg: 'bg-indigo-900',
    footerText: 'text-white',
    accentColor: 'indigo',
  },
  purple: {
    heroBg: 'bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-purple-50',
    sectionText: 'text-purple-900',
    sectionSubtext: 'text-purple-700',
    footerBg: 'bg-purple-900',
    footerText: 'text-white',
    accentColor: 'purple',
  },
  blue: {
    heroBg: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-blue-50',
    sectionText: 'text-blue-900',
    sectionSubtext: 'text-blue-700',
    footerBg: 'bg-blue-900',
    footerText: 'text-white',
    accentColor: 'blue',
  },
  emerald: {
    heroBg: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-emerald-50',
    sectionText: 'text-emerald-900',
    sectionSubtext: 'text-emerald-700',
    footerBg: 'bg-emerald-900',
    footerText: 'text-white',
    accentColor: 'emerald',
  },
  rose: {
    heroBg: 'bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-rose-50',
    sectionText: 'text-rose-900',
    sectionSubtext: 'text-rose-700',
    footerBg: 'bg-rose-900',
    footerText: 'text-white',
    accentColor: 'rose',
  },
  amber: {
    heroBg: 'bg-gradient-to-br from-amber-600 via-amber-500 to-orange-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-amber-50',
    sectionText: 'text-amber-900',
    sectionSubtext: 'text-amber-700',
    footerBg: 'bg-amber-900',
    footerText: 'text-white',
    accentColor: 'amber',
  },
  cyan: {
    heroBg: 'bg-gradient-to-br from-cyan-600 via-cyan-500 to-blue-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-cyan-600 hover:bg-cyan-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-cyan-50',
    sectionText: 'text-cyan-900',
    sectionSubtext: 'text-cyan-700',
    footerBg: 'bg-cyan-900',
    footerText: 'text-white',
    accentColor: 'cyan',
  },
  teal: {
    heroBg: 'bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-teal-600 hover:bg-teal-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-teal-50',
    sectionText: 'text-teal-900',
    sectionSubtext: 'text-teal-700',
    footerBg: 'bg-teal-900',
    footerText: 'text-white',
    accentColor: 'teal',
  },
  pink: {
    heroBg: 'bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-pink-50',
    sectionText: 'text-pink-900',
    sectionSubtext: 'text-pink-700',
    footerBg: 'bg-pink-900',
    footerText: 'text-white',
    accentColor: 'pink',
  },
  violet: {
    heroBg: 'bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600',
    heroText: 'text-white',
    heroButton: 'bg-white text-violet-600 hover:bg-violet-50 px-8 py-4 rounded-xl font-bold shadow-xl transition-all',
    sectionBg: 'bg-violet-50',
    sectionText: 'text-violet-900',
    sectionSubtext: 'text-violet-700',
    footerBg: 'bg-violet-900',
    footerText: 'text-white',
    accentColor: 'violet',
  },
};

const themes = colorThemes;

function getRandomTheme(): ThemeKey {
  const keys: ThemeKey[] = Object.keys(themes) as ThemeKey[];
  return keys[Math.floor(Math.random() * keys.length)];
}

type SectionLayout = 'stacked' | 'split' | 'grid';

function getSectionLayout(section: GeneratedPageData['sections'][0], idx: number): SectionLayout {
  // First check if section has explicit layout from AI
  if (section.layout === 'split') return 'split';
  if (section.layout === 'card' || section.layout === 'feature') return 'grid';

  // Alternate patterns
  const layouts: SectionLayout[] = ['stacked', 'split', 'stacked', 'grid', 'stacked', 'split'];
  return layouts[idx % layouts.length];
}

export default function GeneratedPage({ data, pageSlug, isPreview = false }: GeneratedPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [randomTheme, setRandomTheme] = useState<ThemeKey>('indigo');
  const [heroStyle, setHeroStyle] = useState<string>('centered');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRandomTheme(getRandomTheme());
    const styles = ['centered', 'large', 'minimal', 'bold'];
    setHeroStyle(styles[Math.floor(Math.random() * styles.length)]);
  }, []);

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/publish-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageJson: data }),
      });
      if (!response.ok) throw new Error('Failed to publish page');
      const result = await response.json();
      await navigator.clipboard.writeText(result.url);
      // Redirect to the published page
      window.location.href = result.url;
    } catch (error) {
      console.error(error);
      alert('Failed to publish page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use random theme selected on component mount
  const theme = themes[randomTheme];

  if (!mounted) {
    return null;
  }

  const renderSection = (section: GeneratedPageData['sections'][0], idx: number) => {
    const layout = getSectionLayout(section, idx);
    // Alternate between colored and white backgrounds
    const bgClass = idx % 2 === 0
      ? `${theme.sectionBg}`
      : 'bg-white';

    if (layout === 'split') {
      return (
        <section key={idx} className={`${bgClass} py-16 px-4`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className={`${theme.sectionText} text-3xl md:text-4xl font-bold mb-6`}>
                  {section.icon && <span className="text-5xl mr-3">{section.icon}</span>}
                  {section.title}
                </h2>
                <p className={`${theme.sectionSubtext} text-lg leading-relaxed`}>
                  {section.content}
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-2xl p-8 h-64 flex items-center justify-center">
                <span className="text-8xl opacity-20">{section.icon || '✨'}</span>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (layout === 'grid') {
      const items = section.content.split(/[•\n]/).filter(Boolean);
      return (
        <section key={idx} className={`${bgClass} py-16 px-4`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`${theme.sectionText} text-3xl md:text-4xl font-bold text-center mb-12`}>
              {section.icon && <span className="text-5xl">{section.icon}</span>}
              <span className="block mt-4">{section.title}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-4xl mx-auto">
              {items.slice(0, 6).map((item, i) => (
                <div key={i} className="bg-white shadow-lg rounded-xl p-6">
                  <p className={`${theme.sectionSubtext} text-sm leading-relaxed`}>{item.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Default: stacked layout with improved typography
    return (
      <section key={idx} className={`${bgClass} py-20 px-4 md:px-8`}>
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {section.icon && (
            <div className="text-7xl mb-6">{section.icon}</div>
          )}
          <h2 className={`${theme.sectionText} text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight`}>
            {section.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto my-8"></div>
          <p className={`${theme.sectionSubtext} text-lg md:text-xl leading-relaxed max-w-3xl mx-auto`}>
            {section.content}
          </p>
        </div>
      </section>
    );
  };

  // Render different hero styles
  const renderHero = () => {
    if (heroStyle === 'large') {
      return (
        <section className={`${theme.heroBg} py-32 px-4`}>
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className={`${theme.heroText} text-5xl md:text-7xl lg:text-8xl font-black leading-tight`}>
              {data.headline}
            </h1>
            <p className={`${theme.heroText} text-2xl md:text-3xl font-medium max-w-4xl mx-auto opacity-95`}>
              {data.subheadline}
            </p>
            <div className="mt-12">
              {data.goalType === 'lead' && pageSlug ? (
                <LeadForm pageSlug={pageSlug} />
              ) : data.goalType === 'payment' ? (
                <PaymentBlock data={data} pageSlug={pageSlug} />
              ) : data.goalType === 'booking' ? (
                <BookingBlock data={data} />
              ) : (
                <button className={`${theme.heroButton} text-xl px-12 py-5 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all`}>
                  {data.cta}
                </button>
              )}
            </div>
          </div>
        </section>
      );
    } else if (heroStyle === 'minimal') {
      return (
        <section className="bg-white py-24 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className={`text-4xl md:text-6xl font-bold text-gray-900`}>
              {data.headline}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {data.subheadline}
            </p>
            <div className="mt-8">
              {data.goalType === 'lead' && pageSlug ? (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email..."
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 text-base"
                      />
                      <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors whitespace-nowrap w-full sm:w-auto">
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              ) : data.goalType === 'payment' ? (
                <PaymentBlock data={data} pageSlug={pageSlug} />
              ) : data.goalType === 'booking' ? (
                <BookingBlock data={data} />
              ) : (
                <button className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  {data.cta}
                </button>
              )}
            </div>
          </div>
        </section>
      );
    } else if (heroStyle === 'bold') {
      return (
        <section className={`${theme.heroBg} py-24 px-4 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">

            <h1 className={`${theme.heroText} text-4xl md:text-6xl lg:text-7xl font-black leading-tight`}>
              {data.headline}
            </h1>
            <p className={`${theme.heroText} text-xl md:text-2xl opacity-95`}>
              {data.subheadline}
            </p>
            <div className="mt-8">
              {data.goalType === 'lead' && pageSlug ? (
                <LeadForm pageSlug={pageSlug} />
              ) : data.goalType === 'payment' ? (
                <PaymentBlock data={data} pageSlug={pageSlug} />
              ) : data.goalType === 'booking' ? (
                <BookingBlock data={data} />
              ) : (
                <button className={`${theme.heroButton} text-lg px-10 py-5 rounded-2xl font-bold shadow-2xl`}>
                  {data.cta}
                </button>
              )}
            </div>
          </div>
        </section>
      );
    } else {
      // Default centered style
  return (
        <section className={`${theme.heroBg} py-20 px-4`}>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className={`${theme.heroText} text-4xl md:text-6xl font-bold`}>
            {data.headline}
          </h1>
            <p className={`${theme.heroText} text-xl md:text-2xl opacity-90`}>
            {data.subheadline}
          </p>
            <div className="mt-6">
            {data.goalType === 'lead' && pageSlug ? (
              <LeadForm pageSlug={pageSlug} />
            ) : data.goalType === 'payment' ? (
              <PaymentBlock data={data} pageSlug={pageSlug} />
            ) : data.goalType === 'booking' ? (
              <BookingBlock data={data} />
            ) : (
                <button className={`${theme.heroButton} px-8 py-4 rounded-lg text-lg font-semibold transition-colors`}>
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
      );
    }
  };

  // No decorative transitions - let sections blend naturally

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      {renderHero()}

      {/* Sections */}
      {data.sections.map((section, idx) => renderSection(section, idx))}

      {/* Footer */}
      <footer className={`${theme.footerBg} py-12 px-4 mt-auto`}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className={`${theme.footerText} text-2xl font-bold`}>
            {data.title}
          </h3>
          <p className={`${theme.footerText} text-gray-400`}>
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
