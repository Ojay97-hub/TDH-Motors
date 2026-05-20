function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || v === "") {
    throw new Error(errorMessage);
  }
  return v;
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID — copy it from sanity.io/manage into .env",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing env: NEXT_PUBLIC_SANITY_DATASET (usually 'production')",
);

export const apiVersion = "2025-05-20";
