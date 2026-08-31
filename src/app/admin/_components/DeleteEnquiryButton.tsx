"use client";

import { useState, useTransition } from "react";
import { deleteEnquiry } from "../actions";

export const TrashIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);

type Props = { id: string; name: string; className?: string; children?: React.ReactNode };

export function DeleteEnquiryButton({ id, name, className, children }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        aria-label={`Delete enquiry from ${name}`}
        title="Delete enquiry"
        onClick={() => {
          if (!window.confirm(`Delete the enquiry from ${name}? This can't be undone.`)) return;
          setError(null);
          startTransition(async () => {
            try {
              await deleteEnquiry(id);
            } catch (err) {
              // A successful delete ends in redirect(), which throws a special
              // NEXT_REDIRECT error to trigger navigation — let that propagate
              // instead of treating it as a failure.
              if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
                throw err;
              }
              console.error("Enquiry delete failed:", err);
              setError("Could not delete.");
            }
          });
        }}
        className={
          className ??
          "inline-flex h-9 w-9 items-center justify-center border border-border text-text-muted hover:text-red-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
        }
      >
        {children ?? TrashIcon}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
