"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

// Client fallback for the implicit flow, where Supabase delivers the session
// tokens in the URL #fragment (never sent to the server). The server callback
// redirects here, preserving the fragment, when no code/token_hash is present.
function destinationFor(type: string | null) {
  if (type === "invite" || type === "signup") return "/auth/complete-setup";
  if (type === "recovery") return "/auth/update-password";
  return "/admin";
}

export default function AuthCallbackHashPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const type = hashParams.get("type");
    const errorDescription = hashParams.get("error_description");

    let cancelled = false;

    function go(path: string) {
      if (!cancelled) router.replace(path);
    }

    function fail() {
      if (cancelled) return;
      setFailed(true);
      router.replace("/admin/login?error=invalid_token");
    }

    async function completeAuth() {
      try {
        if (errorDescription || !accessToken || !refreshToken) return fail();

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        return error ? fail() : go(destinationFor(type));
      } catch (error) {
        console.error("Auth callback (hash) error:", error);
        fail();
      }
    }

    void completeAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <p className="text-text-muted text-sm tracking-wider uppercase">
        {failed ? "Link invalid or expired. Redirecting…" : "Signing you in…"}
      </p>
    </div>
  );
}
