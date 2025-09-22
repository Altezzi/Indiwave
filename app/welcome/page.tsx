import Link from "next/link";

export default function WelcomePage() {
  return (
    <div>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/background-4.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: -3,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(var(--bg-rgb, 18, 18, 18), 0.4)",
          backdropFilter: "blur(8px) saturate(1.2)",
          borderRadius: "20px",
          padding: "32px",
          margin: "20px",
          border: "1px solid rgba(138, 180, 255, 0.2)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Welcome Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            padding: "40px 20px",
          }}
        >
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "36px",
              fontWeight: "700",
              color: "var(--fg)",
            }}
          >
            Welcome to Indiwave
          </h1>
          <p
            style={{
              margin: "0 auto 24px",
              fontSize: "18px",
              color: "var(--fg)",
              maxWidth: "600px",
            }}
          >
            Discover amazing comics from independent creators and public domain
            classics. Your gateway to unique stories and artistic adventures.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/home"
              style={{
                padding: "12px 24px",
                background: "var(--accent)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "opacity 0.2s ease",
              }}
            >
              Browse Library
            </Link>
            <Link
              href="/create-account"
              style={{
                padding: "12px 24px",
                background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
                color: "var(--fg)",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "opacity 0.2s ease",
                border: "1px solid rgba(138, 180, 255, 0.1)",
              }}
            >
              Join Indiwave
            </Link>
            <Link
              href="/creator-menu"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #ff6b6b, #ffa500)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "opacity 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Become a Creator
            </Link>
          </div>
        </div>

        {/* Bookmark/Home Screen Instructions */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            padding: "32px 20px",
            background: "rgba(var(--bg-rgb, 18, 18, 18), 0.6)",
            borderRadius: "16px",
            border: "1px solid rgba(138, 180, 255, 0.1)",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: "var(--accent)", margin: "0 auto 16px" }}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "24px",
                fontWeight: "600",
                color: "var(--fg)",
              }}
            >
              Add indiwave to Your Device
            </h2>
            <p
              style={{
                margin: "0 auto 24px",
                fontSize: "16px",
                color: "var(--muted)",
                maxWidth: "500px",
              }}
            >
              Get quick access to indiwave by adding it to your home screen or
              bookmarks
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {/* Mobile Instructions */}
            <div
              style={{
                padding: "20px",
                background: "var(--border)",
                borderRadius: "12px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: "var(--accent)" }}
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--fg)",
                  }}
                >
                  Mobile Devices
                </h3>
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
                <p style={{ margin: "0 0 8px", fontWeight: "500", color: "var(--fg)" }}>
                  iOS (Safari):
                </p>
                <p style={{ margin: "0 0 12px" }}>Tap Share → Add to Home Screen</p>

                <p style={{ margin: "0 0 8px", fontWeight: "500", color: "var(--fg)" }}>
                  Android (Chrome):
                </p>
                <p style={{ margin: "0" }}>Tap Menu → Add to Home Screen</p>
              </div>
            </div>

            {/* Desktop Instructions */}
            <div
              style={{
                padding: "20px",
                background: "var(--border)",
                borderRadius: "12px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: "var(--accent)" }}
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--fg)",
                  }}
                >
                  Desktop
                </h3>
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
                <p style={{ margin: "0 0 8px", fontWeight: "500", color: "var(--fg)" }}>
                  Desktop Shortcut:
                </p>
                <p style={{ margin: "0 0 12px" }}>
                  Right-click desktop → Create Shortcut → Enter URL
                </p>

                <p style={{ margin: "0 0 8px", fontWeight: "500", color: "var(--fg)" }}>
                  Browser Bookmark:
                </p>
                <p style={{ margin: "0" }}>Click Star icon in address bar</p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(138, 180, 255, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(138, 180, 255, 0.2)",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: "var(--accent)",
                fontWeight: "500",
              }}
            >
              💡 Pro Tip: Adding to home screen gives you an app-like experience with
              faster loading!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
