"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  isCreator: boolean;
  isSilenced: boolean;
  createdAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  target: string;
  details: string;
  createdAt: string;
  actor: {
    name: string;
    email: string;
  };
}

interface CreatorClaim {
  id: string;
  status: string;
  evidence: string;
  notes: string | null;
  createdAt: string;
  claimant: {
    id: string;
    name: string;
    email: string;
    username: string;
  };
  series: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
  };
}

interface ImportedManga {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  mangaMDId: string;
  mangaMDStatus: string;
  contentRating: string;
  tags: string;
  authors: string;
  artists: string;
  isPublished: boolean;
  createdAt: string;
  _count: {
    chapters: number;
  };
}


export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [importedManga, setImportedManga] = useState<ImportedManga[]>([]);
  const [loadingImports, setLoadingImports] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [creatorClaims, setCreatorClaims] = useState<CreatorClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalSeries: 0,
    totalComments: 0,
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user || !["ADMIN", "SENIOR_MOD"].includes(session.user.role)) {
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch("/api/admin/users");
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch audit logs
      const logsResponse = await fetch("/api/admin/audit-logs");
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setAuditLogs(logsData.logs || []);
      }

      // Fetch creator claims
      const claimsResponse = await fetch("/api/admin/creator-claims");
      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json();
        setCreatorClaims(claimsData.claims || []);
      }

      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImportedManga = async () => {
    try {
      setLoadingImports(true);
      const response = await fetch("/api/admin/manga-curation");
      if (response.ok) {
        const data = await response.json();
        setImportedManga(data.manga || []);
      }
    } catch (error) {
      console.error("Error fetching imported manga:", error);
    } finally {
      setLoadingImports(false);
    }
  };

  const updateMangaStatus = async (mangaId: string, isPublished: boolean) => {
    try {
      const response = await fetch("/api/admin/update-manga-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mangaId,
          isPublished,
        }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchImportedManga();
      } else {
        console.error("Failed to update manga status");
      }
    } catch (error) {
      console.error("Error updating manga status:", error);
    }
  };

  const bulkUpdateMangaStatus = async (isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/update-manga-status?action=${isPublished ? 'publish-all' : 'unpublish-all'}`, {
        method: "GET",
      });

      if (response.ok) {
        // Refresh the list
        await fetchImportedManga();
      } else {
        console.error("Failed to bulk update manga status");
      }
    } catch (error) {
      console.error("Error bulk updating manga status:", error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Refresh users list
        fetchDashboardData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Failed to change role");
    }
  };

  const handleClaimAction = async (claimId: string, action: string, notes?: string) => {
    try {
      const response = await fetch("/api/admin/creator-claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claimId, action, notes }),
      });

      if (response.ok) {
        // Refresh claims list
        fetchDashboardData();
        alert(`Claim ${action} successfully`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error processing claim:", error);
      alert("Failed to process claim");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--fg)"
      }}>
        <div>Loading admin dashboard...</div>
      </div>
    );
  }

  if (!session?.user || !["ADMIN", "SENIOR_MOD"].includes(session.user.role)) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--fg)"
      }}>
        <div>Access denied. Admin privileges required.</div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "curation", label: "Manga Curation", icon: "🎨" },
    { id: "imports", label: "Import Review", icon: "📚" },
    { id: "audit", label: "Audit Logs", icon: "📋" },
    { id: "claims", label: "Review Queue", icon: "🔍" },
    { id: "moderation", label: "Content Moderation", icon: "🛡️" },
    { id: "settings", label: "Site Settings", icon: "⚙️" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--fg)"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "1px solid var(--border)"
        }}>
          <div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 8px 0",
              color: "var(--fg)"
            }}>
              Admin Dashboard
            </h1>
            <p style={{
              margin: "0",
              color: "var(--muted-foreground)",
              fontSize: "16px"
            }}>
              Welcome back, {session.user.name}
            </p>
          </div>
          <Link 
            href="/"
            style={{
              padding: "8px 16px",
              background: "var(--accent)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            ← Back to Site
          </Link>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "4px",
          marginBottom: "30px",
          background: "var(--muted)",
          padding: "4px",
          borderRadius: "12px",
          overflowX: "auto"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                background: activeTab === tab.id ? "var(--bg)" : "transparent",
                border: "none",
                borderRadius: "8px",
                color: activeTab === tab.id ? "var(--fg)" : "var(--muted-foreground)",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Platform Overview
              </h2>
              
              {/* Stats Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
              }}>
                <div style={{
                  background: "var(--muted)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
                    {stats.totalUsers}
                  </div>
                  <div style={{ color: "var(--muted-foreground)" }}>Total Users</div>
                </div>
                
                <div style={{
                  background: "var(--muted)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
                    {stats.totalCreators}
                  </div>
                  <div style={{ color: "var(--muted-foreground)" }}>Creators</div>
                </div>
                
                <div style={{
                  background: "var(--muted)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
                    {stats.totalSeries}
                  </div>
                  <div style={{ color: "var(--muted-foreground)" }}>Series</div>
                </div>
                
                <div style={{
                  background: "var(--muted)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
                    {stats.totalComments}
                  </div>
                  <div style={{ color: "var(--muted-foreground)" }}>Comments</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{
                background: "var(--muted)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                  Recent Activity
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      background: "var(--bg)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)"
                    }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {log.actor.name} performed {log.action}
                        </div>
                        <div style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                User Management
              </h2>
              
              <div style={{
                background: "var(--muted)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                overflow: "hidden"
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
                  gap: "16px",
                  padding: "16px",
                  background: "var(--border)",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Joined</div>
                  <div>Actions</div>
                </div>
                
                {users.map((user) => (
                  <div key={user.id} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
                    gap: "16px",
                    padding: "16px",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontWeight: "500" }}>{user.name}</div>
                      <div style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                        @{user.username}
                      </div>
                    </div>
                    <div style={{ fontSize: "14px" }}>{user.email}</div>
                    <div>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: user.role === "ADMIN" ? "#dc2626" : 
                                   user.role === "SENIOR_MOD" ? "#ea580c" :
                                   user.role === "MODERATOR" ? "#d97706" :
                                   user.role === "CREATOR" ? "#059669" : "#6b7280",
                        color: "white"
                      }}>
                        {user.role}
                      </span>
                    </div>
                    <div>
                      {user.isSilenced ? (
                        <span style={{ color: "#dc2626", fontSize: "14px" }}>Silenced</span>
                      ) : (
                        <span style={{ color: "#059669", fontSize: "14px" }}>Active</span>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      {session.user.role === "ADMIN" || 
                       (session.user.role === "SENIOR_MOD" && !["ADMIN", "SENIOR_MOD"].includes(user.role)) ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{
                            padding: "6px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                            color: "var(--fg)",
                            fontSize: "12px"
                          }}
                        >
                          <option value="USER">User</option>
                          <option value="CREATOR">Creator</option>
                          <option value="REVIEWER">Reviewer</option>
                          <option value="UPLOAD_TEAM">Upload Team</option>
                          <option value="MODERATOR">Moderator</option>
                          {session.user.role === "ADMIN" && (
                            <>
                              <option value="SENIOR_MOD">Senior Mod</option>
                              <option value="ADMIN">Admin</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                          No permission
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {activeTab === "curation" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Manga Curation
              </h2>
              
              <div style={{
                background: "var(--muted)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                marginBottom: "20px"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                  Review and Manage Imported Manga
                </h3>
                <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
                  Review imported manga from MangaDex, publish or unpublish manga, and manage your library.
                </p>
                <Link
                  href="/admin/manga-curation"
                  style={{
                    display: "inline-block",
                    background: "var(--accent)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    textDecoration: "none"
                  }}
                >
                  Open Manga Curation Tool →
                </Link>
              </div>
            </div>
          )}

          {activeTab === "imports" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Import Review Panel
              </h2>
              
              <div style={{
                background: "var(--muted)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                marginBottom: "20px"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                  Review Imported Manga
                </h3>
                <p style={{ color: "var(--muted-foreground)", marginBottom: "20px" }}>
                  Review and approve imported manga to make them live on the website.
                </p>
                
                {/* Bulk Actions */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                  <button
                    onClick={() => fetchImportedManga()}
                    disabled={loadingImports}
                    style={{
                      background: "var(--accent)",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none",
                      cursor: loadingImports ? "not-allowed" : "pointer",
                      opacity: loadingImports ? 0.6 : 1
                    }}
                  >
                    {loadingImports ? "Loading..." : "Load Imported Manga"}
                  </button>
                  
                  <button
                    onClick={() => bulkUpdateMangaStatus(true)}
                    disabled={loadingImports}
                    style={{
                      background: "rgb(34, 197, 94)",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none",
                      cursor: loadingImports ? "not-allowed" : "pointer",
                      opacity: loadingImports ? 0.6 : 1
                    }}
                  >
                    Accept All
                  </button>
                  
                  <button
                    onClick={() => bulkUpdateMangaStatus(false)}
                    disabled={loadingImports}
                    style={{
                      background: "rgb(239, 68, 68)",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none",
                      cursor: loadingImports ? "not-allowed" : "pointer",
                      opacity: loadingImports ? 0.6 : 1
                    }}
                  >
                    Decline All
                  </button>
                </div>

                {/* Imported Manga List */}
                {importedManga.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                      Imported Manga ({importedManga.length})
                    </h4>
                    <div style={{
                      maxHeight: "600px",
                      overflowY: "auto",
                      border: "1px solid var(--border)",
                      borderRadius: "8px"
                    }}>
                      {importedManga.map((manga, index) => {
                        const authors = manga.authors ? JSON.parse(manga.authors) : [];
                        const tags = manga.tags ? JSON.parse(manga.tags) : [];
                        
                        return (
                          <div
                            key={manga.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "16px",
                              borderBottom: index < importedManga.length - 1 ? "1px solid var(--border)" : "none",
                              background: manga.isPublished ? "rgba(34, 197, 94, 0.05)" : "rgba(239, 68, 68, 0.05)"
                            }}
                          >
                            <div style={{ flex: 1, display: "flex", gap: "16px" }}>
                              {/* Cover Image */}
                              <div style={{
                                width: "60px",
                                height: "80px",
                                borderRadius: "6px",
                                background: "#0f0f11",
                                border: "1px solid #2a2a2e",
                                overflow: "hidden",
                                flexShrink: 0
                              }}>
                                {manga.coverImage ? (
                                  <img 
                                    src={manga.coverImage} 
                                    alt={`${manga.title} cover`}
                                    style={{ 
                                      width: "100%", 
                                      height: "100%", 
                                      objectFit: "cover" 
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: "100%", 
                                    height: "100%", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    color: "#a9a9b2",
                                    fontSize: "10px"
                                  }}>
                                    no cover
                                  </div>
                                )}
                              </div>
                              
                              {/* Manga Info */}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", marginBottom: "4px", fontSize: "16px" }}>
                                  {manga.title}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                                  Authors: {authors.join(", ") || "Unknown"}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--muted-foreground", marginBottom: "4px" }}>
                                  Chapters: {manga._count.chapters} | Status: {manga.mangaMDStatus} | Rating: {manga.contentRating}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                                  Tags: {tags.slice(0, 3).join(", ")}{tags.length > 3 ? "..." : ""}
                                </div>
                                <div style={{ 
                                  fontSize: "12px", 
                                  color: manga.isPublished ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
                                  fontWeight: "500",
                                  marginTop: "4px"
                                }}>
                                  Status: {manga.isPublished ? "✅ Published" : "⏳ Pending Review"}
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => updateMangaStatus(manga.id, true)}
                                disabled={loadingImports || manga.isPublished}
                                style={{
                                  background: manga.isPublished ? "var(--muted)" : "rgb(34, 197, 94)",
                                  color: "white",
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  border: "none",
                                  cursor: manga.isPublished || loadingImports ? "not-allowed" : "pointer",
                                  opacity: manga.isPublished || loadingImports ? 0.6 : 1
                                }}
                              >
                                {manga.isPublished ? "Published" : "Accept"}
                              </button>
                              
                              <button
                                onClick={() => updateMangaStatus(manga.id, false)}
                                disabled={loadingImports || !manga.isPublished}
                                style={{
                                  background: !manga.isPublished ? "var(--muted)" : "rgb(239, 68, 68)",
                                  color: "white",
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  border: "none",
                                  cursor: !manga.isPublished || loadingImports ? "not-allowed" : "pointer",
                                  opacity: !manga.isPublished || loadingImports ? 0.6 : 1
                                }}
                              >
                                {!manga.isPublished ? "Declined" : "Decline"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {importedManga.length === 0 && !loadingImports && (
                  <div style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--muted-foreground)"
                  }}>
                    No imported manga found. Click "Load Imported Manga" to fetch the latest imports.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Audit Logs
              </h2>
              
              <div style={{
                background: "var(--muted)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                overflow: "hidden"
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "16px",
                  padding: "16px",
                  background: "var(--border)",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  <div>Actor</div>
                  <div>Action</div>
                  <div>Target</div>
                  <div>Date</div>
                </div>
                
                {auditLogs.map((log) => (
                  <div key={log.id} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "16px",
                    padding: "16px",
                    borderBottom: "1px solid var(--border)"
                  }}>
                    <div>
                      <div style={{ fontWeight: "500" }}>{log.actor.name}</div>
                      <div style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                        {log.actor.email}
                      </div>
                    </div>
                    <div style={{ fontWeight: "500" }}>{log.action}</div>
                    <div style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                      {log.target || "N/A"}
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "claims" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Creator Claim Review Queue
              </h2>
              
              {creatorClaims.length === 0 ? (
                <div style={{
                  background: "var(--muted)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  textAlign: "center"
                }}>
                  <p style={{ color: "var(--muted-foreground)" }}>
                    No creator claims to review
                  </p>
                </div>
              ) : (
                <div style={{
                  background: "var(--muted)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  overflow: "hidden"
                }}>
                  {creatorClaims.map((claim) => (
                    <div key={claim.id} style={{
                      padding: "20px",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      gap: "20px",
                      alignItems: "flex-start"
                    }}>
                      {/* Series Info */}
                      <div style={{ flex: "0 0 120px" }}>
                        {claim.series.coverImage ? (
                          <img 
                            src={claim.series.coverImage} 
                            alt={claim.series.title}
                            style={{
                              width: "100px",
                              height: "140px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid var(--border)"
                            }}
                          />
                        ) : (
                          <div style={{
                            width: "100px",
                            height: "140px",
                            background: "var(--border)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted-foreground)",
                            fontSize: "12px",
                            textAlign: "center"
                          }}>
                            No Cover
                          </div>
                        )}
                      </div>

                      {/* Claim Details */}
                      <div style={{ flex: "1" }}>
                        <div style={{ marginBottom: "12px" }}>
                          <h3 style={{ 
                            fontSize: "18px", 
                            fontWeight: "600", 
                            margin: "0 0 4px 0",
                            color: "var(--fg)"
                          }}>
                            {claim.series.title}
                          </h3>
                          <p style={{ 
                            margin: "0 0 8px 0", 
                            color: "var(--muted-foreground)",
                            fontSize: "14px"
                          }}>
                            Claimed by: {claim.claimant.name} ({claim.claimant.email})
                          </p>
                          <div style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background: claim.status === "pending" ? "#f59e0b" : 
                                       claim.status === "approved" ? "#10b981" : "#ef4444",
                            color: "white"
                          }}>
                            {claim.status.toUpperCase()}
                          </div>
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                          <h4 style={{ 
                            fontSize: "14px", 
                            fontWeight: "600", 
                            margin: "0 0 4px 0",
                            color: "var(--fg)"
                          }}>
                            Evidence:
                          </h4>
                          <p style={{ 
                            margin: "0", 
                            color: "var(--muted-foreground)",
                            fontSize: "14px",
                            lineHeight: "1.5"
                          }}>
                            {claim.evidence}
                          </p>
                        </div>

                        {claim.notes && (
                          <div style={{ marginBottom: "12px" }}>
                            <h4 style={{ 
                              fontSize: "14px", 
                              fontWeight: "600", 
                              margin: "0 0 4px 0",
                              color: "var(--fg)"
                            }}>
                              Admin Notes:
                            </h4>
                            <p style={{ 
                              margin: "0", 
                              color: "var(--muted-foreground)",
                              fontSize: "14px"
                            }}>
                              {claim.notes}
                            </p>
                          </div>
                        )}

                        <div style={{ 
                          fontSize: "12px", 
                          color: "var(--muted-foreground)",
                          marginBottom: "12px"
                        }}>
                          Submitted: {new Date(claim.createdAt).toLocaleString()}
                        </div>

                        {/* Action Buttons */}
                        {claim.status === "pending" && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => {
                                const notes = prompt("Add notes (optional):");
                                handleClaimAction(claim.id, "approved", notes || undefined);
                              }}
                              style={{
                                padding: "8px 16px",
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer"
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt("Add rejection reason:");
                                if (notes) {
                                  handleClaimAction(claim.id, "rejected", notes);
                                }
                              }}
                              style={{
                                padding: "8px 16px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer"
                              }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt("Request more information:");
                                if (notes) {
                                  handleClaimAction(claim.id, "pending", notes);
                                }
                              }}
                              style={{
                                padding: "8px 16px",
                                background: "#6b7280",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer"
                              }}
                            >
                              Request Info
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "moderation" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Content Moderation
              </h2>
              <div style={{
                background: "var(--muted)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                textAlign: "center"
              }}>
                <p style={{ color: "var(--muted-foreground)" }}>
                  Content moderation tools coming soon...
                </p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Site Settings
              </h2>
              <div style={{
                background: "var(--muted)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                textAlign: "center"
              }}>
                <p style={{ color: "var(--muted-foreground)" }}>
                  Site configuration options coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
