"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";

const VALID_STATUSES = ["new", "contacted", "done"] as const;
type Status = (typeof VALID_STATUSES)[number];

export async function updateEnquiryStatus(id: string, status: string) {
  if (!id || typeof id !== "string") throw new Error("Invalid enquiry ID");
  if (!VALID_STATUSES.includes(status as Status)) throw new Error("Invalid status value");

  const supabaseAuth = await createAuthServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) redirect("/admin/login");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error("Failed to update enquiry status");

  revalidatePath("/admin/enquiries");
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign-out error:", error.message);
  }
  redirect("/admin/login");
}
