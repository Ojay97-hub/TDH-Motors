import Image from "next/image";
import { Play } from "lucide-react";
import { SocialPlatformIcon } from "@/components/social-icons";
import { normalizeCmsHref } from "@/lib/urls";

export type SocialPost = {
  platform?: string;
  caption?: string;
  postUrl?: string;
  image?: string;
  videoFile?: string;
};

/**
 * Instagram-style square grid of social posts. Each tile links out to the real
 * post, so the section stays in sync with the accounts without an API token or
 * a paid embed widget — the editor uploads the still/clip and pastes the link.
 *
 * Tiles with an unsafe or missing post URL still render, just as static media
 * rather than links.
 */
export function SocialFeedGrid({ posts }: { posts: SocialPost[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {posts.map((post, i) => {
        const href = normalizeCmsHref(post.postUrl);
        const isVideo = Boolean(post.videoFile) && !post.image;

        const tile = (
          <>
            <div className="relative aspect-square overflow-hidden bg-bg">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.caption || `${post.platform ?? "Social"} post`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : post.videoFile ? (
                <video
                  src={post.videoFile}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={post.caption || "Social video"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}

              {/* Platform badge — sits above the media, out of the hover scale */}
              <div className="absolute top-3 right-3 text-white/90 drop-shadow-md">
                <SocialPlatformIcon platform={post.platform} size={18} />
              </div>

              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black/45 text-white backdrop-blur-sm">
                    <Play size={18} fill="currentColor" />
                  </span>
                </div>
              )}

              {post.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs leading-relaxed line-clamp-3">{post.caption}</p>
                </div>
              )}
            </div>
          </>
        );

        return href ? (
          <a
            key={`${post.postUrl ?? post.caption ?? "post"}-${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-border hover:border-brand transition-colors overflow-hidden"
          >
            {tile}
          </a>
        ) : (
          <div
            key={`${post.caption ?? "post"}-${i}`}
            className="group block border border-border overflow-hidden"
          >
            {tile}
          </div>
        );
      })}
    </div>
  );
}
