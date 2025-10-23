'use client';

import { useState } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LeadCaptureModal - Quick lead capture for homepage "Get Started Free" button
 * Captures email and stores in Supabase leads table
 */
/**
 * Simplified LeadCaptureModal - Email only (no name field)
 */
export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Submit to lead API with 'landing-page' as default pageSlug
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          pageSlug: 'landing-page', // Default page reference for homepage leads
          metadata: {
            source: 'homepage-get-started',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }

      // Show success state
      setSuccess(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        // Reset form
        setEmail('');
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Lead capture error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {success ? (
            // Success state
            <div className="text-center py-8">
              <div className="mb-4 text-green-600">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thanks!</h3>
              <p className="text-gray-600">We'll be in touch soon.</p>
            </div>
          ) : (
            // Form state
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started Free</h2>
              <p className="text-gray-600 mb-6">
                Create your first landing page in seconds. No credit card required.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Simplified to email only - no name field */}
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Started'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Create professional landing pages in seconds
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
