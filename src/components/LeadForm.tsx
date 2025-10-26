'use client';

import { useState } from 'react';

interface LeadFormProps {
  pageSlug: string;
  variant?: 'colored' | 'white'; // Background context
}

/**
 * Simplified LeadForm - Email only (no name field)
 * Streamlined for faster conversions
 */
export default function LeadForm({ pageSlug, variant = 'colored' }: LeadFormProps) {
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

  // Styling based on background variant
  const isWhiteBg = variant === 'white';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          required
          className={`flex-1 px-6 py-4 rounded-xl text-base transition-all focus:outline-none focus:ring-4 ${
            isWhiteBg
              ? 'border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400'
              : 'border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:ring-white/30'
          }`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-4 rounded-xl font-bold transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
            isWhiteBg
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-white text-indigo-600 hover:bg-gray-100'
          }`}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Get Started'
          )}
        </button>
      </div>

      {error && (
        <div className={`mt-3 text-sm text-center ${
          isWhiteBg ? 'text-red-600' : 'text-white/90'
        }`}>
          {error}
        </div>
      )}
    </form>
  );
}
