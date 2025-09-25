"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

type CropSettings = {
  scale: number;
  position: { x: number; y: number };
};

type User = {
  name: string;
  email: string;
  profilePicture: string;
  cropSettings?: CropSettings | null;
  description?: string;
  isCreator?: boolean;
};

type Comment = {
  id: number;
  comic: string;
  chapter: string;
  comment: string;
  timestamp: string;
};

type Book = {
  id: number;
  title: string;
  type: string;
  chaptersRead: number;
  totalChapters: number | string;
  lastRead: string;
  cover: string;
};

type Work = {
  id: number;
  title: string;
  type: string;
  status: "Ongoing" | "Completed";
  chapters: number;
  totalChapters: number | string;
  lastUpdated: string;
  cover: string;
  description: string;
  views: number;
  likes: number;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [recentComments, setRecentComments] = useState<Comment[]>([
    {
      id: 1,
      comic: "The Great Wave",
      chapter: "Chapter 5",
      comment: "This chapter was absolutely amazing! The artwork is incredible.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      comic: "Ocean Tales",
      chapter: "Chapter 12",
      comment: "I love how the story is developing. Can't wait for the next chapter!",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      comic: "Wave Chronicles",
      chapter: "Chapter 3",
      comment: "The character development in this series is top-notch.",
      timestamp: "3 days ago",
    },
  ]);

  const [recentlyRead, setRecentlyRead] = useState<Book[]>([
    {
      id: 1,
      title: "The Great Wave",
      type: "Manga",
      chaptersRead: 15,
      totalChapters: 24,
      lastRead: "2 hours ago",
      cover: "/api/placeholder/120/160",
    },
    {
      id: 2,
      title: "Ocean Tales",
      type: "Manhua",
      chaptersRead: 8,
      totalChapters: 12,
      lastRead: "1 day ago",
      cover: "/api/placeholder/120/160",
    },
    {
      id: 3,
      title: "Wave Chronicles",
      type: "Manga",
      chaptersRead: 3,
      totalChapters: 18,
      lastRead: "3 days ago",
      cover: "/api/placeholder/120/160",
    },
    {
      id: 4,
      title: "Deep Blue Stories",
      type: "Hentai",
      chaptersRead: 6,
      totalChapters: 6,
      lastRead: "1 week ago",
      cover: "/api/placeholder/120/160",
    },
  ]);

  const [creatorWorks, setCreatorWorks] = useState<Work[]>([
    {
      id: 1,
      title: "Storm Rider",
      type: "Manga",
      status: "Ongoing",
      chapters: 12,
      totalChapters: "?",
      lastUpdated: "3 days ago",
      cover: "/api/placeholder/120/160",
      description: "A thrilling adventure about a young rider who controls the power of storms.",
      views: 15420,
      likes: 892,
    },
    {
      id: 2,
      title: "Crystal Dreams",
      type: "Manhua",
      status: "Completed",
      chapters: 8,
      totalChapters: 8,
      lastUpdated: "2 weeks ago",
      cover: "/api/placeholder/120/160",
      description: "A beautiful story about dreams, crystals, and the power of imagination.",
      views: 8930,
      likes: 456,
    },
    {
      id: 3,
      title: "Digital Hearts",
      type: "Webtoon",
      status: "Ongoing",
      chapters: 6,
      totalChapters: "?",
      lastUpdated: "1 week ago",
      cover: "/api/placeholder/120/160",
      description: "A romance story set in a digital world where hearts can be programmed.",
      views: 12300,
      likes: 678,
    },
  ]);

  useEffect(() => {
    if (session?.user) {
      // Load description from localStorage if available
      const savedDescription = localStorage.getItem(`description_${session.user.id}`);
      setDescription(savedDescription || "");
    }
  }, [session]);

  const handleSaveDescription = () => {
    if (session?.user) {
      // Save description to localStorage with user ID
      localStorage.setItem(`description_${session.user.id}`, description);
      setIsEditingDescription(false);

      window.dispatchEvent(
        new CustomEvent("userDataUpdated", {
          detail: { description },
        })
      );
    }
  };

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1>Please sign in to view your profile</h1>
        <Link href="/sign-in" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Library
        </Link>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Profile Header */}
        <div className="card" style={{ marginBottom: "24px", textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            <img
              src={session.user.image || "/default-profile-picture.svg"}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 16px",
                display: "block",
                border: "3px solid var(--border)",
              }}
            />
            <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "600" }}>
              {session.user.name}
            </h1>
            <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
              {session.user.email}
            </p>
            
            {/* Description */}
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              {isEditingDescription ? (
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about yourself..."
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      padding: "12px",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      background: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: "14px",
                      resize: "vertical",
                      marginBottom: "12px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button
                      onClick={handleSaveDescription}
                      style={{
                        padding: "8px 16px",
                        background: "var(--accent)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingDescription(false)}
                      style={{
                        padding: "8px 16px",
                        background: "var(--border)",
                        color: "var(--fg)",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ 
                    margin: "0 0 12px", 
                    color: "var(--muted)",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}>
                    {description || "No description yet."}
                  </p>
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      cursor: "pointer",
                      fontSize: "14px",
                      textDecoration: "underline",
                    }}
                  >
                    {description ? "Edit description" : "Add description"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
            Recent Comments
          </h2>
          {recentComments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentComments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: "12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--muted)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <Link
                        href={`/comic/${comment.comic.toLowerCase().replace(/\s+/g, "-")}`}
                        style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}
                      >
                        {comment.comic}
                      </Link>
                      <span style={{ color: "var(--muted-foreground)", margin: "0 8px" }}>•</span>
                      <span style={{ color: "var(--muted-foreground)" }}>{comment.chapter}</span>
                    </div>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
                      {comment.timestamp}
                    </span>
                  </div>
                  <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5" }}>
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "20px" }}>
              No comments yet.
            </p>
          )}
        </div>

        {/* Recently Read */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
            Recently Read
          </h2>
          {recentlyRead.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {recentlyRead.map((book) => (
                <Link
                  key={book.id}
                  href={`/comic/${book.title.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "var(--muted)",
                    transition: "border-color 0.2s ease",
                  }}>
                    <img
                      src={book.cover}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "12px" }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600" }}>
                        {book.title}
                      </h3>
                      <p style={{ margin: "0 0 8px", color: "var(--muted-foreground)", fontSize: "12px" }}>
                        {book.type}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                          {book.chaptersRead}/{book.totalChapters} chapters
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                          {book.lastRead}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "20px" }}>
              No recently read comics.
            </p>
          )}
        </div>

        {/* Creator Works (only show if user is a creator) */}
        {session.user.role === "CREATOR" && (
          <div className="card">
            <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
              My Works
            </h2>
            {creatorWorks.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                {creatorWorks.map((work) => (
                  <Link
                    key={work.id}
                    href={`/comic/${work.title.toLowerCase().replace(/\s+/g, "-")}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "var(--muted)",
                      transition: "border-color 0.2s ease",
                    }}>
                      <img
                        src={work.cover}
                        alt={work.title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ padding: "12px" }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600" }}>
                          {work.title}
                        </h3>
                        <p style={{ margin: "0 0 8px", color: "var(--muted-foreground)", fontSize: "12px" }}>
                          {work.type} • {work.status}
                        </p>
                        <p style={{ margin: "0 0 8px", fontSize: "12px", lineHeight: "1.4" }}>
                          {work.description}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                            {work.chapters}/{work.totalChapters} chapters
                          </span>
                          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "var(--muted-foreground)" }}>
                            <span>👁 {work.views}</span>
                            <span>❤️ {work.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "20px" }}>
                No works published yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}