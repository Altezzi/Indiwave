import Link from "next/link";

interface FollowedMangaCardProps {
  manga: {
    id: string;
    title: string;
    cover?: string;
    description?: string;
    tags?: string;
    authors?: string;
    artists?: string;
    mangaMDStatus?: string;
    isImported?: boolean;
    followedAt: string;
    latestChapter?: {
      id: string;
      title: string;
      chapterNumber: number;
      mangaMDChapterTitle?: string;
      mangaMDChapterNumber?: number;
      createdAt: string;
      mangaMDPublishAt?: string;
    } | null;
  };
}

export default function FollowedMangaCard({ manga }: FollowedMangaCardProps) {
  // Parse JSON fields if they exist
  const tags = (() => {
    if (!manga.tags) return [];
    if (Array.isArray(manga.tags)) return manga.tags;
    try {
      return JSON.parse(manga.tags);
    } catch {
      return [manga.tags];
    }
  })();

  const authors = (() => {
    try {
      return manga.authors ? JSON.parse(manga.authors) : [];
    } catch {
      return [];
    }
  })();

  const artists = (() => {
    try {
      return manga.artists ? JSON.parse(manga.artists) : [];
    } catch {
      return [];
    }
  })();

  // Get the best author/artist info
  const authorInfo = authors.length > 0 ? authors.join(', ') : manga.authors;
  const artistInfo = artists.length > 0 ? artists.join(', ') : manga.artists;

  // Format the latest chapter info
  const getLatestChapterInfo = () => {
    if (!manga.latestChapter) {
      return { title: "No chapters yet", number: null, date: null };
    }

    const chapter = manga.latestChapter;
    const chapterTitle = chapter.mangaMDChapterTitle || chapter.title;
    const chapterNumber = chapter.mangaMDChapterNumber || chapter.chapterNumber;
    const publishDate = chapter.mangaMDPublishAt || chapter.createdAt;

    return {
      title: chapterTitle,
      number: chapterNumber,
      date: new Date(publishDate).toLocaleDateString()
    };
  };

  const latestChapterInfo = getLatestChapterInfo();

  return (
    <Link href={`/series/${manga.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card" style={{ 
        cursor: "pointer", 
        transition: "transform 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
        border: "1px solid rgba(138, 180, 255, 0.2)",
        borderRadius: "12px",
        padding: "16px",
      }}>
        {/* Cover and basic info */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ 
            aspectRatio: "3/4", 
            overflow: "hidden", 
            borderRadius: 6, 
            background: "#0f0f11", 
            border: "1px solid #2a2a2e", 
            position: "relative", 
            minWidth: "80px",
            height: "100px",
            flexShrink: 0
          }}>
            {manga.cover ? (
              <img 
                src={manga.cover} 
                alt={`${manga.title} cover`} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block"
                }} 
              />
            ) : (
              <div style={{ 
                width: "100%", 
                height: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "#a9a9b2",
                fontSize: "10px"
              }}>
                no cover
              </div>
            )}
            
            {/* Status indicators */}
            {manga.isImported && (
              <div style={{ 
                position: "absolute", 
                top: 4, 
                right: 4, 
                background: "#10b981", 
                color: "white", 
                fontSize: 8, 
                padding: "1px 4px", 
                borderRadius: 3,
                fontWeight: "bold"
              }}>
                MD
              </div>
            )}
            
            {manga.mangaMDStatus && (
              <div style={{ 
                position: "absolute", 
                bottom: 4, 
                left: 4, 
                background: manga.mangaMDStatus === 'completed' ? "#10b981" : 
                           manga.mangaMDStatus === 'ongoing' ? "#3b82f6" : 
                           manga.mangaMDStatus === 'hiatus' ? "#f59e0b" : "#ef4444",
                color: "white", 
                fontSize: 8, 
                padding: "1px 4px", 
                borderRadius: 3,
                fontWeight: "bold",
                textTransform: "capitalize"
              }}>
                {manga.mangaMDStatus}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              margin: "0 0 4px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--fg)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.2"
            }}>
              {manga.title}
            </h3>
            
            {(authorInfo || artistInfo) && (
              <p style={{ 
                margin: "0 0 4px",
                fontSize: "11px",
                color: "#a9a9b2",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {authorInfo && artistInfo ? `${authorInfo} · ${artistInfo}` : authorInfo || artistInfo}
              </p>
            )}

            {/* Tags preview */}
            {tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 4 }}>
                {tags.slice(0, 2).map((tag: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      background: "#374151",
                      color: "#d1d5db",
                      fontSize: 8,
                      padding: "1px 3px",
                      borderRadius: 2
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span style={{ color: "#6b7280", fontSize: 8 }}>
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Latest chapter info */}
        <div style={{ 
          borderTop: "1px solid rgba(138, 180, 255, 0.1)",
          paddingTop: "8px",
          marginTop: "auto"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "4px"
          }}>
            <span style={{ 
              fontSize: "10px", 
              color: "#8ab4ff", 
              fontWeight: "500"
            }}>
              Latest Chapter
            </span>
            {latestChapterInfo.date && (
              <span style={{ 
                fontSize: "9px", 
                color: "#6b7280"
              }}>
                {latestChapterInfo.date}
              </span>
            )}
          </div>
          
          <div style={{ 
            fontSize: "12px",
            color: "var(--fg)",
            fontWeight: "500",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {latestChapterInfo.number && `Chapter ${latestChapterInfo.number}: `}
            {latestChapterInfo.title}
          </div>
        </div>
      </div>
    </Link>
  );
}
