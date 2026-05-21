"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createAuthServerClient } from "@/lib/supabase-ssr";

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  if (!email) redirect("/auth/reset-password");

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;

  const supabase = await createAuthServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });

  // Always redirect to the sent state — don't reveal whether the email exists
  redirect("/auth/reset-password?sent=1");
}
