"use client";

import "./globals.css";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import ProfileDropdown from "../components/ProfileDropdown";
import SearchDropdown from "../components/SearchDropdown";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [comics, setComics] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  useEffect(() => {
    // Fetch comics data for search
    const fetchComics = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/comics`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setComics(data.comics || []);
        }
      } catch (error) {
        console.error("Failed to fetch comics for search:", error);
      }
    };

    fetchComics();
  }, []);

  return (
    <html lang="en">
      <body>
            <header className="header">
              <div className="header-inner container">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0px", height: "80px" }}>
                    <img 
                      src="/logo.png"
                      alt="Indiwave Logo" 
                      className="logo-image"
                      style={{ 
                        width: "75px", 
                        height: "75px", 
                        objectFit: "contain"
                      }} 
                    />
                    <img 
                      src="/text.png" 
                      alt="Indiwave" 
                      className="logo-text"
                      style={{ 
                        height: "36px", 
                        objectFit: "contain",
                        marginLeft: "-8px",
                        marginTop: "4px"
                      }} 
                    />
                  </Link>
                  <span className="badge">Beta</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, justifyContent: "center" }}>
                  <div className="search" style={{ maxWidth: "400px", width: "100%", position: "relative", display: "flex" }}>
                    <input 
                      type="search" 
                      placeholder="Search comics, authors, or creators..." 
                      onClick={() => setIsSearchOpen(true)}
                      style={{ cursor: "pointer", flex: 1, borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
                    />
                    <button
                      onClick={() => setIsAdvancedSearchOpen(true)}
                      style={{
                        padding: "12px 16px",
                        background: "var(--border)",
                        border: "1px solid var(--border)",
                        borderLeft: "none",
                        borderTopRightRadius: "12px",
                        borderBottomRightRadius: "12px",
                        color: "var(--fg)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </button>
                    <SearchDropdown 
                      comics={comics}
                      isOpen={isSearchOpen}
                      onClose={() => setIsSearchOpen(false)}
                    />
                  </div>
                  <nav style={{ display: "flex", gap: 16 }}>
                    <Link className="link" href="/library">Library</Link>
                    <Link className="link" href="/my-list">My List</Link>
                  </nav>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <ProfileDropdown />
                </div>
              </div>
            </header>
        <main className="container">{children}</main>
        <footer className="footer">© 2025 Indiwave — public domain & creator-authorized only</footer>

        {/* Advanced Search Modal */}
        {isAdvancedSearchOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}>
            <div style={{
              background: "var(--bg)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              border: "1px solid var(--border)",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "600" }}>
                  Advanced Search
                </h2>
                <button
                  onClick={() => setIsAdvancedSearchOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Search Term */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--fg)" }}>
                    Search Term
                  </label>
                  <input
                    type="text"
                    placeholder="Enter keywords, titles, authors..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      background: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Filters Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  {/* Year Range */}
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--fg)" }}>
                      Year Range
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="number"
                        placeholder="From"
                        min="1900"
                        max="2025"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          background: "var(--bg)",
                          color: "var(--fg)",
                          fontSize: "14px"
                        }}
                      />
                      <input
                        type="number"
                        placeholder="To"
                        min="1900"
                        max="2025"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          background: "var(--bg)",
                          color: "var(--fg)",
                          fontSize: "14px"
                        }}
                      />
                    </div>
                  </div>

                  {/* Author */}
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--fg)" }}>
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="Author name"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        background: "var(--bg)",
                        color: "var(--fg)",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--fg)" }}>
                    Tags
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                    {["Action", "Adventure", "Fantasy", "Sci-Fi", "Romance", "Comedy", "Drama", "Horror", "Mystery", "Superhero"].map((tag) => (
                      <button
                        key={tag}
                        style={{
                          padding: "6px 12px",
                          background: "var(--border)",
                          border: "1px solid var(--border)",
                          borderRadius: "16px",
                          color: "var(--fg)",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
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
                        {tag}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add custom tags..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      background: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: "14px"
                    }}
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--fg)" }}>
                    Sort By
                  </label>
                  <select style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: "14px"
                  }}>
                    <option value="relevance">Relevance</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="year">Year (Newest)</option>
                    <option value="year-desc">Year (Oldest)</option>
                    <option value="author">Author (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "32px" }}>
                <button
                  onClick={() => setIsAdvancedSearchOpen(false)}
                  style={{
                    padding: "12px 24px",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle advanced search
                    setIsAdvancedSearchOpen(false);
                  }}
                  style={{
                    padding: "12px 24px",
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
