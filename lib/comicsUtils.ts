import fs from 'fs';
import path from 'path';

export interface Comic {
  id: string;
  title: string;
  series: string;
  description: string;
  cover: string;
  coverImage: string;
  author: string;
  artist: string;
  authors: string[];
  artists: string[];
  year: number;
  tags: string[];
  status: string;
  contentRating: string;
  totalChapters: number;
  source: string;
}

export async function getAllComics(): Promise<Comic[]> {
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
          series: metadata.title,
          description: metadata.description || '',
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
          source: 'Local Files'
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
