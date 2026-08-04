import { SocialPlatformIcon } from "@/components/social-icons";
import { SOCIAL_ACCOUNTS } from "@/lib/social";

/**
 * Fixed social badges pinned to the right edge, vertically centred.
 *
 * Hidden below `lg` so it never sits on top of content on phones and tablets —
 * the footer icons cover small screens. It is also kept clear of the fixed
 * theme toggle in the bottom-right corner of the site layout.
 */
export function SocialRail() {
  return (
    <nav
      aria-label="Social media"
      className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col border border-r-0 border-border bg-surface/85 backdrop-blur-sm shadow-lg"
    >
      {SOCIAL_ACCOUNTS.map((account) => (
        <a
          key={account.platform}
          href={account.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${account.platform} — ${account.handle}`}
          title={`${account.platform} — ${account.handle}`}
          className="group relative flex items-center justify-center w-12 h-12 text-text-muted hover:text-on-brand hover:bg-brand transition-colors duration-200 border-b border-border last:border-b-0"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            <SocialPlatformIcon platform={account.platform} size={18} />
          </span>

          {/* Handle slides out to the left on hover */}
          <span className="pointer-events-none absolute right-full mr-0 whitespace-nowrap bg-brand text-on-brand text-xs tracking-wide px-3 py-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
            {account.handle}
          </span>
        </a>
      ))}
    </nav>
  );
}
