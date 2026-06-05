"use client";

import { useState, useTransition } from "react";
import { setAdminRole } from "../(protected)/users/actions";

export function RoleToggleButton({
  userId,
  email,
  isAdmin,
  isSelf,
}: {
  userId: string;
  email: string;
  isAdmin: boolean;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const makeAdmin = !isAdmin;
    if (
      !makeAdmin &&
      !confirm(`Remove admin access for ${email}? They will no longer reach /admin.`)
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await setAdminRole(userId, makeAdmin);
        if (result.error) setError(result.error);
      } catch (err) {
        console.error("Set admin role failed:", err);
        setError("Could not update admin access.");
      }
    });
  }

  // You can't strip your own access; hide the revoke control for yourself.
  if (isAdmin && isSelf) return null;

  return (
    <span className="inline-flex flex-col gap-0.5 items-start">
      <button
        onClick={handleClick}
        disabled={pending}
        className={`text-xs hover:underline disabled:opacity-50 transition-colors ${
          isAdmin
            ? "text-amber-600 hover:text-amber-700"
            : "text-brand hover:text-brand-dark"
        }`}
      >
        {pending
          ? "Saving…"
          : isAdmin
            ? "Revoke admin"
            : "Make admin"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
