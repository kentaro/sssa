'use client';

import { createContext, useContext, useEffect, useState, startTransition, ReactNode } from 'react';

interface KidsModeContextType {
  isKidsMode: boolean;
  toggleKidsMode: () => void;
  setMode: (mode: 'adult' | 'kids') => void;
}

const KidsModeContext = createContext<KidsModeContextType | undefined>(undefined);

const STORAGE_KEY = 'kids-mode';

export function KidsModeProvider({ children }: { children: ReactNode }) {
  const [isKidsMode, setIsKidsMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        startTransition(() => setIsKidsMode(true));
      }
    } catch {
      // ignore errors accessing localStorage
    }
  }, []);

  const setMode = (mode: 'adult' | 'kids') => {
    const next = mode === 'kids';
    setIsKidsMode((prev) => {
      if (prev === next) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, String(next));
        }
        return prev;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  const toggleKidsMode = () => {
    setIsKidsMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  return (
    <KidsModeContext.Provider value={{ isKidsMode, toggleKidsMode, setMode }}>
      {children}
    </KidsModeContext.Provider>
  );
}

export function useKidsMode() {
  const context = useContext(KidsModeContext);
  if (context === undefined) {
    // エラーを投げる代わりに、デフォルト値を返す
    console.warn('useKidsMode must be used within a KidsModeProvider, returning default values');
    return {
      isKidsMode: false,
      toggleKidsMode: () => {},
      setMode: () => {},
    };
  }
  return context;
}
