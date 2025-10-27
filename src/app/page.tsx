'use client';

import { useState, useEffect } from 'react';
import { GeneratedPageData } from '@/lib/openai';
import GeneratedPage from '@/components/GeneratedPage';
import { usePageRefinement } from '@/hooks/usePageRefinement';

/**
 * Professional Hand-Coded Homepage with AI Chat Refinement
 * Clean semantic HTML with modern design patterns
 */
export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [generatedPage, setGeneratedPage] = useState<GeneratedPageData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Chat refinement hook
  const { messages, refinePage, resetChat, isLoading: isRefining, error: chatError } = usePageRefinement();

  // Track when generatedPage changes
  useEffect(() => {
    if (generatedPage) {
      console.log('🔄 [Effect] generatedPage changed:', {
        title: generatedPage.title,
        color: generatedPage.metadata?.colorScheme?.primary
      });
    }
  }, [generatedPage]);

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
      setOriginalPrompt(prompt.trim()); // Save for refinement context
      setShowChatPanel(true); // Show chat panel after generation
      resetChat(); // Reset chat history
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
    setShowChatPanel(false);
    resetChat();
  };

  const handleRefinePage = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🖱️ [Page] Refine button clicked');
    console.log('📝 [Page] Chat input:', chatInput);
    console.log('📄 [Page] Has generated page:', !!generatedPage);

    if (!chatInput.trim() || !generatedPage) {
      console.warn('⚠️ [Page] Missing input or page:', { hasInput: !!chatInput.trim(), hasPage: !!generatedPage });
      return;
    }

    console.log('➡️ [Page] Calling refinePage...');
    const refinedData = await refinePage(originalPrompt, generatedPage, chatInput);

    console.log('👀 [Page] Got result:', refinedData ? 'Success' : 'Failed');

    if (refinedData) {
      console.log('💾 [Page] Updating page with refined data');
      console.log('🎨 [Page] Old color:', generatedPage.metadata?.colorScheme?.primary);
      console.log('🎨 [Page] New color:', refinedData.metadata?.colorScheme?.primary);
      console.log('📦 [Page] Full refined data:', refinedData);

      // Force update by creating new object reference and incrementing key
      setGeneratedPage({ ...refinedData });
      setRenderKey(prev => prev + 1); // Force component re-render
      setChatInput(''); // Clear input

      console.log('✅ [Page] State updated, key:', renderKey + 1);
    } else {
      console.error('❌ [Page] No refined data returned!');
    }
  };

  const handleChatToggle = () => {
    setShowChatPanel(!showChatPanel);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation Header - Clean backdrop blur */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4 md:py-6">
            {/* Brand Section - Professional gradient */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-2.5 rounded-xl shadow-md">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                  LaunchPage AI
                </h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">AI-Powered Landing Pages</p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <a href="/leads" className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden md:inline">My Leads</span>
              </a>

              {generatedPage && (
                <button onClick={handleNewPage} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-sm md:text-base hover:from-indigo-700 hover:to-indigo-600 shadow-lg transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden md:inline">Create New Page</span>
                  <span className="md:hidden">New</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {!generatedPage ? (
          <div className="max-w-5xl mx-auto">
            {/* Modern Hero Section - Centered with gradient background */}
            <section className="text-center mb-16 md:mb-20">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Hero Title with Gradient Accent */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                  Create Stunning Landing Pages
                  <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                    In Seconds
                  </span>
                </h2>

                {/* Hero Description */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  AI-powered landing page generator with dynamic layouts, beautiful designs, and built-in email capture
                </p>

                {/* Trust Indicators - Modern badge style */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-base">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-700">Unique every time</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-700">Ready in 30 seconds</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-700">Built-in email capture</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Generator Form Section - Modern card with subtle gradient */}
            <section className="mb-16">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
                    Describe Your Product
                  </h3>

                  <form onSubmit={handleGenerate} className="space-y-8">
                    {/* Feature Highlight - Modern info card */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6 flex gap-4 items-start">
                      <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-3 rounded-xl shadow-md flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Email Capture Landing Pages</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Every page includes a professional email capture form, unique layouts, and dynamic color schemes
                        </p>
                      </div>
                    </div>

                    {/* Input Section - Clean modern textarea */}
                    <div className="space-y-3">
                      <label htmlFor="prompt" className="block text-sm font-bold text-gray-900">
                        What are you selling?
                      </label>
                      <div>
                        <textarea
                          id="prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g., I sell a Notion productivity course for busy freelancers who want to get organized fast"
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg font-family-inherit resize-none transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white"
                          rows={5}
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Be specific about your audience and benefits</span>
                          </div>
                          <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                            {prompt.length}/500
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button - Modern gradient button */}
                    <button
                      type="submit"
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all hover:from-indigo-700 hover:to-indigo-600 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating Your Landing Page...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Generate Landing Page</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Error Message - Modern alert style */}
                  {error && (
                    <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 text-red-800 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Examples Section - Modern card grid */}
            <section className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Try These Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setPrompt("Notion productivity course for busy freelancers who want to get organized fast")}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6 cursor-pointer transition-all hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 text-left"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                    "Notion productivity course for busy freelancers who want to get organized fast"
                  </p>
                </button>

                <button
                  onClick={() => setPrompt("AI-powered social media scheduler for solopreneurs and small businesses")}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6 cursor-pointer transition-all hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 text-left"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                    "AI-powered social media scheduler for solopreneurs and small businesses"
                  </p>
                </button>

                <button
                  onClick={() => setPrompt("Weekend coding bootcamp for career switchers looking to break into tech")}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6 cursor-pointer transition-all hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 text-left"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                    "Weekend coding bootcamp for career switchers looking to break into tech"
                  </p>
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* Generated Page Preview - Modern preview header */
          <section className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Generated Landing Page</h2>
                  <p className="text-gray-600">
                    Preview your page below. Use the chat panel to refine your design.
                  </p>
                </div>
                <button
                  onClick={handleChatToggle}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm md:text-base font-semibold text-white hover:from-indigo-700 hover:to-indigo-600 shadow-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {showChatPanel ? 'Hide Chat' : 'Refine with AI'}
                </button>
              </div>
            </div>

            {/* Chat Panel - Modern design */}
            {showChatPanel && (
              <div className="mx-auto mb-6 max-w-4xl">
                <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
                  {/* Chat Header - Professional gradient */}
                  <div className="border-b-2 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4">
                    <h3 className="text-base font-bold text-gray-900">AI Refinement Assistant</h3>
                    <p className="text-sm text-gray-600 mt-1">Tell me what to change: colors, style, content, layout, or tone</p>
                  </div>

                  {/* Quick Action Buttons - Modern pill buttons */}
                  <div className="border-b border-gray-200 px-6 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setChatInput('Make it more modern and professional')}
                        disabled={isRefining}
                        className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Modern
                      </button>
                      <button
                        onClick={() => setChatInput('Change colors to blue and purple')}
                        disabled={isRefining}
                        className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Blue/ Purple
                      </button>
                      <button
                        onClick={() => setChatInput('Make it more bold and energetic')}
                        disabled={isRefining}
                        className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Bold
                      </button>
                      <button
                        onClick={() => setChatInput('Add more sections about benefits')}
                        disabled={isRefining}
                        className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        More Sections
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages - Modern message bubbles */}
                  <div className="max-h-64 overflow-y-auto p-6">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center py-8 text-center text-gray-500">
                        <div>
                          <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <p className="text-sm font-semibold mb-1">Start refining your page</p>
                          <p className="text-xs text-gray-400">Click a quick action above or type your own request</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {isRefining && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl bg-gray-100 px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input - Modern input design */}
                  <div className="border-t-2 border-gray-200 p-6">
                    {chatError && (
                      <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                        {chatError}
                      </div>
                    )}
                    <form onSubmit={handleRefinePage} className="flex gap-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="e.g., 'Make colors more vibrant', 'Change to modern style', 'Add 2 more sections'"
                        disabled={isRefining}
                        className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isRefining}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-300 transition-all shadow-lg"
                      >
                        Refine
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl">
              <GeneratedPage key={renderKey} data={generatedPage} isPreview={true} />
            </div>
          </section>
        )}
      </main>

      {/* Site Footer - Modern professional footer */}
      <footer className="mt-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-2 rounded-xl">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">LaunchPage AI</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              Built with Next.js, OpenAI, TailwindCSS, and Supabase
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-gray-400">
              <span>© 2025 LaunchPage AI</span>
              <span className="hidden sm:inline">•</span>
              <a href="/leads" className="text-indigo-400 hover:text-indigo-300 transition-colors">View Leads</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
