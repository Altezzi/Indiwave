"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import ComicCard from "./ComicCard";
import GenreFilter from "./GenreFilter";

interface Comic {
  id: string;
  title: string;
  cover: string;
  author?: string;
  artist?: string;
  year?: string | number;
  tags?: string[];
  chapters?: Array<{ id: string; title: string; pages?: string[] }>;
  [key: string]: any;
}

interface LibraryContentProps {
  allComics: Comic[];
}

// Show all manga without pagination

export default function LibraryContent({ 
  allComics
}: { allComics: Comic[] }) {
  const { data: session, status } = useSession();
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mangaPerPage, setMangaPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("none");
  const [showAdultContent, setShowAdultContent] = useState(false);
  const [publicationStatus, setPublicationStatus] = useState("any");
  const [hasTranslatedChapters, setHasTranslatedChapters] = useState(false);

  // Filter comics based on selected genre and search query
  const filteredComics = useMemo(() => {
    let filtered = allComics.filter(comic => {
      // Genre filter
      if (selectedGenre) {
        let hasGenre = false;
        if (comic.tags) {
          try {
            const tags = Array.isArray(comic.tags) ? comic.tags : JSON.parse(comic.tags);
            hasGenre = tags.some((tag: string) => tag === selectedGenre);
          } catch (error) {
            hasGenre = comic.tags === selectedGenre;
          }
        }
        if (!hasGenre) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const title = comic.title?.toLowerCase() || "";
        const author = comic.author?.toLowerCase() || "";
        const artist = comic.artist?.toLowerCase() || "";
        const series = comic.series?.toLowerCase() || "";
        
        if (!(title.includes(query) || 
              author.includes(query) || 
              artist.includes(query) || 
              series.includes(query))) {
          return false;
        }
      }

      // Adult content filter - only filter explicit sexual content
      if (!session || !showAdultContent) {
        // Filter by content rating - only filter explicit sexual content
        if (comic.contentRating) {
          const rating = comic.contentRating.toLowerCase();
          if (rating === "erotica" || rating === "pornographic") return false;
          // Allow "suggestive" content by default
        }
        
        // Filter by tags for explicit sexual content only
        if (comic.tags && Array.isArray(comic.tags)) {
          const explicitTags = [
            'hentai', 'ecchi', 'sexual', 'nudity', 'explicit', 'adult', 'mature',
            'rape', 'abuse'
          ];
          
          // Check if any of the comic's tags match explicit content tags (case insensitive)
          const hasExplicitContent = comic.tags.some(tag => 
            explicitTags.some(explicitTag => 
              tag.toLowerCase().includes(explicitTag.toLowerCase())
            )
          );
          
          if (hasExplicitContent) return false;
        }
      }

      // Publication status filter
      if (publicationStatus !== "any" && comic.mangaMDStatus) {
        if (comic.mangaMDStatus.toLowerCase() !== publicationStatus.toLowerCase()) return false;
      }

      // Has translated chapters filter
      if (hasTranslatedChapters && (!comic.chapters || comic.chapters.length === 0)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "title":
            return (a.title || "").localeCompare(b.title || "");
          case "title-desc":
            return (b.title || "").localeCompare(a.title || "");
          case "year":
            return (b.year || 0) - (a.year || 0);
          case "year-desc":
            return (a.year || 0) - (b.year || 0);
          case "chapters":
            return (b.chapters?.length || 0) - (a.chapters?.length || 0);
          case "chapters-desc":
            return (a.chapters?.length || 0) - (b.chapters?.length || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [allComics, selectedGenre, searchQuery, showAdultContent, publicationStatus, hasTranslatedChapters, sortBy, session]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredComics.length / mangaPerPage);
  const startIndex = (currentPage - 1) * mangaPerPage;
  const endIndex = startIndex + mangaPerPage;
  
  // Paginate filtered results based on current page and mangaPerPage setting
  const paginatedComics = useMemo(() => {
    return filteredComics.slice(startIndex, endIndex);
  }, [filteredComics, startIndex, endIndex]);

  // Smart pagination: show 5 pages max, centered around current page
  const getVisiblePages = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <>

      {/* Search and Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: "1000px",
          margin: "0 auto 40px auto",
          padding: "0 16px",
        }}
      >
        <div style={{ 
          flex: 1, 
          minWidth: "200px", 
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <input
            type="search"
            placeholder="Search comics, authors, or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 50px 12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              color: "var(--fg)",
              fontSize: "14px",
            }}
          />
          <button
            type="button"
            onClick={() => {
              setShowFilters(!showFilters);
            }}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              border: "none",
              borderRadius: "8px",
              background: "#87CEEB", // Light blue background like in the image
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(135, 206, 235, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#7BB3D9"; // Slightly darker blue on hover
              e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(135, 206, 235, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#87CEEB";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(135, 206, 235, 0.3)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
              }}
            >
              {/* Magnifying glass lens */}
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="#4A90E2"
                strokeWidth="2"
                fill="none"
              />
              {/* Magnifying glass handle */}
              <path
                d="m21 21-4.35-4.35"
                stroke="#D946EF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Plus sign inside the lens */}
              <path
                d="M11 7v8M7 11h8"
                stroke="#4A90E2"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <GenreFilter
          comics={allComics}
          onGenreChange={setSelectedGenre}
          selectedGenre={selectedGenre}
        />
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", minWidth: "280px" }}>
          <select
            value={mangaPerPage}
            onChange={(e) => setMangaPerPage(Number(e.target.value))}
            style={{
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              color: "var(--fg)",
              fontSize: "14px",
              minWidth: "120px",
              cursor: "pointer",
            }}
          >
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
            <option value={99}>99 per page</option>
          </select>
          
          {/* 18+ Content Toggle - Only show for authenticated users */}
          {session && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg)",
              minWidth: "140px",
            }}>
              <label style={{ 
                fontSize: "14px", 
                color: "var(--fg)", 
                cursor: "pointer",
                userSelect: "none"
              }}>
                18+
              </label>
              <div
                style={{
                  position: "relative",
                  width: "40px",
                  height: "20px",
                  background: showAdultContent ? "var(--accent)" : "var(--muted)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => setShowAdultContent(!showAdultContent)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: showAdultContent ? "22px" : "2px",
                    width: "16px",
                    height: "16px",
                    background: "white",
                    borderRadius: "50%",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div
          style={{
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            padding: "24px",
            margin: "0 auto 32px auto",
            maxWidth: "800px",
            border: "1px solid rgba(138, 180, 255, 0.2)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Sort By */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--fg)" }}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                }}
              >
                <option value="none">None</option>
                <option value="title">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="year">Year (Newest)</option>
                <option value="year-desc">Year (Oldest)</option>
                <option value="chapters">Most Chapters</option>
                <option value="chapters-desc">Least Chapters</option>
              </select>
            </div>


            {/* Publication Status */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--fg)" }}>
                Publication Status
              </label>
              <select
                value={publicationStatus}
                onChange={(e) => setPublicationStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                }}
              >
                <option value="any">Any</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Checkbox and Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--fg)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={hasTranslatedChapters}
                onChange={(e) => setHasTranslatedChapters(e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              Has translated chapters
            </label>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setSortBy("none");
                  setShowAdultContent(false);
                  setPublicationStatus("any");
                  setHasTranslatedChapters(false);
                }}
                style={{
                  padding: "10px 20px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg)";
                }}
              >
                Reset filters
              </button>
              
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-hover, #4f46e5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {/* Previous Button */}
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={currentPage === 1}
            style={{
              padding: "12px 24px",
              background: currentPage === 1 ? "var(--border)" : "var(--accent)",
              color: currentPage === 1 ? "var(--muted)" : "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {visiblePages.map((pageNum) => {
              const isCurrentPage = pageNum === currentPage;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: "8px 16px",
                    background: isCurrentPage ? "var(--accent)" : "transparent",
                    color: isCurrentPage ? "white" : "var(--fg)",
                    border: isCurrentPage ? "none" : "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: isCurrentPage ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentPage) {
                      e.currentTarget.style.background = "var(--border)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentPage) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={currentPage === totalPages}
            style={{
              padding: "12px 24px",
              background: currentPage === totalPages ? "var(--border)" : "var(--accent)",
              color: currentPage === totalPages ? "var(--muted)" : "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Filter Results Info */}
      <div
        style={{
          textAlign: "center",
          margin: "16px auto",
          fontSize: "14px",
          color: "var(--fg)",
          opacity: 0.8,
          maxWidth: "600px",
        }}
      >
        Showing {paginatedComics.length} of {filteredComics.length} manga
        {selectedGenre && ` in "${selectedGenre}"`}
        {searchQuery && ` matching "${searchQuery}"`}
        {!selectedGenre && !searchQuery && " in library"}
      </div>

      {/* Comics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {paginatedComics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
        {paginatedComics.length === 0 && (
          <div style={{ 
            gridColumn: "1 / -1", 
            textAlign: "center", 
            padding: "40px",
            opacity: 0.8 
          }}>
            {selectedGenre || searchQuery ? (
              <p>No comics found matching your filters.</p>
            ) : (
              <p>No comics yet — check back soon!</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {paginatedComics.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          {/* Pagination Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {/* Previous Button */}
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentPage === 1}
              style={{
                padding: "12px 24px",
                background: currentPage === 1 ? "var(--border)" : "var(--accent)",
                color: currentPage === 1 ? "var(--muted)" : "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "opacity 0.2s ease",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {visiblePages.map((pageNum) => {
                const isCurrentPage = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      padding: "8px 16px",
                      background: isCurrentPage ? "var(--accent)" : "transparent",
                      color: isCurrentPage ? "white" : "var(--fg)",
                      border: isCurrentPage ? "none" : "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: isCurrentPage ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrentPage) {
                        e.currentTarget.style.background = "var(--border)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentPage) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentPage === totalPages}
              style={{
                padding: "12px 24px",
                background: currentPage === totalPages ? "var(--border)" : "var(--accent)",
                color: currentPage === totalPages ? "var(--muted)" : "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                transition: "opacity 0.2s ease",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Next →
            </button>
          </div>
          
          {/* Library Stats */}
          <div
            style={{
              fontSize: "14px",
              color: "var(--fg)",
              opacity: 0.7,
            }}
          >
            Page {currentPage} of {totalPages} • Showing {paginatedComics.length} of {filteredComics.length} manga
            {selectedGenre && ` in "${selectedGenre}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>
      )}
    </>
  );
}
