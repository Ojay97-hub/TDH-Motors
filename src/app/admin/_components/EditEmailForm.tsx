"use client";

import { useActionState, useState } from "react";
import { updateUserEmail } from "../(protected)/users/actions";

type FormState = { error?: string; success?: string };
const initial: FormState = {};

export function EditEmailForm({ userId, currentEmail }: { userId: string; currentEmail: string }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await updateUserEmail(prev, formData);
    if (result.success) setEditing(false);
    return result;
  }, initial);

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-text">{currentEmail}</span>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-text-muted hover:text-brand transition-colors"
        >
          Edit
        </button>
        {state.success && (
          <span className="text-xs text-green-600">{state.success}</span>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <input
        type="email"
        name="email"
        defaultValue={currentEmail}
        required
        autoFocus
        className="rounded border border-border bg-bg px-2 py-1 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand/40 w-52"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-brand hover:underline disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-text-muted hover:underline"
      >
        Cancel
      </button>
      {state.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
    </form>
  );
}
