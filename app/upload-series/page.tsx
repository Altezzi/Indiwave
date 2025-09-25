"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SeriesUploadData {
  title: string;
  description: string;
  chaptersCount: number;
  tags: string[];
  readingLinks: Array<{
    label: string;
    url: string;
  }>;
  coverFile?: File;
}

const TAG_CATEGORIES = {
  "Format": [
    "4-Koma", "Adaptation", "Anthology", "Award Winning", "Doujinshi", "Fan Colored", 
    "Full Color", "Long Strip", "Official Colored", "Oneshot", "Self-Published", "Web Comic",
    "Manhwa", "Manhua", "Webtoon", "Manga", "Light Novel"
  ],
  "Genre": [
    "Action", "Adventure", "Boys' Love", "Comedy", "Crime", "Drama", "Fantasy", 
    "Girls' Love", "Historical", "Horror", "Isekai", "Magical Girls", "Mecha", 
    "Medical", "Mystery", "Philosophical", "Psychological", "Romance", "Sci-Fi", 
    "Slice of Life", "Sports", "Superhero", "Thriller", "Tragedy", "Wuxia"
  ],
  "Theme": [
    "Aliens", "Animals", "Cooking", "Crossdressing", "Delinquents", "Demons", 
    "Genderswap", "Ghosts", "Gyaru", "Harem", "Incest", "Loli", "Mafia", "Magic", 
    "Martial Arts", "Military", "Monster Girls", "Monsters", "Music", "Ninja", 
    "Office Workers", "Police", "Post-Apocalyptic", "Reincarnation", "Reverse Harem", 
    "Samurai", "School Life", "Shota", "Supernatural", "Survival", "Time Travel", 
    "Traditional Games", "Vampires", "Video Games", "Villainess", "Virtual Reality", "Zombies"
  ],
  "Content": [
    "Gore", "Sexual Violence", "Violence", "Nudity", "Sexual Content", "Drug Use", 
    "Strong Language", "Disturbing Themes", "Mature Themes"
  ]
};

export default function UploadSeriesPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState<SeriesUploadData>({
    title: "",
    description: "",
    chaptersCount: 1,
    tags: [],
    readingLinks: []
  });
  const [newReadingLink, setNewReadingLink] = useState({ label: "", url: "" });
  const [selectedTag, setSelectedTag] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadData(prev => ({ ...prev, coverFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addReadingLink = () => {
    if (newReadingLink.label.trim() && newReadingLink.url.trim()) {
      setUploadData(prev => ({
        ...prev,
        readingLinks: [...prev.readingLinks, newReadingLink]
      }));
      setNewReadingLink({ label: "", url: "" });
    }
  };

  const removeReadingLink = (index: number) => {
    setUploadData(prev => ({
      ...prev,
      readingLinks: prev.readingLinks.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (selectedTag && !uploadData.tags.includes(selectedTag)) {
      setUploadData(prev => ({
        ...prev,
        tags: [...prev.tags, selectedTag]
      }));
      setSelectedTag("");
    }
  };

  const removeTag = (index: number) => {
    setUploadData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!uploadData.title.trim()) {
      alert("Please enter a series title");
      return;
    }

    if (!uploadData.description.trim()) {
      alert("Please enter a series description");
      return;
    }

    if (uploadData.chaptersCount < 1) {
      alert("Please enter a valid chapter count");
      return;
    }

    if (!uploadData.coverFile) {
      alert("Please upload a cover image");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", uploadData.title);
      formData.append("description", uploadData.description);
      formData.append("chaptersCount", uploadData.chaptersCount.toString());
      formData.append("tags", JSON.stringify(uploadData.tags));
      formData.append("readingLinks", JSON.stringify(uploadData.readingLinks));
      
      if (uploadData.coverFile) {
        formData.append("cover", uploadData.coverFile);
      }

      const response = await fetch("/api/upload-series", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Series uploaded successfully! It will be reviewed before being added to the library.");
        router.push("/library");
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "800px", 
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
          Upload New Series
        </h1>
        <p style={{ 
          color: "var(--muted-foreground)",
          textAlign: "center",
          margin: "0 0 32px 0",
          lineHeight: "1.5"
        }}>
          Add a series that isn't currently in our library. Make sure you have permission to share this content.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Series Title */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "var(--fg)" 
            }}>
              Series Title *
            </label>
            <input
              type="text"
              value={uploadData.title}
              onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter the series title"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "var(--fg)" 
            }}>
              Description *
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter a detailed description of the series"
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                fontSize: "16px",
                boxSizing: "border-box",
                resize: "vertical"
              }}
              required
            />
          </div>

          {/* Chapter Count */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "var(--fg)" 
            }}>
              Number of Chapters *
            </label>
            <input
              type="number"
              min="1"
              value={uploadData.chaptersCount}
              onChange={(e) => setUploadData(prev => ({ ...prev, chaptersCount: parseInt(e.target.value) || 1 }))}
              placeholder="Enter total chapter count"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "var(--fg)" 
            }}>
              Tags (Optional)
            </label>
            <p style={{ 
              fontSize: "14px", 
              color: "var(--muted-foreground)", 
              margin: "0 0 16px 0" 
            }}>
              Select tags from the list below to help categorize this series
            </p>

            {/* Add new tag */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px"
                }}
              >
                <option value="">Select a tag to add...</option>
                {PREDEFINED_TAGS
                  .filter(tag => !uploadData.tags.includes(tag))
                  .sort()
                  .map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addTag}
                disabled={!selectedTag || uploadData.tags.includes(selectedTag)}
                style={{
                  padding: "12px 16px",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  opacity: (!selectedTag || uploadData.tags.includes(selectedTag)) ? 0.5 : 1
                }}
              >
                Add Tag
              </button>
            </div>

            {/* Display added tags */}
            {uploadData.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {uploadData.tags.map((tag, index) => (
                  <div key={index} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    padding: "6px 12px",
                    background: "rgba(138, 180, 255, 0.1)",
                    border: "1px solid rgba(138, 180, 255, 0.3)",
                    borderRadius: "16px",
                    fontSize: "14px"
                  }}>
                    <span style={{ color: "var(--fg)" }}>
                      {tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      style={{
                        background: "transparent",
                        color: "var(--muted-foreground)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "0",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cover Upload */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "var(--fg)" 
            }}>
              Cover Image *
            </label>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                  required
                />
                <p style={{ 
                  fontSize: "14px", 
                  color: "var(--muted-foreground)", 
                  margin: "8px 0 0 0" 
                }}>
                  Upload a high-quality cover image (JPG, PNG, or WebP)
                </p>
              </div>
              {coverPreview && (
                <div style={{ 
                  width: "120px", 
                  height: "160px", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Reading Links */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "var(--fg)" 
            }}>
              Legal Reading Options (Optional)
            </label>
            <p style={{ 
              fontSize: "14px", 
              color: "var(--muted-foreground)", 
              margin: "0 0 16px 0" 
            }}>
              Add links to official publishers or legal reading platforms
            </p>

            {/* Add new reading link */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Site name (e.g., Official Publisher)"
                value={newReadingLink.label}
                onChange={(e) => setNewReadingLink(prev => ({ ...prev, label: e.target.value }))}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px"
                }}
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={newReadingLink.url}
                onChange={(e) => setNewReadingLink(prev => ({ ...prev, url: e.target.value }))}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px"
                }}
              />
              <button
                type="button"
                onClick={addReadingLink}
                disabled={!newReadingLink.label.trim() || !newReadingLink.url.trim()}
                style={{
                  padding: "12px 16px",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  opacity: (!newReadingLink.label.trim() || !newReadingLink.url.trim()) ? 0.5 : 1
                }}
              >
                Add
              </button>
            </div>

            {/* Display added reading links */}
            {uploadData.readingLinks.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {uploadData.readingLinks.map((link, index) => (
                  <div key={index} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    padding: "12px 16px",
                    background: "var(--border)",
                    borderRadius: "8px"
                  }}>
                    <span style={{ flex: 1, color: "var(--fg)", fontWeight: "500" }}>
                      {link.label}
                    </span>
                    <span style={{ 
                      flex: 2, 
                      color: "var(--muted-foreground)", 
                      fontSize: "14px",
                      wordBreak: "break-all"
                    }}>
                      {link.url}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeReadingLink(index)}
                      style={{
                        padding: "6px 12px",
                        background: "transparent",
                        color: "var(--muted-foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div style={{ 
            marginTop: "20px", 
            padding: "12px 16px", 
            background: "rgba(239, 68, 68, 0.1)", 
            border: "1px solid rgba(239, 68, 68, 0.3)", 
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            ⚠️ <strong>Important:</strong> Only submit legal, official reading links (publisher sites, licensed platforms). 
            Do not add illegal or unauthorized sites as this may result in account suspension or ban. 
            All uploaded series are reviewed by admins before going live.
          </div>

          {/* Submit Button */}
          <div style={{ 
            display: "flex", 
            gap: "16px", 
            justifyContent: "flex-end",
            marginTop: "15px"
          }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: "16px 32px",
                background: "transparent",
                color: "var(--muted-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              style={{
                padding: "16px 32px",
                background: isUploading ? "var(--muted)" : "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isUploading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                opacity: isUploading ? 0.6 : 1
              }}
            >
              {isUploading ? "Uploading..." : "Upload Series"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
