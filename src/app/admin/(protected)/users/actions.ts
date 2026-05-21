"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";

async function requireAuth() {
  const supabaseAuth = await createAuthServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function inviteUser(_prev: { error?: string; success?: string }, formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();

  if (!email) return { error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  await requireAuth();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = createServiceClient();
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback`,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: `Invite sent to ${email}.` };
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  if (!userId || typeof userId !== "string") return { error: "Invalid user ID." };

  const caller = await requireAuth();
  if (caller.id === userId) return { error: "You cannot delete your own account." };

  const supabase = createServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return {};
}

export async function updateUserEmail(
  _prev: { error?: string; success?: string },
  formData: FormData
) {
  const userId = (formData.get("userId") ?? "").toString();
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();

  if (!userId) return { error: "Missing user ID." };
  if (!email) return { error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  await requireAuth();

  const supabase = createServiceClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, { email });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: "Email updated." };
}
