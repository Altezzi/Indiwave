"use client";

// import { SessionProvider } from "next-auth/react";
import { CoverFallbackProvider } from "./CoverFallbackProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Temporarily disable NextAuth to fix context errors
  return (
    <CoverFallbackProvider>
      {children}
    </CoverFallbackProvider>
  );
  // return <SessionProvider>{children}</SessionProvider>;
}
