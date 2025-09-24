"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Chapter {
  id: string;
  title: string;
  pages: string[];
  chapterNumber: number;
  isPublished: boolean;
  createdAt: string;
}

interface Season {
  id: string;
  title: string;
  seasonNumber: number;
  coverImage: string;
  description: string;
  createdAt: string;
  chapters: Chapter[];
  totalChapters: number;
}

interface Comic {
  id: string;
  series: string;
  title: string;
  year: number;
  cover: string;
  description: string;
  tags: string[];
  author: string;
  artist: string;
  chapters: Chapter[];
  seasons: Season[];
  totalSeasons: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
}

interface UserUrl {
  id: string;
  url: string;
  label: string;
  userId: string;
  seriesId?: string;
  chapterId?: string;
}

export default function SeriesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [comic, setComic] = useState<Comic | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userUrls, setUserUrls] = useState<UserUrl[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [communityRating, setCommunityRating] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'seasons'>('chapters');

  useEffect(() => {
    if (params.id) {
      fetchComicData(params.id as string);
      fetchComments(params.id as string);
      fetchUserUrls(params.id as string); // Always fetch user URLs now
      fetchCommunityRating(params.id as string);
    }
  }, [params.id]);

  // Fetch follow status after comic data is loaded
  useEffect(() => {
    if (comic?.id && session?.user?.id) {
      fetchFollowStatus(comic.id);
      fetchUserRating(comic.id);
    }
  }, [comic?.id, session?.user?.id]);

  const fetchComicData = async (id: string) => {
    try {
      const response = await fetch(`/api/series/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch comics data: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.comic) {
        setComic(data.comic);
      } else {
        console.error("Series not found with ID:", id);
        setComic(null);
      }
    } catch (error) {
      console.error("Error fetching comic:", error);
      setComic(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (seriesId: string) => {
    try {
      const response = await fetch(`/api/comments?seriesId=${seriesId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

         const fetchUserUrls = async (seriesId: string) => {
           try {
             // For now, load from localStorage since NextAuth is disabled
             const storedUrls = localStorage.getItem(`userUrls_${seriesId}`);
             if (storedUrls) {
               setUserUrls(JSON.parse(storedUrls));
             } else {
               setUserUrls([]);
             }
           } catch (error) {
             console.error("Error fetching user URLs:", error);
             setUserUrls([]);
           }
         };

  const fetchUserRating = async (seriesId: string) => {
    try {
      const response = await fetch(`/api/user/rating?seriesId=${seriesId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRating(data.rating || null);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const fetchFollowStatus = async (seriesId: string) => {
    try {
      const response = await fetch(`/api/user/follow-status?seriesId=${seriesId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing || false);
      }
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  };

  const fetchCommunityRating = async (seriesId: string) => {
    try {
      const response = await fetch(`/api/community/rating?seriesId=${seriesId}`);
      if (response.ok) {
        const data = await response.json();
        setCommunityRating(data.averageRating || null);
      }
    } catch (error) {
      console.error("Error fetching community rating:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !session?.user) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seriesId: params.id,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(params.id as string);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

         const handleSaveUrl = async () => {
           if (!newUrl.trim() || !newLabel.trim() || !params.id) return;

           // For now, store in localStorage since NextAuth is disabled
           try {
             const newUserUrl = {
               id: Date.now().toString(),
               url: newUrl.trim(),
               label: newLabel.trim(),
               userId: 'local-user',
               seriesId: params.id
             };

             // Get existing URLs from localStorage
             const existingUrls = JSON.parse(localStorage.getItem(`userUrls_${params.id}`) || '[]');
             existingUrls.push(newUserUrl);
             
             // Save back to localStorage
             localStorage.setItem(`userUrls_${params.id}`, JSON.stringify(existingUrls));
             
             // Update state
             setUserUrls(existingUrls);
             setNewUrl("");
             setNewLabel("");
             setShowUrlForm(false);
             
             alert("Reading option added successfully!");
           } catch (error) {
             console.error("Error saving URL:", error);
             alert("Failed to add reading option. Please try again.");
           }
         };

  const handleDeleteUrl = async (urlId: string) => {
    if (!confirm("Are you sure you want to delete this reading option?")) {
      return;
    }

    try {
      // Get existing URLs from localStorage
      const existingUrls = JSON.parse(localStorage.getItem(`userUrls_${params.id}`) || '[]');
      const updatedUrls = existingUrls.filter((url: any) => url.id !== urlId);
      
      // Save back to localStorage
      localStorage.setItem(`userUrls_${params.id}`, JSON.stringify(updatedUrls));
      
      // Update state
      setUserUrls(updatedUrls);
      
      alert("Reading option deleted successfully!");
    } catch (error) {
      console.error("Error deleting URL:", error);
      alert("Failed to delete reading option. Please try again.");
    }
  };

  const handleRating = async (rating: number) => {
    if (!session?.user || !params.id) return;

    try {
      const response = await fetch("/api/user/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seriesId: params.id,
          rating: rating,
        }),
      });

      if (response.ok) {
        setUserRating(rating);
        // Refresh community rating after user rates
        fetchCommunityRating(params.id as string);
      }
    } catch (error) {
      console.error("Error rating series:", error);
    }
  };

  const handleFollow = async () => {
    if (!session?.user || !comic?.id) return;

    setIsLoadingFollow(true);
    try {
      const response = await fetch("/api/user/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seriesId: comic.id,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error("Failed to follow/unfollow series:", response.status);
      }
    } catch (error) {
      console.error("Error following/unfollowing series:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        fontSize: "18px",
        color: "var(--muted-foreground)"
      }}>
        Loading...
      </div>
    );
  }

  if (!comic) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        gap: "16px",
        textAlign: "center"
      }}>
        <div style={{ 
          fontSize: "24px",
          color: "var(--fg)",
          marginBottom: "8px"
        }}>
          📚 Series Not Found
        </div>
        <div style={{ 
          fontSize: "16px",
          color: "var(--muted-foreground)",
          maxWidth: "400px"
        }}>
          The series "{params.id}" could not be found in our library.
        </div>
        <Link 
          href="/library"
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            background: "#8ab4ff",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
        >
          ← Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Back Button */}
      <div style={{ marginBottom: "24px" }}>
        <Link 
          href="/library" 
          style={{ 
            color: "var(--accent)", 
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ← Back to Library
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px" }}>
        {/* Main Content */}
        <div>
          {/* Series Header */}
          <div style={{ 
            display: "flex", 
            gap: "24px", 
            marginBottom: "32px",
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            {/* Cover */}
            <div style={{ 
              flex: "0 0 200px",
              aspectRatio: "3/4",
              borderRadius: "12px",
              overflow: "hidden",
              background: "var(--border)"
            }}>
              <img 
                src={comic.cover} 
                alt={`${comic.title} cover`}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover" 
                }}
              />
            </div>

            {/* Series Info */}
            <div style={{ flex: "1" }}>
              <h1 style={{ 
                fontSize: "32px", 
                fontWeight: "700", 
                margin: "0 0 12px 0",
                color: "var(--fg)"
              }}>
                {comic.series}
              </h1>
              
              <p style={{ 
                fontSize: "18px", 
                color: "var(--muted-foreground)",
                margin: "0 0 16px 0"
              }}>
                {comic.title}
              </p>

              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 4px 0", color: "var(--muted-foreground)" }}>
                  <strong style={{ color: "var(--fg)" }}>Author:</strong> {comic.author}
                </p>
                <p style={{ margin: "0 0 4px 0", color: "var(--muted-foreground)" }}>
                  <strong style={{ color: "var(--fg)" }}>Artist:</strong> {comic.artist}
                </p>
                <p style={{ margin: "0", color: "var(--muted-foreground)" }}>
                  <strong style={{ color: "var(--fg)" }}>Year:</strong> {comic.year}
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {(comic.tags || []).map((tag, index) => (
                  <span 
                    key={index}
                    style={{ 
                      background: "var(--accent)", 
                      color: "white", 
                      fontSize: "12px", 
                      padding: "4px 8px", 
                      borderRadius: "6px",
                      fontWeight: "500"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rating and Follow Section */}
              {session?.user ? (
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  {/* Rating */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--fg)" }}>
                      Rating:
                    </span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            color: userRating && star <= userRating ? "#ffd700" : 
                                   communityRating && star <= communityRating ? "#4a9eff" : "var(--muted-foreground)",
                            transition: "color 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            if (!userRating || star > userRating) {
                              e.currentTarget.style.color = "#ffd700";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!userRating || star > userRating) {
                              e.currentTarget.style.color = communityRating && star <= communityRating ? "#4a9eff" : "var(--muted-foreground)";
                            }
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={handleFollow}
                    disabled={isLoadingFollow}
                    style={{
                      padding: "12px 24px",
                      background: isFollowing ? "var(--accent)" : "transparent",
                      color: isFollowing ? "white" : "var(--accent)",
                      border: `2px solid var(--accent)`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: isLoadingFollow ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      opacity: isLoadingFollow ? 0.6 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    {isLoadingFollow ? (
                      "Loading..."
                    ) : (
                      <>
                        {isFollowing ? "✓ Following" : "+ Follow"}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div style={{ 
                  padding: "16px", 
                  background: "var(--border)", 
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <p style={{ margin: "0 0 12px 0", color: "var(--muted-foreground)" }}>
                    Sign in to rate and follow this series
                  </p>
                  <Link 
                    href="/sign-in"
                    style={{
                      padding: "8px 16px",
                      background: "var(--accent)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>


          {/* Description */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              margin: "0 0 16px 0",
              color: "var(--fg)"
            }}>
              Description
            </h2>
            <p style={{ 
              color: "var(--muted-foreground)",
              lineHeight: "1.6",
              margin: "0"
            }}>
              {comic.description}
            </p>
          </div>

          {/* Chapters */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(138, 180, 255, 0.1)"
          }}>
            {/* Tab Navigation */}
            <div style={{ 
              display: "flex", 
              gap: "8px", 
              marginBottom: "24px",
              borderBottom: "1px solid var(--border)",
              alignItems: "center"
            }}>
              <button
                onClick={() => setActiveTab('chapters')}
                style={{
                  padding: "12px 20px",
                  background: activeTab === 'chapters' ? "var(--accent)" : "transparent",
                  color: activeTab === 'chapters' ? "white" : "var(--fg)",
                  border: "none",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                Chapters ({(() => {
                  if (selectedSeason && comic.seasons) {
                    const selectedSeasonData = comic.seasons.find(s => s.seasonNumber === selectedSeason);
                    return selectedSeasonData ? selectedSeasonData.chapters.length : 0;
                  }
                  return comic.chapters.length;
                })()})
              </button>
              
              {/* Season Dropdown for Chapters Tab */}
              {activeTab === 'chapters' && comic.seasons && comic.seasons.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px" }}>
                  <label style={{ 
                    fontSize: "14px", 
                    color: "var(--fg)", 
                    fontWeight: "500" 
                  }}>
                    Season:
                  </label>
                  <select
                    value={selectedSeason || ''}
                    onChange={(e) => setSelectedSeason(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: "14px",
                      minWidth: "150px"
                    }}
                  >
                    <option value="">All Seasons</option>
                    {comic.seasons.map((season) => (
                      <option key={season.id} value={season.seasonNumber}>
                        Season {season.seasonNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {comic.seasons && comic.seasons.length > 0 && (
                <button
                  onClick={() => setActiveTab('seasons')}
                  style={{
                    padding: "12px 20px",
                    background: activeTab === 'seasons' ? "var(--accent)" : "transparent",
                    color: activeTab === 'seasons' ? "white" : "var(--fg)",
                    border: "none",
                    borderRadius: "8px 8px 0 0",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                >
                  Seasons ({comic.seasons.length})
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'chapters' && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(() => {
                  // Get chapters to display based on selected season
                  let chaptersToShow = [];
                  
                  if (selectedSeason && comic.seasons) {
                    // Show chapters from selected season
                    const selectedSeasonData = comic.seasons.find(s => s.seasonNumber === selectedSeason);
                    if (selectedSeasonData) {
                      chaptersToShow = selectedSeasonData.chapters || [];
                    }
                  } else {
                    // Show all chapters from main series
                    chaptersToShow = comic.chapters || [];
                  }
                  
                  if (chaptersToShow.length === 0) {
                    return (
                      <div style={{ 
                        textAlign: "center", 
                        padding: "40px", 
                        color: "var(--muted-foreground)" 
                      }}>
                        {selectedSeason ? `No chapters found for Season ${selectedSeason}` : "No chapters available"}
                      </div>
                    );
                  }
                  
                  return chaptersToShow.map((chapter, index) => (
                    <Link 
                      key={chapter.id}
                      href={`/chapter/${selectedSeason && comic.seasons ? 
                        comic.seasons.find(s => s.seasonNumber === selectedSeason)?.id : 
                        comic.id}/${chapter.id}`}
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
                          Chapter {chapter.chapterNumber} • {chapter.pages ? chapter.pages.length : 0} pages
                          {selectedSeason && (
                            <span style={{ marginLeft: "8px", color: "var(--accent)" }}>
                              • Season {selectedSeason}
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ color: "var(--accent)" }}>→</span>
                    </Link>
                  ));
                })()}
              </div>
            )}

            {activeTab === 'seasons' && comic.seasons && comic.seasons.length > 0 && (
              <div>
                {/* Season Selector */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500",
                    color: "var(--fg)"
                  }}>
                    Select Season:
                  </label>
                  <select
                    value={selectedSeason || ''}
                    onChange={(e) => setSelectedSeason(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: "14px",
                      minWidth: "200px"
                    }}
                  >
                    <option value="">All Seasons</option>
                    {comic.seasons.map((season) => (
                      <option key={season.id} value={season.seasonNumber}>
                        Season {season.seasonNumber} - {season.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Season Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {comic.seasons
                    .filter(season => !selectedSeason || season.seasonNumber === selectedSeason)
                    .map((season) => (
                    <div key={season.id} style={{
                      background: "var(--border)",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px solid rgba(138, 180, 255, 0.1)"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px", 
                        marginBottom: "12px" 
                      }}>
                        <img 
                          src={season.coverImage} 
                          alt={season.title}
                          style={{
                            width: "60px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "6px"
                          }}
                        />
                        <div>
                          <h3 style={{ 
                            margin: "0 0 4px 0", 
                            fontSize: "16px", 
                            fontWeight: "600",
                            color: "var(--fg)"
                          }}>
                            Season {season.seasonNumber}
                          </h3>
                          <p style={{ 
                            margin: "0", 
                            fontSize: "14px", 
                            color: "var(--muted-foreground)" 
                          }}>
                            {season.totalChapters} chapters
                          </p>
                        </div>
                      </div>
                      
                      {season.chapters.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {season.chapters.map((chapter) => (
                            <Link 
                              key={chapter.id}
                              href={`/chapter/${season.id}/${chapter.id}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px",
                                background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
                                borderRadius: "6px",
                                textDecoration: "none",
                                color: "var(--fg)",
                                transition: "background 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(138, 180, 255, 0.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(var(--bg-rgb, 18, 18, 18), 0.6)";
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: "500", fontSize: "14px" }}>
                                  {chapter.title}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                                  Chapter {chapter.chapterNumber}
                                </div>
                              </div>
                              <span style={{ color: "var(--accent)" }}>→</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Where to Read Section */}
          {(
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
                Where to Read
              </h2>

              {/* Where to Read Buttons */}
              <div style={{ marginBottom: "16px" }}>
                {/* Default Reading Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a
                    href={`https://mangadex.org/title/${comic?.id || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "12px 16px",
                      background: "var(--accent)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "center",
                      transition: "opacity 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    📖 Read on MangaDex
                  </a>
                  
                  <a
                    href={`https://mangakakalot.com/search/story/${encodeURIComponent(comic?.title || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "12px 16px",
                      background: "var(--accent)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "center",
                      transition: "opacity 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    📚 Search on MangaKakalot
                  </a>
                  
                  <a
                    href={`https://mangasee123.com/search/?name=${encodeURIComponent(comic?.title || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "12px 16px",
                      background: "var(--accent)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "center",
                      transition: "opacity 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    🔍 Search on MangaSee
                  </a>
                </div>

                {/* User Custom URLs (if any) */}
                {userUrls.length > 0 && (
                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0", color: "var(--fg)" }}>
                      Your Reading Options
                    </h3>
                    {userUrls.map((userUrl) => (
                      <div key={userUrl.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <a
                          href={userUrl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            background: "var(--border)",
                            color: "var(--fg)",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            textAlign: "center",
                            transition: "opacity 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.9";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                        >
                          {userUrl.label}
                        </a>
                        <button
                          onClick={() => handleDeleteUrl(userUrl.id)}
                          style={{
                            padding: "8px",
                            background: "var(--border)",
                            color: "var(--fg)",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                          title="Delete this reading option"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Site Button - Temporarily allow for all users */}
              {(
                <button
                  onClick={() => setShowUrlForm(true)}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    background: "var(--border)",
                    color: "var(--fg)",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Reading Option
                </button>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div style={{ 
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(138, 180, 255, 0.1)",
            height: "fit-content"
          }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              margin: "0 0 20px 0",
              color: "var(--fg)"
            }}>
              Discussion ({comments.length})
            </h2>

          {/* Add Comment */}
          {session?.user ? (
            <div style={{ marginBottom: "24px" }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this series..."
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
                  marginBottom: "12px"
                }}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                style={{
                  padding: "8px 16px",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: newComment.trim() ? "pointer" : "not-allowed",
                  opacity: newComment.trim() ? 1 : 0.5
                }}
              >
                Post Comment
              </button>
            </div>
          ) : (
            <div style={{ 
              marginBottom: "24px",
              padding: "16px",
              background: "var(--border)",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <p style={{ margin: "0 0 12px 0", color: "var(--muted-foreground)" }}>
                Sign in to join the discussion
              </p>
              <Link 
                href="/sign-in"
                style={{
                  padding: "8px 16px",
                  background: "var(--accent)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {comments.length === 0 ? (
              <p style={{ 
                color: "var(--muted-foreground)", 
                textAlign: "center",
                margin: "20px 0"
              }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={{
                  padding: "16px",
                  background: "var(--border)",
                  borderRadius: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "14px", color: "var(--fg)" }}>
                        {comment.userName}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p style={{ 
                    margin: "0", 
                    color: "var(--muted-foreground)",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}>
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Add Reading Site Popup */}
      {showUrlForm && (
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
            maxWidth: "400px",
            width: "100%",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
          }}>
            <h3 style={{ 
              margin: "0 0 24px 0", 
              fontSize: "20px", 
              fontWeight: "600",
              color: "var(--fg)"
            }}>
              Add Reading Option
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "var(--fg)" 
                }}>
                  Site Name
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Official, Fan Translation, My Site"
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

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "var(--fg)" 
                }}>
                  URL
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/read"
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
            </div>

            <div style={{ 
              display: "flex", 
              gap: "12px", 
              justifyContent: "flex-end", 
              marginTop: "24px" 
            }}>
              <button
                onClick={() => {
                  setShowUrlForm(false);
                  setNewUrl("");
                  setNewLabel("");
                }}
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
                onClick={handleSaveUrl}
                disabled={!newUrl.trim() || !newLabel.trim()}
                style={{
                  padding: "12px 24px",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: newUrl.trim() && newLabel.trim() ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: newUrl.trim() && newLabel.trim() ? 1 : 0.5
                }}
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
