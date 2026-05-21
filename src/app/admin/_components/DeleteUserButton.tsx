"use client";

import { useTransition } from "react";
import { deleteUser } from "../(protected)/users/actions";

export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete ${email}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteUser(userId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-xs text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 transition-colors"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
