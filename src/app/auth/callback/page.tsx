"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

// Where to send the user once their session is established, based on the email
// link type. Invites/signups need to set a password; recovery needs the reset
// form; everything else goes to the dashboard.
function destinationFor(type: string | null) {
  if (type === "invite" || type === "signup") return "/auth/complete-setup";
  if (type === "recovery") return "/auth/update-password";
  return "/admin";
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const tokenHash = searchParams.get("token_hash");
    const code = searchParams.get("code");
    const type = hashParams.get("type") ?? searchParams.get("type");
    const errorDescription =
      hashParams.get("error_description") ?? searchParams.get("error_description");

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
        // Supabase reported an error in the link itself (expired, already used).
        if (errorDescription) return fail();

        // 1. Implicit flow — session tokens delivered in the URL hash.
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          return error ? fail() : go(destinationFor(type));
        }

        // 2. Email OTP links (invite / recovery / magic link) carrying a
        //    self-contained token_hash + type.
        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            type: type as EmailOtpType,
            token_hash: tokenHash,
          });
          return error ? fail() : go(destinationFor(type));
        }

        // 3. PKCE / OAuth — exchange the code in the query string for a session.
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          return error ? fail() : go(destinationFor(type));
        }

        // Nothing usable in the URL.
        fail();
      } catch (error) {
        console.error("Auth callback error:", error);
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
