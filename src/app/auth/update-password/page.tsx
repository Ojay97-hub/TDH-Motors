"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!cancelled && !session) router.replace("/admin/login");
      })
      .catch((error) => {
        console.error("Password reset session check failed:", error);
        if (!cancelled) router.replace("/admin/login?error=invalid_token");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setError(error.message);
        } else {
          router.replace("/admin");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-xl font-bold tracking-wider uppercase text-text">
            TDH Motors
          </span>
          <p className="text-text-muted text-sm mt-1 tracking-widest uppercase">Admin</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          <h1 className="text-lg font-semibold text-text mb-2">Reset your password</h1>
          <p className="text-sm text-text-muted mb-6">Enter a new password for your account.</p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-muted mb-1"
              >
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-text-muted mb-1"
              >
                Confirm new password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand text-on-brand font-semibold py-2 rounded-lg text-sm hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {isPending ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
