"use client";

import { useState, useEffect } from "react";

interface UploadedSeries {
  seriesTitle: string;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
  readingLinks: Array<{ label: string; url: string }>;
  chaptersCount: number;
  reviewedAt?: string;
  reviewedBy?: string;
}

export default function AdminUploadQueuePage() {
  const [uploads, setUploads] = useState<UploadedSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchUploads = async () => {
    try {
      const response = await fetch('/api/admin/upload-queue');
      if (response.ok) {
        const data = await response.json();
        setUploads(data.uploads || []);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (seriesTitle: string, action: 'approve' | 'reject') => {
    setProcessing(seriesTitle);
    
    try {
      const response = await fetch('/api/admin/upload-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seriesTitle,
          action
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Series ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        // Refresh the list
        fetchUploads();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error processing review:', error);
      alert('Error processing review. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

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
        Loading upload queue...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "32px 16px",
      minHeight: "calc(100vh - 160px)"
    }}>
      <div style={{ 
        background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid rgba(138, 180, 255, 0.1)"
      }}>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "700", 
          margin: "0 0 8px 0",
          color: "var(--fg)",
          textAlign: "center"
        }}>
          Upload Queue Review
        </h1>
        <p style={{ 
          color: "var(--muted-foreground)",
          textAlign: "center",
          margin: "0 0 32px 0",
          lineHeight: "1.5"
        }}>
          Review and approve or reject uploaded series
        </p>

        {uploads.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "64px 32px",
            color: "var(--muted-foreground)",
            fontSize: "18px"
          }}>
            No series pending review
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {uploads.map((upload, index) => (
              <div
                key={index}
                style={{
                  background: "var(--border)",
                  borderRadius: "12px",
                  padding: "24px",
                  border: "1px solid rgba(138, 180, 255, 0.1)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "600", 
                      margin: "0 0 8px 0",
                      color: "var(--fg)"
                    }}>
                      {upload.seriesTitle}
                    </h3>
                    <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "var(--muted-foreground)" }}>
                      <span>📚 {upload.chaptersCount} chapters</span>
                      <span>👤 Uploaded by: {upload.uploadedBy}</span>
                      <span>📅 {new Date(upload.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleReview(upload.seriesTitle, 'approve')}
                      disabled={processing === upload.seriesTitle}
                      style={{
                        padding: "8px 16px",
                        background: processing === upload.seriesTitle ? "var(--muted)" : "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: processing === upload.seriesTitle ? "not-allowed" : "pointer",
                        opacity: processing === upload.seriesTitle ? 0.6 : 1
                      }}
                    >
                      {processing === upload.seriesTitle ? "Processing..." : "✅ Approve"}
                    </button>
                    
                    <button
                      onClick={() => handleReview(upload.seriesTitle, 'reject')}
                      disabled={processing === upload.seriesTitle}
                      style={{
                        padding: "8px 16px",
                        background: processing === upload.seriesTitle ? "var(--muted)" : "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: processing === upload.seriesTitle ? "not-allowed" : "pointer",
                        opacity: processing === upload.seriesTitle ? 0.6 : 1
                      }}
                    >
                      {processing === upload.seriesTitle ? "Processing..." : "❌ Reject"}
                    </button>
                  </div>
                </div>

                {/* Reading Links */}
                {upload.readingLinks && upload.readingLinks.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: "600", 
                      margin: "0 0 8px 0",
                      color: "var(--fg)"
                    }}>
                      Reading Links:
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {upload.readingLinks.map((link, linkIndex) => (
                        <div key={linkIndex} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "var(--fg)",
                            minWidth: "120px"
                          }}>
                            {link.label}:
                          </span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "14px",
                              color: "var(--accent)",
                              textDecoration: "none",
                              wordBreak: "break-all"
                            }}
                          >
                            {link.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Series Info */}
                <div style={{ marginTop: "16px", fontSize: "14px", color: "var(--muted-foreground)" }}>
                  <p><strong>Series Path:</strong> series/{upload.seriesTitle}/</p>
                  <p><strong>Cover:</strong> series/{upload.seriesTitle}/cover.jpg</p>
                  <p><strong>Metadata:</strong> series/{upload.seriesTitle}/metadata.json</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

