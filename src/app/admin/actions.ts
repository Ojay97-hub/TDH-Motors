"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";

export async function updateEnquiryStatus(id: string, status: string) {
  const supabase = createServiceClient();
  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
