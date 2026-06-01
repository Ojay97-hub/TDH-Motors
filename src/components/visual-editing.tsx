import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

export async function VisualEditingControls() {
  const draft = await draftMode();

  if (!draft.isEnabled) {
    return null;
  }

  return <VisualEditing />;
}
