'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MangaMDSearchResult {
  id: string;
  title: string;
  description: string;
  status: string;
  year?: number;
  contentRating: string;
  authors: string[];
  artists: string[];
  tags: string[];
  altTitles: Array<{ [key: string]: string }>;
}

interface SearchResponse {
  success: boolean;
  data: MangaMDSearchResult[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface ImportResponse {
  success: boolean;
  error?: string;
  series: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    mangaMDId: string;
    mangaMDStatus: string;
    tags: string[];
    authors: string[];
    artists: string[];
  };
}

export default function MangaMDImportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MangaMDSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState('');
  const [creators, setCreators] = useState<Array<{ id: string; name: string; username: string; role?: string }>>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      console.log('Searching for:', searchQuery);
      const response = await fetch(`/api/admin/mangaMD/search?q=${encodeURIComponent(searchQuery)}`);
      console.log('Response status:', response.status);
      
      const data: SearchResponse = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setSearchResults(data.data);
        console.log('Search results:', data.data);
      } else {
        setError('Failed to search MangaMD');
      }
    } catch (err) {
      setError('Error searching MangaMD');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (mangaId: string, title: string) => {
    if (!selectedCreator) {
      setError('Please select a creator');
      return;
    }

    setIsImporting(mangaId);
    setError('');

    try {
      const response = await fetch('/api/admin/mangaMD/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mangaMDId: mangaId,
          creatorId: selectedCreator,
        }),
      });

      const data: ImportResponse = await response.json();

      if (data.success) {
        setSuccess(`Successfully imported "${title}"`);
        // Remove the imported manga from search results
        setSearchResults(prev => prev.filter(manga => manga.id !== mangaId));
      } else {
        setError(data.error || 'Failed to import manga');
      }
    } catch (err) {
      setError('Error importing manga');
      console.error('Import error:', err);
    } finally {
      setIsImporting(null);
    }
  };

  const loadCreators = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setCreators(data.users.filter((user: any) => user.role === 'CREATOR' || user.role === 'ADMIN'));
      }
    } catch (err) {
      console.error('Error loading creators:', err);
    }
  };

  // Load creators on component mount
  useEffect(() => {
    loadCreators();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import Manga from MangaMD</h1>
          <p className="mt-2 text-gray-600">
            Search and import manga metadata from MangaMD to add to your platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-800">{success}</div>
          </div>
        )}

        {/* Creator Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Creator</h2>
          <select
            value={selectedCreator}
            onChange={(e) => setSelectedCreator(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a creator...</option>
            {creators.map((creator) => (
              <option key={creator.id} value={creator.id}>
                {creator.name || creator.username}{creator.role ? ` (${creator.role})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search MangaMD</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter manga title to search..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {searchResults.map((manga) => (
                <div key={manga.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {manga.title}
                      </h3>
                      
                      {manga.description && (
                        <p className="text-gray-600 mb-3 line-clamp-3">
                          {manga.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span>Status: <span className="font-medium capitalize">{manga.status}</span></span>
                        {manga.year && <span>Year: <span className="font-medium">{manga.year}</span></span>}
                        <span>Rating: <span className="font-medium capitalize">{manga.contentRating}</span></span>
                      </div>

                      {manga.authors.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Authors: </span>
                          <span className="text-sm text-gray-600">{manga.authors.join(', ')}</span>
                        </div>
                      )}

                      {manga.artists.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Artists: </span>
                          <span className="text-sm text-gray-600">{manga.artists.join(', ')}</span>
                        </div>
                      )}

                      {manga.tags.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Tags: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {manga.tags.slice(0, 10).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {manga.tags.length > 10 && (
                              <span className="text-xs text-gray-500">
                                +{manga.tags.length - 10} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-6">
                      <button
                        onClick={() => handleImport(manga.id, manga.title)}
                        disabled={isImporting === manga.id || !selectedCreator}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isImporting === manga.id ? 'Importing...' : 'Import'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
