"use client";

import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import SearchDropdown from "./SearchDropdown";

interface HeaderProps {
  comics: any[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
}

export default function Header({ 
  comics, 
  isSearchOpen, 
  setIsSearchOpen, 
  isAdvancedSearchOpen, 
  setIsAdvancedSearchOpen,
  isSidebarOpen
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner container" style={{ overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!isSidebarOpen && (
            <>
              <Link href="/welcome" style={{ display: "flex", alignItems: "center", gap: "0px", height: "80px" }}>
                <img 
                  src="/logo.png"
                  alt="Indiwave Logo" 
                  className="logo-image"
                  style={{ 
                    width: "75px", 
                    height: "75px", 
                    objectFit: "contain"
                  }} 
                />
                <img 
                  src="/text.png" 
                  alt="Indiwave" 
                  className="logo-text"
                  style={{ 
                    height: "36px", 
                    objectFit: "contain",
                    marginLeft: "-8px",
                    marginTop: "4px"
                  }} 
                />
              </Link>
              <span className="badge">Beta</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, justifyContent: "center", overflow: "visible" }}>
          <div 
            style={{ 
              position: "relative", 
              display: "flex", 
              alignItems: "center",
              maxWidth: "500px", 
              width: "100%",
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(16px) saturate(1.2)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              padding: "4px",
              transition: "all 0.3s ease",
              overflow: "visible",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.4)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)";
            }}
          >
            <input 
              type="search" 
              placeholder="Search" 
              onClick={() => setIsSearchOpen(true)}
              style={{ 
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "12px 16px",
                color: "var(--fg)",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            />
            
            {/* Keyboard shortcut hint */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginRight: "8px",
            }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 0.7)",
                letterSpacing: "0.5px",
              }}>
                Ctrl
              </div>
              <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 0.7)",
                letterSpacing: "0.5px",
              }}>
                K
              </div>
            </div>

            {/* Search icon */}
            <Link 
              href="/library"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.8)",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                fontSize: "18px",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "rgba(255, 255, 255, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </Link>
            
            <SearchDropdown 
              comics={comics}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}