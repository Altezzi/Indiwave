"use client";

import { useEffect, useState } from "react";

interface LibraryLayoutProps {
  children: React.ReactNode;
}

export default function LibraryLayout({ children }: LibraryLayoutProps) {
  const [layoutWidth, setLayoutWidth] = useState("full");
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    // Load saved layout width setting
    const savedWidth = localStorage.getItem('layoutWidth') || 'full';
    setLayoutWidth(savedWidth);

    // Check screen size with MangaDex-style breakpoints
    const checkScreenSize = () => {
      const width = window.innerWidth;
      let newScreenSize;
      if (width < 768) {
        newScreenSize = "mobile";
      } else if (width < 1024) {
        newScreenSize = "tablet";
      } else if (width < 1440) {
        newScreenSize = "desktop";
      } else {
        newScreenSize = "large";
      }
      setScreenSize(newScreenSize);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getContainerStyle = () => {
    
    const baseStyle = {
      position: "relative" as const,
      zIndex: 1,
      background: "rgba(var(--bg-rgb, 18, 18, 18), 0.4)",
      backdropFilter: "blur(8px) saturate(1.2)",
      border: "1px solid rgba(138, 180, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      overflow: "hidden" as const,
    };

    // Mobile (0-768px) - Full width like MangaDex mobile
    if (screenSize === "mobile") {
      return {
        ...baseStyle,
        margin: "0",
        padding: "16px",
        borderRadius: "0",
        maxWidth: "100vw",
        width: "100%",
        minHeight: "calc(100vh - 80px)",
      };
    }

    // Tablet (768px-1024px) - Slightly contained
    if (screenSize === "tablet") {
      return {
        ...baseStyle,
        margin: "16px auto",
        padding: "24px",
        borderRadius: "16px",
        maxWidth: "calc(100vw - 32px)",
        width: "100%",
      };
    }

    // Desktop and Large screens - MangaDex-style contained layout
    const isDesktop = screenSize === "desktop" || screenSize === "large";
    
    if (isDesktop) {
      switch (layoutWidth) {
        case "contained":
          return {
            ...baseStyle,
            margin: "20px auto",
            padding: "32px",
            borderRadius: "20px",
            maxWidth: "1200px",
            width: "100%",
          };
        case "narrow":
          return {
            ...baseStyle,
            margin: "20px auto",
            padding: "32px",
            borderRadius: "20px",
            maxWidth: "800px",
            width: "100%",
          };
        case "full":
        default:
          // MangaDex-style: reasonable max-width to prevent massive gaps
          const maxWidth = screenSize === "large" ? "1400px" : "1200px";
          return {
            ...baseStyle,
            margin: "20px auto",
            padding: "32px",
            borderRadius: "20px",
            maxWidth: maxWidth,
            width: "100%",
          };
      }
    }

    // Fallback
    return {
      ...baseStyle,
      margin: "20px auto",
      padding: "32px",
      borderRadius: "20px",
      maxWidth: "1200px",
      width: "100%",
    };
  };

  return (
    <div style={getContainerStyle()}>
      {children}
    </div>
  );
}
