'use client';

import { useState } from 'react';

interface LeadFormProps {
  pageSlug: string;
}

/**
 * Simplified LeadForm - Email only (no name field)
 * Streamlined for faster conversions
 */
export default function LeadForm({ pageSlug }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          pageSlug,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Lead form error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 text-green-900 px-10 py-8 rounded-2xl shadow-2xl max-w-lg mx-auto animate-in">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="font-bold text-2xl text-center mb-2">🎉 You're all set!</p>
        <p className="text-center text-base">Check your inbox — we'll send you something special soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Enhanced email form with better visual design */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-3 border border-gray-200/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            required
            className="flex-1 px-6 py-5 rounded-xl border-2 border-transparent bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:bg-white focus:border-indigo-400 text-lg transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Get Started →'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400 text-red-800 px-6 py-4 rounded-xl text-base shadow-lg">
          <span className="font-semibold">⚠️ {error}</span>
        </div>
      )}
    </form>
  );
}
