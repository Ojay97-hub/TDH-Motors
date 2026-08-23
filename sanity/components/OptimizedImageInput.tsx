import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { InputProps, SchemaType } from "sanity";

/**
 * Shrinks oversized photos in the browser before Studio uploads them.
 *
 * Cameras and modern phones produce 20+ megapixel JPEGs — around 11MB each — and
 * a single car listing carries a dozen or more. That's ~175MB per car crawling
 * up a domestic broadband connection, and it's stored forever. The public site
 * never needs it: Sanity resizes on delivery and nothing on the site renders an
 * image wider than 2048px.
 *
 * Editors shouldn't have to know or care about any of that, so this happens
 * invisibly and drag-and-drop keeps working exactly as before.
 *
 * Safety: every path fails *open*. If a photo can't be decoded, re-encoding
 * fails, or the browser lacks an API we need, the original file is passed
 * through untouched. A failed optimisation must never become a failed upload.
 */

// Comfortably above the 2048px cap in next.config.ts, leaving headroom if the
// site's layouts ever grow.
const MAX_EDGE = 2560;
const JPEG_QUALITY = 0.85;
// Below this, shrinking isn't worth the wait — most already-sized images land here.
const MIN_BYTES = 1_500_000;

const styles = {
  wrapper: { position: "relative" },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 17, 23, 0.82)",
    backdropFilter: "blur(2px)",
    borderRadius: 6,
    color: "#f5f5f5",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    padding: 16,
    pointerEvents: "none",
  },
} satisfies Record<string, CSSProperties>;

/**
 * Only JPEGs are touched. PNG/WebP/GIF/SVG are left alone — they're logos and
 * graphics where transparency matters and re-encoding to JPEG would wreck them.
 * The multi-megabyte offenders are all camera JPEGs.
 */
function shouldDownscale(file: File) {
  return file.type === "image/jpeg" && file.size > MIN_BYTES;
}

async function downscale(file: File): Promise<File> {
  // `from-image` bakes the EXIF rotation into the pixels. Without it, canvas
  // drops the orientation flag and photos shot in portrait come out sideways.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  try {
    const longEdge = Math.max(bitmap.width, bitmap.height);
    if (longEdge <= MAX_EDGE) return file;

    const scale = MAX_EDGE / longEdge;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    // Never hand back something bigger than what we were given.
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}

async function downscaleAll(files: File[]): Promise<File[]> {
  return Promise.all(
    files.map(async (file) => {
      if (!shouldDownscale(file)) return file;
      try {
        return await downscale(file);
      } catch (err) {
        console.warn(`[studio] could not optimise ${file.name}, uploading as-is:`, err);
        return file;
      }
    }),
  );
}

function toFileList(files: File[]) {
  const transfer = new DataTransfer();
  for (const file of files) transfer.items.add(file);
  return transfer;
}

/** Walks the schema type chain so both `image` and any type extending it match. */
function isImageType(schemaType: SchemaType | undefined): boolean {
  for (let type = schemaType; type; type = type.type) {
    if (type.name === "image") return true;
  }
  return false;
}

export function OptimizedImageInput(props: InputProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // `DataTransfer` is what lets us hand rewritten files back to Studio. Without
    // it there's no way to replay the event, so we sit this one out entirely.
    if (typeof DataTransfer === "undefined" || typeof createImageBitmap === "undefined") {
      return;
    }

    // Both handlers run in the capture phase, which fires before Studio's own
    // (React-delegated) handlers get a look in. We stop the original event,
    // shrink the files, then re-dispatch. The replayed event is untrusted, which
    // is exactly how we recognise it on the way back through and let it pass.
    async function onDrop(event: DragEvent) {
      if (!event.isTrusted) return;
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (!files.some(shouldDownscale)) return;

      event.preventDefault();
      event.stopPropagation();
      const target = event.target as HTMLElement | null;
      if (!target) return;

      setBusy(true);
      try {
        const optimised = await downscaleAll(files);
        target.dispatchEvent(
          new DragEvent("drop", {
            dataTransfer: toFileList(optimised),
            bubbles: true,
            cancelable: true,
          }),
        );
      } finally {
        setBusy(false);
      }
    }

    async function onChange(event: Event) {
      if (!event.isTrusted) return;
      const input = event.target as HTMLInputElement | null;
      if (input?.type !== "file") return;
      const files = Array.from(input.files ?? []);
      if (!files.some(shouldDownscale)) return;

      event.stopPropagation();

      setBusy(true);
      try {
        const optimised = await downscaleAll(files);
        input.files = toFileList(optimised).files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      } finally {
        setBusy(false);
      }
    }

    el.addEventListener("drop", onDrop, true);
    el.addEventListener("change", onChange, true);
    return () => {
      el.removeEventListener("drop", onDrop, true);
      el.removeEventListener("change", onChange, true);
    };
  }, []);

  return (
    <div ref={ref} style={styles.wrapper}>
      {props.renderDefault(props)}
      {busy ? <div style={styles.overlay}>Optimising photos...</div> : null}
    </div>
  );
}

/**
 * Studio hands every input in the form through this, so anything that isn't an
 * image is passed straight to the default renderer untouched.
 */
export function renderOptimizedImageInput(props: InputProps) {
  if (!isImageType(props.schemaType)) return props.renderDefault(props);
  return <OptimizedImageInput {...props} />;
}
