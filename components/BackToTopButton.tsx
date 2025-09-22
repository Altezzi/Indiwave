"use client";

import { useState, useEffect } from "react";

export default function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showButton) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: "calc(50vw - 600px + 20px)", // Position relative to content
        transform: "translateY(-50%)",
        width: "50px",
        height: "50px",
        background: "var(--accent)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        fontSize: "20px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
      }}
    >
      ↑
    </div>
  );
}
