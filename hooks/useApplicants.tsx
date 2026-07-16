"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApplicantRecord, ReviewInput } from "@/lib/data/types";

async function fetchApplicants(): Promise<ApplicantRecord[] | null> {
  const res = await fetch("/api/applicants");
  if (!res.ok) return null;
  return res.json();
}

export function useApplicants() {
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchApplicants().then((data) => {
      if (cancelled) return;
      if (data) setApplicants(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    const data = await fetchApplicants();
    if (data) setApplicants(data);
  }, []);

  const updateReview = useCallback(
    async (id: string, review: ReviewInput) => {
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...review } : a))
      );
      const res = await fetch(`/api/applicants/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        const updated: ApplicantRecord = await res.json();
        setApplicants((prev) =>
          prev.map((a) => (a.id === id ? updated : a))
        );
      }
    },
    []
  );

  return { applicants, loading, refresh, updateReview };
}
