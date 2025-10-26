'use client';

import { useState } from 'react';
import { GeneratedPageData } from '@/lib/openai';
import GeneratedPage from '@/components/GeneratedPage';

/**
 * Professional Hand-Coded Homepage
 * Clean semantic HTML with modern design patterns
 */
export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [generatedPage, setGeneratedPage] = useState<GeneratedPageData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a description for your landing page');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          goalType: 'lead'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate page');
      }

      const data = await response.json();
      setGeneratedPage(data);
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate landing page');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewPage = () => {
    setGeneratedPage(null);
    setPrompt('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="site-header">
        <div className="container">
          <nav className="nav-bar">
            <div className="brand-section">
              <div className="brand-icon">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="brand-content">
                <h1 className="brand-title">LaunchPage AI</h1>
                <p className="brand-subtitle">AI-Powered Landing Pages in Seconds</p>
              </div>
            </div>

            <div className="nav-actions">
              <a href="/leads" className="nav-link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>My Leads</span>
              </a>

              {generatedPage && (
                <button onClick={handleNewPage} className="btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Page
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {!generatedPage ? (
          <div className="content-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h2 className="hero-title">
                  Create Stunning Landing Pages
                  <span className="hero-title-accent">In Seconds</span>
                </h2>
                <p className="hero-description">
                  AI-powered landing page generator with dynamic layouts, beautiful designs, and built-in email capture
                </p>

                {/* Trust Indicators */}
                <div className="trust-indicators">
                  <div className="trust-item">
                    <svg className="trust-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Unique every time</span>
                  </div>
                  <div className="trust-item">
                    <svg className="trust-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Ready in 30 seconds</span>
                  </div>
                  <div className="trust-item">
                    <svg className="trust-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Built-in email capture</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Generator Form Section */}
            <section className="generator-section">
              <div className="generator-card">
                <div className="generator-decorations">
                  <div className="decoration-blur decoration-blur--top-right"></div>
                  <div className="decoration-blur decoration-blur--bottom-left"></div>
                </div>

                <div className="generator-content">
                  <h3 className="generator-title">Describe Your Product</h3>

                  <form onSubmit={handleGenerate} className="generator-form">
                    {/* Feature Highlight */}
                    <div className="feature-highlight">
                      <div className="feature-icon">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="feature-content">
                        <h4 className="feature-title">Email Capture Landing Pages</h4>
                        <p className="feature-description">
                          Every page includes a professional email capture form, unique layouts, and dynamic color schemes
                        </p>
                      </div>
                    </div>

                    {/* Input Section */}
                    <div className="input-section">
                      <label htmlFor="prompt" className="input-label">
                        What are you selling?
                      </label>
                      <div className="textarea-wrapper">
                        <textarea
                          id="prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g., I sell a Notion productivity course for busy freelancers who want to get organized fast"
                          className="prompt-textarea"
                          rows={5}
                          maxLength={500}
                        />
                        <div className="textarea-footer">
                          <div className="input-hint">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Be specific about your audience and benefits</span>
                          </div>
                          <div className="character-count">
                            {prompt.length}/500
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isGenerating || !prompt.trim()}
                      className="submit-button"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="loading-spinner" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating Your Landing Page...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Generate Landing Page</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  {error && (
                    <div className="error-message">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section className="examples-section">
              <div className="examples-grid">
                <button
                  onClick={() => setPrompt("Notion productivity course for busy freelancers who want to get organized fast")}
                  className="example-card example-card--education"
                >
                  <div className="example-icon">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="example-text">
                    "Notion productivity course for busy freelancers who want to get organized fast"
                  </p>
                </button>

                <button
                  onClick={() => setPrompt("AI-powered social media scheduler for solopreneurs and small businesses")}
                  className="example-card example-card--saas"
                >
                  <div className="example-icon">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="example-text">
                    "AI-powered social media scheduler for solopreneurs and small businesses"
                  </p>
                </button>

                <button
                  onClick={() => setPrompt("Weekend coding bootcamp for career switchers looking to break into tech")}
                  className="example-card example-card--tech"
                >
                  <div className="example-icon">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <p className="example-text">
                    "Weekend coding bootcamp for career switchers looking to break into tech"
                  </p>
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* Generated Page Preview */
          <section className="preview-section">
            <div className="preview-header">
              <h2 className="preview-title">Generated Landing Page</h2>
              <p className="preview-description">
                Preview your page below. Click "Publish Page" to make it live and get a shareable URL.
              </p>
            </div>

            <div className="preview-container">
              <GeneratedPage data={generatedPage} isPreview={true} />
            </div>
          </section>
        )}
      </main>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-icon">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="footer-title">LaunchPage AI</h3>
            </div>
            <p className="footer-description">
              Built with Next.js, OpenAI, TailwindCSS, and Supabase
            </p>
            <div className="footer-links">
              <span className="footer-copyright">© 2025 LaunchPage AI</span>
              <span className="footer-separator">•</span>
              <a href="/leads" className="footer-link">View Leads</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
