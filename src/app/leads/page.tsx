'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  metadata?: any;
}

interface LeadsData {
  pageSlug: string;
  count: number;
  leads: Lead[];
}

/**
 * Leads Dashboard - View all collected emails from your landing pages
 */
export default function LeadsPage() {
  const [pageSlug, setPageSlug] = useState('');
  const [leadsData, setLeadsData] = useState<LeadsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = async (slug: string) => {
    if (!slug.trim()) {
      setError('Please enter a page slug');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/leads?pageSlug=${encodeURIComponent(slug)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leads');
      }

      const data = await response.json();
      setLeadsData(data);
    } catch (error) {
      console.error('Fetch leads error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch leads');
      setLeadsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(pageSlug);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadCSV = () => {
    if (!leadsData || leadsData.leads.length === 0) return;

    const headers = ['Email', 'Created At', 'Source'];
    const rows = leadsData.leads.map(lead => [
      lead.email,
      formatDate(lead.created_at),
      lead.metadata?.source || 'landing-page',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${leadsData.pageSlug}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl hover:scale-110 transition-transform">
                <span className="text-2xl">🚀</span>
              </a>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                  Leads Dashboard
                </h1>
                <p className="text-xs md:text-sm text-gray-600 mt-0.5">View your collected emails</p>
              </div>
            </div>

            <a
              href="/"
              className="text-sm md:text-base text-gray-700 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            View Leads by Page Slug
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pageSlug" className="block text-sm font-bold text-gray-900 mb-2">
                Enter Page Slug
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="pageSlug"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  placeholder="e.g., my-landing-page-xyz123"
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 text-lg transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !pageSlug.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'View Leads'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              💡 The slug is the last part of your published page URL (e.g., <code className="bg-gray-100 px-2 py-1 rounded">yourdomain.com/<strong>my-page-slug</strong></code>)
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Special slug:</strong> Use <code className="bg-white px-2 py-1 rounded font-mono">"landing-page"</code> to view leads from the homepage "Get Started Free" button
              </p>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400 text-red-800 px-6 py-4 rounded-xl shadow-lg">
              <span className="font-semibold">⚠️ {error}</span>
            </div>
          )}
        </div>

        {/* Leads Display */}
        {leadsData && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Leads for: <span className="text-indigo-600">{leadsData.pageSlug}</span>
                </h3>
                <p className="text-lg text-gray-600">
                  Total: <strong className="text-gray-900">{leadsData.count} leads</strong>
                </p>
              </div>

              {leadsData.leads.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <span>📥</span>
                  <span>Download CSV</span>
                </button>
              )}
            </div>

            {/* Leads Table */}
            {leadsData.leads.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl mb-6 block">📭</span>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">No leads yet</h4>
                <p className="text-gray-600">
                  Leads will appear here once visitors submit their email on your landing page
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-900">#</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Email</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Submitted</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsData.leads.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className="border-b border-gray-100 hover:bg-indigo-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-900">{lead.email}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {lead.metadata?.source || 'landing-page'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              Track your leads and grow your business
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

