"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ComicCard from "./ComicCard";

interface Comic {
  id: string;
  series: string;
  title: string;
  year: number;
  cover: string;
  description: string;
  tags: string[];
  author?: string;
  artist?: string;
}

interface SearchDropdownProps {
  comics: Comic[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ comics, isOpen, onClose }: SearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredComics([]);
      return;
    }

    console.log('Searching for:', searchTerm, 'in', comics.length, 'comics');
    
    const filtered = comics.filter(comic => 
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (comic.author && comic.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (comic.artist && comic.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    console.log('Found', filtered.length, 'results');
    setFilteredComics(filtered.slice(0, 6)); // Limit to 6 results
  }, [searchTerm, comics]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "rgba(var(--bg-rgb, 18, 18, 18), 0.95)",
        backdropFilter: "blur(16px) saturate(1.2)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        zIndex: 9999,
        marginTop: "8px",
        maxHeight: "400px",
        overflowY: "auto"
      }}
    >
      <div style={{ padding: "16px" }}>
        <input
          type="text"
          placeholder="Search comics, series, authors, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--bg)",
            color: "var(--fg)",
            fontSize: "14px",
            marginBottom: "16px",
            boxSizing: "border-box"
          }}
          autoFocus
        />
        
        {searchTerm && (
          <div>
            {filteredComics.length > 0 ? (
              <div>
                <div style={{ 
                  fontSize: "12px", 
                  color: "var(--muted)", 
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {filteredComics.length} result{filteredComics.length !== 1 ? 's' : ''} found
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredComics.map((comic) => (
                    <Link 
                      key={comic.id} 
                      href={`/series/${comic.id}`}
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: "var(--fg)",
                        transition: "background 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--border)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <img 
                        src={comic.cover} 
                        alt={comic.title}
                        style={{
                          width: "40px",
                          height: "56px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          background: "var(--border)"
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: "14px", 
                          fontWeight: "600", 
                          marginBottom: "2px" 
                        }}>
                          {comic.title}
                        </div>
                        <div style={{ 
                          fontSize: "12px", 
                          color: "var(--muted)" 
                        }}>
                          {comic.series} · {comic.year}
                          {comic.author && ` · by ${comic.author}`}
                        </div>
                        {comic.tags && comic.tags.length > 0 && (
                          <div style={{ 
                            fontSize: "11px", 
                            color: "var(--accent)",
                            marginTop: "2px"
                          }}>
                            {comic.tags.slice(0, 2).join(", ")}
                            {comic.tags.length > 2 && "..."}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                color: "var(--muted)", 
                fontSize: "14px",
                padding: "20px"
              }}>
                No comics found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
        
        {!searchTerm && (
          <div style={{ 
            textAlign: "center", 
            color: "var(--muted)", 
            fontSize: "14px",
            padding: "20px"
          }}>
            Start typing to search comics...
          </div>
        )}
      </div>
    </div>
  );
}
