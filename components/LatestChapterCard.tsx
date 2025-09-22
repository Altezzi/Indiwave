"use client";

import Link from "next/link";

interface LatestChapter {
  id: string;
  title: string;
  chapterNumber: number;
  mangaMDChapterTitle?: string;
  mangaMDChapterNumber?: string;
  createdAt: string;
  mangaMDPublishAt?: string;
  series: {
    id: string;
    title: string;
    coverImage?: string;
    description?: string;
    tags?: string[];
    author?: string;
    artist?: string;
    year?: string | number;
    mangaMDStatus?: string;
  };
}

interface LatestChapterCardProps {
  chapter: LatestChapter;
}

export default function LatestChapterCard({ chapter }: LatestChapterCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const chapterTitle = chapter.mangaMDChapterTitle || chapter.title || `Chapter ${chapter.chapterNumber}`;
  const chapterNumber = chapter.mangaMDChapterNumber || chapter.chapterNumber.toString();

  return (
    <Link
      href={`/reader/${chapter.series.id}/${chapter.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid rgba(138, 180, 255, 0.1)",
        transition: "all 0.2s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(var(--bg-rgb, 18, 18, 18), 0.8)";
        e.currentTarget.style.border = "1px solid rgba(138, 180, 255, 0.2)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(var(--bg-rgb, 18, 18, 18), 0.6)";
        e.currentTarget.style.border = "1px solid rgba(138, 180, 255, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", gap: "12px", height: "100%" }}>
        {/* Cover Image */}
        <div
          style={{
            width: "60px",
            height: "80px",
            borderRadius: "6px",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {chapter.series.coverImage ? (
            <img
              src={chapter.series.coverImage}
              alt={`${chapter.series.title} cover`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{ color: "var(--muted)", fontSize: "12px", textAlign: "center" }}>
              📖
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--fg)",
                lineHeight: "1.3",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {chapter.series.title}
            </h3>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--accent)",
                lineHeight: "1.2",
              }}
            >
              {chapterTitle}
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "11px",
                color: "var(--muted)",
                lineHeight: "1.2",
              }}
            >
              {formatDate(chapter.createdAt)}
            </p>
          </div>

          {/* Read Button */}
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "var(--accent)",
                fontWeight: "500",
              }}
            >
              Read →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
