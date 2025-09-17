import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "48px", margin: "0 0 16px", color: "var(--fg)" }}>
        404
      </h1>
      <h2 style={{ fontSize: "24px", margin: "0 0 16px", color: "var(--fg)" }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: "16px", margin: "0 0 24px", color: "var(--muted)", maxWidth: "400px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        style={{ 
          padding: "12px 24px", 
          background: "var(--accent)", 
          color: "white", 
          textDecoration: "none", 
          borderRadius: "8px", 
          fontWeight: "600"
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
