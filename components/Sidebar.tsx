"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpen }: SidebarProps) {
  const [screenSize, setScreenSize] = useState("desktop");
  const sidebarTabRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Only close sidebar on mobile when clicking navigation items
  const handleNavClick = () => {
    if (screenSize === "mobile") {
      onClose();
    }
  };

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Overlay for mobile only */}
      {isOpen && screenSize === "mobile" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
            display: "block",
          }}
          onClick={onClose}
        />
      )}

      {/* File Tab Handle - Always Visible */}
      <div
        ref={sidebarTabRef}
        className="sidebar-tab"
        style={{
          position: "fixed",
          left: isOpen ? "280px" : "0px",
          top: "12%",
          transform: "translateY(-50%)",
          width: "20px",
          height: "120px",
          background: "rgba(var(--bg-rgb, 18, 18, 18), 0.95)",
          backdropFilter: "blur(16px) saturate(1.1)",
          border: "1px solid rgba(138, 180, 255, 0.2)",
          borderLeft: isOpen ? "none" : "1px solid rgba(138, 180, 255, 0.2)",
          borderRadius: isOpen ? "0 12px 12px 0" : "0 12px 12px 0", // Right-rounded when open (right side), right-rounded when closed (left side)
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOpen ? "4px 0 16px rgba(0, 0, 0, 0.3)" : "4px 0 16px rgba(0, 0, 0, 0.3)", // Right shadow when open, right shadow when closed
          zIndex: 1002, // Higher than header (1000)
          transition: "all 0.3s ease",
        }}
        onClick={isOpen ? onClose : onOpen}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--fg)",
            letterSpacing: "1px",
          }}
        >
          {isOpen ? "CLOSE" : "MENU"}
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isOpen ? "280px" : "0",
          background: "rgba(var(--bg-rgb, 18, 18, 18), 0.95)",
          backdropFilter: "blur(16px) saturate(1.1)",
          borderRight: isOpen ? "none" : "1px solid rgba(138, 180, 255, 0.2)",
          zIndex: 1001, // Higher than header (1000)
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          overflow: "hidden",
          boxShadow: "4px 0 16px rgba(0, 0, 0, 0.3)",
          borderRadius: "0 20px 20px 0",
        }}
      >
        <div
          style={{
            padding: "20px",
            height: "100%",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <img
                src="/indiwave-logo.png"
                alt="Indiwave Logo"
                style={{
                  width: "72px",
                  height: "72px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "white",
                  letterSpacing: "-0.5px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Indiwave
              </span>
            </div>
          </div>

          {/* Main Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "24px" }}>
            <Link
              href="/home"
              onClick={handleNavClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "8px",
                color: "var(--fg)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive("/home") ? "rgba(138, 180, 255, 0.15)" : "none",
                border: isActive("/home") ? "1px solid rgba(138, 180, 255, 0.3)" : "1px solid transparent",
                fontWeight: isActive("/home") ? "600" : "500",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚡</span>
              <span style={{ fontSize: "15px" }}>Home</span>
            </Link>

            <Link
              href="/library"
              onClick={handleNavClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "8px",
                color: "var(--fg)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive("/library") ? "rgba(138, 180, 255, 0.15)" : "none",
                border: isActive("/library") ? "1px solid rgba(138, 180, 255, 0.3)" : "1px solid transparent",
                fontWeight: isActive("/library") ? "600" : "500",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/library")) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/library")) {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.border = "1px solid transparent";
                }
              }}
            >
              <span style={{ fontSize: "18px" }}>📖</span>
              <span style={{ fontSize: "15px" }}>Library</span>
            </Link>

            <Link
              href="/my-list"
              onClick={handleNavClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "8px",
                color: "var(--fg)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive("/my-list") ? "rgba(138, 180, 255, 0.15)" : "none",
                border: isActive("/my-list") ? "1px solid rgba(138, 180, 255, 0.3)" : "1px solid transparent",
                fontWeight: isActive("/my-list") ? "600" : "500",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/my-list")) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/my-list")) {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.border = "1px solid transparent";
                }
              }}
            >
              <span style={{ fontSize: "18px" }}>⭐</span>
              <span style={{ fontSize: "15px" }}>My List</span>
            </Link>

          </nav>

          {/* Secondary Navigation */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Browse
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Link
                href="/library?sort=recent"
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <span style={{ fontSize: "14px" }}>🆕</span>
                <span>Recently Added</span>
              </Link>

              <Link
                href="/library?sort=popular"
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <span style={{ fontSize: "14px" }}>🔥</span>
                <span>Popular</span>
              </Link>

              <Link
                href="/library?sort=trending"
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <span style={{ fontSize: "14px" }}>📈</span>
                <span>Trending</span>
              </Link>

              <Link
                href="/welcome"
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  background: isActive("/welcome") ? "rgba(138, 180, 255, 0.1)" : "none",
                  border: isActive("/welcome") ? "1px solid rgba(138, 180, 255, 0.2)" : "1px solid transparent",
                  fontWeight: isActive("/welcome") ? "600" : "500",
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/welcome")) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/welcome")) {
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                <span style={{ fontSize: "14px" }}>🏠</span>
                <span>Welcome</span>
              </Link>
            </nav>
          </div>

          {/* Settings */}
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Account
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Link
                href="/settings"
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  background: isActive("/settings") ? "rgba(138, 180, 255, 0.1)" : "none",
                  border: isActive("/settings") ? "1px solid rgba(138, 180, 255, 0.2)" : "1px solid transparent",
                  fontWeight: isActive("/settings") ? "600" : "500",
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/settings")) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/settings")) {
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                <span style={{ fontSize: "14px" }}>⚙️</span>
                <span>Settings</span>
              </Link>

              <Link
                href="/upload-series"
                onClick={handleNavClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  background: isActive("/upload-series") ? "rgba(138, 180, 255, 0.1)" : "none",
                  border: isActive("/upload-series") ? "1px solid rgba(138, 180, 255, 0.2)" : "1px solid transparent",
                  fontWeight: isActive("/upload-series") ? "600" : "500",
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/upload-series")) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/upload-series")) {
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                <span style={{ fontSize: "14px" }}>📤</span>
                <span>Upload a Series</span>
              </Link>
            </nav>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(138, 180, 255, 0.2)",
              margin: "24px 0",
            }}
          />

          {/* Quick Stats */}
          <div
            style={{
              padding: "16px",
              background: "rgba(138, 180, 255, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(138, 180, 255, 0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--fg)",
              }}
            >
              Quick Stats
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Total Manga</span>
                <span style={{ fontSize: "12px", color: "var(--fg)", fontWeight: "500" }}>558</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>In Library</span>
                <span style={{ fontSize: "12px", color: "var(--fg)", fontWeight: "500" }}>558</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              © 2025 indiwave
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
