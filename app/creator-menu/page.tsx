"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CreatorMenuPage() {
  const [user, setUser] = useState<any>(null);
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
      likes: 892,
      comments: 45
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
      comments: 23
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
      comments: 34
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1>Please sign in to access the creator menu</h1>
        <Link href="/sign-in" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Sign In
        </Link>
      </div>
    );
  }

  const handleBecomeCreator = () => {
    const updatedUser = { ...user, isCreator: true };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUser }));
  };

  if (!user.isCreator) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <Link href="/profile" style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← Back to Profile
          </Link>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ marginBottom: "24px" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)", margin: "0 auto 16px" }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h1 style={{ margin: "0 0 16px", fontSize: "28px", fontWeight: "600" }}>
              Become a Creator
            </h1>
            <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "16px", lineHeight: "1.6" }}>
              Join our community of creators and share your stories with the world. 
              Publish your comics, manga, webtoons, and more on Indiwave.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--border)", borderRadius: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <span>Publish your own comics and stories</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--border)", borderRadius: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
                <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
              </svg>
              <span>Track your performance with detailed analytics</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--border)", borderRadius: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Connect with readers and build your audience</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--border)", borderRadius: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Join our creator community and get support</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleBecomeCreator}
              style={{
                padding: "16px 32px",
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Become a Creator
            </button>
            <p style={{ margin: "0", fontSize: "12px", color: "var(--muted)" }}>
              Free to join • No setup fees • Start publishing immediately
            </p>
          </div>
        </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "600" }}>
            Creator Menu
          </h1>
        </div>
        
        <p style={{ margin: "0 0 32px", color: "var(--muted)", textAlign: "center" }}>
          Manage your creative works and track your performance
        </p>
        
        {/* Creator Stats */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
            Creator Statistics
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "center", padding: "16px", background: "var(--border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)" }}>
                {creatorWorks.length}
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Total Works</div>
            </div>
            <div style={{ textAlign: "center", padding: "16px", background: "var(--border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)" }}>
                {creatorWorks.reduce((sum, work) => sum + work.views, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Total Views</div>
            </div>
            <div style={{ textAlign: "center", padding: "16px", background: "var(--border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)" }}>
                {creatorWorks.reduce((sum, work) => sum + work.likes, 0)}
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Total Likes</div>
            </div>
            <div style={{ textAlign: "center", padding: "16px", background: "var(--border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--accent)" }}>
                {creatorWorks.reduce((sum, work) => sum + work.comments, 0)}
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Total Comments</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
            Quick Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              color: "var(--fg)",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              width: "100%",
              textAlign: "left"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Create New Work
            </button>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              color: "var(--fg)",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              width: "100%",
              textAlign: "left"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Upload New Chapter
            </button>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              color: "var(--fg)",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              width: "100%",
              textAlign: "left"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
              </svg>
              Analytics Dashboard
            </button>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              color: "var(--fg)",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              width: "100%",
              textAlign: "left"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Creator Profile Settings
            </button>
          </div>
        </div>

        {/* My Works Management */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
            Manage My Works
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {creatorWorks.map((work) => (
              <div key={work.id} style={{
                display: "flex",
                gap: "16px",
                padding: "16px",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                background: "var(--bg)"
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
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>
                    <span>👁️ {work.views.toLocaleString()} views</span>
                    <span>❤️ {work.likes} likes</span>
                    <span>💬 {work.comments} comments</span>
                    <span>📅 Updated {work.lastUpdated}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{
                      padding: "6px 12px",
                      background: "var(--accent)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      Edit
                    </button>
                    <button style={{
                      padding: "6px 12px",
                      background: "transparent",
                      color: "var(--fg)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}>
                      Analytics
                    </button>
                    <button style={{
                      padding: "6px 12px",
                      background: "transparent",
                      color: "var(--fg)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}>
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
