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
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/comics`, { cache: "no-store" });
        if (res.ok) {
          const comicsData = await res.json();
          if (comicsData.comics) {
            // Convert comics data to the expected format
            const comics = comicsData.comics.map((comic: any) => ({
              id: String(comic.id || ''),
              title: String(comic.title || ''),
              series: String(comic.series || comic.title || ''),
              cover: String(comic.cover || ''),
              coverImage: String(comic.cover || ''),
              author: String(comic.author || ''),
              artist: String(comic.artist || ''),
              year: comic.year || 0,
              tags: Array.isArray(comic.tags) ? comic.tags : (typeof comic.tags === 'string' ? comic.tags.split(',').map(tag => tag.trim()) : []),
              description: String(comic.description || ''),
              status: String(comic.status || ''),
              contentRating: String(comic.contentRating || ''),
              totalChapters: comic.totalChapters || 0,
              source: String(comic.source || '')
            }));
            console.log('Loaded comics for search:', comics.length);
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
