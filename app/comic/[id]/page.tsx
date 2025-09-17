import Link from "next/link";
import { notFound } from "next/navigation";

async function getComic(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/comics/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ComicDetailsPage({ params }: { params: { id: string } }) {
  const comic = await getComic(params.id);
  
  if (!comic) {
    notFound();
  }

  return (
    <div>
      {/* Back Navigation */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/library" style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px", 
          color: "var(--accent)", 
          textDecoration: "none",
          fontSize: "14px"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Library
        </Link>
      </div>

      {/* Comic Header */}
      <div style={{ 
        display: "flex", 
        gap: "24px", 
        marginBottom: "32px",
        flexWrap: "wrap"
      }}>
        {/* Cover Art */}
        <div style={{ 
          flex: "0 0 200px",
          minWidth: "200px"
        }}>
          <img 
            src={comic.cover} 
            alt={`${comic.title} cover`}
            style={{
              width: "100%",
              height: "280px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          />
        </div>

        {/* Comic Info */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h1 style={{ 
            margin: "0 0 8px", 
            fontSize: "28px", 
            fontWeight: "700",
            lineHeight: "1.2"
          }}>
            {comic.title}
          </h1>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            marginBottom: "16px",
            flexWrap: "wrap"
          }}>
            <span style={{ 
              color: "var(--muted)", 
              fontSize: "16px" 
            }}>
              {comic.series}
            </span>
            <span style={{ 
              color: "var(--muted)", 
              fontSize: "14px" 
            }}>
              •
            </span>
            <span style={{ 
              color: "var(--muted)", 
              fontSize: "14px" 
            }}>
              {comic.year}
            </span>
          </div>

          {/* Tags */}
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            marginBottom: "20px",
            flexWrap: "wrap"
          }}>
            {comic.tags?.map((tag: string, index: number) => (
              <span 
                key={index}
                style={{
                  padding: "4px 12px",
                  background: "var(--accent)",
                  color: "white",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "500"
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ 
              margin: "0 0 12px", 
              fontSize: "18px", 
              fontWeight: "600" 
            }}>
              Description
            </h3>
            <p style={{ 
              margin: "0", 
              lineHeight: "1.6", 
              color: "var(--muted)",
              fontSize: "14px"
            }}>
              {comic.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: "flex", 
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <button style={{
              padding: "12px 24px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s ease"
            }}>
              Start Reading
            </button>
            <button style={{
              padding: "12px 24px",
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s ease"
            }}>
              Add to Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div>
        <h2 style={{ 
          margin: "0 0 20px", 
          fontSize: "22px", 
          fontWeight: "600" 
        }}>
          Chapters ({comic.chapters?.length || 0})
        </h2>
        
        <div style={{ 
          display: "grid", 
          gap: "12px",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
        }}>
          {comic.chapters?.map((chapter: any, index: number) => (
            <Link 
              key={chapter.id}
              href={`/reader/${comic.id}/${chapter.id}`}
              style={{
                display: "block",
                padding: "16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                textDecoration: "none",
                color: "var(--fg)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <div>
                  <h3 style={{ 
                    margin: "0 0 4px", 
                    fontSize: "16px", 
                    fontWeight: "600" 
                  }}>
                    {chapter.title}
                  </h3>
                  <p style={{ 
                    margin: "0", 
                    fontSize: "14px", 
                    color: "var(--muted)" 
                  }}>
                    {chapter.pages?.length || 0} pages
                  </p>
                </div>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ color: "var(--muted)" }}
                >
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

