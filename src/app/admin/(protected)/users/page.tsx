import { createAuthServerClient } from "@/lib/supabase-ssr";
import { createServiceClient } from "@/lib/supabase-server";
import Link from "next/link";
import { SignOutButton } from "../../_components/SignOutButton";
import { InviteUserForm } from "../../_components/InviteUserForm";
import { DeleteUserButton } from "../../_components/DeleteUserButton";
import { EditEmailForm } from "../../_components/EditEmailForm";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function UsersPage() {
  const [supabaseAuth, supabaseService] = await Promise.all([
    createAuthServerClient(),
    Promise.resolve(createServiceClient()),
  ]);

  const {
    data: { user: currentUser },
  } = await supabaseAuth.auth.getUser();

  const { data, error } = await supabaseService.auth.admin.listUsers();
  if (error) throw new Error("Failed to load users");

  const users = data.users.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-bold tracking-wider uppercase text-text hover:text-brand transition-colors"
            >
              TDH Motors
            </Link>
            <span className="text-xs font-medium bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted hidden sm:block">
              {currentUser?.email}
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

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-text mb-6">User Management</h1>

        <InviteUserForm />

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-text">
              Admin Users
              <span className="ml-2 text-xs font-normal text-text-muted">
                ({users.length})
              </span>
            </h2>
          </div>

          {users.length === 0 ? (
            <p className="px-6 py-8 text-sm text-text-subtle text-center">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated">
                    <th className="text-left px-6 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Invited
                    </th>
                    <th className="text-left px-6 py-3 text-text-subtle font-medium uppercase tracking-wider text-xs">
                      Last sign in
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => {
                    const isCurrentUser = u.id === currentUser?.id;
                    const isPending = !u.last_sign_in_at;

                    return (
                      <tr key={u.id} className="hover:bg-bg-elevated transition-colors">
                        <td className="px-6 py-4">
                          <EditEmailForm userId={u.id} currentEmail={u.email ?? ""} />
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-text-subtle">(you)</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                              isPending
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isPending ? "Pending" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                          {formatDate(u.created_at)}
                        </td>
                        <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                          {formatDate(u.last_sign_in_at ?? null)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!isCurrentUser && (
                            <DeleteUserButton userId={u.id} email={u.email ?? u.id} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
