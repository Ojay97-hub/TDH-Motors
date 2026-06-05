import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase-server";

export function hasAdminMetadata(user: User) {
  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;

  return role === "admin" || (Array.isArray(roles) && roles.includes("admin"));
}

async function isAdminInTable(userId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    // The admin_users table is optional. When it doesn't exist, admin status is
    // driven entirely by app_metadata.role, so treat "table missing" as simply
    // "no table-based admins" instead of spamming errors. Surface anything else.
    const tableMissing =
      error.code === "PGRST205" ||
      error.code === "42P01" ||
      /schema cache|does not exist/i.test(error.message);
    if (!tableMissing) {
      console.error("Admin role lookup failed:", error.message);
    }
    return false;
  }

  return Boolean(data);
}

export async function isAdminUser(user: User | null) {
  if (!user) return false;
  if (hasAdminMetadata(user)) return true;
  return isAdminInTable(user.id);
}

export async function requireAdmin(user: User | null): Promise<User> {
  if (!user || !(await isAdminUser(user))) {
    redirect("/admin/login");
  }

  return user;
}

export async function assertAdmin(user: User | null): Promise<User> {
  if (!user || !(await isAdminUser(user))) {
    throw new Error("Unauthorized");
  }

  return user;
}
