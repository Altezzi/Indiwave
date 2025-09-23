import Link from "next/link";
import ComicCard from "../../components/ComicCard";
import FollowedMangaCard from "../../components/FollowedMangaCard";
import LatestChapterCard from "../../components/LatestChapterCard";
import { CoverFallbackProvider } from "../../components/CoverFallbackProvider";
import HomeSection from "../../components/HomeSection";
import LibraryLayout from "../../components/LibraryLayout";

// Force fresh data on every request
export const revalidate = 0;

const ITEMS_PER_SECTION = 10; // Show 10 items per section

type Comic = {
  id: string;
  title: string;
  cover: string;
  author?: string;
  artist?: string;
  year?: string | number;
  tags?: string[];
  chapters?: Array<{ id: string; title: string; pages?: string[] }>;
  [key: string]: any;
};

function getBaseUrl() {
  // For server-side rendering, we'll use environment variables
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL;
  return envUrl?.startsWith("http") ? envUrl : "http://localhost:3000";
}

async function getAllComics(): Promise<Comic[]> {
  const origin = getBaseUrl();

  try {
    // Use the new manga API
    const res = await fetch(`${origin}/api/manga`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch manga data:', res.status);
      return [];
    }

    const mangaData = await res.json();
    
    if (mangaData.success && mangaData.data) {
      // Convert manga data to comic format for compatibility
      const comics: Comic[] = mangaData.data.map((manga: any) => ({
        id: String(manga.id || ''),
        title: String(manga.title || ''),
        cover: String(manga.coverUrl || ''),
        coverImage: String(manga.coverUrl || ''),
        author: String(manga.authors?.join(', ') || ''),
        artist: String(manga.artists?.join(', ') || ''),
        year: manga.year || 0,
        tags: Array.isArray(manga.tags) ? manga.tags : [],
        description: String(manga.description || ''),
        status: String(manga.status || ''),
        contentRating: String(manga.contentRating || ''),
        totalChapters: manga.totalChapters || 0,
        source: String(manga.source || '')
      }));
      
      return comics;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching manga data:', error);
    return [];
  }
}

// Get recently added comics (last 10)
function getRecentlyAdded(comics: Comic[]): Comic[] {
  return comics.slice(0, ITEMS_PER_SECTION);
}

// Get staff picks (random selection of 10)
function getStaffPicks(comics: Comic[]): Comic[] {
  const shuffled = [...comics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, ITEMS_PER_SECTION);
}

// Get popular comics (middle section, assuming they're ordered by popularity)
function getPopular(comics: Comic[]): Comic[] {
  const startIndex = Math.floor(comics.length / 3);
  return comics.slice(startIndex, startIndex + ITEMS_PER_SECTION);
}

// Get trending comics (another random selection)
function getTrending(comics: Comic[]): Comic[] {
  const shuffled = [...comics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, ITEMS_PER_SECTION);
}

async function getFollowedManga(): Promise<any[]> {
  const origin = getBaseUrl();

  try {
    const res = await fetch(`${origin}/api/user/followed-manga`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.followedManga || [];
  } catch (error) {
    console.error("Error fetching followed manga:", error);
    return [];
  }
}

async function getLatestChapters(): Promise<any[]> {
  const origin = getBaseUrl();

  try {
    const res = await fetch(`${origin}/api/user/latest-chapters`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.latestChapters || [];
  } catch (error) {
    console.error("Error fetching latest chapters:", error);
    return [];
  }
}

export default async function HomePage() {
  const [allComics, followedManga, latestChapters] = await Promise.all([
    getAllComics(),
    getFollowedManga(),
    getLatestChapters()
  ]);
  
  // Create different sections
  const recentlyAdded = getRecentlyAdded(allComics);
  const staffPicks = getStaffPicks(allComics);
  const popular = getPopular(allComics);
  const trending = getTrending(allComics);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/background-4.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: -3,
        }}
      />

      {/* Content Container */}
      <CoverFallbackProvider>
        <LibraryLayout>
        {/* Latest Followed Series Section */}
        {followedManga.length > 0 && (
          <HomeSection
            title="Latest followed series"
            comics={followedManga}
            viewAllLink="/my-list"
          />
        )}

        {/* Latest Chapters Section */}
        {latestChapters.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px" 
            }}>
              <h2
                style={{
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "var(--fg)",
                }}
              >
                New Chapters from Followed Comics
              </h2>
              <Link
                href="/my-list"
                style={{
                  fontSize: "14px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                View All →
              </Link>
            </div>
            
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {latestChapters.slice(0, 6).map((chapter) => (
                <LatestChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Added Section */}
        <HomeSection
          title="Recently Added"
          comics={recentlyAdded}
          viewAllLink="/library?sort=recent"
        />

        {/* Staff Picks Section */}
        <HomeSection
          title="Staff Picks"
          comics={staffPicks}
          viewAllLink="/library?sort=featured"
        />

        {/* Popular Section */}
        <HomeSection
          title="Popular"
          comics={popular}
          viewAllLink="/library?sort=popular"
        />

        {/* Trending Section */}
        <HomeSection
          title="Trending"
          comics={trending}
          viewAllLink="/library?sort=trending"
        />

        {/* Call to Action */}
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            border: "1px solid rgba(138, 180, 255, 0.1)",
            marginTop: "40px",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "24px",
              fontWeight: "600",
              color: "var(--fg)",
            }}
          >
            Want to see more?
          </h2>
          <p
            style={{
              margin: "0 auto 24px",
              fontSize: "16px",
              color: "var(--muted)",
              maxWidth: "500px",
            }}
          >
            Explore our complete library with hundreds of comics, advanced search, and genre filtering.
          </p>
          <Link
            href="/library"
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, var(--accent), #8ab4ff)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "opacity 0.2s ease",
              display: "inline-block",
            }}
          >
            Explore Full Library →
          </Link>
        </div>
        </LibraryLayout>
      </CoverFallbackProvider>
    </div>
  );
}
