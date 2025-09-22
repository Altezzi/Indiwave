// Publisher Sources Service
// This service provides official publisher sources for manga instead of MangaDex

export interface PublisherSource {
  name: string;
  url: string;
  type: 'official' | 'retail' | 'subscription';
  icon?: string;
  description?: string;
}

export interface MangaPublisherInfo {
  title: string;
  authors: string[];
  publishers: PublisherSource[];
}

class PublisherSourcesService {
  private rateLimitDelay = 1000; // 1 second between requests
  private lastRequestTime = 0;

  // Simulated publisher database - in a real implementation, this would query actual publisher APIs
  private publisherDatabase: Record<string, PublisherSource[]> = {
    // Popular manga with known publishers
    'chainsaw man': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/chainsaw-man',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Shonen Jump+',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese digital magazine'
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.com/s?k=chainsaw+man+manga',
        type: 'retail',
        description: 'Physical volumes'
      }
    ],
    'one piece': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/one-piece',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Weekly Shonen Jump',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'Book☆Walker',
        url: 'https://bookwalker.jp/series/2966/one-piece/',
        type: 'retail',
        description: 'Digital volumes'
      }
    ],
    'naruto': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/naruto',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Weekly Shonen Jump',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'eBookJapan',
        url: 'https://ebookjapan.yahoo.co.jp/books/123456/',
        type: 'retail',
        description: 'Digital volumes'
      }
    ],
    'attack on titan': [
      {
        name: 'Kodansha Comics',
        url: 'https://www.kodansha.us/series/attack-on-titan',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Bessatsu Shonen Magazine',
        url: 'https://magazine.kodansha.co.jp/bessatsu-shonen',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'CDJapan',
        url: 'https://www.cdjapan.co.jp/product/NEOBK-1234567',
        type: 'retail',
        description: 'Physical volumes'
      }
    ],
    'demon slayer': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/demon-slayer-kimetsu-no-yaiba',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Weekly Shonen Jump',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.com/s?k=demon+slayer+manga',
        type: 'retail',
        description: 'Physical volumes'
      }
    ],
    'jujutsu kaisen': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/jujutsu-kaisen',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Weekly Shonen Jump',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'Book☆Walker',
        url: 'https://bookwalker.jp/series/2966/jujutsu-kaisen/',
        type: 'retail',
        description: 'Digital volumes'
      }
    ],
    'my hero academia': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/my-hero-academia',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Weekly Shonen Jump',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'eBookJapan',
        url: 'https://ebookjapan.yahoo.co.jp/books/123456/',
        type: 'retail',
        description: 'Digital volumes'
      }
    ],
    'dragon ball': [
      {
        name: 'Viz Media',
        url: 'https://www.viz.com/dragon-ball',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Weekly Shonen Jump',
        url: 'https://shonenjumpplus.com/series/10833519556325042816',
        type: 'subscription',
        description: 'Official Japanese magazine'
      },
      {
        name: 'CDJapan',
        url: 'https://www.cdjapan.co.jp/product/NEOBK-1234567',
        type: 'retail',
        description: 'Physical volumes'
      }
    ]
  };

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Get publisher sources for a manga title
  async getPublisherSources(title: string, authors: string[] = []): Promise<PublisherSource[]> {
    await this.rateLimit();

    // Normalize title for lookup
    const normalizedTitle = title.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')    // Normalize spaces
      .trim();

    // Try exact match first
    if (this.publisherDatabase[normalizedTitle]) {
      return this.publisherDatabase[normalizedTitle];
    }

    // Try partial matches
    for (const [key, sources] of Object.entries(this.publisherDatabase)) {
      if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
        return sources;
      }
    }

    // Try matching by author (for series with multiple titles)
    for (const author of authors) {
      const normalizedAuthor = author.toLowerCase().trim();
      // Some common author-based matches
      if (normalizedAuthor.includes('oda') && normalizedTitle.includes('piece')) {
        return this.publisherDatabase['one piece'];
      }
      if (normalizedAuthor.includes('kishimoto') && normalizedTitle.includes('naruto')) {
        return this.publisherDatabase['naruto'];
      }
      if (normalizedAuthor.includes('toriyama') && normalizedTitle.includes('dragon')) {
        return this.publisherDatabase['dragon ball'];
      }
    }

    // Default fallback sources for unknown manga
    return this.getDefaultPublisherSources();
  }

  // Get default publisher sources for unknown manga
  private getDefaultPublisherSources(): PublisherSource[] {
    return [
      {
        name: 'Official Raw',
        url: '#',
        type: 'official',
        description: 'Official Japanese source'
      },
      {
        name: 'Official English',
        url: '#',
        type: 'official',
        description: 'Official English publisher'
      },
      {
        name: 'Book☆Walker',
        url: 'https://bookwalker.jp/',
        type: 'retail',
        description: 'Digital manga store'
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.com/s?k=manga',
        type: 'retail',
        description: 'Physical volumes'
      },
      {
        name: 'eBookJapan',
        url: 'https://ebookjapan.yahoo.co.jp/',
        type: 'retail',
        description: 'Digital manga store'
      },
      {
        name: 'CDJapan',
        url: 'https://www.cdjapan.co.jp/',
        type: 'retail',
        description: 'Physical volumes'
      }
    ];
  }

  // Get publisher sources by type
  getSourcesByType(sources: PublisherSource[], type: 'official' | 'retail' | 'subscription'): PublisherSource[] {
    return sources.filter(source => source.type === type);
  }

  // Get all official sources
  getOfficialSources(sources: PublisherSource[]): PublisherSource[] {
    return this.getSourcesByType(sources, 'official');
  }

  // Get all retail sources
  getRetailSources(sources: PublisherSource[]): PublisherSource[] {
    return this.getSourcesByType(sources, 'retail');
  }

  // Get all subscription sources
  getSubscriptionSources(sources: PublisherSource[]): PublisherSource[] {
    return this.getSourcesByType(sources, 'subscription');
  }
}

export const publisherSourcesService = new PublisherSourcesService();
