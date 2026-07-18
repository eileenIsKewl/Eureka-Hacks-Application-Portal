"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SUBMARINE_OPTIONS } from "@/lib/submarines";

const STORAGE_KEY = "eurekahacks:submarine";

async function readStoredSubmarine(): Promise<string | null> {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && SUBMARINE_OPTIONS.some((s) => s.id === saved) ? saved : null;
}

interface SubmarineContextValue {
  submarineId: string;
  chooseSubmarine: (id: string) => void;
  loaded: boolean;
}

const SubmarineContext = createContext<SubmarineContextValue | null>(null);

/**
 * Shared across the picker and the scroll-follower so picking a submarine in
 * one place updates the other immediately, instead of each holding its own
 * disconnected copy of the choice.
 */
export function SubmarineProvider({ children }: { children: React.ReactNode }) {
  const [submarineId, setSubmarineId] = useState(SUBMARINE_OPTIONS[0].id);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    readStoredSubmarine().then((saved) => {
      if (cancelled) return;
      if (saved) setSubmarineId(saved);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function chooseSubmarine(id: string) {
    setSubmarineId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <SubmarineContext.Provider value={{ submarineId, chooseSubmarine, loaded }}>
      {children}
    </SubmarineContext.Provider>
  );
}

export function useSubmarineChoice() {
  const ctx = useContext(SubmarineContext);
  if (!ctx) {
    throw new Error("useSubmarineChoice must be used within a SubmarineProvider");
  }
  return ctx;
}
