import { createServiceClient } from "@/lib/supabase-server";
import { createAuthServerClient } from "@/lib/supabase-ssr";
import { StatusSelect } from "../_components/StatusSelect";
import { SignOutButton } from "../_components/SignOutButton";

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
  Viewing: "bg-brand/10 text-brand",
  "Part-Exchange": "bg-accent/10 text-accent",
  "Bespoke Sourcing": "bg-purple-100 text-purple-700",
  General: "bg-bg-elevated text-text-muted",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminPage() {
  const [supabaseAuth, supabaseService] = await Promise.all([
    createAuthServerClient(),
    Promise.resolve(createServiceClient()),
  ]);

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  const { data: enquiries } = await supabaseService
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (enquiries ?? []) as Enquiry[];

  const counts = rows.reduce(
    (acc, e) => {
      acc.total++;
      if (e.status === "new") acc.new++;
      else if (e.status === "contacted") acc.contacted++;
      else if (e.status === "completed") acc.completed++;
      else if (e.status === "closed") acc.closed++;
      return acc;
    },
    { total: 0, new: 0, contacted: 0, completed: 0, closed: 0 }
  );

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
            <span className="text-sm text-text-muted hidden sm:block">
              {user?.email}
            </span>
            <a
              href="/"
              className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block"
            >
              ← Back to site
            </a>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-text mb-6">Enquiries</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, style: "text-text" },
            { label: "New", value: counts.new, style: "text-brand" },
            { label: "Contacted", value: counts.contacted, style: "text-accent" },
            {
              label: "Done",
              value: counts.completed + counts.closed,
              style: "text-text-muted",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <p className="text-xs uppercase tracking-wider text-text-subtle mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.style}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {rows.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-subtle">
            No enquiries yet.
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated">
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Car interest
                    </th>
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Message
                    </th>
                    <th className="text-left px-4 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-bg-elevated transition-colors"
                    >
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {formatDate(e.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-text whitespace-nowrap">
                        {e.name}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${e.email}`}
                          className="text-brand hover:underline block"
                        >
                          {e.email}
                        </a>
                        {e.phone && (
                          <a
                            href={`tel:${e.phone}`}
                            className="text-text-muted hover:underline block text-xs mt-0.5"
                          >
                            {e.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_BADGE[e.type] ?? TYPE_BADGE.General}`}
                        >
                          {e.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted max-w-[140px] truncate">
                        {e.car ?? <span className="text-text-subtle">—</span>}
                      </td>
                      <td className="px-4 py-3 text-text-muted max-w-[220px]">
                        <p className="line-clamp-2 leading-snug">{e.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect id={e.id} current={e.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
