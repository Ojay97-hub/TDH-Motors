"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase-ssr";

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/admin/login?error=1");
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=1");
  }

  redirect("/admin");
}
