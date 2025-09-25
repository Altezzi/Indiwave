// app/library/page.tsx
import { headers } from "next/headers";
import LibraryContent from "../../components/LibraryContent";
import BackToTopButton from "../../components/BackToTopButton";
import LibraryLayout from "../../components/LibraryLayout";
import { CoverFallbackProvider } from "../../components/CoverFallbackProvider";
import fs from 'fs';
import path from 'path';

// Force fresh data on every request
export const revalidate = 0;

function getBaseUrl() {
  const envUrl = process.env.VERCEL_URL || process.env.DEPLOY_PRIME_URL;
  return envUrl?.startsWith("http") ? envUrl : "http://localhost:3000";
}

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

async function getAllComics(): Promise<Comic[]> {
  const origin = getBaseUrl();

  try {
    // Use the comics API (same as home page)
    const res = await fetch(`${origin}/api/comics`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch comics data:', res.status);
      return [];
    }

    const comicsData = await res.json();
    
    if (comicsData.comics) {
      // Convert comics data to the expected format
      const comics: Comic[] = comicsData.comics.map((comic: any) => ({
        id: String(comic.id || ''),
        title: String(comic.title || ''),
        cover: String(comic.cover || ''),
        coverImage: String(comic.cover || ''),
        author: String(comic.author || ''),
        artist: String(comic.artist || ''),
        authors: comic.authors || [],
        artists: comic.artists || [],
        year: comic.year || 0,
        tags: Array.isArray(comic.tags) ? comic.tags : [],
        description: String(comic.description || ''),
        status: String(comic.status || ''),
        contentRating: String(comic.contentRating || 'safe'),
        totalChapters: comic.totalChapters || 0,
        source: 'database',
        chapters: comic.chapters || []
      }));

      return comics;
    }

    return [];
  } catch (error) {
    console.error('Error fetching comics:', error);
    return [];
  }
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { page?: string; genre?: string; search?: string };
}) {
  const comics = await getAllComics();

  return (
    <div style={{ position: "relative", minHeight: "300vh" }}>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/shika-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: -3,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(45deg, rgba(138, 180, 255, 0.1) 0%, rgba(255, 182, 193, 0.05) 50%, rgba(138, 180, 255, 0.1) 100%)",
          zIndex: -2,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(138, 180, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(138, 180, 255, 0.1) 0%, transparent 50%)",
          zIndex: -1,
        }}
      />

      <CoverFallbackProvider>
        <div style={{ textAlign: "center", marginBottom: "40px", padding: "40px 20px" }}>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "36px",
              fontWeight: 700,
              color: "var(--fg)",
            }}
          >
            Manga Library
          </h1>
          <p
            style={{
              margin: "0 auto 24px",
              fontSize: "18px",
              color: "var(--fg)",
              maxWidth: "600px",
            }}
          >
            Explore our collection of amazing manga series with cover art and detailed metadata.
          </p>
          <div
            style={{
              margin: "0 auto 24px",
              fontSize: "16px",
              color: "var(--fg)",
              opacity: 0.8,
            }}
          >
            📚 {comics.length} total manga in library
          </div>
          <LibraryContent allComics={comics} />
        </div>
      </CoverFallbackProvider>
      <BackToTopButton />
    </div>
  );
}