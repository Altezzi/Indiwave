"use client";

import Link from "next/link";
import { useCoverFallback } from "./CoverFallbackProvider";

interface ComicCardProps {
  comic: {
    id: string;
    title: string;
    series?: string;
    year?: string | number;
    cover?: string;
    coverImage?: string;
    author?: string;
    artist?: string;
    authors?: string;
    artists?: string;
    tags?: string | string[];
    mangaMDStatus?: string;
    isImported?: boolean;
    [key: string]: any;
  };
}

export default function ComicCard({ comic }: ComicCardProps) {
  const { lastSuccessfulCover, setLastSuccessfulCover } = useCoverFallback();
  
  // Parse JSON fields if they exist, with error handling
  const authors = (() => {
    try {
      return comic.authors ? JSON.parse(comic.authors) : [];
    } catch {
      return [];
    }
  })();
  
  const artists = (() => {
    try {
      return comic.artists ? JSON.parse(comic.artists) : [];
    } catch {
      return [];
    }
  })();
  
  const tags = (() => {
    if (!comic.tags) return [];
    if (Array.isArray(comic.tags)) return comic.tags;
    try {
      return JSON.parse(comic.tags);
    } catch {
      return [comic.tags]; // fallback to single tag as array
    }
  })();
  
  // Get the best author/artist info with truncation
  const authorInfo = authors.length > 0 ? authors.join(', ') : comic.author;
  const artistInfo = artists.length > 0 ? artists.join(', ') : comic.artist;
  
  // Truncate long text to keep tiles uniform
  const truncateText = (text: string | undefined, maxLength: number = 60) => {
    if (!text) return '';
    const textStr = String(text);
    if (textStr.length <= maxLength) return textStr;
    return textStr.substring(0, maxLength) + '...';
  };
  
  // Get cover image (use coverImage from database, fallback to last successful)
  const coverImage = comic.coverImage || lastSuccessfulCover;
  
  // Check cover types
  const isPlaceholder = coverImage === '/placeholder.svg';
  const isLocalCover = coverImage && coverImage.startsWith('/covers/');
  const isMangaDexUrl = coverImage && coverImage.startsWith('https://uploads.mangadex.org/');
  const shouldShowPlaceholder = isPlaceholder;
  
  
  // Get year info
  const yearInfo = comic.year || '';

  return (
    <Link href={`/series/${comic.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card" style={{ 
        cursor: "pointer", 
        transition: "transform 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: 8, marginBottom: 4, background: "#0f0f11", border: "1px solid #2a2a2e", position: "relative", minHeight: "320px" }}>
          {/* Cover image */}
          {coverImage && !shouldShowPlaceholder ? (
            <img 
              src={coverImage} 
              alt={`${comic.title} cover`} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover"
              }}
              onLoad={() => {
                console.log(`✅ Image loaded successfully: ${comic.title} - ${coverImage}`);
                if (comic.coverImage) {
                  setLastSuccessfulCover(comic.coverImage);
                }
              }}
              onError={(e) => {
                console.log(`❌ Image failed to load: ${comic.title} - ${coverImage}`);
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          {/* Fallback for broken images */}
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: shouldShowPlaceholder ? "flex" : "none", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#a9a9b2",
            fontSize: "12px",
            textAlign: "center",
            padding: "16px",
            background: "linear-gradient(135deg, #1a1a1e 0%, #2a2a2e 100%)"
          }}>
            {(coverImage && !shouldShowPlaceholder) ? (
              <div>
                <div style={{ fontSize: "14px", marginBottom: "8px" }}>📖</div>
                <div>{comic.title}</div>
                <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "4px" }}>Cover unavailable</div>
              </div>
            ) : shouldShowPlaceholder ? (
              <div>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📚</div>
                <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{comic.title}</div>
                <div style={{ fontSize: "10px", opacity: 0.7 }}>Cover coming soon</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "14px", marginBottom: "8px" }}>📖</div>
                <div>{comic.title}</div>
                <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "4px" }}>No cover</div>
              </div>
            )}
          </div>
          
          {/* MangaMD import indicator */}
          {comic.isImported && (
            <div style={{ 
              position: "absolute", 
              top: 8, 
              right: 8, 
              background: "#10b981", 
              color: "white", 
              fontSize: 10, 
              padding: "2px 6px", 
              borderRadius: 4,
              fontWeight: "bold"
            }}>
              MD
            </div>
          )}
          
          {/* Status indicator */}
          {comic.mangaMDStatus && (
            <div style={{ 
              position: "absolute", 
              bottom: 8, 
              left: 8, 
              background: comic.mangaMDStatus === 'completed' ? "#10b981" : 
                         comic.mangaMDStatus === 'ongoing' ? "#3b82f6" : 
                         comic.mangaMDStatus === 'hiatus' ? "#f59e0b" : "#ef4444",
              color: "white", 
              fontSize: 10, 
              padding: "2px 6px", 
              borderRadius: 4,
              fontWeight: "bold",
              textTransform: "capitalize"
            }}>
              {comic.mangaMDStatus}
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "flex-start", paddingTop: 4 }}>
          <strong style={{ 
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.2",
            fontSize: "16px",
            marginBottom: 6
          }}>
            {truncateText(comic.title, 30)}
          </strong>
          
          {/* Author/Artist info */}
          {(authorInfo || artistInfo) && (
            <span style={{ 
              color: "#a9a9b2", 
              fontSize: 13,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.2",
              marginBottom: 4
            }}>
              {truncateText(authorInfo && artistInfo ? `${authorInfo} · ${artistInfo}` : authorInfo || artistInfo, 35)}
            </span>
          )}

          {/* Series and year */}
          <span style={{ 
            color: "#a9a9b2", 
            fontSize: 13,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.2",
            marginBottom: 6
          }}>
            {truncateText(comic.series && yearInfo ? `${comic.series} · ${yearInfo}` : comic.series || yearInfo, 30)}
          </span>

          {/* Tags preview */}
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: 2 }}>
              {tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  style={{
                    background: "#374151",
                    color: "#d1d5db",
                    fontSize: 10,
                    padding: "2px 4px",
                    borderRadius: 3
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span style={{ color: "#6b7280", fontSize: 10 }}>
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          <div>
            <span style={{ color: "#8ab4ff", fontSize: 14 }}>Read →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
