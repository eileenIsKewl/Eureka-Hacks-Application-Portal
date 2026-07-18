import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Fixed to the viewport so the gradient never scrolls away or cuts
          off to flat black, no matter how long the page gets. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle at 20% -10%, rgba(34,224,196,0.10), transparent 45%),
            radial-gradient(circle at 90% 10%, rgba(34,224,196,0.06), transparent 40%),
            linear-gradient(to bottom, var(--color-midnight-700), var(--color-midnight-900) 55%, var(--color-hadal-900))
          `,
        }}
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
            href="/apply"
            className="text-xs text-white/40 underline decoration-dotted underline-offset-4 hover:text-white/70"
          >
            ← Back to the application
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
