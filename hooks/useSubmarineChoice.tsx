"use client";

import { useEffect, useState } from "react";
import { SUBMARINE_OPTIONS } from "@/lib/submarines";

const STORAGE_KEY = "eurekahacks:submarine";

export function useSubmarineChoice() {
  const [submarineId, setSubmarineId] = useState(SUBMARINE_OPTIONS[0].id);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUBMARINE_OPTIONS.some((s) => s.id === saved)) {
      setSubmarineId(saved);
    }
    setLoaded(true);
  }, []);

  function chooseSubmarine(id: string) {
    setSubmarineId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return { submarineId, chooseSubmarine, loaded };
}
