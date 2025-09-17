"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateAccountPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // Call the registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.username,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Account creation failed. Please try again.");
        return;
      }
      
      setSuccess(true);
      
      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 1500);
      
    } catch (err) {
      setError("Account creation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Library
        </Link>
      </div>
      
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "600", textAlign: "center" }}>Create Account</h1>
        <p style={{ margin: "0 0 32px", color: "var(--muted)", textAlign: "center" }}>
          Join Indiwave to save your favorite comics and get personalized recommendations
        </p>
        
        {success ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ 
              fontSize: "48px", 
              marginBottom: "16px",
              color: "var(--accent)"
            }}>
              ✓
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "600" }}>
              Account Created!
            </h2>
            <p style={{ margin: "0", color: "var(--muted)" }}>
              Redirecting you to the library...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {error && (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "12px",
                color: "#ef4444",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Username
              </label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Email
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Password
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Confirm Password
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            <input 
              type="checkbox" 
              id="terms"
              style={{ margin: 0 }}
            />
            <label htmlFor="terms" style={{ fontSize: "14px", color: "var(--muted)" }}>
              I agree to the{" "}
              <Link href="/terms" style={{ color: "var(--accent)", textDecoration: "none" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>
                Privacy Policy
              </Link>
            </label>
          </div>
          
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "none",
                borderRadius: "8px",
                background: "var(--accent)",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "16px",
                transition: "opacity 0.2s ease",
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
        
        <div style={{ margin: "24px 0", textAlign: "center", position: "relative" }}>
          <div style={{ height: "1px", background: "var(--border)", position: "absolute", top: "50%", left: "0", right: "0" }}></div>
          <span style={{ background: "var(--bg)", padding: "0 16px", color: "var(--muted)", fontSize: "14px" }}>or continue with</span>
        </div>
        
        {!success && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button 
              type="button" 
              onClick={() => {
                // Simulate Google sign up
                localStorage.setItem("user", JSON.stringify({ 
                  email: "user@gmail.com", 
                  name: "Google User",
                  profilePicture: "/default-profile-picture.svg",
                  cropSettings: {
                    scale: 1.3,
                    position: { x: 0, y: 0 }
                  },
                  isCreator: false
                }));
                window.location.href = "/";
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "12px", 
                padding: "12px 16px", 
                borderRadius: "8px", 
                border: "1px solid var(--border)", 
                background: "var(--bg)", 
                color: "var(--fg)", 
                fontSize: "16px", 
                fontWeight: "500", 
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <button 
              type="button" 
              onClick={() => {
                // Simulate Apple sign up
                localStorage.setItem("user", JSON.stringify({ 
                  email: "user@icloud.com", 
                  name: "Apple User",
                  profilePicture: "/default-profile-picture.svg",
                  cropSettings: {
                    scale: 1.3,
                    position: { x: 0, y: 0 }
                  },
                  isCreator: false
                }));
                window.location.href = "/";
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "12px", 
                padding: "12px 16px", 
                borderRadius: "8px", 
                border: "1px solid var(--border)", 
                background: "var(--bg)", 
                color: "var(--fg)", 
                fontSize: "16px", 
                fontWeight: "500", 
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>
          </div>
        )}
        
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <p style={{ margin: "0", color: "var(--muted)", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
