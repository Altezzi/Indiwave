"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ComicReader({ comic }: { comic: any }) {
  const [page, setPage] = useState(0);
  const total = comic.pages.length;
  const listRef = useRef<HTMLDivElement>(null);

  const go = (delta: number) => setPage((p) => Math.min(total - 1, Math.max(0, p + delta)));
  const goto = (n: number) => setPage(() => Math.min(total - 1, Math.max(0, n)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") go(1);
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") go(-1);
      if (e.key === "Home") goto(0);
      if (e.key === "End") goto(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  useEffect(() => {
    const el = document.getElementById(`page-${page}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const pct = useMemo(() => Math.round(((page + 1) / total) * 100), [page, total]);

  return (
    <div>
      <h1 style={{ margin: "14px 0 10px" }}>{comic.title}</h1>
      <div className="toolbar">
        <button onClick={() => go(-1)}>← Prev</button>
        <button onClick={() => go(1)}>Next →</button>
        <span className="badge mono">{page + 1} / {total} • {pct}%</span>
        <button onClick={() => goto(0)}>⟲ First</button>
        <button onClick={() => goto(total - 1)}>Last ⤓</button>
      </div>

      <div ref={listRef} className="reader">
        {comic.pages.map((src: string, i: number) => (
          <img id={`page-${i}`} key={i} src={src} alt={`Page ${i + 1}`} loading={i > 2 ? "lazy" : "eager"} />
        ))}
      </div>
    </div>
  );
}
