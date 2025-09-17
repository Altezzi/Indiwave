import Link from "next/link";
import ComicCard from "../../components/ComicCard";

async function getComics() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/comics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load comics");
  return res.json();
}

export default async function LibraryPage() {
  const data = await getComics();
  const comics = data.comics as any[];
  
  return (
    <div style={{
      position: "relative",
      minHeight: "300vh"
    }}>
      {/* Background Image with Artistic Effects */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/background-4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        filter: "none",
        zIndex: -3
      }} />
      
      
      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        background: "rgba(var(--bg-rgb, 18, 18, 18), 0.4)",
        backdropFilter: "blur(8px) saturate(1.2)",
        borderRadius: "20px",
        padding: "32px",
        margin: "20px",
        border: "1px solid rgba(138, 180, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle inner glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 20%, rgba(138, 180, 255, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: -1
        }} />
        <h1 style={{ margin: "14px 0 18px" }}>New Chapters You Follow</h1>
      
      <div className="grid" style={{ marginBottom: "32px" }}>
        {comics.slice(0, 4).map((c) => (
          <Link key={c.id} href={`/comic/${c.id}`}>
            <ComicCard comic={c} />
          </Link>
        ))}
      </div>

      {/* More Stories from Indie Creators */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>More stories from indie creators</h2>
          <Link href="/library" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>View all →</Link>
        </div>
        <div className="grid">
          {comics.slice(0, 6).map((c) => (
            <Link key={`indie-${c.id}`} href={`/comic/${c.id}`}>
              <ComicCard comic={c} />
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Series by Category */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>Popular Series by Category</h2>
          <Link href="/library" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>View all →</Link>
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {["Drama", "Fantasy", "Comedy", "Action", "Romance", "Sci-fi"].map((category) => (
            <button 
              key={category}
              style={{
                padding: "8px 16px",
                background: category === "Drama" ? "var(--fg)" : "transparent",
                color: category === "Drama" ? "var(--bg)" : "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid">
          {comics.slice(0, 6).map((c) => (
            <Link key={`popular-${c.id}`} href={`/comic/${c.id}`}>
              <ComicCard comic={c} />
            </Link>
          ))}
        </div>
      </div>


      {/* Most Popular Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Most Popular</h2>
        <div className="grid">
          {comics.slice(0, 4).map((c) => (
            <Link key={`popular-${c.id}`} href={`/comic/${c.id}`}>
              <ComicCard comic={c} />
            </Link>
          ))}
        </div>
      </div>

      {/* Most Followed Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>Most Followed</h2>
        <div className="grid">
          {comics.slice(0, 4).map((c) => (
            <Link key={`followed-${c.id}`} href={`/comic/${c.id}`}>
              <ComicCard comic={c} />
            </Link>
          ))}
        </div>
      </div>

      {/* New Added Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>New Added</h2>
        <div className="grid">
          {comics.slice(0, 4).map((c) => (
            <Link key={`new-${c.id}`} href={`/comic/${c.id}`}>
              <ComicCard comic={c} />
            </Link>
          ))}
        </div>
      </div>

      {/* All Comics Section */}
      <div>
        <h2 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "600" }}>All Comics</h2>
        <div className="grid">
          {comics.map((c) => (
            <Link key={`all-${c.id}`} href={`/comic/${c.id}`}>
              <ComicCard comic={c} />
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
