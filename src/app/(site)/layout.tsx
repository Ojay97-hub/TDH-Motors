import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialRail } from "@/components/social-rail";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisualEditingControls } from "@/components/visual-editing";
import { SanityLive } from "@/sanity/live";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SocialRail />
      <SiteFooter />
      <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border shadow-lg rounded-full">
        <ThemeToggle />
      </div>
      <VisualEditingControls />
      <SanityLive />
    </>
  );
}
