"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Season {
  id: string;
  title: string;
  seasonNumber: number;
  description?: string;
  coverImage?: string;
  isPublished: boolean;
  createdAt: string;
  series: {
    id: string;
    title: string;
    coverImage?: string;
    description?: string;
    authors?: string;
    artists?: string;
    tags?: string;
    mangaMDStatus?: string;
    contentRating?: string;
  };
  chapters: Array<{
    id: string;
    title: string;
    chapterNumber: number;
    pages?: string;
    isPublished: boolean;
    createdAt: string;
  }>;
  creator: {
    id: string;
    name?: string;
    username?: string;
  };
}

export default function SeasonPage() {
  const params = useParams();
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSeasonData(params.id as string);
    }
  }, [params.id]);

  const fetchSeasonData = async (seasonId: string) => {
    try {
      const response = await fetch(`/api/seasons/${seasonId}`);
      const data = await response.json();
      if (data.success) {
        setSeason(data.data);
      } else {
        console.error("Season not found with ID:", seasonId);
        setSeason(null);
      }
    } catch (error) {
      console.error("Error fetching season:", error);
      setSeason(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading season...</h1>
      </div>
    );
  }

  if (!season) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Season not found</h1>
        <Link href="/" style={{ color: "var(--accent)" }}>
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px", fontSize: "14px", color: "var(--muted-foreground)" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>→</span>
        <Link 
          href={`/series/${season.series.id}`} 
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          {season.series.title}
        </Link>
        <span style={{ margin: "0 8px" }}>→</span>
        <span style={{ color: "var(--fg)" }}>{season.title}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px" }}>
        {/* Main Content */}
        <div>
          {/* Season Header */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              margin: "0 0 8px 0",
              color: "var(--fg)"
            }}>
              {season.title}
            </h1>
            
            <p style={{ 
              fontSize: "16px", 
              color: "var(--muted-foreground)",
              margin: "0 0 16px 0"
            }}>
              Season {season.seasonNumber} of <strong style={{ color: "var(--fg)" }}>{season.series.title}</strong>
            </p>

            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ 
                background: "var(--accent)", 
                color: "white", 
                fontSize: "12px", 
                padding: "4px 8px", 
                borderRadius: "6px",
                fontWeight: "500"
              }}>
                {season.chapters.length} chapters
              </span>
              
              <span style={{ 
                background: season.isPublished ? "#28a745" : "#ffc107", 
                color: "white", 
                fontSize: "12px", 
                padding: "4px 8px", 
                borderRadius: "6px",
                fontWeight: "500"
              }}>
                {season.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            {season.description && (
              <p style={{ 
                color: "var(--muted-foreground)",
                lineHeight: "1.6",
                margin: "0"
              }}>
                {season.description}
              </p>
            )}
          </div>

          {/* Chapters List */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              margin: "0 0 20px 0",
              color: "var(--fg)"
            }}>
              Chapters ({season.chapters.length})
            </h2>

            {season.chapters.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px", 
                color: "var(--muted-foreground)" 
              }}>
                No chapters available yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {season.chapters.map((chapter) => (
                  <Link 
                    key={chapter.id}
                    href={`/reader/${season.id}/${chapter.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      background: "var(--border)",
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "var(--fg)",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(138, 180, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--border)";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {chapter.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                        Chapter {chapter.chapterNumber} • {chapter.pages ? chapter.pages.split(',').length : 0} pages
                      </div>
                    </div>
                    <span style={{ color: "var(--accent)" }}>→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Series Info */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            <h3 style={{ 
              fontSize: "18px", 
              fontWeight: "600", 
              margin: "0 0 16px 0",
              color: "var(--fg)"
            }}>
              Series Information
            </h3>
            
            <div style={{ marginBottom: "12px" }}>
              <strong style={{ color: "var(--fg)" }}>Title:</strong>
              <br />
              <Link 
                href={`/series/${season.series.id}`}
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                {season.series.title}
              </Link>
            </div>

            {season.series.authors && (
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ color: "var(--fg)" }}>Authors:</strong>
                <br />
                <span style={{ color: "var(--muted-foreground)" }}>{season.series.authors}</span>
              </div>
            )}

            {season.series.artists && (
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ color: "var(--fg)" }}>Artists:</strong>
                <br />
                <span style={{ color: "var(--muted-foreground)" }}>{season.series.artists}</span>
              </div>
            )}

            {season.series.mangaMDStatus && (
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ color: "var(--fg)" }}>Status:</strong>
                <br />
                <span style={{ color: "var(--muted-foreground)" }}>{season.series.mangaMDStatus}</span>
              </div>
            )}

            {season.series.contentRating && (
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ color: "var(--fg)" }}>Content Rating:</strong>
                <br />
                <span style={{ color: "var(--muted-foreground)" }}>{season.series.contentRating}</span>
              </div>
            )}
          </div>

          {/* Season Stats */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            <h3 style={{ 
              fontSize: "18px", 
              fontWeight: "600", 
              margin: "0 0 16px 0",
              color: "var(--fg)"
            }}>
              Season Statistics
            </h3>
            
            <div style={{ marginBottom: "12px" }}>
              <strong style={{ color: "var(--fg)" }}>Total Chapters:</strong>
              <br />
              <span style={{ color: "var(--muted-foreground)" }}>{season.chapters.length}</span>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <strong style={{ color: "var(--fg)" }}>Created:</strong>
              <br />
              <span style={{ color: "var(--muted-foreground)" }}>
                {new Date(season.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <strong style={{ color: "var(--fg)" }}>Status:</strong>
              <br />
              <span style={{ 
                color: season.isPublished ? "#28a745" : "#ffc107",
                fontWeight: "500"
              }}>
                {season.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
