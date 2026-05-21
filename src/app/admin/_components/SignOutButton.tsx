"use client";

import { useTransition } from "react";
import { signOut } from "../actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="text-sm text-text-muted hover:text-text transition-colors disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
