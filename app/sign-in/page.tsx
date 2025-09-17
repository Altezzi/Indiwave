"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (email && password) {
        // Store user session (in a real app, you'd use proper auth)
        localStorage.setItem("user", JSON.stringify({ 
          email, 
          name: email.split("@")[0],
          profilePicture: "/default-profile-picture.svg",
          cropSettings: {
            scale: 1.3,
            position: { x: 0, y: 0 }
          },
          isCreator: email === "test@example.com" // Demo: make test user a creator
        }));
        
        // Redirect to home page
        window.location.href = "/";
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(var(--bg-rgb, 18, 18, 18), 0.8)",
        backdropFilter: "blur(8px)",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        border: "1px solid rgba(138, 180, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ 
            margin: "0 0 8px", 
            fontSize: "28px", 
            fontWeight: "700",
            color: "var(--fg)"
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            margin: "0", 
            color: "var(--muted)", 
            fontSize: "14px" 
          }}>
            Sign in to your Indiwave account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "var(--fg)"
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "var(--fg)"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
              color: "#ef4444",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.2s ease",
              marginBottom: "20px"
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Link 
              href="/forgot-password" 
              style={{ 
                color: "var(--accent)", 
                textDecoration: "none", 
                fontSize: "14px" 
              }}
            >
              Forgot your password?
            </Link>
          </div>

          <div style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "20px",
            textAlign: "center"
          }}>
            <p style={{ 
              margin: "0 0 16px", 
              color: "var(--muted)", 
              fontSize: "14px" 
            }}>
              Don't have an account?
            </p>
            <Link 
              href="/create-account" 
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "transparent",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
