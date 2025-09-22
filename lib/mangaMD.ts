// MangaMD API integration service
// This service handles fetching manga metadata from MangaDex API v5

export interface MangaMDManga {
  id: string;
  title: {
    en?: string;
    ja?: string;
    [key: string]: string | undefined;
  };
  altTitles?: Array<{
    [key: string]: string;
  }>;
  description: {
    en?: string;
    ja?: string;
    [key: string]: string | undefined;
  };
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  year?: number;
  contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
  tags: Array<{
    id: string;
    type: string;
    attributes: {
      name: {
        [key: string]: string;
      };
      group: 'content' | 'format' | 'genre' | 'theme';
    };
  }>;
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
      fileName?: string;
      [key: string]: any;
    };
  }>;
}

export interface MangaMDCover {
  id: string;
  type: string;
  attributes: {
    fileName: string;
    volume?: string;
    description?: string;
    locale?: string;
  };
  relationships: Array<{
    id: string;
    type: string;
  }>;
}

export interface MangaMDAuthor {
  id: string;
  type: string;
  attributes: {
    name: string;
    [key: string]: any;
  };
}

export interface MangaMDChapter {
  id: string;
  type: string;
  attributes: {
    title?: string;
    volume?: string;
    chapter?: string;
    pages: number;
    translatedLanguage: string;
    uploader?: string;
    externalUrl?: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    publishAt: string;
    readableAt: string;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
      fileName?: string;
      [key: string]: any;
    };
  }>;
}

export interface MangaMDSearchResult {
  result: string;
  response: string;
  data: MangaMDManga[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaMDCoverResult {
  result: string;
  response: string;
  data: MangaMDCover[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaMDAuthorResult {
  result: string;
  response: string;
  data: MangaMDAuthor[];
  limit: number;
  offset: number;
  total: number;
}

class MangaMDService {
  private baseUrl = 'https://api.mangadex.org';
  private rateLimitDelay = 1000; // 1 second delay between requests
  private lastRequestTime = 0;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await this.delay(this.rateLimitDelay - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
  }

  private async fetchWithRateLimit(url: string): Promise<Response> {
    await this.rateLimit();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'indiwave/1.0 (MangaMD Integration)',
      },
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorDetails = '';
      try {
        const errorData = await response.text();
        errorDetails = ` - ${errorData}`;
      } catch (e) {
        // Ignore if we can't parse error response
      }
      
      throw new Error(`MangaMD API error: ${response.status} ${response.statusText}${errorDetails}`);
    }

    return response;
  }

  async searchManga(query: string, limit = 20, offset = 0): Promise<MangaMDSearchResult> {
    try {
      // Try the full search first
      const searchParams = new URLSearchParams();
      
      // Add title search
      searchParams.append('title', query);
      
      // Add pagination
      searchParams.append('limit', limit.toString());
      searchParams.append('offset', offset.toString());
      
      // Add content ratings (safe and suggestive only)
      searchParams.append('contentRating[]', 'safe');
      searchParams.append('contentRating[]', 'suggestive');
      
      // Add ordering
      searchParams.append('order[relevance]', 'desc');
      
      // Add includes
      searchParams.append('includes[]', 'cover_art');
      searchParams.append('includes[]', 'author');
      searchParams.append('includes[]', 'artist');

      const url = `${this.baseUrl}/manga?${searchParams.toString()}`;
      console.log('MangaDex search URL:', url);
      
      const response = await this.fetchWithRateLimit(url);
      return response.json();
    } catch (error) {
      console.log('Full search failed, trying simplified search:', error);
      
      // Fallback to a simpler search
      const simpleParams = new URLSearchParams({
        title: query,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const simpleUrl = `${this.baseUrl}/manga?${simpleParams.toString()}`;
      console.log('MangaDex simple search URL:', simpleUrl);
      
      const response = await this.fetchWithRateLimit(simpleUrl);
      return response.json();
    }
  }

  async getMangaById(id: string): Promise<MangaMDManga> {
    const searchParams = new URLSearchParams();
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    const url = `${this.baseUrl}/manga/${id}?${searchParams.toString()}`;
    const response = await this.fetchWithRateLimit(url);
    const result = await response.json();
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to fetch manga: ${result.result}`);
    }
    
    return result.data;
  }

  async getMangaCovers(mangaId: string): Promise<MangaMDCoverResult> {
    const searchParams = new URLSearchParams();
    searchParams.append('manga[]', mangaId);
    searchParams.append('limit', '100');

    const url = `${this.baseUrl}/cover?${searchParams.toString()}`;
    const response = await this.fetchWithRateLimit(url);
    return response.json();
  }

  async getAuthorById(id: string): Promise<MangaMDAuthor> {
    const url = `${this.baseUrl}/author/${id}`;
    const response = await this.fetchWithRateLimit(url);
    const result = await response.json();
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to fetch author: ${result.result}`);
    }
    
    return result.data;
  }

  // Helper method to get the best available title
  getBestTitle(manga: MangaMDManga): string {
    // Check if manga has attributes and title
    if (!manga.attributes || !manga.attributes.title) {
      console.log('No title found in manga attributes');
      return 'Unknown Title';
    }
    
    const title = manga.attributes.title;
    
    // Debug: log the title structure
    console.log('Title structure for manga ID', manga.id, ':', JSON.stringify(title, null, 2));
    
    // Try different title formats
    if (typeof title === 'string') {
      return title;
    }
    
    if (typeof title === 'object') {
      // Try English first, then Japanese, then any other language
      return title.en || title.ja || Object.values(title)[0] || 'Unknown Title';
    }
    
    return 'Unknown Title';
  }

  // Helper method to get the best available description
  getBestDescription(manga: MangaMDManga): string {
    if (!manga.attributes || !manga.attributes.description) return '';
    const description = manga.attributes.description;
    return description.en || description.ja || Object.values(description)[0] || '';
  }

  // Helper method to get cover image URL
  getCoverUrl(cover: MangaMDCover, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const baseUrl = 'https://uploads.mangadex.org/covers';
    const sizeMap = {
      small: '.256.jpg',
      medium: '.512.jpg',
      large: '.512.jpg'
    };
    
    return `${baseUrl}/${cover.relationships[0]?.id}/${cover.attributes.fileName}${sizeMap[size]}`;
  }

  // Helper method to get cover URL from manga relationships
  getCoverUrlFromManga(manga: MangaMDManga, size: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (!manga.relationships || !Array.isArray(manga.relationships)) {
      return null;
    }

    // Find cover art relationship
    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (!coverRel || !coverRel.attributes?.fileName) {
      return null;
    }

    const baseUrl = 'https://uploads.mangadex.org/covers';
    const sizeMap = {
      small: '.256.jpg',
      medium: '.512.jpg',
      large: '.512.jpg'
    };
    
    return `${baseUrl}/${manga.id}/${coverRel.attributes.fileName}${sizeMap[size]}`;
  }

  // Helper method to extract tags by group
  getTagsByGroup(manga: MangaMDManga, group: 'content' | 'format' | 'genre' | 'theme'): string[] {
    if (!manga.attributes?.tags || !Array.isArray(manga.attributes.tags)) return [];
    return manga.attributes.tags
      .filter(tag => tag?.attributes?.group === group)
      .map(tag => tag?.attributes?.name?.en || Object.values(tag?.attributes?.name || {})[0])
      .filter(Boolean);
  }

  // Helper method to get all tags as a flat array
  getAllTags(manga: MangaMDManga): string[] {
    if (!manga.attributes?.tags || !Array.isArray(manga.attributes.tags)) return [];
    return manga.attributes.tags
      .map(tag => tag?.attributes?.name?.en || Object.values(tag?.attributes?.name || {})[0])
      .filter(Boolean);
  }

  // Helper method to get authors and artists
  getAuthorsAndArtists(manga: MangaMDManga): { authors: string[]; artists: string[] } {
    const authors: string[] = [];
    const artists: string[] = [];

    if (!manga.relationships || !Array.isArray(manga.relationships)) {
      return { authors, artists };
    }

    manga.relationships.forEach(rel => {
      if (rel.type === 'author' && rel.attributes?.name) {
        authors.push(rel.attributes.name);
      } else if (rel.type === 'artist' && rel.attributes?.name) {
        artists.push(rel.attributes.name);
      }
    });

    return { authors, artists };
  }

  async getMangaChapters(mangaId: string, limit: number = 100, offset: number = 0): Promise<{ result: string; response: string; data: MangaMDChapter[]; limit: number; offset: number; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('manga', mangaId);
    searchParams.append('limit', limit.toString());
    searchParams.append('offset', offset.toString());
    searchParams.append('translatedLanguage[]', 'en'); // Only get English chapters
    searchParams.append('order[chapter]', 'asc'); // Order by chapter number ascending

    const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
    console.log('MangaDex chapters URL:', url);
    
    const response = await this.fetchWithRateLimit(url);
    const result = await response.json();
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to fetch chapters: ${result.result}`);
    }
    
    return result;
  }

  // Fetch ALL chapters for a manga (handles pagination automatically)
  async getAllMangaChapters(mangaId: string): Promise<MangaMDChapter[]> {
    console.log('Fetching ALL chapters for manga:', mangaId);
    
    const allChapters: MangaMDChapter[] = [];
    let offset = 0;
    const limit = 100; // MangaDex max per request
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching chapters batch: offset ${offset}, limit ${limit}`);
      
      const batch = await this.getMangaChapters(mangaId, limit, offset);
      allChapters.push(...batch.data);
      
      console.log(`Fetched ${batch.data.length} chapters in this batch`);
      
      // Check if we've got all chapters
      if (batch.data.length < limit || allChapters.length >= batch.total) {
        hasMore = false;
      } else {
        offset += limit;
      }
      
      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Total chapters fetched: ${allChapters.length}`);
    return allChapters;
  }
}

export const mangaMDService = new MangaMDService();
