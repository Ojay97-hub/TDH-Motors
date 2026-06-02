"use client";

import { EyeOpenIcon } from "@sanity/icons";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { usePresentationNavigate } from "sanity/presentation";

/**
 * `usePresentationNavigate` throws when there's no Presentation context (e.g. the
 * same document opened in Structure). Document actions render in every tool, so
 * we swallow that and return null — the action then only shows in Presentation,
 * where driving the inline preview iframe actually makes sense. The hook order
 * is stable (the underlying `useContext` always runs first), so catching the
 * post-context throw is safe.
 */
function useSafePresentationNavigate() {
  try {
    return usePresentationNavigate();
  } catch {
    return null;
  }
}

/**
 * Adds a "View detail page" action to car documents in Presentation. Clicking it
 * points the live preview at `/inventory/<slug>`; because the preview runs in
 * draft mode, you see the unpublished content exactly as it will look once live.
 */
export const ViewDetailPageAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const navigate = useSafePresentationNavigate();
  if (!navigate) return null;

  const slugField = ((props.draft ?? props.published)?.slug ?? null) as
    | { current?: string }
    | null;
  const slug = slugField?.current;

  return {
    label: "View detail page",
    icon: EyeOpenIcon,
    disabled: !slug,
    title: slug
      ? "Open this car's detail page in the live preview"
      : "Add a URL slug first",
    onHandle: () => {
      if (slug) navigate(`/inventory/${slug}`);
      props.onComplete();
    },
  };
};
