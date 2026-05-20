import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border shadow-lg rounded-full">
        <ThemeToggle />
      </div>
    </>
  );
}
