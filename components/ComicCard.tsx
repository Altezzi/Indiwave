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
  
  // Get the best author/artist info
  const authorInfo = authors.length > 0 ? authors.join(', ') : comic.author;
  const artistInfo = artists.length > 0 ? artists.join(', ') : comic.artist;
  
  // Get cover image (prefer coverImage for imported series)
  const coverImage = comic.coverImage || comic.cover;
  
  // Get year info
  const yearInfo = comic.year || '';

  return (
    <div className="card">
      <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: 8, marginBottom: 8, background: "#0f0f11", display: "grid", placeItems: "center", border: "1px solid #2a2a2e", position: "relative" }}>
        {/* cover */}
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt={`${comic.title} cover`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span className="mono">no cover</span>
        )}
        
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
      
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <strong>{comic.title}</strong>
        
        {/* Author/Artist info */}
        {(authorInfo || artistInfo) && (
          <span style={{ color: "#a9a9b2", fontSize: 12 }}>
            {authorInfo && artistInfo ? `${authorInfo} · ${artistInfo}` : authorInfo || artistInfo}
          </span>
        )}
        
        {/* Series and year */}
        <span style={{ color: "#a9a9b2", fontSize: 13 }}>
          {comic.series && yearInfo ? `${comic.series} · ${yearInfo}` : comic.series || yearInfo}
        </span>
        
        {/* Tags preview */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index}
                style={{ 
                  background: "#374151", 
                  color: "#d1d5db", 
                  fontSize: 10, 
                  padding: "1px 4px", 
                  borderRadius: 3 
                }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span style={{ color: "#6b7280", fontSize: 10 }}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <span style={{ color: "#8ab4ff", fontSize: 12 }}>Read →</span>
      </div>
    </div>
  );
}
