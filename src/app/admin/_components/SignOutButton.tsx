"use client";

import { useState, useTransition } from "react";
import { signOut } from "../actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await signOut();
            } catch (error) {
              console.error("Sign out failed:", error);
              setError("Could not sign out.");
            }
          });
        }}
        disabled={isPending}
        className="text-sm text-text-muted hover:text-text transition-colors disabled:opacity-50"
      >
        {isPending ? "Signing out..." : "Sign out"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
