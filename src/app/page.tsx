'use client';

import { useState } from 'react';
import { GeneratedPageData } from '@/lib/openai';
import GeneratedPage from '@/components/GeneratedPage';

/**
 * Lean MVP Homepage - Focused on email capture landing pages
 * Removed goal selector - all pages are email capture only
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
      // Lean MVP: Always generate email capture pages (goalType: 'lead')
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          goalType: 'lead'  // Lean MVP focuses on email capture only
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header - Enhanced design */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LaunchPage AI
                </h1>
                <p className="text-xs md:text-sm text-gray-600 mt-0.5">AI-Powered Landing Pages in Seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* View Leads Dashboard */}
              <a
                href="/leads"
                className="text-sm md:text-base text-gray-700 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
              >
                <span className="hidden md:inline">📊</span>
                <span>My Leads</span>
              </a>

              {/* Create New Page button */}
              {generatedPage && (
                <button
                  onClick={handleNewPage}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg transform hover:scale-105 text-sm md:text-base"
                >
                  Create New Page
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!generatedPage ? (
          /* Generation Form */
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Create Stunning Landing Pages
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  In Seconds
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                AI-powered landing page generator with dynamic layouts, beautiful designs, and built-in email capture
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unique every time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Ready in 30 seconds</span>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 relative overflow-hidden">
              {/* Decorative blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30"></div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                  Describe Your Product
                </h3>

                <form onSubmit={handleGenerate} className="space-y-6">
                  {/* Info Badge */}
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">✨</span>
                      <div>
                        <p className="font-bold text-indigo-900 mb-1">Email Capture Landing Pages</p>
                        <p className="text-sm text-indigo-800">
                          Every page includes a professional email capture form, unique layouts, and dynamic color schemes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prompt Input */}
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-bold text-gray-900 mb-3">
                      What are you selling?
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., I sell a Notion productivity course for busy freelancers who want to get organized fast"
                      className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 resize-none text-lg transition-all"
                      rows={5}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-sm text-gray-600 font-medium">
                        💡 Be specific about your audience and benefits
                      </p>
                      <span className="text-sm font-semibold text-gray-500">
                        {prompt.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-8 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl transform hover:scale-105"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating Your Landing Page...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>✨ Generate Landing Page</span>
                        <span>→</span>
                      </span>
                    )}
                  </button>
                </form>

                {error && (
                  <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400 text-red-800 px-6 py-4 rounded-2xl shadow-lg">
                    <span className="font-semibold">⚠️ {error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setPrompt("Notion productivity course for busy freelancers who want to get organized fast")}
                className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-all text-left group"
              >
                <span className="text-2xl mb-3 block">📚</span>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
                  "Notion productivity course for busy freelancers who want to get organized fast"
                </p>
              </button>
              <button
                onClick={() => setPrompt("AI-powered social media scheduler for solopreneurs and small businesses")}
                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all text-left group"
              >
                <span className="text-2xl mb-3 block">🤖</span>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                  "AI-powered social media scheduler for solopreneurs and small businesses"
                </p>
              </button>
              <button
                onClick={() => setPrompt("Weekend coding bootcamp for career switchers looking to break into tech")}
                className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 transition-all text-left group"
              >
                <span className="text-2xl mb-3 block">💻</span>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600">
                  "Weekend coding bootcamp for career switchers looking to break into tech"
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* Generated Page Preview */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Landing Page</h2>
              <p className="text-gray-600 mb-4">
                Preview your page below. Click "Publish Page" to make it live and get a shareable URL.
              </p>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-lg">
              <GeneratedPage data={generatedPage} isPreview={true} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <h3 className="text-2xl font-bold">LaunchPage AI</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Built with Next.js, OpenAI, TailwindCSS, and Supabase
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span>© 2025 LaunchPage AI</span>
              <span>•</span>
              <a href="/leads" className="hover:text-white transition-colors">View Leads</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
