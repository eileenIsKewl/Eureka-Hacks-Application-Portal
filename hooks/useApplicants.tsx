"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApplicantRecord, ReviewInput } from "@/lib/data/types";

export function useApplicants() {
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/applicants");
    if (res.ok) {
      const data: ApplicantRecord[] = await res.json();
      setApplicants(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
