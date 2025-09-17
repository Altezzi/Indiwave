"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CropSettings = {
  scale: number;
  position: { x: number; y: number };
};

type User = {
  name: string;
  email: string;
  profilePicture: string;
  cropSettings?: CropSettings | null;
};

export default function ProfileMenuPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropSettings, setCropSettings] = useState<CropSettings | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        setCropImage(parsedUser.profilePicture ?? null);
        setCropSettings(parsedUser.cropSettings ?? null);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCropImage(result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = () => {
    if (cropImage && cropSettings && user) {
      const updatedUser: User = {
        ...user,
        profilePicture: cropImage,
        cropSettings,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("userDataUpdated", {
          detail: updatedUser,
        })
      );

      setShowCropModal(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1>Please sign in to access your profile menu</h1>
        <Link href="/sign-in" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Library
        </Link>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "600", textAlign: "center" }}>
          Profile Menu
        </h1>
        <p style={{ margin: "0 0 32px", color: "var(--muted)", textAlign: "center" }}>
          Manage your account information and preferences
        </p>

        {/* Account Information */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
            Account Information
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{ position: "relative" }}>
              <img
                src={user.profilePicture}
                alt="Profile"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: user.cropSettings
                    ? `${50 + user.cropSettings.position.x / 3}% ${
                        50 + user.cropSettings.position.y / 3
                      }%`
                    : "center center",
                  transform: user.cropSettings ? `scale(${user.cropSettings.scale})` : "scale(1)",
                  transformOrigin: "center center",
                  background: "var(--border)",
                }}
              />
              <button
                onClick={() => document.getElementById("profile-picture-upload")?.click()}
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                ✏️
              </button>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "600" }}>{user.name}</h3>
              <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>{user.email}</p>
              <button
                onClick={() => document.getElementById("profile-picture-upload")?.click()}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline",
                }}
              >
                Click to edit profile picture
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                textDecoration: "none",
                transition: "border-color 0.2s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              View Public Profile
            </Link>
            <Link
              href="/settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                textDecoration: "none",
                transition: "border-color 0.2s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
              </svg>
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                cursor: "pointer",
                transition: "border-color 0.2s ease",
                width: "100%",
                textAlign: "left",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && cropImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--bg)",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90%",
              overflow: "auto",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>
              Crop Profile Picture
            </h2>
            <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
              Adjust the position and zoom of your profile picture
            </p>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 16px",
                  border: "2px solid var(--border)",
                  position: "relative",
                }}
              >
                <img
                  src={cropImage}
                  alt="Crop preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: cropSettings
                      ? `${50 + cropSettings.position.x / 3}% ${
                          50 + cropSettings.position.y / 3
                        }%`
                      : "center center",
                    transform: cropSettings ? `scale(${cropSettings.scale})` : "scale(1)",
                    transformOrigin: "center center",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Zoom: {Math.round((cropSettings?.scale || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={cropSettings?.scale ?? 1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCropSettings((prev: CropSettings | null): CropSettings => {
                      const base: CropSettings = prev ?? { scale: 1, position: { x: 0, y: 0 } };
                      return {
                        ...base,
                        scale: parseFloat(e.target.value),
                      };
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCropModal(false)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  background: "var(--accent)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}