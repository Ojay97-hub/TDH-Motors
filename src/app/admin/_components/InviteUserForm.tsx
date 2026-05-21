"use client";

import { useActionState, useEffect, useRef } from "react";
import { inviteUser } from "../(protected)/users/actions";

type FormState = { error?: string; success?: string };
const initial: FormState = {};

export function InviteUserForm() {
  const [state, action, pending] = useActionState(inviteUser, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
      <h2 className="font-semibold text-text mb-1">Invite a new admin</h2>
      <p className="text-sm text-text-muted mb-4">
        They will receive an email to set up their login credentials.
      </p>

      <form ref={formRef} action={action} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          placeholder="admin@example.com"
          required
          className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-brand text-white text-sm font-medium px-5 py-2 hover:bg-brand/90 transition-colors disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send Invite"}
        </button>
      </form>

      {state.error && (
        <p className="mt-3 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-green-600">{state.success}</p>
      )}
    </div>
  );
}
