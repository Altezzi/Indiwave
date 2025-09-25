"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MyListPage() {
  // Temporarily disable authentication until NextAuth is properly configured
  const session = null; // { user: { id: 'demo-user' } }; // Uncomment for demo mode
  const status = "authenticated"; // "loading" or "unauthenticated"
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [followedSeries, setFollowedSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Fetch user's followed series when component mounts or session changes
  useEffect(() => {
    const fetchFollowedSeries = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get user's followed series IDs
        const followsResponse = await fetch('/api/user/followed-series');
        if (!followsResponse.ok) {
          throw new Error('Failed to fetch followed series');
        }
        const followsData = await followsResponse.json();
        const followedSeriesIds = followsData.followedSeries || [];

        if (followedSeriesIds.length === 0) {
          setFollowedSeries([]);
          setLoading(false);
          return;
        }

        // Get full manga data for followed series
        const mangaResponse = await fetch('/api/manga');
        if (!mangaResponse.ok) {
          throw new Error('Failed to fetch manga data');
        }
        const mangaData = await mangaResponse.json();
        const allManga = mangaData.data || [];

        // Filter manga data to only include followed series
        const userFollowedManga = allManga.filter((manga: any) => 
          followedSeriesIds.includes(manga.id)
        );

        // Convert manga data to the format expected by the UI
        const formattedSeries = userFollowedManga.map((manga: any) => ({
          id: manga.id,
          title: manga.title,
          series: manga.title, // Using title as series name
          author: manga.authors?.join(', ') || 'Unknown',
          cover: manga.coverUrl,
          totalChapters: manga.totalChapters || 0,
          chaptersRead: 0, // Default to 0 - could be enhanced later
          rating: 0, // Default to 0 - could be enhanced later
          status: manga.status || 'Unknown',
          readingStatus: 'Plan to read', // Default status
          lastRead: 'Never', // Default - could be enhanced later
          isFavorite: false, // Default to false - could be enhanced later
          description: manga.description || 'No description available',
          tags: manga.tags || []
        }));

        setFollowedSeries(formattedSeries);
      } catch (error) {
        console.error('Error fetching followed series:', error);
        setFollowedSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedSeries();
  }, [session?.user?.id]);

  const handleRatingChange = (seriesId: string, newRating: number) => {
    setFollowedSeries(prev => 
      prev.map(series => 
        series.id === seriesId 
          ? { ...series, rating: newRating }
          : series
      )
    );
  };

  const handleReadingStatusChange = (seriesId: string, newStatus: string) => {
    setFollowedSeries(prev => 
      prev.map(series => 
        series.id === seriesId 
          ? { ...series, readingStatus: newStatus }
          : series
      )
    );
  };

  const handleFavoriteToggle = (seriesId: string) => {
    setFollowedSeries(prev => 
      prev.map(series => 
        series.id === seriesId 
          ? { ...series, isFavorite: !series.isFavorite }
          : series
      )
    );
  };

  const getProgressPercentage = (read: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((read / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "var(--accent)";
      case "Ongoing": return "#ffa500";
      case "Not Started": return "var(--muted)";
      default: return "var(--border)";
    }
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilter(prev => [...prev, status]);
    } else {
      setStatusFilter(prev => prev.filter(s => s !== status));
    }
  };

  // Get unique statuses from followed series
  const availableStatuses = Array.from(new Set(followedSeries.map(series => series.status))).sort();

  // Filter series based on status filter
  const getFilteredSeries = () => {
    let filtered = followedSeries;
    
    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(series => !statusFilter.includes(series.status));
    }
    
    // Apply tab filter (all vs favorites)
    if (activeTab === "favorites") {
      filtered = filtered.filter(series => series.isFavorite);
    }
    
    return filtered;
  };

  const filteredSeries = getFilteredSeries();

  // Show loading state while checking authentication or fetching data
  if (status === "loading" || loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "600" }}>Loading...</h1>
        <p style={{ margin: "0 0 24px", color: "var(--muted)" }}>
          {status === "loading" ? "Checking authentication..." : "Loading your list..."}
        </p>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!session?.user) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "600" }}>Please Sign In</h1>
        <p style={{ margin: "0 0 24px", color: "var(--muted)" }}>
          You need to be signed in to view your reading list.
        </p>
        <Link href="/sign-in" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <h1 style={{ margin: "0", fontSize: "32px", fontWeight: "700" }}>
            My List
          </h1>
          <span style={{
            padding: "4px 8px",
            background: "var(--border)",
            color: "var(--fg)",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            {filteredSeries.length} series
          </span>
        </div>
        
        {/* Filter Button */}
        <button
          onClick={() => setShowFilterModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: statusFilter.length > 0 ? "var(--accent)" : "transparent",
            color: statusFilter.length > 0 ? "white" : "var(--fg)",
            border: `2px solid var(--accent)`,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter
          {statusFilter.length > 0 && (
            <span style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              borderRadius: "10px",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "600"
            }}>
              {statusFilter.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "8px 16px",
            background: activeTab === "all" ? "var(--accent)" : "transparent",
            color: activeTab === "all" ? "white" : "var(--fg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          All Series ({followedSeries.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          style={{
            padding: "8px 16px",
            background: activeTab === "favorites" ? "var(--accent)" : "transparent",
            color: activeTab === "favorites" ? "white" : "var(--fg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Favorites ({followedSeries.filter(s => s.isFavorite).length})
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredSeries.map((series) => (
          <div key={series.id} className="card" style={{
            display: "flex",
            gap: "16px",
            padding: "20px",
            transition: "border-color 0.2s ease"
          }}>
            {/* Cover Image */}
            <Link href={`/series/${series.id}`} style={{ textDecoration: "none" }}>
              <img
                src={series.cover}
                alt={series.title}
                style={{
                  width: "80px",
                  height: "110px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  background: "var(--border)",
                  cursor: "pointer"
                }}
              />
            </Link>

            {/* Series Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <Link href={`/series/${series.id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ 
                        margin: "0", 
                        fontSize: "20px", 
                        fontWeight: "600", 
                        color: "var(--fg)",
                        cursor: "pointer"
                      }}>
                        {series.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => handleFavoriteToggle(series.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={series.isFavorite ? "#ff6b6b" : "none"}
                        stroke={series.isFavorite ? "#ff6b6b" : "var(--muted)"}
                        strokeWidth="2"
                        style={{
                          transition: "all 0.2s ease"
                        }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "14px" }}>
                    {series.series} • by {series.author}
                  </p>
                </div>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(series.id, star)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px"
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={star <= series.rating ? "#ffd700" : "none"}
                          stroke={star <= series.rating ? "#ffd700" : "var(--muted)"}
                          strokeWidth="2"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: "14px", color: "var(--muted)", minWidth: "30px" }}>
                    {series.rating > 0 ? series.rating.toFixed(1) : "—"}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", color: "var(--fg)", fontWeight: "500" }}>
                    Progress
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                    {series.chaptersRead}/{series.totalChapters} chapters
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  height: "6px",
                  background: "var(--border)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${getProgressPercentage(series.chaptersRead, series.totalChapters)}%`,
                    height: "100%",
                    background: "var(--accent)",
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <div style={{ 
                  fontSize: "12px", 
                  color: "var(--muted)", 
                  marginTop: "4px",
                  textAlign: "right"
                }}>
                  {getProgressPercentage(series.chaptersRead, series.totalChapters)}% complete
                </div>
              </div>

              {/* Status and Last Read */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                <span style={{
                  padding: "4px 8px",
                  background: getStatusColor(series.status),
                  color: "white",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase"
                }}>
                  {series.status}
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Last read: {series.lastRead}
                </span>
              </div>

              {/* Reading Status */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>
                    Reading Status:
                  </span>
                  <select
                    value={series.readingStatus}
                    onChange={(e) => handleReadingStatusChange(series.id, e.target.value)}
                    style={{
                      padding: "6px 12px",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--fg)",
                      fontSize: "12px",
                      cursor: "pointer",
                      minWidth: "140px",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 8px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                      paddingRight: "32px"
                    }}
                  >
                    <option value="Currently reading">Currently reading</option>
                    <option value="Waiting for new chapters">Waiting for new chapters</option>
                    <option value="On hold">On hold</option>
                    <option value="Plan to read">Plan to read</option>
                    <option value="Finished">Finished</option>
                    <option value="Rereading">Rereading</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <p style={{ 
                margin: "0 0 12px", 
                fontSize: "14px", 
                color: "var(--muted)", 
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {series.description}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {series.tags.slice(0, 3).map((tag) => (
                  <span key={tag} style={{
                    padding: "2px 6px",
                    background: "var(--border)",
                    color: "var(--fg)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500"
                  }}>
                    {tag}
                  </span>
                ))}
                {series.tags.length > 3 && (
                  <span style={{
                    padding: "2px 6px",
                    background: "var(--border)",
                    color: "var(--muted)",
                    borderRadius: "4px",
                    fontSize: "11px"
                  }}>
                    +{series.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {followedSeries.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", margin: "0 auto 16px" }}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "600" }}>
            Your list is empty
          </h3>
          <p style={{ margin: "0 0 24px", color: "var(--muted)" }}>
            Start following series to see them here
          </p>
          <Link href="/library" style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "var(--accent)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600"
          }}>
            Browse Library
          </Link>
        </div>
      )}

      {followedSeries.length > 0 && filteredSeries.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", margin: "0 auto 16px" }}>
            <path d="M3 3l18 18"/>
            <path d="M9 9l6 6"/>
            <path d="M21 3l-6 6"/>
            <path d="M3 21l6-6"/>
          </svg>
          <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "600" }}>
            No series match your filters
          </h3>
          <p style={{ margin: "0 0 24px", color: "var(--muted)" }}>
            Try adjusting your status filters to see more series
          </p>
          <button
            onClick={() => setStatusFilter([])}
            style={{
              padding: "12px 24px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {followedSeries.length > 0 && followedSeries.filter(s => activeTab === "all" || s.isFavorite).length === 0 && activeTab === "favorites" && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", margin: "0 auto 16px" }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "600" }}>
            No favorites yet
          </h3>
          <p style={{ margin: "0 0 24px", color: "var(--muted)" }}>
            Click the heart icon on any series to add it to your favorites
          </p>
          <button
            onClick={() => setActiveTab("all")}
            style={{
              padding: "12px 24px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            View All Series
          </button>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0, 0, 0, 0.6)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{ 
            background: "var(--bg)", 
            padding: "24px", 
            borderRadius: "12px", 
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", 
            maxWidth: "500px", 
            width: "100%",
            border: "1px solid var(--border)",
            maxHeight: "80vh",
            overflow: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ 
                margin: "0", 
                fontSize: "20px", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter by Status
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
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
            
            <p style={{ 
              margin: "0 0 20px", 
              fontSize: "14px", 
              color: "var(--muted)",
              lineHeight: "1.4"
            }}>
              Hide series with these statuses:
            </p>

            {availableStatuses.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {availableStatuses.map((status) => {
                  const isFiltered = statusFilter.includes(status);
                  const count = followedSeries.filter(s => s.status === status).length;
                  
                  return (
                    <label key={status} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px",
                      cursor: "pointer",
                      padding: "12px",
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease",
                      backgroundColor: isFiltered ? "var(--accent)" : "var(--bg-secondary)",
                      border: "1px solid var(--border)"
                    }}>
                      <input
                        type="checkbox"
                        checked={isFiltered}
                        onChange={(e) => handleStatusFilterChange(status, e.target.checked)}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "var(--accent)"
                        }}
                      />
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: getStatusColor(status)
                        }} />
                        <span style={{ 
                          fontSize: "16px",
                          color: isFiltered ? "white" : "var(--fg)",
                          fontWeight: isFiltered ? "500" : "400"
                        }}>
                          {status}
                        </span>
                        <span style={{ 
                          fontSize: "14px",
                          color: isFiltered ? "rgba(255,255,255,0.7)" : "var(--muted)",
                          marginLeft: "auto"
                        }}>
                          ({count})
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p style={{ 
                margin: "0 0 20px", 
                fontSize: "14px", 
                color: "var(--muted)",
                fontStyle: "italic",
                textAlign: "center"
              }}>
                No series with different statuses found
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              {statusFilter.length > 0 && (
                <button
                  onClick={() => setStatusFilter([])}
                  style={{
                    padding: "10px 20px",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilterModal(false)}
                style={{
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
