"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ComicDetailsPage() {
  const params = useParams();
  const [comic, setComic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const res = await fetch(`${baseUrl}/api/comics/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setComic(data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Failed to load comic:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchComic();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        fontSize: "18px",
        color: "var(--fg)"
      }}>
        Loading comic...
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        fontSize: "18px",
        color: "var(--fg)"
      }}>
        <h2>Comic not found</h2>
        <Link href="/library" style={{ color: "var(--accent)" }}>Back to Library</Link>
      </div>
    );
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
          fontSize: "16px",
          fontWeight: "500"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Library
        </Link>
      </div>

      {/* Comic Details */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "32px",
        alignItems: "start"
      }}>
        {/* Cover Image */}
        <div style={{
          position: "sticky",
          top: "20px"
        }}>
          <img 
            src={comic.cover} 
            alt={comic.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}
          />
        </div>

        {/* Comic Info */}
        <div>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            margin: "0 0 8px",
            color: "var(--fg)"
          }}>
            {comic.title}
          </h1>
          
          <p style={{ 
            fontSize: "18px", 
            color: "var(--muted)", 
            margin: "0 0 24px" 
          }}>
            {comic.series} • {comic.year}
          </p>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 12px", color: "var(--fg)" }}>
              Description
            </h3>
            <p style={{ 
              fontSize: "16px", 
              lineHeight: "1.6", 
              color: "var(--fg)",
              margin: "0 0 16px"
            }}>
              {comic.description}
            </p>
          </div>

          {/* Author Info */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 4px", color: "var(--muted)" }}>
                  Author
                </h4>
                <p style={{ fontSize: "16px", margin: "0", color: "var(--fg)" }}>
                  {comic.author}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 4px", color: "var(--muted)" }}>
                  Artist
                </h4>
                <p style={{ fontSize: "16px", margin: "0", color: "var(--fg)" }}>
                  {comic.artist}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 8px", color: "var(--muted)" }}>
              Tags
            </h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {comic.tags?.map((tag: string) => (
                <span key={tag} style={{
                  padding: "4px 12px",
                  background: "var(--border)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "var(--fg)"
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 16px", color: "var(--fg)" }}>
              Chapters
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {comic.chapters?.map((chapter: any) => (
                <Link 
                  key={chapter.id}
                  href={`/reader/${comic.id}/${chapter.id}`}
                  style={{
                    display: "block",
                    padding: "16px",
                    background: "var(--border)",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "var(--fg)",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--border)";
                    e.currentTarget.style.color = "var(--fg)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "600" }}>
                        {chapter.title}
                      </h4>
                      <p style={{ margin: "0", fontSize: "14px", opacity: 0.8 }}>
                        {chapter.pages?.length || 0} pages
                      </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
