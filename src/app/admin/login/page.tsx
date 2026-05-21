import { signIn } from "./actions";

export const metadata = { title: "Admin Login | TDH Motors" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-xl font-bold tracking-wider uppercase text-text">
            TDH Motors
          </span>
          <p className="text-text-muted text-sm mt-1 tracking-widest uppercase">
            Admin
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          <h1 className="text-lg font-semibold text-text mb-6">Sign in</h1>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              Invalid email or password. Please try again.
            </p>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-muted mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-muted mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand text-on-brand font-semibold py-2 rounded-lg text-sm hover:bg-brand-dark transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
