"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update scrollToIndex when isMobile changes
  useEffect(() => {
    // Recalculate scroll position when mobile state changes
    if (scrollContainerRef.current) {
      const itemWidth = isMobile ? 280 : 260;
      const gap = isMobile ? 16 : 20;
      const scrollPosition = currentIndex * (itemWidth + gap);
      
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [isMobile, currentIndex]);
  
  const itemsPerView = isMobile ? 1.2 : 5; // Show 1.2 items on mobile (partial view), 5 on desktop
  const maxIndex = Math.max(0, comics.length - Math.floor(itemsPerView));

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    
    if (scrollContainerRef.current) {
      const itemWidth = isMobile ? 280 : 260; // Use appropriate width based on device
      const gap = isMobile ? 16 : 20; // Use appropriate gap
      const scrollPosition = clampedIndex * (itemWidth + gap);
      
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

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      scrollRight();
    }
    if (isRightSwipe && currentIndex > 0) {
      scrollLeft();
    }
  };

  // Mouse event handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return; // Only handle mouse events on desktop
    
    const startX = e.clientX;
    let isDragging = false;
    
    // Change cursor to grabbing
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
    }
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) {
        const deltaX = Math.abs(moveEvent.clientX - startX);
        if (deltaX > 10) {
          isDragging = true;
          e.preventDefault();
        }
      }
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      if (isDragging) {
        const distance = startX - upEvent.clientX;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentIndex < maxIndex) {
          scrollRight();
        }
        if (isRightSwipe && currentIndex > 0) {
          scrollLeft();
        }
      }
      
      // Reset cursor
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
          
          {/* Navigation Arrows - Hide on mobile, show on desktop */}
          {!isMobile && (
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
          )}
        </div>
      </div>

      {/* Comics Carousel */}
      <div
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          gap: isMobile ? "16px" : "20px",
          overflowX: "hidden", // Always use hidden for our custom scrolling
          scrollBehavior: "smooth",
          paddingBottom: "8px",
          paddingLeft: isMobile ? "16px" : "0", // Add padding on mobile
          paddingRight: isMobile ? "16px" : "0",
          cursor: isMobile ? "default" : "grab", // Show grab cursor on desktop
          userSelect: "none", // Prevent text selection during drag
        }}
      >
        {comics.map((comic, index) => (
          <div
            key={comic.id}
            style={{
              flex: isMobile ? "0 0 280px" : "0 0 260px", // Wider on mobile for better touch targets
              minWidth: isMobile ? "280px" : "260px",
              scrollSnapAlign: isMobile ? "start" : "none", // Snap to start on mobile
            }}
          >
            <ComicCard comic={comic} />
          </div>
        ))}
      </div>

      {/* Pagination Dots - Show on desktop only */}
      {!isMobile && comics.length > itemsPerView && (
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
