"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Season {
  id: string;
  title: string;
  seasonNumber: number;
  description?: string;
  coverImage?: string;
  isPublished: boolean;
  createdAt: string;
  series: {
    id: string;
    title: string;
    coverImage?: string;
  };
  chapters: Array<{
    id: string;
    title: string;
    chapterNumber: number;
  }>;
  creator: {
    id: string;
    name?: string;
    username?: string;
  };
}

interface Series {
  id: string;
  title: string;
  coverImage?: string;
}

export default function SeasonsAdminPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSeason, setNewSeason] = useState({
    title: "",
    seasonNumber: 1,
    description: "",
    coverImage: "",
    seriesId: "",
    creatorId: "system" // Default creator for now
  });

  useEffect(() => {
    fetchSeasons();
    fetchSeries();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await fetch('/api/seasons');
      const data = await response.json();
      if (data.success) {
        setSeasons(data.data);
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch('/api/series');
      const data = await response.json();
      if (data.success) {
        setSeries(data.data);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/seasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSeason),
      });

      const data = await response.json();
      if (data.success) {
        setSeasons([...seasons, data.data]);
        setNewSeason({
          title: "",
          seasonNumber: 1,
          description: "",
          coverImage: "",
          seriesId: "",
          creatorId: "system"
        });
        setShowCreateForm(false);
      } else {
        alert('Error creating season: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating season:', error);
      alert('Error creating season');
    }
  };

  const handleDeleteSeason = async (seasonId: string) => {
    if (!confirm('Are you sure you want to delete this season?')) return;

    try {
      const response = await fetch(`/api/seasons/${seasonId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setSeasons(seasons.filter(season => season.id !== seasonId));
      } else {
        alert('Error deleting season: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting season:', error);
      alert('Error deleting season');
    }
  };

  const handleTogglePublish = async (seasonId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/seasons/${seasonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setSeasons(seasons.map(season => 
          season.id === seasonId 
            ? { ...season, isPublished: !currentStatus }
            : season
        ));
      } else {
        alert('Error updating season: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating season:', error);
      alert('Error updating season');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading seasons...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Seasons Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: "10px 20px",
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {showCreateForm ? "Cancel" : "Create New Season"}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ 
          background: "var(--border)", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px" 
        }}>
          <h2>Create New Season</h2>
          <form onSubmit={handleCreateSeason}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Title:</label>
              <input
                type="text"
                value={newSeason.title}
                onChange={(e) => setNewSeason({...newSeason, title: e.target.value})}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)" }}
              />
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Season Number:</label>
              <input
                type="number"
                value={newSeason.seasonNumber}
                onChange={(e) => setNewSeason({...newSeason, seasonNumber: parseInt(e.target.value)})}
                required
                min="1"
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Series:</label>
              <select
                value={newSeason.seriesId}
                onChange={(e) => setNewSeason({...newSeason, seriesId: e.target.value})}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)" }}
              >
                <option value="">Select a series</option>
                {series.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
              <textarea
                value={newSeason.description}
                onChange={(e) => setNewSeason({...newSeason, description: e.target.value})}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)", minHeight: "80px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Cover Image URL:</label>
              <input
                type="url"
                value={newSeason.coverImage}
                onChange={(e) => setNewSeason({...newSeason, coverImage: e.target.value})}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Create Season
            </button>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: "20px" }}>
        {seasons.map((season) => (
          <div
            key={season.id}
            style={{
              background: "var(--border)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid rgba(138, 180, 255, 0.1)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0" }}>
                  {season.title} - Season {season.seasonNumber}
                </h3>
                <p style={{ margin: "0 0 10px 0", color: "var(--muted-foreground)" }}>
                  Series: <Link href={`/series/${season.series.id}`} style={{ color: "var(--accent)" }}>
                    {season.series.title}
                  </Link>
                </p>
                {season.description && (
                  <p style={{ margin: "0 0 10px 0", color: "var(--muted-foreground)" }}>
                    {season.description}
                  </p>
                )}
                <p style={{ margin: "0 0 10px 0", color: "var(--muted-foreground)" }}>
                  Chapters: {season.chapters.length} | 
                  Created: {new Date(season.createdAt).toLocaleDateString()} |
                  Status: {season.isPublished ? "Published" : "Draft"}
                </p>
              </div>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={() => handleTogglePublish(season.id, season.isPublished)}
                  style={{
                    padding: "6px 12px",
                    background: season.isPublished ? "#dc3545" : "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  {season.isPublished ? "Unpublish" : "Publish"}
                </button>
                
                <Link
                  href={`/seasons/${season.id}`}
                  style={{
                    padding: "6px 12px",
                    background: "var(--accent)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                >
                  View
                </Link>
                
                <button
                  onClick={() => handleDeleteSeason(season.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seasons.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted-foreground)" }}>
          <p>No seasons found. Create your first season above.</p>
        </div>
      )}
    </div>
  );
}
