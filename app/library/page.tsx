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
  // Read series from series folders
  const seriesDir = path.join(process.cwd(), 'series');
  const comics: Comic[] = [];

  if (!fs.existsSync(seriesDir)) {
    return comics;
  }

  const seriesFolders = fs.readdirSync(seriesDir)
    .filter(item => {
      const itemPath = path.join(seriesDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

  for (const folderName of seriesFolders) {
    const seriesFolder = path.join(seriesDir, folderName);
    const metadataPath = path.join(seriesFolder, 'metadata.json');
    const chaptersPath = path.join(seriesFolder, 'chapters.json');
    
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        // Read chapters if available
        let chapters = [];
        if (fs.existsSync(chaptersPath)) {
          chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
        }

        // Transform to comic format
        const comic: Comic = {
          id: metadata.mangaMDId || folderName,
          title: metadata.title,
          cover: `/api/series-covers/${encodeURIComponent(folderName)}/cover.jpg`,
          coverImage: `/api/series-covers/${encodeURIComponent(folderName)}/cover.jpg`,
          author: metadata.authors?.[0] || '',
          artist: metadata.artists?.[0] || '',
          authors: metadata.authors || [],
          artists: metadata.artists || [],
          year: metadata.year || new Date().getFullYear(),
          tags: metadata.tags || [],
          status: metadata.status || 'ongoing',
          contentRating: metadata.contentRating || 'safe',
          totalChapters: chapters.length,
          source: 'Local Files',
          chapters: chapters
        };

        comics.push(comic);
      } catch (error) {
        console.error(`Error processing ${folderName}:`, error);
      }
    }
  }

  // Sort by title
  comics.sort((a, b) => a.title.localeCompare(b.title));

  return comics;
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