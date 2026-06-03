import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";
import Link from "next/link";
import { StatusSelect } from "../../_components/StatusSelect";
import { SignOutButton } from "../../_components/SignOutButton";
import { ThemeToggle } from "@/components/theme-toggle";

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
};

const TYPE_BADGE: Record<string, string> = {
  Viewing: "bg-brand/15 text-brand dark:text-brand-light border border-brand/30",
  "Part-Exchange": "bg-accent/15 text-amber-700 dark:text-accent border border-accent/30",
  "Bespoke Sourcing": "bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-400/30",
  General: "bg-bg-elevated text-text-muted border border-border",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const MailIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const PhoneIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const CarIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
);
const EyeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = typeof filter === "string" ? filter : "all";

  const supabaseAuth = await createAuthServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  await requireAdmin(user);

  const supabaseService = createServiceClient();
  const { data: enquiries, error: enquiriesError } = await supabaseService
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (enquiriesError) throw new Error("Failed to load enquiries");

  const rows = (enquiries ?? []) as Enquiry[];

  const counts = rows.reduce(
    (acc, e) => {
      acc.total++;
      if (e.status === "new") acc.new++;
      else if (e.status === "contacted") acc.contacted++;
      else if (e.status === "done") acc.done++;
      return acc;
    },
    { total: 0, new: 0, contacted: 0, done: 0 }
  );

  const filteredRows =
    activeFilter === "new"
      ? rows.filter((e) => e.status === "new")
      : activeFilter === "contacted"
        ? rows.filter((e) => e.status === "contacted")
        : activeFilter === "done"
          ? rows.filter((e) => e.status === "done")
          : rows;

  const stats = [
    { label: "Total", value: counts.total, dot: "bg-text-muted", value_style: "text-text", filter: "all" },
    { label: "New", value: counts.new, dot: "bg-brand-light", value_style: "text-brand dark:text-brand-light", filter: "new" },
    { label: "Contacted", value: counts.contacted, dot: "bg-accent", value_style: "text-amber-700 dark:text-accent", filter: "contacted" },
    { label: "Done", value: counts.done, dot: "bg-text-muted", value_style: "text-text-muted", filter: "done" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/"
              className="font-bold tracking-wider uppercase text-text hover:text-brand transition-colors truncate"
            >
              TDH Motors
            </Link>
            <span className="shrink-0 text-sm font-semibold bg-brand/10 text-brand px-2 py-0.5 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <ThemeToggle />
            <span className="text-sm text-text-muted hidden md:block max-w-[180px] truncate">
              {user?.email}
            </span>
            <Link
              href="/admin"
              className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block"
            >
              ← Dashboard
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Title + mobile dashboard link */}
        <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text">Enquiries</h1>
            <p className="text-sm text-text-muted mt-1">
              {counts.total} total · {counts.new} awaiting response
            </p>
          </div>
          <Link
            href="/admin"
            className="sm:hidden text-sm text-text-muted hover:text-text transition-colors whitespace-nowrap"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Stat / filter cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const isActive = activeFilter === stat.filter;
            const href =
              stat.filter === "all"
                ? "/admin/enquiries"
                : `/admin/enquiries?filter=${stat.filter}`;
            return (
              <Link
                key={stat.label}
                href={href}
                className={`group relative border p-4 sm:p-5 transition-all duration-200 ${
                  isActive
                    ? "border-brand bg-surface"
                    : "border-border bg-surface hover:border-brand hover:bg-bg-elevated"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
                  <p className="text-sm uppercase tracking-wider text-text-muted font-medium">
                    {stat.label}
                  </p>
                </div>
                <p className={`text-3xl sm:text-4xl font-bold tabular-nums ${stat.value_style}`}>
                  {stat.value}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Active filter indicator */}
        {activeFilter !== "all" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-text-muted">
              Showing{" "}
              <span className="font-medium text-text capitalize">{activeFilter}</span>
              {" "}· {filteredRows.length}
            </span>
            <Link
              href="/admin/enquiries"
              className="text-sm text-brand dark:text-brand-light hover:underline underline-offset-2"
            >
              Clear filter
            </Link>
          </div>
        )}

        {filteredRows.length === 0 ? (
          <div className="bg-surface border border-dashed border-border p-12 sm:p-16 text-center">
            <p className="text-text-subtle">
              No {activeFilter !== "all" ? `"${activeFilter}" ` : ""}enquiries yet.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile / tablet: card list */}
            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
              {filteredRows.map((e) => (
                <div
                  key={e.id}
                  className="border border-border bg-surface p-4 flex flex-col gap-3 transition-colors hover:border-brand"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-text truncate">{e.name}</p>
                      <p className="text-sm text-text-muted dark:text-neutral-300 mt-0.5">
                        {formatDate(e.created_at)}
                      </p>
                    </div>
                    <span className={`shrink-0 inline-block text-sm font-medium px-2.5 py-1 ${TYPE_BADGE[e.type] ?? TYPE_BADGE.General}`}>
                      {e.type}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-sm">
                    <a href={`mailto:${e.email}`} className="flex items-center gap-2 text-brand dark:text-brand-light hover:underline">
                      <span className="text-text-muted">{MailIcon}</span>
                      <span className="truncate">{e.email}</span>
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="flex items-center gap-2 text-text-muted dark:text-neutral-200 hover:underline">
                        <span className="text-text-muted">{PhoneIcon}</span>
                        {e.phone}
                      </a>
                    )}
                    {e.car && (
                      <p className="flex items-center gap-2 text-text-muted dark:text-neutral-200">
                        <span className="text-text-muted">{CarIcon}</span>
                        <span className="truncate">{e.car}</span>
                      </p>
                    )}
                  </div>

                  {e.message && (
                    <p className="text-sm text-text-muted dark:text-neutral-200 line-clamp-2 leading-snug border-l-2 border-border pl-3">
                      {e.message}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <StatusSelect id={e.id} current={e.status} />
                    <Link
                      href={`/admin/enquiries/${e.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 border border-border text-text-muted hover:text-brand hover:border-brand transition-colors"
                    >
                      {EyeIcon}
                      View details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: separated rows */}
            <table className="hidden lg:table w-full text-sm border-separate border-spacing-y-3">
              <thead>
                <tr>
                  {["Customer", "Contact", "Enquiry", "Message", "Status", ""].map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-5 pb-1 text-text-muted font-medium uppercase tracking-wider text-sm"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((e) => {
                  const cell =
                    "bg-surface border-y border-border align-middle px-5 py-5 transition-colors group-hover:bg-bg-elevated group-hover:border-brand";
                  return (
                    <tr key={e.id} className="group">
                      {/* Customer = name + date stacked */}
                      <td className={`${cell} border-l`}>
                        <p className="font-semibold text-text whitespace-nowrap">{e.name}</p>
                        <p className="text-sm text-text-muted dark:text-neutral-300 mt-0.5 whitespace-nowrap">
                          {formatDate(e.created_at)}
                        </p>
                      </td>
                      {/* Contact = email + phone stacked */}
                      <td className={cell}>
                        <a href={`mailto:${e.email}`} className="text-brand dark:text-brand-light hover:underline block">
                          {e.email}
                        </a>
                        {e.phone && (
                          <a href={`tel:${e.phone}`} className="text-text-muted dark:text-neutral-200 hover:underline block text-sm mt-0.5">
                            {e.phone}
                          </a>
                        )}
                      </td>
                      {/* Enquiry = type badge + car interest stacked */}
                      <td className={`${cell} max-w-[180px]`}>
                        <span className={`inline-block text-sm font-medium px-2.5 py-1 ${TYPE_BADGE[e.type] ?? TYPE_BADGE.General}`}>
                          {e.type}
                        </span>
                        <p className="text-text-muted dark:text-neutral-200 text-sm mt-1.5 truncate">
                          {e.car ?? <span className="text-text-subtle">—</span>}
                        </p>
                      </td>
                      {/* Message */}
                      <td className={`${cell} max-w-[280px]`}>
                        <p className="line-clamp-2 leading-snug text-text-muted dark:text-neutral-200">{e.message}</p>
                      </td>
                      {/* Status */}
                      <td className={cell}>
                        <StatusSelect id={e.id} current={e.status} />
                      </td>
                      {/* View details icon */}
                      <td className={`${cell} border-r text-right whitespace-nowrap`}>
                        <Link
                          href={`/admin/enquiries/${e.id}`}
                          aria-label="View details"
                          title="View details"
                          className="inline-flex h-9 w-9 items-center justify-center border border-border text-text-muted hover:text-brand hover:border-brand hover:bg-brand/5 transition-colors"
                        >
                          {EyeIcon}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}
