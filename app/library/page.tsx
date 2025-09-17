import Link from "next/link";
import ComicCard from "../../components/ComicCard";
import data from "../../data/comics.json";

export default function LibraryPage() {
  const comics = data.comics;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "300vh",
      }}
    >
      {/* Background Image with Artistic Effects */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/shika-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: -3,
        }}
      />

      {/* Overlay Effects */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(138, 180, 255, 0.1) 0%, rgba(255, 182, 193, 0.05) 50%, rgba(138, 180, 255, 0.1) 100%)",
          zIndex: -2,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(138, 180, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(138, 180, 255, 0.1) 0%, transparent 50%)",
          zIndex: -1,
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
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "40px", padding: "40px 20px" }}>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "36px",
              fontWeight: "700",
              color: "var(--fg)",
            }}
          >
            Comic Library
          </h1>
          <p
            style={{
              // keep the centered auto margins version
              margin: "0 auto 24px",
              fontSize: "18px",
              color: "var(--fg)",
              maxWidth: "600px",
            }}
          >
            Explore our collection of amazing comics from independent creators and public domain classics.
          </p>

          {/* Search and Filter Bar */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <input
              type="search"
              placeholder="Search comics..."
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                fontSize: "14px",
              }}
            />
            <select
              style={{
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--fg)",
                fontSize: "14px",
              }}
            >
              <option>All Genres</option>
              <option>Action</option>
              <option>Adventure</option>
              <option>Fantasy</option>
              <option>Sci-Fi</option>
            </select>
          </div>
        </div>

        {/* Comics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>

        {/* Load More Section */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            style={{
              padding: "12px 32px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            Load More Comics
          </button>
        </div>
      </div>
    </div>
  );
}