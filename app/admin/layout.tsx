import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-midnight-950">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(34,224,196,0.08),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(34,224,196,0.05),transparent_40%)]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <Link
              href="/admin"
              className="font-display text-xl text-glow-400 hover:text-glow-300"
            >
              EurekaHacks Control Room
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/35">
              Submersible review deck
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-white/40 underline decoration-dotted underline-offset-4 hover:text-white/70"
          >
            ← Back to surface site
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
