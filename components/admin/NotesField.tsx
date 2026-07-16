"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";

interface NotesFieldProps {
  value: string;
  onSave: (value: string) => void;
}

export function NotesField({ value, onSave }: NotesFieldProps) {
  const [draft, setDraft] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleChange(next: string) {
    setDraft(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSave(next), 500);
  }

  return (
    <Card>
      <h3 className="mb-3 font-display text-lg text-glow-300">Reviewer notes</h3>
      <textarea
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Notes only the crew can see…"
        rows={5}
        className="w-full resize-none rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-glow-500"
      />
    </Card>
  );
}
