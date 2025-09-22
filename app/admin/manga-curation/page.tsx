'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ImportedManga {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  mangaMDId: string;
  mangaMDStatus: string;
  contentRating: string;
  tags: string;
  authors: string;
  artists: string;
  isPublished: boolean;
  createdAt: string;
  _count: {
    chapters: number;
  };
}

export default function MangaCurationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [manga, setManga] = useState<ImportedManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('unpublished');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishingAll, setIsPublishingAll] = useState(false);

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

  const fetchManga = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/manga-curation');
      const data = await response.json();
      
      if (data.success) {
        setManga(data.manga);
      } else {
        setError(data.error || 'Failed to fetch manga');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Error fetching manga:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (mangaId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/manga-curation/${mangaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setManga(prev => prev.map(m => 
          m.id === mangaId ? { ...m, isPublished: !currentStatus } : m
        ));
        setSuccess(`✅ Manga ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update manga status');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Error updating manga:', err);
    }
  };

  const handleDeleteManga = async (mangaId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/manga-curation/${mangaId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setManga(prev => prev.filter(m => m.id !== mangaId));
        setSuccess(`✅ Manga "${title}" deleted successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete manga');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Error deleting manga:', err);
    }
  };

  const handlePublishAll = async () => {
    const unpublishedManga = manga.filter(m => !m.isPublished);
    
    if (unpublishedManga.length === 0) {
      setError('No unpublished manga to publish.');
      return;
    }

    if (!confirm(`Are you sure you want to publish all ${unpublishedManga.length} unpublished manga?`)) {
      return;
    }

    try {
      setIsPublishingAll(true);
      setError('');
      
      const response = await fetch('/api/admin/manga-curation/publish-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Update all manga to published
        setManga(prev => prev.map(m => ({ ...m, isPublished: true })));
        setSuccess(`✅ Successfully published ${data.count} manga!`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to publish all manga');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
      console.error('Error publishing all manga:', err);
    } finally {
      setIsPublishingAll(false);
    }
  };

  useEffect(() => {
    fetchManga();
  }, []);

  // Filter manga based on search and status
  const filteredManga = manga.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'published' && m.isPublished) ||
                         (filter === 'unpublished' && !m.isPublished);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manga...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manga Curation</h1>
          <p className="mt-2 text-gray-600">
            Review and manage imported manga from MangaDex. Publish or remove manga from the public library.
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search manga by title or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({manga.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'published' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Published ({manga.filter(m => m.isPublished).length})
              </button>
              <button
                onClick={() => setFilter('unpublished')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'unpublished' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unpublished ({manga.filter(m => !m.isPublished).length})
              </button>
            </div>
          </div>
        </div>

        {/* Manga List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredManga.length} manga found
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredManga.map((manga) => (
              <div key={manga.id} className="p-6">
                <div className="flex items-start gap-4">
                  {manga.coverImage && (
                    <img
                      src={manga.coverImage}
                      alt={`${manga.title} cover`}
                      className="w-20 h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {manga.title}
                        </h3>
                        
                        {manga.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {manga.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <span>Status: <span className="font-medium capitalize">{manga.mangaMDStatus}</span></span>
                          <span>Rating: <span className="font-medium capitalize">{manga.contentRating}</span></span>
                          <span>Chapters: <span className="font-medium">{manga._count.chapters}</span></span>
                          <span>Imported: <span className="font-medium">{new Date(manga.createdAt).toLocaleDateString()}</span></span>
                        </div>

                        {manga.tags && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Tags: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {JSON.parse(manga.tags).slice(0, 8).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handlePublishToggle(manga.id, manga.isPublished)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            manga.isPublished
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {manga.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteManga(manga.id, manga.title)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                        
                        <a
                          href={`https://mangadex.org/title/${manga.mangaMDId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium text-center"
                        >
                          View on MangaDex
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredManga.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No manga found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
