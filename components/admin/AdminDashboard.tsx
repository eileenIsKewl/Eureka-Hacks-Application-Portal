"use client";

import { useMemo, useState } from "react";
import type { ReviewStatus } from "@/lib/data/types";
import { matchesSearch, sortApplicants, type SortDir, type SortKey } from "@/lib/admin";
import { useApplicants } from "@/hooks/useApplicants";
import { StatsBar } from "./StatsBar";
import { FilterBar, type ViewMode } from "./FilterBar";
import { ApplicantTable } from "./ApplicantTable";
import { ApplicantCards } from "./ApplicantCards";
import { KanbanBoard } from "./KanbanBoard";

export function AdminDashboard() {
  const { applicants, loading, updateReview } = useApplicants();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "ALL">("ALL");
  const [schoolFilter, setSchoolFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [view, setView] = useState<ViewMode>("table");

  const schools = useMemo(() => {
    const set = new Set<string>();
    for (const a of applicants) if (a.school) set.add(a.school);
    return Array.from(set).sort();
  }, [applicants]);

  const filtered = useMemo(() => {
    let list = applicants;
    if (statusFilter !== "ALL") list = list.filter((a) => a.status === statusFilter);
    if (schoolFilter !== "ALL") list = list.filter((a) => a.school === schoolFilter);
    list = list.filter((a) => matchesSearch(a, search));
    return sortApplicants(list, sortKey, sortDir);
  }, [applicants, statusFilter, schoolFilter, search, sortKey, sortDir]);

  if (loading) {
    return <p className="text-white/50">Scanning the depths for applicants…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <StatsBar applicants={applicants} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        schoolFilter={schoolFilter}
        onSchoolFilterChange={setSchoolFilter}
        schools={schools}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        view={view}
        onViewChange={setView}
      />

      {view === "table" && <ApplicantTable applicants={filtered} />}
      {view === "cards" && <ApplicantCards applicants={filtered} />}
      {view === "pipeline" && (
        <KanbanBoard
          applicants={filtered}
          onStatusChange={(id, status) => updateReview(id, { status })}
        />
      )}
    </div>
  );
}
