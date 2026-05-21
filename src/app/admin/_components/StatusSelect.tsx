"use client";

import { useTransition } from "react";
import { updateEnquiryStatus } from "../actions";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
] as const;

const statusStyles: Record<string, string> = {
  new: "text-brand bg-brand/10 border-brand/30",
  contacted: "text-accent bg-accent/10 border-accent/30",
  completed: "text-text-muted bg-bg-elevated border-border",
  closed: "text-text-subtle bg-bg-elevated border-border",
};

type Props = { id: string; current: string };

export function StatusSelect({ id, current }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={current}
      disabled={isPending}
      onChange={(e) => {
        startTransition(() => updateEnquiryStatus(id, e.target.value));
      }}
      className={`text-xs font-medium px-2 py-1 rounded-md border cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand ${statusStyles[current] ?? statusStyles.new}`}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
