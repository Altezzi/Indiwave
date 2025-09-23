"use client";

import "./globals.css";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import Header from "../components/Header";
import Providers from "../components/Providers";
import Sidebar from "../components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [comics, setComics] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Set document title
    document.title = "indiwave";
    
    // Fetch comics data for search
    const fetchComics = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003";
        const res = await fetch(`${baseUrl}/api/manga`, { cache: "no-store" });
        if (res.ok) {
          const mangaData = await res.json();
          if (mangaData.success && mangaData.data) {
            // Convert manga data to comic format for compatibility
            const comics = mangaData.data.map((manga: any) => ({
              id: String(manga.id || ''),
              title: String(manga.title || ''),
              cover: String(manga.coverUrl || ''),
              coverImage: String(manga.coverUrl || ''),
              author: String(manga.authors?.join(', ') || ''),
              artist: String(manga.artists?.join(', ') || ''),
              year: manga.year || 0,
              tags: Array.isArray(manga.tags) ? manga.tags : [],
              description: String(manga.description || ''),
              status: String(manga.status || ''),
              contentRating: String(manga.contentRating || ''),
              totalChapters: manga.totalChapters || 0,
              source: String(manga.source || '')
            }));
            setComics(comics);
          }
        }
      } catch (error) {
        console.error("Failed to fetch comics for search:", error);
      }
    };

    fetchComics();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <title>indiwave</title>
      </head>
      <body>
        <Providers>
          <Header 
            comics={comics}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            isAdvancedSearchOpen={isAdvancedSearchOpen}
            setIsAdvancedSearchOpen={setIsAdvancedSearchOpen}
            isSidebarOpen={isSidebarOpen}
          />
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpen={() => setIsSidebarOpen(true)}
          />
          <main 
            className="container"
            style={{
              minHeight: "calc(100vh - 80px)",
            }}
          >
            {children}
          </main>
          <footer className="footer">© 2025 indiwave — public domain & creator-authorized only</footer>

        </Providers>
      </body>
    </html>
  );
}
