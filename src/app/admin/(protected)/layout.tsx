import { requireAdmin } from "@/lib/admin-auth";
import { createAuthServerClient } from "@/lib/supabase-ssr";

export const metadata = { title: "Admin | TDH Motors" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await requireAdmin(user);

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {children}
    </div>
  );
}
