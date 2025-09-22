// Legal Sources Integration Service
// This service handles fetching manga data from official legal sources

export interface LegalSource {
  id: string;
  name: string;
  baseUrl: string;
  apiEndpoint?: string;
  requiresAuth: boolean;
  supportedPublishers: string[];
  rateLimit: {
    requests: number;
    per: 'minute' | 'hour' | 'day';
  };
}

export interface LegalChapter {
  id: string;
  title: string;
  chapterNumber: number;
  pages: string[];
  publishedAt: Date;
  source: string;
  sourceUrl: string;
}

export interface LegalManga {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: string;
  artist: string;
  publisher: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  totalChapters: number;
  source: string;
  sourceUrl: string;
  chapters: LegalChapter[];
}

// Legal sources configuration
export const LEGAL_SOURCES: LegalSource[] = [
  {
    id: 'viz-shonen-jump',
    name: 'Viz Media - Shonen Jump',
    baseUrl: 'https://www.viz.com',
    apiEndpoint: 'https://www.viz.com/api', // Hypothetical - may not exist
    requiresAuth: true,
    supportedPublishers: ['Shueisha', 'Viz Media'],
    rateLimit: {
      requests: 100,
      per: 'hour'
    }
  },
  {
    id: 'shueisha-jump-plus',
    name: 'Shueisha - Jump+',
    baseUrl: 'https://shonenjumpplus.com',
    requiresAuth: true,
    supportedPublishers: ['Shueisha'],
    rateLimit: {
      requests: 50,
      per: 'hour'
    }
  },
  {
    id: 'mangaplus',
    name: 'Manga Plus by Shueisha',
    baseUrl: 'https://mangaplus.shueisha.co.jp',
    requiresAuth: false,
    supportedPublishers: ['Shueisha'],
    rateLimit: {
      requests: 200,
      per: 'hour'
    }
  }
];

// Publisher mapping for manga
export const MANGA_PUBLISHER_MAP: Record<string, string[]> = {
  'Kaiju No. 8': ['viz-shonen-jump', 'shueisha-jump-plus', 'mangaplus'],
  'One Piece': ['viz-shonen-jump', 'mangaplus'],
  'My Hero Academia': ['viz-shonen-jump', 'mangaplus'],
  'Demon Slayer': ['viz-shonen-jump', 'mangaplus'],
  // Add more mappings as needed
};

export class LegalSourcesService {
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();

  // Get the best legal source for a manga
  getBestLegalSource(mangaTitle: string): LegalSource | null {
    const sources = MANGA_PUBLISHER_MAP[mangaTitle];
    if (!sources || sources.length === 0) {
      return null;
    }

    // Return the first available source (could be enhanced with availability checking)
    const sourceId = sources[0];
    return LEGAL_SOURCES.find(source => source.id === sourceId) || null;
  }

  // Check if we can make a request to a source (rate limiting)
  canMakeRequest(sourceId: string): boolean {
    const source = LEGAL_SOURCES.find(s => s.id === sourceId);
    if (!source) return false;

    const now = Date.now();
    const limiter = this.rateLimiters.get(sourceId);
    
    if (!limiter || now > limiter.resetTime) {
      // Reset rate limiter
      const resetTime = now + this.getRateLimitDuration(source.rateLimit.per);
      this.rateLimiters.set(sourceId, { count: 0, resetTime });
      return true;
    }

    return limiter.count < source.rateLimit.requests;
  }

  // Record a request to a source
  recordRequest(sourceId: string): void {
    const limiter = this.rateLimiters.get(sourceId);
    if (limiter) {
      limiter.count++;
    }
  }

  private getRateLimitDuration(per: string): number {
    switch (per) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      default: return 60 * 1000;
    }
  }

  // Fetch manga metadata from a legal source (no content, just counts and info)
  async fetchMangaMetadataFromLegalSource(mangaTitle: string, sourceId: string): Promise<LegalManga | null> {
    const source = LEGAL_SOURCES.find(s => s.id === sourceId);
    if (!source) {
      throw new Error(`Unknown legal source: ${sourceId}`);
    }

    if (!this.canMakeRequest(sourceId)) {
      throw new Error(`Rate limit exceeded for source: ${sourceId}`);
    }

    console.log(`Fetching metadata for ${mangaTitle} from ${source.name}...`);
    
    // This would make a lightweight API call to get just the metadata
    // For now, we'll use known data for Kaiju No. 8
    if (mangaTitle.toLowerCase().includes('kaiju') && sourceId === 'viz-shonen-jump') {
      this.recordRequest(sourceId);
      
      return {
        id: `legal-${sourceId}-${mangaTitle.toLowerCase().replace(/\s+/g, '-')}`,
        title: mangaTitle,
        description: `Official ${mangaTitle} from ${source.name}`,
        coverImage: '',
        author: 'Naoya Matsumoto',
        artist: 'Naoya Matsumoto',
        publisher: 'Viz Media',
        status: 'completed',
        totalChapters: 129, // Actual count from Shonen Jump
        source: sourceId,
        sourceUrl: `https://www.viz.com/shonenjump/chapters/kaiju-no-8`,
        chapters: [] // We'll populate this with just chapter numbers
      };
    }
    
    // Simulate API call for other manga
    await new Promise(resolve => setTimeout(resolve, 500));
    this.recordRequest(sourceId);

    // Return mock data for other manga
    return {
      id: `legal-${sourceId}-${mangaTitle.toLowerCase().replace(/\s+/g, '-')}`,
      title: mangaTitle,
      description: `Official ${mangaTitle} from ${source.name}`,
      coverImage: '',
      author: 'Unknown',
      artist: 'Unknown',
      publisher: source.supportedPublishers[0],
      status: 'ongoing',
      totalChapters: 0, // Would come from actual API
      source: sourceId,
      sourceUrl: `${source.baseUrl}/manga/${mangaTitle.toLowerCase().replace(/\s+/g, '-')}`,
      chapters: []
    };
  }

  // Fetch chapter metadata from a legal source (no content, just chapter list)
  async fetchChapterMetadataFromLegalSource(mangaTitle: string, sourceId: string): Promise<LegalChapter[]> {
    const source = LEGAL_SOURCES.find(s => s.id === sourceId);
    if (!source) {
      throw new Error(`Unknown legal source: ${sourceId}`);
    }

    if (!this.canMakeRequest(sourceId)) {
      throw new Error(`Rate limit exceeded for source: ${sourceId}`);
    }

    console.log(`Fetching chapter metadata for ${mangaTitle} from ${source.name}...`);
    
    // For Kaiju No. 8, we know there are 129 chapters
    if (mangaTitle.toLowerCase().includes('kaiju') && sourceId === 'viz-shonen-jump') {
      this.recordRequest(sourceId);
      
      const chapters: LegalChapter[] = [];
      for (let i = 1; i <= 129; i++) {
        chapters.push({
          id: `legal-${sourceId}-kaiju-no-8-ch${i}`,
          title: `Chapter ${i}`,
          chapterNumber: i,
          pages: [], // No actual page content - just metadata
          publishedAt: new Date(2020, 6, 3 + i), // Approximate dates
          source: sourceId,
          sourceUrl: `https://www.viz.com/shonenjump/chapters/kaiju-no-8/chapter-${i}`
        });
      }
      return chapters;
    }
    
    // Simulate API call for other manga
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.recordRequest(sourceId);

    // Return empty array for other manga (would be populated from actual API)
    return [];
  }

  // Get all available legal sources for a manga
  getAvailableSources(mangaTitle: string): LegalSource[] {
    const sourceIds = MANGA_PUBLISHER_MAP[mangaTitle];
    if (!sourceIds) return [];

    return sourceIds
      .map(id => LEGAL_SOURCES.find(source => source.id === id))
      .filter((source): source is LegalSource => source !== undefined);
  }
}

export const legalSourcesService = new LegalSourcesService();
