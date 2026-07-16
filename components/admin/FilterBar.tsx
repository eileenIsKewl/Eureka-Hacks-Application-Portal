"use client";

import { REVIEW_STATUSES, type ReviewStatus } from "@/lib/data/types";
import { STATUS_META, type SortKey, type SortDir } from "@/lib/admin";
import { cn, SELECT_OPTION_STYLE } from "@/lib/cn";

export type ViewMode = "table" | "cards" | "pipeline";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: ReviewStatus | "ALL";
  onStatusFilterChange: (v: ReviewStatus | "ALL") => void;
  schoolFilter: string;
  onSchoolFilterChange: (v: string) => void;
  schools: string[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

const controlClasses =
  "rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-glow-500";

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  schoolFilter,
  onSchoolFilterChange,
  schools,
  sortKey,
  sortDir,
  onSortChange,
  view,
  onViewChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email…"
          className={cn(controlClasses, "min-w-[200px] flex-1")}
        />

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as ReviewStatus | "ALL")}
          className={controlClasses}
        >
          <option value="ALL" style={SELECT_OPTION_STYLE}>All statuses</option>
          {REVIEW_STATUSES.map((s) => (
            <option key={s} value={s} style={SELECT_OPTION_STYLE}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>

        <select
          value={schoolFilter}
          onChange={(e) => onSchoolFilterChange(e.target.value)}
          className={controlClasses}
        >
          <option value="ALL" style={SELECT_OPTION_STYLE}>All schools</option>
          {schools.map((s) => (
            <option key={s} value={s} style={SELECT_OPTION_STYLE}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={`${sortKey}:${sortDir}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split(":") as [SortKey, SortDir];
            onSortChange(key, dir);
          }}
          className={controlClasses}
        >
          <option value="createdAt:desc" style={SELECT_OPTION_STYLE}>Newest first</option>
          <option value="createdAt:asc" style={SELECT_OPTION_STYLE}>Oldest first</option>
          <option value="name:asc" style={SELECT_OPTION_STYLE}>Name A to Z</option>
          <option value="name:desc" style={SELECT_OPTION_STYLE}>Name Z to A</option>
          <option value="score:desc" style={SELECT_OPTION_STYLE}>Highest score</option>
          <option value="score:asc" style={SELECT_OPTION_STYLE}>Lowest score</option>
          <option value="school:asc" style={SELECT_OPTION_STYLE}>School A to Z</option>
          <option value="completion:desc" style={SELECT_OPTION_STYLE}>Furthest along</option>
          <option value="completion:asc" style={SELECT_OPTION_STYLE}>Least far along</option>
        </select>
      </div>

      <div className="flex gap-1 rounded-xl border border-white/15 bg-black/25 p-1">
        {(["table", "cards", "pipeline"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              view === mode
                ? "bg-glow-500 text-hadal-950"
                : "text-white/60 hover:text-white"
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
