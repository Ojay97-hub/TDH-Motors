"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase-ssr";
import { createServiceClient } from "@/lib/supabase-server";

const VALID_STATUSES = ["new", "contacted", "done"] as const;
type Status = (typeof VALID_STATUSES)[number];

async function requireAuth() {
  const supabaseAuth = await createAuthServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) redirect("/admin/login");
}

export async function saveNotes(id: string, notes: string) {
  if (!id || typeof id !== "string") throw new Error("Invalid enquiry ID");
  await requireAuth();

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ notes })
    .eq("id", id);

  if (error) throw new Error("Failed to save notes");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function updateStatus(id: string, status: string) {
  if (!id || typeof id !== "string") throw new Error("Invalid enquiry ID");
  if (!VALID_STATUSES.includes(status as Status)) throw new Error("Invalid status value");
  await requireAuth();

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error("Failed to update status");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
}
