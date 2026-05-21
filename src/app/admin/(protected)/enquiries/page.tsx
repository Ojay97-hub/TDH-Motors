import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";
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
  Viewing: "bg-brand/10 text-brand border border-brand/20",
  "Part-Exchange": "bg-accent/10 text-accent border border-accent/20",
  "Bespoke Sourcing": "bg-purple-100 text-purple-700 border border-purple-200",
  General: "bg-bg-elevated text-text-muted border border-border",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = typeof filter === "string" ? filter : "all";

  const [supabaseAuth, supabaseService] = await Promise.all([
    createAuthServerClient(),
    Promise.resolve(createServiceClient()),
  ]);

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

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
    { label: "Total", value: counts.total, style: "text-text", filter: "all" },
    { label: "New", value: counts.new, style: "text-brand", filter: "new" },
    { label: "Contacted", value: counts.contacted, style: "text-accent", filter: "contacted" },
    { label: "Done", value: counts.done, style: "text-text-muted", filter: "done" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="font-bold tracking-wider uppercase text-text hover:text-brand transition-colors"
            >
              TDH Motors
            </a>
            <span className="text-xs font-medium bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-text-muted hidden sm:block">
              {user?.email}
            </span>
            <a
              href="/admin"
              className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block"
            >
              ← Dashboard
            </a>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-text mb-6">Enquiries</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const isActive = activeFilter === stat.filter;
            const href =
              stat.filter === "all"
                ? "/admin/enquiries"
                : `/admin/enquiries?filter=${stat.filter}`;
            return (
              <a
                key={stat.label}
                href={href}
                className={`bg-surface border rounded-xl p-4 transition-all hover:bg-bg-elevated ${
                  isActive
                    ? "border-brand ring-1 ring-brand/30"
                    : "border-border"
                }`}
              >
                <p className="text-xs uppercase tracking-wider text-text-subtle mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.style}`}>{stat.value}</p>
              </a>
            );
          })}
        </div>

        {/* Active filter indicator */}
        {activeFilter !== "all" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-text-muted">
              Showing:{" "}
              <span className="font-medium text-text capitalize">{activeFilter}</span>
            </span>
            <a
              href="/admin/enquiries"
              className="text-xs text-text-muted hover:text-text underline underline-offset-2"
            >
              Clear filter
            </a>
          </div>
        )}

        {/* Table */}
        {filteredRows.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-subtle">
            No {activeFilter !== "all" ? `"${activeFilter}" ` : ""}enquiries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Date</th>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Name</th>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Contact</th>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Type</th>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Car interest</th>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Message</th>
                  <th className="text-left px-5 py-2 text-text-subtle font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-5 py-2" />
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((e) => {
                  const cell = "border-t border-b border-border bg-surface px-5 py-4 align-middle";
                  return (
                    <tr key={e.id} className="hover:brightness-[0.97] transition-all">
                      <td className={`${cell} rounded-l-xl border-l whitespace-nowrap text-text-muted`}>
                        {formatDate(e.created_at)}
                      </td>
                      <td className={`${cell} font-semibold text-text whitespace-nowrap`}>
                        {e.name}
                      </td>
                      <td className={cell}>
                        <a href={`mailto:${e.email}`} className="text-brand hover:underline block">
                          {e.email}
                        </a>
                        {e.phone && (
                          <a href={`tel:${e.phone}`} className="text-text-muted hover:underline block text-xs mt-0.5">
                            {e.phone}
                          </a>
                        )}
                      </td>
                      <td className={cell}>
                        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_BADGE[e.type] ?? TYPE_BADGE.General}`}>
                          {e.type}
                        </span>
                      </td>
                      <td className={`${cell} text-text-muted max-w-[140px] truncate`}>
                        {e.car ?? <span className="text-text-subtle">—</span>}
                      </td>
                      <td className={`${cell} text-text-muted max-w-[220px]`}>
                        <p className="line-clamp-2 leading-snug">{e.message}</p>
                      </td>
                      <td className={`${cell} pr-8`}>
                        <StatusSelect id={e.id} current={e.status} />
                      </td>
                      <td className={`${cell} rounded-r-xl border-r whitespace-nowrap`}>
                        <a
                          href={`/admin/enquiries/${e.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-colors"
                        >
                          View details
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
