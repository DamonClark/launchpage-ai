'use client';

import { useState } from 'react';
import { GeneratedPageData } from '@/lib/openai';

interface PaymentBlockProps {
  data: GeneratedPageData;
  pageSlug?: string;
}

export default function PaymentBlock({ data, pageSlug }: PaymentBlockProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!data.priceId) {
      setError('No price ID configured for this product');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSlug: pageSlug || 'preview',
          priceId: data.priceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handlePayment}
        disabled={isLoading || !data.priceId}
        className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : data.cta}
      </button>

      {!data.priceId && (
        <p className="mt-4 text-sm text-yellow-600">
          ⚠️ No Stripe price ID configured. This is a demo button.
        </p>
      )}

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      )}
    </div>
  );
}
