"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin-auth";
import { createAuthServerClient } from "@/lib/supabase-ssr";
import { createServiceClient } from "@/lib/supabase-server";

const VALID_STATUSES = ["new", "contacted", "done"] as const;
type Status = (typeof VALID_STATUSES)[number];
type FormState = { error?: string; success?: string };

async function requireAuth() {
  const supabaseAuth = await createAuthServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) redirect("/admin/login");
  return assertAdmin(user);
}

function splitEmails(value?: string) {
  return (value ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getReplySender(userEmail?: string) {
  const fallbackSender = process.env.BREVO_SENDER_EMAIL?.trim();
  const allowedSenders = new Set(
    [
      ...splitEmails(process.env.BREVO_VERIFIED_SENDERS),
      ...splitEmails(process.env.BREVO_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS),
      ...(fallbackSender ? [fallbackSender] : []),
    ].map((email) => email.toLowerCase())
  );

  const normalizedUserEmail = userEmail?.trim().toLowerCase();
  if (normalizedUserEmail && allowedSenders.has(normalizedUserEmail)) {
    return normalizedUserEmail;
  }

  return fallbackSender;
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

export async function sendEnquiryReply(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const id = (formData.get("enquiryId") ?? "").toString();
  const subject = (formData.get("subject") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();

  if (!id) return { error: "Missing enquiry." };
  if (!subject) return { error: "Subject is required." };
  if (!message) return { error: "Message is required." };
  if (subject.length > 180) return { error: "Subject is too long." };
  if (message.length > 5000) return { error: "Message is too long." };

  const user = await requireAuth();
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = getReplySender(user.email);
  const senderName = process.env.BREVO_SENDER_NAME ?? "TDH Motors";

  if (!apiKey || !senderEmail) {
    return { error: "Missing Brevo reply configuration." };
  }

  const supabase = createServiceClient();
  const { data: enquiry, error } = await supabase
    .from("enquiries")
    .select("id, name, email, message, status")
    .eq("id", id)
    .single();

  if (error || !enquiry) return { error: "Could not find this enquiry." };

  const textContent = [
    message,
    "",
    "--",
    "TDH Motors",
    "",
    "Original enquiry:",
    enquiry.message,
  ].join("\n");

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;color:#26231f;line-height:1.5;">
      <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
      <p style="margin:24px 0 0;">--<br />TDH Motors</p>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e6e2da;color:#6f6a61;">
        <p style="margin:0 0 8px;font-weight:600;">Original enquiry</p>
        <div style="white-space:pre-wrap;">${escapeHtml(enquiry.message)}</div>
      </div>
    </div>`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: enquiry.email, name: enquiry.name }],
      replyTo: { email: senderEmail, name: senderName },
      subject,
      htmlContent,
      textContent,
      tags: ["admin-reply"],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Brevo reply send failed (${response.status}):`, details);
    return { error: "Could not send the reply." };
  }

  if (enquiry.status === "new") {
    await supabase.from("enquiries").update({ status: "contacted" }).eq("id", id);
  }

  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
  return { success: `Reply sent from ${senderEmail}.` };
}
