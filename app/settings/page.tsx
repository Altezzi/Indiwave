"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const [layoutWidth, setLayoutWidth] = useState("full");
  const [theme, setTheme] = useState("default");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session, status } = useSession();

  const applyTheme = (themeToApply: string) => {
    // Apply theme changes
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    root.classList.remove('dark', 'light');
    
    if (themeToApply === 'dark') {
      root.classList.add('dark');
      // Apply dark background for full viewport coverage
      root.style.setProperty('--bg', '#121212');
      body.style.background = '#121212';
      body.style.backgroundColor = '#121212';
      body.style.backgroundImage = 'none';
      
      // Override any custom backgrounds on ALL elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el: any) => {
        if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
          el.style.background = '#121212';
          el.style.backgroundColor = '#121212';
          el.style.backgroundImage = 'none';
        }
      });
    } else if (themeToApply === 'light') {
      root.classList.add('light');
      // Apply light background for full viewport coverage
      root.style.setProperty('--bg', '#ffffff');
      body.style.background = '#ffffff';
      body.style.backgroundColor = '#ffffff';
      body.style.backgroundImage = 'none';
      
      // Override any custom backgrounds on ALL elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el: any) => {
        if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
          el.style.background = '#ffffff';
          el.style.backgroundColor = '#ffffff';
          el.style.backgroundImage = 'none';
        }
      });
    } else {
      // Default theme - use your existing backgrounds
      root.style.removeProperty('--bg');
      body.style.background = '';
      body.style.backgroundColor = '';
      body.style.backgroundImage = '';
      
      // Remove overrides from ALL elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el: any) => {
        if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
          el.style.background = '';
          el.style.backgroundColor = '';
          el.style.backgroundImage = '';
        }
      });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    // For signed-in users, mark as unsaved changes
    if (session?.user) {
      setHasUnsavedChanges(true);
    } else {
      // For non-signed-in users, apply immediately but don't save
      localStorage.setItem('theme', newTheme);
    }
    
    // Apply the theme immediately for preview
    applyTheme(newTheme);
    
    console.log('Theme changed to:', newTheme);
  };

  const saveThemePreference = async () => {
    if (!session?.user) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });
      
      if (response.ok) {
        setHasUnsavedChanges(false);
        localStorage.setItem('theme', theme);
        console.log('Theme preference saved to account');
      } else {
        console.error('Failed to save theme preference');
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Load saved layout width setting
    const savedWidth = localStorage.getItem('layoutWidth') || 'full';
    setLayoutWidth(savedWidth);
    
    // Load theme setting based on user status
    if (session?.user) {
      // For signed-in users, load from account
      loadUserThemePreference();
    } else {
      // For non-signed-in users, always use default (cherry blossom)
      setTheme('default');
      applyTheme('default');
    }
  }, [session]);

  const loadUserThemePreference = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/user/theme');
      if (response.ok) {
        const data = await response.json();
        const userTheme = data.theme || 'default';
        setTheme(userTheme);
        applyTheme(userTheme);
        localStorage.setItem('theme', userTheme);
      } else {
        // Fallback to localStorage if API fails
        const savedTheme = localStorage.getItem('theme') || 'default';
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading user theme preference:', error);
      // Fallback to localStorage if API fails
      const savedTheme = localStorage.getItem('theme') || 'default';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Library
        </Link>
      </div>
      
      <h1 style={{ margin: "0 0 24px", fontSize: "28px", fontWeight: "600" }}>Settings</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Theme Settings */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Appearance</h2>
          <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
            {session?.user 
              ? "Customize the look and feel of Indiwave. Changes are saved to your account."
              : "Customize the look and feel of Indiwave. Sign in to save your preferences."
            }
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <label style={{ fontWeight: "500", minWidth: "80px" }}>Theme:</label>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  minWidth: "150px"
                }}
              >
                <option value="default">Default (Your Backgrounds)</option>
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
              {session?.user && hasUnsavedChanges && (
                <button
                  onClick={saveThemePreference}
                  disabled={isSaving}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--accent)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                    transition: "opacity 0.2s ease"
                  }}
                >
                  {isSaving ? "Saving..." : "Save Theme"}
                </button>
              )}
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted)", maxWidth: "500px" }}>
              {theme === "default" && "Uses your custom page backgrounds (cherry blossom, etc.)"}
              {theme === "dark" && "Solid dark background with full viewport coverage"}
              {theme === "light" && "Solid light background with full viewport coverage"}
              {!session?.user && " • Sign in to save your theme preference to your account"}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Account</h2>
          <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
            Manage your account preferences and information
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Profile Information</span>
              <button style={{ 
                padding: "8px 16px", 
                border: "1px solid var(--border)", 
                borderRadius: "8px", 
                background: "var(--bg)", 
                color: "var(--fg)", 
                cursor: "pointer" 
              }}>
                Edit Profile
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Privacy Settings</span>
              <button style={{ 
                padding: "8px 16px", 
                border: "1px solid var(--border)", 
                borderRadius: "8px", 
                background: "var(--bg)", 
                color: "var(--fg)", 
                cursor: "pointer" 
              }}>
                Manage Privacy
              </button>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Layout</h2>
          <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
            Customize the content width for desktop and large screens. Mobile and tablet layouts automatically optimize for screen size.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ minWidth: "140px" }}>Content Width</span>
              <select 
                id="layout-width"
                value={layoutWidth}
                style={{ 
                  padding: "8px 12px", 
                  border: "1px solid var(--border)", 
                  borderRadius: "8px", 
                  background: "var(--bg)", 
                  color: "var(--fg)",
                  minWidth: "200px"
                }}
                onChange={(e) => {
                  const newWidth = e.target.value;
                  setLayoutWidth(newWidth);
                  localStorage.setItem('layoutWidth', newWidth);
                  // Show a message that the setting will apply immediately
                  alert('Layout setting saved! The change will apply immediately across all pages.');
                }}
              >
                <option value="full">Full Width - Max 1200px (1400px on large screens)</option>
                <option value="contained">Contained - Max 1200px width</option>
                <option value="narrow">Narrow - Max 800px width</option>
              </select>
            </div>
                      <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", padding: "8px", background: "rgba(var(--bg-rgb), 0.3)", borderRadius: "6px" }}>
                        <strong>📱 Mobile (0-768px):</strong> Full width, no margins (MangaDex-style)<br/>
                        <strong>📱 Tablet (768-1024px):</strong> Slightly contained with 16px margins<br/>
                        <strong>🖥️ Desktop (1024px+):</strong> Your selected width option applies<br/>
                        <strong>🔄 Responsive:</strong> MangaDex-style adaptive layout!
                      </div>
          </div>
        </div>

        {/* Reading Settings */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Reading</h2>
          <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
            Customize your reading experience
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Reading Direction</span>
              <select style={{ 
                padding: "8px 12px", 
                border: "1px solid var(--border)", 
                borderRadius: "8px", 
                background: "var(--bg)", 
                color: "var(--fg)" 
              }}>
                <option>Left to Right</option>
                <option>Right to Left</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Auto-scroll Speed</span>
              <input 
                type="range" 
                min="1" 
                max="10" 
                defaultValue="5"
                style={{ width: "120px" }}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Notifications</h2>
          <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
            Control how you receive updates
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>New Chapter Notifications</span>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Weekly Digest</span>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>About</h2>
          <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
            Indiwave - Your comics hub
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "var(--muted)" }}>
            <div>Version: 1.0.0</div>
            <div>© 2024 Indiwave</div>
            <div>
              <Link href="https://digitalcomicmuseum.com/" target="_blank" style={{ color: "var(--accent)", textDecoration: "none" }}>
                Public Domain Comics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
