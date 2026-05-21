"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase-server";

export async function saveNotes(id: string, notes: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ notes })
    .eq("id", id);

  if (error) throw new Error("Failed to save notes");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function updateStatus(id: string, status: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error("Failed to update status");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
}
