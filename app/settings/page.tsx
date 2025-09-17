import Link from "next/link";

export default function SettingsPage() {
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
            Customize the look and feel of Indiwave
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>Theme:</span>
            <Link 
              href="/profile" 
              style={{ 
                padding: "8px 16px", 
                background: "var(--accent)", 
                borderRadius: "8px", 
                color: "white",
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Go to Profile Menu →
            </Link>
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
