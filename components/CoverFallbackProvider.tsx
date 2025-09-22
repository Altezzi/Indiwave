"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface CoverFallbackContextType {
  lastSuccessfulCover: string | null;
  setLastSuccessfulCover: (url: string) => void;
}

const CoverFallbackContext = createContext<CoverFallbackContextType | undefined>(undefined);

export function CoverFallbackProvider({ children }: { children: ReactNode }) {
  const [lastSuccessfulCover, setLastSuccessfulCover] = useState<string | null>(null);

  return (
    <CoverFallbackContext.Provider value={{ lastSuccessfulCover, setLastSuccessfulCover }}>
      {children}
    </CoverFallbackContext.Provider>
  );
}

export function useCoverFallback() {
  const context = useContext(CoverFallbackContext);
  if (context === undefined) {
    // Return a default context when not within provider
    return {
      lastSuccessfulCover: null,
      setLastSuccessfulCover: () => {}
    };
  }
  return context;
}
