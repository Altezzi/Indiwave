"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsLightMode(!shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (darkMode: boolean) => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const handleToggle = () => {
    const newLightMode = !isLightMode;
    setIsLightMode(newLightMode);
    const newTheme = newLightMode ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(!newLightMode);
  };

  return (
    <div className="dropdown-item toggle-item">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <span>Theme</span>
      </div>
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          checked={isLightMode}
          onChange={handleToggle}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
}
