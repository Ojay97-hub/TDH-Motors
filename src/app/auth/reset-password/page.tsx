import { requestPasswordReset } from "./actions";

export const metadata = { title: "Reset Password | TDH Motors" };

type Props = { searchParams: Promise<{ sent?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { sent } = await searchParams;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-xl font-bold tracking-wider uppercase text-text">
            TDH Motors
          </span>
          <p className="text-text-muted text-sm mt-1 tracking-widest uppercase">Admin</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          {sent ? (
            <>
              <h1 className="text-lg font-semibold text-text mb-2">Check your email</h1>
              <p className="text-sm text-text-muted mb-6">
                If that address is registered, you&apos;ll receive a password reset link shortly.
              </p>
              <a
                href="/admin/login"
                className="block text-center text-sm text-brand hover:text-brand-dark transition-colors"
              >
                Back to sign in
              </a>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-text mb-2">Forgot password?</h1>
              <p className="text-sm text-text-muted mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form action={requestPasswordReset} className="space-y-4">
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

                <button
                  type="submit"
                  className="w-full bg-brand text-on-brand font-semibold py-2 rounded-lg text-sm hover:bg-brand-dark transition-colors"
                >
                  Send reset link
                </button>
              </form>

              <a
                href="/admin/login"
                className="block text-center text-sm text-text-muted hover:text-text transition-colors mt-4"
              >
                Back to sign in
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
