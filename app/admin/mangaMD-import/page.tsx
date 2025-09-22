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
  coverUrl?: string | null;
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
  const [legalImportTitle, setLegalImportTitle] = useState('');
  const [selectedLegalSource, setSelectedLegalSource] = useState('');
  const [batchSize, setBatchSize] = useState(50);
  const [maxManga, setMaxManga] = useState(1000);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

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
    console.log('Import button clicked:', { mangaId, title, selectedCreator });
    
    if (!selectedCreator) {
      setError('Please select a creator');
      return;
    }

    setIsImporting(mangaId);
    setError('');
    setSuccess('');

    try {
      console.log('Sending import request:', { mangaMDId: mangaId, creatorId: selectedCreator });
      
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

      console.log('Import response status:', response.status);
      const data: ImportResponse = await response.json();
      console.log('Import response data:', data);

      if (response.status === 401) {
        setError('Unauthorized: Please sign out and sign back in to refresh your admin permissions.');
        return;
      }

      if (response.status === 403) {
        setError('Forbidden: You do not have admin permissions. Please contact an administrator.');
        return;
      }

      if (data.success) {
        setSuccess(`✅ Successfully imported "${title}" to the public library and added MangaDex reading site!`);
        // Remove the imported manga from search results
        setSearchResults(prev => prev.filter(manga => manga.id !== mangaId));
        // Show success message for 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to import manga');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Import error:', err);
    } finally {
      setIsImporting(null);
    }
  };

  const handleTestImport = async (mangaId: string, title: string) => {
    console.log('Test import button clicked:', { mangaId, title });
    
    setIsImporting(mangaId);
    setError('');
    setSuccess('');

    try {
      // Use the test creator we just created
      const testCreatorId = "cmft9z0ao0000n6y4510tk99h"; // This is the ID from the debug output
      
      console.log('Sending test import request:', { mangaMDId: mangaId, creatorId: testCreatorId });
      
      const response = await fetch('/api/admin/mangaMD/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mangaMDId: mangaId,
          creatorId: testCreatorId,
        }),
      });

      console.log('Test import response status:', response.status);
      const data: ImportResponse = await response.json();
      console.log('Test import response data:', data);

      if (response.status === 401) {
        setError('Unauthorized: Please sign out and sign back in to refresh your admin permissions.');
        return;
      }

      if (response.status === 403) {
        setError('Forbidden: You do not have admin permissions. Please contact an administrator.');
        return;
      }

      if (data.success) {
        setSuccess(`✅ Test import successful! "${title}" has been added to the public library!`);
        // Remove the imported manga from search results
        setSearchResults(prev => prev.filter(manga => manga.id !== mangaId));
        // Show success message for 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to import manga');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Test import error:', err);
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


  const importFromLegalSource = async () => {
    try {
      setError('');
      setSuccess('');

      if (!legalImportTitle.trim() || !selectedLegalSource || !selectedCreator) {
        setError('Please fill in all fields and select a creator');
        return;
      }
      
      console.log('Importing from legal source:', { legalImportTitle, selectedLegalSource, selectedCreator });
      
      const response = await fetch('/api/admin/legal-sources/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mangaTitle: legalImportTitle.trim(),
          sourceId: selectedLegalSource,
          creatorId: selectedCreator,
        }),
      });

      console.log('Legal source import response status:', response.status);
      const data = await response.json();
      console.log('Legal source import response data:', data);

      if (response.status === 401) {
        setError('Unauthorized: Please sign out and sign back in to refresh your admin permissions.');
        return;
      }

      if (response.status === 403) {
        setError('Forbidden: You do not have admin permissions. Please contact an administrator.');
        return;
      }

      if (data.success) {
        const chapterInfo = data.chapters ? ` with ${data.chapters.count} chapters` : '';
        const readingSitesInfo = data.readingSites ? ` and ${data.readingSites.count} legal reading sites` : '';
        setSuccess(`✅ Successfully imported "${data.series.title}" from legal source${chapterInfo}${readingSitesInfo}!`);
        
        // Clear form
        setLegalImportTitle('');
        setSelectedLegalSource('');
        
        // Show success message for 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to import from legal source');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Legal source import error:', err);
    }
  };

  const startBulkImport = async () => {
    try {
      setError('');
      setSuccess('');
      setIsBulkImporting(true);

      if (!selectedCreator) {
        setError('Please select a creator');
        return;
      }
      
      console.log('Starting bulk import:', { batchSize, maxManga, selectedCreator });
      
      const response = await fetch('/api/admin/mangaMD/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchSize,
          maxManga,
          creatorId: selectedCreator,
        }),
      });

      console.log('Bulk import response status:', response.status);
      const data = await response.json();
      console.log('Bulk import response data:', data);

      if (response.status === 401) {
        setError('Unauthorized: Please sign out and sign back in to refresh your admin permissions.');
        return;
      }

      if (response.status === 403) {
        setError('Forbidden: You do not have admin permissions. Please contact an administrator.');
        return;
      }

      if (data.success) {
        setSuccess(`✅ Bulk import completed! Imported ${data.summary.imported} manga, skipped ${data.summary.skipped}, ${data.summary.errors} errors. Use Manga Curation to review and publish manga.`);
        
        // Show success message for 10 seconds
        setTimeout(() => setSuccess(''), 10000);
      } else {
        setError(data.error || 'Failed to start bulk import');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Bulk import error:', err);
    } finally {
      setIsBulkImporting(false);
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


        {/* Bulk Import from MangaDex */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Import from MangaDex</h2>
          <p className="text-gray-600 mb-4">
            Import all manga from MangaDex catalog. Manga will be imported as unpublished so you can curate them later.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  placeholder="50"
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 50)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Manga to Import
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={maxManga}
                  onChange={(e) => setMaxManga(parseInt(e.target.value) || 1000)}
                />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="text-yellow-800 text-sm">
                <strong>Warning:</strong> This will import a large number of manga and may take a long time. 
                All imported manga will be unpublished by default. Use the Manga Curation page to review and publish manga.
              </div>
            </div>
            <button
              onClick={startBulkImport}
              disabled={!selectedCreator || isBulkImporting}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 font-medium"
            >
              {isBulkImporting ? 'Importing...' : 'Start Bulk Import'}
            </button>
          </div>
        </div>

        {/* Import from Legal Sources */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Import from Legal Sources</h2>
          <p className="text-gray-600 mb-4">
            Import manga with correct chapter counts and legal source links from official publishers.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manga Title
              </label>
              <input
                type="text"
                placeholder="e.g., Kaiju No. 8"
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={legalImportTitle}
                onChange={(e) => setLegalImportTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legal Source
              </label>
              <select
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLegalSource}
                onChange={(e) => setSelectedLegalSource(e.target.value)}
              >
                <option value="">Select a legal source...</option>
                <option value="viz-shonen-jump">Viz Media - Shonen Jump</option>
                <option value="shueisha-jump-plus">Shueisha - Jump+</option>
                <option value="mangaplus">Manga Plus by Shueisha</option>
              </select>
            </div>
            <button
              onClick={importFromLegalSource}
              disabled={!legalImportTitle.trim() || !selectedLegalSource || !selectedCreator}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              Import from Legal Source
            </button>
          </div>
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
                      <div className="flex items-start gap-4">
                        {manga.coverUrl && (
                          <img
                            src={manga.coverUrl}
                            alt={`${manga.title} cover`}
                            className="w-24 h-32 object-cover rounded-lg shadow-sm flex-shrink-0"
                            onError={(e) => {
                              // Hide image if it fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
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
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <button
                        onClick={() => handleImport(manga.id, manga.title)}
                        disabled={isImporting === manga.id || !selectedCreator}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isImporting === manga.id ? 'Importing...' : 'Import'}
                      </button>
                      <button
                        onClick={() => handleTestImport(manga.id, manga.title)}
                        disabled={isImporting === manga.id}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Test Import
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
