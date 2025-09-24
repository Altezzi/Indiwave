"use client";

// import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Temporarily disable NextAuth to fix context errors
  return <>{children}</>;
  // return <SessionProvider>{children}</SessionProvider>;
}
