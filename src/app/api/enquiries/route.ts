import { z } from "zod";
import { createServiceClient } from "@/lib/supabase-server";

const enquiryTypes = [
  "Viewing",
  "Curated Sales",
  "Part-Exchange",
  "Detailing",
  "Storage",
  "Bespoke Sourcing",
  "General",
] as const;

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  car: z.string().optional(),
  type: z.enum(enquiryTypes),
  message: z.string().min(1),
});

type Enquiry = z.infer<typeof schema>;

const brevoEndpoint = "https://api.brevo.com/v3/smtp/email";

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

function detailRows(enquiry: Enquiry) {
  return [
    ["Enquiry type", enquiry.type],
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone || "Not provided"],
    ["Car of interest", enquiry.car || "Not specified"],
  ];
}

function normalizeSiteUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, "");
}

function getAdminSiteUrl(requestOrigin?: string) {
  return normalizeSiteUrl(
    process.env.ADMIN_SITE_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.VERCEL_URL ??
      requestOrigin
  );
}

function buildAdminEmail(enquiry: Enquiry, enquiryId?: string, requestOrigin?: string) {
  const siteUrl = getAdminSiteUrl(requestOrigin);
  const adminUrl = siteUrl && enquiryId ? `${siteUrl}/admin/enquiries/${enquiryId}` : undefined;
  const subjectParts = ["New", enquiry.type, "enquiry"];

  if (enquiry.car) subjectParts.push(`about ${enquiry.car}`);

  const subject = `TDH Motors: ${subjectParts.join(" ")} from ${enquiry.name}`;
  const rows = detailRows(enquiry);
  const text = [
    subject,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    enquiry.message,
    ...(adminUrl ? ["", `View in admin: ${adminUrl}`] : []),
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:8px 12px;border-bottom:1px solid #e6e2da;color:#6f6a61;font-weight:600;">${escapeHtml(label)}</th>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e2da;color:#26231f;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#26231f;line-height:1.5;">
      <h1 style="font-size:22px;margin:0 0 16px;">${escapeHtml(subject)}</h1>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:640px;margin-bottom:20px;">
        ${htmlRows}
      </table>
      <h2 style="font-size:16px;margin:0 0 8px;">Message</h2>
      <div style="white-space:pre-wrap;background:#f7f5ef;border:1px solid #e6e2da;padding:16px;margin-bottom:20px;">${escapeHtml(enquiry.message)}</div>
      ${
        adminUrl
          ? `<p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#2d6f4f;color:#fff;text-decoration:none;padding:12px 18px;">View enquiry in admin</a></p>`
          : ""
      }
    </div>`;

  return { subject, text, html };
}

async function sendAdminEmail(enquiry: Enquiry, enquiryId?: string, requestOrigin?: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const recipients = splitEmails(process.env.BREVO_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS);
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "TDH Motors";

  if (!apiKey || !senderEmail || recipients.length === 0) {
    throw new Error(
      "Missing Brevo email configuration. Set BREVO_API_KEY, BREVO_SENDER_EMAIL, and BREVO_ADMIN_EMAILS."
    );
  }

  const email = buildAdminEmail(enquiry, enquiryId, requestOrigin);
  const response = await fetch(brevoEndpoint, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: recipients.map((email) => ({ email })),
      replyTo: { email: enquiry.email, name: enquiry.name },
      subject: email.subject,
      htmlContent: email.html,
      textContent: email.text,
      tags: ["contact-enquiry", enquiry.type.toLowerCase().replace(/\s+/g, "-")],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo send failed (${response.status}): ${details}`);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  const requestOrigin = new URL(request.url).origin;

  if (!parsed.success) {
    return Response.json({ error: "Invalid data", issues: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("enquiries")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return Response.json({ error: "Failed to save enquiry" }, { status: 500 });
  }

  try {
    await sendAdminEmail(parsed.data, data?.id, requestOrigin);
  } catch (error) {
    console.error("Brevo enquiry email error:", error);
  }

  return Response.json({ ok: true }, { status: 201 });
}
