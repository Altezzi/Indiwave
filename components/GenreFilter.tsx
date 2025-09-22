"use client";

import { useState, useEffect } from "react";

interface GenreFilterProps {
  comics: any[];
  onGenreChange: (selectedGenre: string) => void;
  selectedGenre: string;
}

export default function GenreFilter({ comics, onGenreChange, selectedGenre }: GenreFilterProps) {
  const [allGenres, setAllGenres] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique tags from all comics
    const genreSet = new Set<string>();
    
    comics.forEach(comic => {
      if (comic.tags) {
        try {
          const tags = Array.isArray(comic.tags) ? comic.tags : JSON.parse(comic.tags);
          tags.forEach((tag: string) => {
            if (tag && typeof tag === 'string') {
              genreSet.add(tag);
            }
          });
        } catch (error) {
          // If parsing fails, treat as single tag
          if (typeof comic.tags === 'string') {
            genreSet.add(comic.tags);
          }
        }
      }
    });

    // Sort genres alphabetically
    const sortedGenres = Array.from(genreSet).sort();
    setAllGenres(sortedGenres);
  }, [comics]);

  return (
    <select
      value={selectedGenre}
      onChange={(e) => onGenreChange(e.target.value)}
      style={{
        padding: "12px 16px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "var(--bg)",
        color: "var(--fg)",
        fontSize: "14px",
        minWidth: "150px",
      }}
    >
      <option value="">All Genres</option>
      {allGenres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
}
