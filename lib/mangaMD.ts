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
        'User-Agent': 'IndiWave/1.0 (MangaMD Integration)',
      },
    });

    if (!response.ok) {
      throw new Error(`MangaMD API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async searchManga(query: string, limit = 20, offset = 0): Promise<MangaMDSearchResult> {
    const searchParams = new URLSearchParams({
      title: query,
      limit: limit.toString(),
      offset: offset.toString(),
      'contentRating[]': 'safe,suggestive',
      'order[relevance]': 'desc',
      'includes[]': 'cover_art,author,artist',
    });

    const url = `${this.baseUrl}/manga?${searchParams}`;
    const response = await this.fetchWithRateLimit(url);
    return response.json();
  }

  async getMangaById(id: string): Promise<MangaMDManga> {
    const searchParams = new URLSearchParams({
      'includes[]': 'cover_art,author,artist',
    });

    const url = `${this.baseUrl}/manga/${id}?${searchParams}`;
    const response = await this.fetchWithRateLimit(url);
    const result = await response.json();
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to fetch manga: ${result.result}`);
    }
    
    return result.data;
  }

  async getMangaCovers(mangaId: string): Promise<MangaMDCoverResult> {
    const searchParams = new URLSearchParams({
      'manga[]': mangaId,
      limit: '100',
    });

    const url = `${this.baseUrl}/cover?${searchParams}`;
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
    return manga.title.en || manga.title.ja || Object.values(manga.title)[0] || 'Unknown Title';
  }

  // Helper method to get the best available description
  getBestDescription(manga: MangaMDManga): string {
    return manga.description.en || manga.description.ja || Object.values(manga.description)[0] || '';
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

  // Helper method to extract tags by group
  getTagsByGroup(manga: MangaMDManga, group: 'content' | 'format' | 'genre' | 'theme'): string[] {
    return manga.tags
      .filter(tag => tag.attributes.group === group)
      .map(tag => tag.attributes.name.en || Object.values(tag.attributes.name)[0])
      .filter(Boolean);
  }

  // Helper method to get all tags as a flat array
  getAllTags(manga: MangaMDManga): string[] {
    return manga.tags
      .map(tag => tag.attributes.name.en || Object.values(tag.attributes.name)[0])
      .filter(Boolean);
  }

  // Helper method to get authors and artists
  getAuthorsAndArtists(manga: MangaMDManga): { authors: string[]; artists: string[] } {
    const authors: string[] = [];
    const artists: string[] = [];

    manga.relationships.forEach(rel => {
      if (rel.type === 'author' && rel.attributes?.name) {
        authors.push(rel.attributes.name);
      } else if (rel.type === 'artist' && rel.attributes?.name) {
        artists.push(rel.attributes.name);
      }
    });

    return { authors, artists };
  }
}

export const mangaMDService = new MangaMDService();
