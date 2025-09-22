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
          const data = await res.json();
          setComics(data.comics || []);
        }
      } catch (error) {
        console.error("Failed to fetch comics for search:", error);
      }
    };

    fetchComics();
  }, []);

  return (
    <html lang="en">
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
