'use client';

import { GeneratedPageData } from '@/lib/openai';

interface BookingBlockProps {
  data: GeneratedPageData;
}

export default function BookingBlock({ data }: BookingBlockProps) {
  // For MVP, we'll use a placeholder Calendly URL
  // In production, this could be dynamically set based on the business
  const calendlyUrl = 'https://calendly.com/your-username/30min';

  const handleBooking = () => {
    // Open Calendly in a new window
    window.open(calendlyUrl, '_blank', 'width=800,height=600');
  };

  return (
    <div className="text-center">
      <button
        onClick={handleBooking}
        className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        {data.cta}
      </button>

      <p className="mt-4 text-sm text-gray-600">
        📅 Opens booking calendar in new window
      </p>

      {/* Alternative: Embedded Calendly widget */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Or book directly:</p>
          <iframe
            src={`${calendlyUrl}?embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&embed_type=Inline`}
            width="100%"
            height="400"
            frameBorder="0"
            title="Booking Calendar"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
