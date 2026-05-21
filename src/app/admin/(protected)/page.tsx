import { createAuthServerClient } from "@/lib/supabase-ssr";
import Link from "next/link";
import { SignOutButton } from "../_components/SignOutButton";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminDashboardPage() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
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
            <ThemeToggle />
            <span className="text-sm text-text-muted hidden sm:block">
              {user?.email}
            </span>
            <Link
              href="/"
              className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block"
            >
              ← Back to site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-text-muted mb-10">Welcome back, {user?.email}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* User Management */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-text mb-1">User Management</h2>
              <p className="text-sm text-text-muted leading-snug">
                Manage admin accounts and access permissions.
              </p>
            </div>
            <Link
              href="/admin/users"
              className="inline-flex items-center justify-center rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 hover:bg-brand/90 transition-colors"
            >
              Manage Users
            </Link>
          </div>

          {/* Sanity Studio */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-text mb-1">Sanity Studio</h2>
              <p className="text-sm text-text-muted leading-snug">
                Edit site content, car listings, and marketing copy.
              </p>
            </div>
            <a
              href="https://www.sanity.io/@oIYAL9sDV/studio/bwp3bixqbg6nz5vosnu0osa6/tdh-motors/structure"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent/90 transition-colors"
            >
              Open Studio
            </a>
          </div>

          {/* View Enquiries */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-text mb-1">Enquiries</h2>
              <p className="text-sm text-text-muted leading-snug">
                View and manage customer booking enquiries.
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center justify-center rounded-lg border border-border text-text text-sm font-medium px-4 py-2 hover:bg-bg-elevated transition-colors"
            >
              View Enquiries
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
