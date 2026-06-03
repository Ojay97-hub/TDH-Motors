"use client";

import { useState, useTransition } from "react";
import { deleteUser } from "../(protected)/users/actions";

export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm(`Delete ${email}? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteUser(userId);
        if (result.error) setError(result.error);
      } catch (error) {
        console.error("Delete user failed:", error);
        setError("Could not delete user.");
      }
    });
  }

  return (
    <span className="inline-flex flex-col gap-0.5 items-start">
      <button
        onClick={handleClick}
        disabled={pending}
        className="text-xs text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 transition-colors"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
