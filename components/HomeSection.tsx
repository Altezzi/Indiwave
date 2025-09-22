"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ComicCard from "./ComicCard";

interface Comic {
  id: string;
  title: string;
  cover?: string;
  coverImage?: string;
  author?: string;
  artist?: string;
  year?: string | number;
  tags?: string[];
  chapters?: Array<{ id: string; title: string; pages?: string[] }>;
  [key: string]: any;
}

interface HomeSectionProps {
  title: string;
  comics: Comic[];
  viewAllLink: string;
}

export default function HomeSection({ title, comics, viewAllLink }: HomeSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const itemsPerView = 5; // Show 5 items at a time
  const maxIndex = Math.max(0, comics.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    
    if (scrollContainerRef.current) {
      const itemWidth = 280; // Approximate width of each comic card
      const scrollPosition = clampedIndex * itemWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    scrollToIndex(currentIndex - 1);
  };

  const scrollRight = () => {
    scrollToIndex(currentIndex + 1);
  };

  if (comics.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Section Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px" 
      }}>
        <h2
          style={{
            margin: "0",
            fontSize: "24px",
            fontWeight: "600",
            color: "var(--fg)",
          }}
        >
          {title}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href={viewAllLink}
            style={{
              fontSize: "14px",
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View All →
          </Link>
          
          {/* Navigation Arrows */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: currentIndex === 0 ? "var(--muted)" : "var(--bg)",
                color: currentIndex === 0 ? "var(--muted)" : "var(--fg)",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                transition: "all 0.2s ease",
                opacity: currentIndex === 0 ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentIndex > 0) {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex > 0) {
                  e.currentTarget.style.background = "var(--bg)";
                  e.currentTarget.style.color = "var(--fg)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }
              }}
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              disabled={currentIndex >= maxIndex}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: currentIndex >= maxIndex ? "var(--muted)" : "var(--bg)",
                color: currentIndex >= maxIndex ? "var(--muted)" : "var(--fg)",
                cursor: currentIndex >= maxIndex ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                transition: "all 0.2s ease",
                opacity: currentIndex >= maxIndex ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentIndex < maxIndex) {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex < maxIndex) {
                  e.currentTarget.style.background = "var(--bg)";
                  e.currentTarget.style.color = "var(--fg)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Comics Carousel */}
      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          paddingBottom: "8px",
        }}
      >
        {comics.map((comic) => (
          <div
            key={comic.id}
            style={{
              flex: "0 0 260px", // Fixed width for each item
              minWidth: "260px",
            }}
          >
            <ComicCard comic={comic} />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {comics.length > itemsPerView && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "8px", 
          marginTop: "16px" 
        }}>
          {Array.from({ length: Math.ceil(comics.length / itemsPerView) }, (_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index * itemsPerView)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "none",
                background: index === Math.floor(currentIndex / itemsPerView) ? "var(--accent)" : "var(--muted)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
