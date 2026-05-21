import { redirect } from "next/navigation";
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

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {children}
    </div>
  );
}
