import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";
import Link from "next/link";
import { SignOutButton } from "../../../_components/SignOutButton";
import { StatusSelect } from "../../../_components/StatusSelect";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotesForm } from "./NotesForm";
import { ReplyForm } from "./ReplyForm";

type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  car: string | null;
  type: string;
  message: string;
  status: string;
  notes: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_BADGE: Record<string, string> = {
  new: "bg-brand/15 text-brand dark:text-brand-light",
  contacted: "bg-accent/15 text-amber-700 dark:text-accent",
  done: "bg-bg-elevated text-text-muted",
  fallback: "bg-bg-elevated text-text-muted border border-border",
};

function getStatusBadge(status: string) {
  return STATUS_BADGE[status] ?? STATUS_BADGE.fallback;
}

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabaseAuth = await createAuthServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  await requireAdmin(user);

  const supabaseService = createServiceClient();
  const { data, error } = await supabaseService
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const enquiry = data as Enquiry;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-bold tracking-wider uppercase text-text hover:text-brand transition-colors"
            >
              TDH Motors
            </Link>
            <span className="text-sm font-medium bg-brand/10 text-brand dark:text-brand-light px-2 py-0.5 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-text-muted hidden sm:block">
              {user?.email}
            </span>
            <Link
              href="/admin/enquiries"
              className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block"
            >
              ← Enquiries
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back + title row */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to enquiries
            </Link>
            <h1 className="text-2xl font-bold text-text">{enquiry.name}</h1>
            <p className="text-sm text-text-muted mt-0.5">
              Received {formatDate(enquiry.created_at)}
            </p>
          </div>
          <span
            className={`text-sm font-medium px-2.5 py-1 capitalize ${getStatusBadge(enquiry.status)}`}
          >
            {enquiry.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: enquiry details */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Contact */}
            <div className="bg-surface border border-border p-5">
              <h2 className="text-xs uppercase tracking-wider text-text-muted font-medium mb-4">
                Contact
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-text-muted mb-0.5">Name</dt>
                  <dd className="text-sm font-medium text-text">{enquiry.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-text-muted mb-0.5">Email</dt>
                  <dd className="text-sm">
                    <a href={`mailto:${enquiry.email}`} className="text-brand dark:text-brand-light hover:underline">
                      {enquiry.email}
                    </a>
                  </dd>
                </div>
                {enquiry.phone && (
                  <div>
                    <dt className="text-sm text-text-muted mb-0.5">Phone</dt>
                    <dd className="text-sm">
                      <a href={`tel:${enquiry.phone}`} className="text-brand dark:text-brand-light hover:underline">
                        {enquiry.phone}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-text-muted mb-0.5">Type</dt>
                  <dd className="text-sm text-text">{enquiry.type}</dd>
                </div>
                {enquiry.car && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-text-muted mb-0.5">Car interest</dt>
                    <dd className="text-sm text-text">{enquiry.car}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Message */}
            <div className="bg-surface border border-border p-5">
              <h2 className="text-xs uppercase tracking-wider text-text-muted font-medium mb-3">
                Message
              </h2>
              <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                {enquiry.message}
              </p>
            </div>

            {/* Notes */}
            <div className="bg-surface border border-border p-5">
              <h2 className="text-xs uppercase tracking-wider text-text-muted font-medium mb-3">
                Notes
              </h2>
              <NotesForm id={enquiry.id} initial={enquiry.notes} />
            </div>
          </div>

          {/* Right: status */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-border p-5">
              <h2 className="text-xs uppercase tracking-wider text-text-muted font-medium mb-3">
                Status
              </h2>
              <StatusSelect id={enquiry.id} current={enquiry.status} />
            </div>

            <a
              href={`mailto:${enquiry.email}?subject=Your enquiry — TDH Motors`}
              className="flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 hover:bg-brand/90 transition-colors"
            >
              Reply by email
            </a>

            <div className="bg-surface border border-border p-5">
              <h2 className="text-xs uppercase tracking-wider text-text-muted font-medium mb-3">
                Send website reply
              </h2>
              <ReplyForm
                enquiryId={enquiry.id}
                customerName={enquiry.name}
                currentUserEmail={user?.email}
              />
            </div>

            {enquiry.phone && (
              <a
                href={`tel:${enquiry.phone}`}
                className="flex items-center justify-center gap-2 bg-surface border border-border text-text text-sm font-medium px-4 py-2.5 hover:bg-bg-elevated transition-colors"
              >
                Call {enquiry.phone}
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
