"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const type = hashParams.get("type") ?? searchParams.get("type");

    function successRedirect() {
      if (type === "invite") return "/auth/complete-setup";
      if (type === "recovery") return "/auth/update-password";
      return "/admin";
    }

    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          router.replace(error ? "/admin/login?error=1" : successRedirect());
        });
    } else {
      // PKCE flow — code is in query params
      const code = searchParams.get("code");
      if (code) {
        supabase.auth
          .exchangeCodeForSession(code)
          .then(({ error }) => {
            router.replace(error ? "/admin/login?error=1" : successRedirect());
          });
      } else {
        router.replace("/admin/login?error=1");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <p className="text-text-muted text-sm tracking-wider uppercase">Signing you in…</p>
    </div>
  );
}
