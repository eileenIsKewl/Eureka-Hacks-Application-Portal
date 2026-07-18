"use client";

import { useEffect, useState } from "react";

/** Whether the element with this id is currently intersecting the viewport. */
export function useSectionInView(sectionId: string): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId]);

  return inView;
}
