"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [recentComments, setRecentComments] = useState([
    {
      id: 1,
      comic: "The Great Wave",
      chapter: "Chapter 5",
      comment: "This chapter was absolutely amazing! The artwork is incredible.",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      comic: "Ocean Tales",
      chapter: "Chapter 12",
      comment: "I love how the story is developing. Can't wait for the next chapter!",
      timestamp: "1 day ago"
    },
    {
      id: 3,
      comic: "Wave Chronicles",
      chapter: "Chapter 3",
      comment: "The character development in this series is top-notch.",
      timestamp: "3 days ago"
    }
  ]);
  const [recentlyRead, setRecentlyRead] = useState([
    {
      id: 1,
      title: "The Great Wave",
      type: "Manga",
      chaptersRead: 15,
      totalChapters: 24,
      lastRead: "2 hours ago",
      cover: "/api/placeholder/120/160"
    },
    {
      id: 2,
      title: "Ocean Tales",
      type: "Manhua",
      chaptersRead: 8,
      totalChapters: 12,
      lastRead: "1 day ago",
      cover: "/api/placeholder/120/160"
    },
    {
      id: 3,
      title: "Wave Chronicles",
      type: "Manga",
      chaptersRead: 3,
      totalChapters: 18,
      lastRead: "3 days ago",
      cover: "/api/placeholder/120/160"
    },
    {
      id: 4,
      title: "Deep Blue Stories",
      type: "Hentai",
      chaptersRead: 6,
      totalChapters: 6,
      lastRead: "1 week ago",
      cover: "/api/placeholder/120/160"
    }
  ]);
  const [creatorWorks, setCreatorWorks] = useState([
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
      likes: 892
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
      likes: 456
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
      likes: 678
    }
  ]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setDescription(parsedUser.description || "");
      
      // For demo purposes, let's make this user a creator
      // In a real app, this would come from the user data
      if (parsedUser.name === "test" || parsedUser.email === "test@example.com") {
        setUser(prev => ({ ...prev, isCreator: true }));
      }
    }
  }, []);

  const handleSaveDescription = () => {
    if (user) {
      const updatedUser = { ...user, description };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingDescription(false);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('userDataUpdated', { 
        detail: updatedUser 
      }));
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h1 style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "600" }}>
            Please sign in to view your profile
          </h1>
          <p style={{ margin: "0 0 24px", color: "var(--muted)" }}>
            Sign in to access your profile, comments, and reading history
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link 
              href="/sign-in"
              style={{
                padding: "12px 24px",
                background: "var(--accent)",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Sign In
            </Link>
            <Link 
              href="/create-account"
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
      
      <h1 style={{ margin: "0 0 32px", fontSize: "32px", fontWeight: "700" }}>Profile</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Profile Header */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{ position: "relative" }}>
              <img
                src={user.profilePicture}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: user.cropSettings ?
                    `${50 + (user.cropSettings.position.x / 3)}% ${50 + (user.cropSettings.position.y / 3)}%` :
                    "center center",
                  transform: user.cropSettings ? `scale(${user.cropSettings.scale})` : "scale(1)",
                  transformOrigin: "center center",
                  background: "var(--border)"
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "600" }}>
                  {user.name}
                </h2>
                {user.isCreator && (
                  <span style={{
                    padding: "4px 8px",
                    background: "linear-gradient(135deg, #ff6b6b, #ffa500)",
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 4px rgba(255, 107, 107, 0.3)"
                  }}>
                    Creator
                  </span>
                )}
              </div>
              <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: "16px" }}>
                {user.email}
              </p>
              <Link href="/profile-menu" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "var(--accent)",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>About</h3>
            {!isEditingDescription && (
              <button
                onClick={() => setIsEditingDescription(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline"
                }}
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditingDescription ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about yourself..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
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
                    fontWeight: "500"
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingDescription(false);
                    setDescription(user.description || "");
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p style={{ 
              margin: "0", 
              color: description ? "var(--fg)" : "var(--muted)", 
              lineHeight: "1.6",
              fontStyle: description ? "normal" : "italic"
            }}>
              {description || "No description added yet. Click Edit to add one."}
            </p>
          )}
        </div>

        {/* Creator Works Section */}
        {user.isCreator && (
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>My Works</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {creatorWorks.map((work) => (
                <div key={work.id} style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  background: "var(--bg)",
                  transition: "border-color 0.2s ease"
                }}>
                  <img
                    src={work.cover}
                    alt={work.title}
                    style={{
                      width: "80px",
                      height: "110px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      background: "var(--border)"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <h4 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
                        {work.title}
                      </h4>
                      <span style={{
                        padding: "2px 6px",
                        background: work.status === "Completed" ? "var(--accent)" : "#ffa500",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      }}>
                        {work.status}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "14px" }}>
                      {work.type} • {work.chapters}/{work.totalChapters} chapters
                    </p>
                    <p style={{ margin: "0 0 8px", fontSize: "14px", lineHeight: "1.4" }}>
                      {work.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--muted)" }}>
                      <span>👁️ {work.views.toLocaleString()} views</span>
                      <span>❤️ {work.likes} likes</span>
                      <span>📅 Updated {work.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Read Section */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600" }}>Recently Read</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentlyRead.map((book) => (
              <div key={book.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)"
              }}>
                <img
                  src={book.cover}
                  alt={book.title}
                  style={{
                    width: "60px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    background: "var(--border)"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "600" }}>
                    {book.title}
                  </h4>
                  <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "14px" }}>
                    {book.type} • {book.chaptersRead}/{book.totalChapters} chapters
                  </p>
                  <p style={{ margin: "0", color: "var(--muted)", fontSize: "12px" }}>
                    Last read: {book.lastRead}
                  </p>
                </div>
                <div style={{
                  padding: "4px 8px",
                  background: book.chaptersRead === book.totalChapters ? "var(--accent)" : "var(--border)",
                  color: book.chaptersRead === book.totalChapters ? "white" : "var(--fg)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500"
                }}>
                  {book.chaptersRead === book.totalChapters ? "Completed" : "In Progress"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments Section */}
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600" }}>Recent Comments</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentComments.map((comment) => (
              <div key={comment.id} style={{
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--accent)" }}>
                    {comment.comic}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {comment.chapter}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    • {comment.timestamp}
                  </span>
                </div>
                <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5" }}>
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}