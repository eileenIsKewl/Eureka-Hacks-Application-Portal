"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Slim floating nav: placeholder logo + Home on the left, Admin Portal on
 * the right. No background of its own; since it only shows while the page
 * is at the sunlit surface, dark text keeps it readable. It slides away
 * once the descent starts so nothing breaks the underwater immersion.
 */
export function NavBar() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 transition-all duration-300",
        atTop ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center gap-6">
        {/* Placeholder logo: swap for real art whenever it's ready */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-glow-500 font-display text-sm text-hadal-950 shadow-glow-teal">
          EH
        </div>
        <span className="cursor-default text-base font-semibold text-sunlight-950/80 transition-colors hover:text-sunlight-950">
          Home
        </span>
      </div>

      <Link
        href="/admin"
        className="rounded-xl border border-sunlight-950/25 bg-white/25 px-4 py-2 text-base font-semibold text-sunlight-950/80 backdrop-blur-sm transition-colors hover:border-sunlight-950/40 hover:text-sunlight-950"
      >
        Admin Portal
      </Link>
    </nav>
  );
}
