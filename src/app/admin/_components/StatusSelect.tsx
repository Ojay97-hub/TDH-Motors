"use client";

import { useTransition } from "react";
import { updateEnquiryStatus } from "../actions";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "done", label: "Done" },
] as const;

const statusStyles: Record<string, string> = {
  new: "text-brand dark:text-brand-light bg-brand/15 border-brand/40",
  contacted: "text-amber-700 dark:text-accent bg-accent/15 border-accent/40",
  done: "text-text-muted bg-bg-elevated border-border",
};

type Props = { id: string; current: string };

export function StatusSelect({ id, current }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-block">
      <select
        value={current}
        disabled={isPending}
        onChange={(e) => {
          startTransition(() => updateEnquiryStatus(id, e.target.value));
        }}
        className={`appearance-none text-sm font-medium pl-3 pr-8 py-2 border cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand ${statusStyles[current] ?? statusStyles.new}`}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
