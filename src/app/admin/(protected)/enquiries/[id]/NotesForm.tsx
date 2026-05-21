"use client";

import { useRef, useState, useTransition } from "react";
import { saveNotes } from "./actions";

export function NotesForm({ id, initial }: { id: string; initial: string | null }) {
  const [value, setValue] = useState(initial ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSave() {
    startTransition(async () => {
      await saveNotes(id, value);
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        rows={6}
        placeholder="Log call notes, follow-up actions, or anything relevant…"
        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none leading-relaxed"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save notes"}
        </button>
        {saved && (
          <span className="text-sm text-brand">Saved</span>
        )}
      </div>
    </div>
  );
}
