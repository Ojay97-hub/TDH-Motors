import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

function getSafeRedirect(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");

  if (!redirectTo) {
    return new URL("/", url.origin);
  }

  try {
    const target = new URL(redirectTo, url.origin);
    if (target.origin !== url.origin) {
      return new URL("/", url.origin);
    }
    return target;
  } catch {
    return new URL("/", url.origin);
  }
}

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(getSafeRedirect(request));
}
