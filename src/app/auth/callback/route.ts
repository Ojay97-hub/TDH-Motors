import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createAuthServerClient } from "@/lib/supabase-ssr";

// Where to send the user once their session is established, based on the email
// link type. Invites/signups need to set a password; recovery needs the reset
// form; everything else goes to the dashboard.
function destinationFor(type: string | null) {
  if (type === "invite" || type === "signup") return "/auth/complete-setup";
  if (type === "recovery") return "/auth/update-password";
  return "/admin";
}

// Auth callback runs server-side so it can redeem flows the browser can't:
// PKCE codes (the verifier lives in an httpOnly cookie) and token_hash OTPs.
// Session cookies written via the SSR client are attached to the redirect
// response automatically.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const errorDescription = searchParams.get("error_description");

  const fail = () =>
    NextResponse.redirect(new URL("/admin/login?error=invalid_token", origin));

  // Supabase reported an error in the link itself (expired, already used).
  if (errorDescription) return fail();

  const supabase = await createAuthServerClient();

  // Clear any existing session before redeeming a fresh link. Without this, an
  // admin who is already signed in (e.g. clicking an invite for someone else in
  // the same browser) collides with the incoming token and bounces through
  // /admin/login into a redirect loop. Scope is local so we only drop this
  // browser's cookie — other sessions for that user are left untouched.
  if (code || (tokenHash && type)) {
    await supabase.auth.signOut({ scope: "local" });
  }

  // 1. PKCE / OAuth — exchange the code for a session. The matching code
  //    verifier was stored as an httpOnly cookie when the email was sent, so
  //    only the server can complete this.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail();
    return NextResponse.redirect(new URL(destinationFor(type), origin));
  }

  // 2. Email OTP links carrying a self-contained token_hash + type. Stateless
  //    and cross-device — works even if the link is opened in a different
  //    browser than the one that requested it.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: tokenHash,
    });
    if (error) return fail();
    return NextResponse.redirect(new URL(destinationFor(type), origin));
  }

  // 3. Implicit flow — session tokens live in the URL #fragment, which the
  //    server never receives. Bounce to a client page that can read it;
  //    browsers preserve the fragment across this redirect because the
  //    Location carries none of its own.
  return NextResponse.redirect(new URL("/auth/callback/hash", origin));
}
