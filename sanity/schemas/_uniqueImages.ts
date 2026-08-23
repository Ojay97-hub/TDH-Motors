import type { CustomValidator } from "sanity";

type ImageArrayItem = {
  _key?: string;
  asset?: { _ref?: string };
};

/**
 * Flags photos that are already attached to the same document.
 *
 * Sanity's image input gives no indication that a file is already in the array,
 * so dragging the same batch in twice silently attaches every photo again and
 * the gallery shows each shot twice. It's easily done and easily missed —
 * two cars had picked up duplicates this way before this check existed.
 *
 * Deliberately a warning, not an error: repeating a photo is untidy rather
 * than wrong, and an error would block publishing over something cosmetic.
 * The returned `paths` make Studio highlight the offending items.
 *
 * Pair with `scripts/dedupe-car-images.mjs`, which clears up existing repeats.
 */
export const noDuplicateImages: CustomValidator<ImageArrayItem[] | undefined> = (images) => {
  const seen = new Set<string>();
  const repeats: string[] = [];

  for (const item of Array.isArray(images) ? images : []) {
    const ref = item?.asset?._ref;
    // Entries still awaiting an upload aren't duplicates of anything.
    if (!ref) continue;
    if (seen.has(ref)) {
      if (item._key) repeats.push(item._key);
    } else {
      seen.add(ref);
    }
  }

  if (repeats.length === 0) return true;

  return {
    message:
      repeats.length === 1
        ? "This photo is already attached to this car — remove the highlighted duplicate."
        : `${repeats.length} of these photos are already attached to this car — remove the highlighted duplicates.`,
    paths: repeats.map((key) => [{ _key: key }]),
  };
};
