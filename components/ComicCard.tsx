export default function ComicCard({ comic }: { comic: any }) {
  return (
    <div className="card">
      <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: 8, marginBottom: 8, background: "#0f0f11", display: "grid", placeItems: "center", border: "1px solid #2a2a2e" }}>
        {/* cover */}
        {/* @ts-ignore */}
        {comic.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={comic.cover} alt={`${comic.title} cover`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span className="mono">no cover</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <strong>{comic.title}</strong>
        <span style={{ color: "#a9a9b2", fontSize: 13 }}>{comic.series} · {comic.year}</span>
        <span style={{ color: "#8ab4ff", fontSize: 12 }}>Read →</span>
      </div>
    </div>
  );
}
