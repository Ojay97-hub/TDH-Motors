import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env");

export function loadLocalEnv() {
  try {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trim();
    }
  } catch {
    // .env optional
  }
}

export function getSanityWriteConfig() {
  loadLocalEnv();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

  if (!projectId || !dataset || !token) {
    throw new Error(
      "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN.",
    );
  }

  const forceProduction =
    process.env.FORCE_PROD_MUTATION === "true" ||
    process.argv.includes("--confirm-production");

  if (dataset === "production" && !forceProduction) {
    throw new Error(
      'Refusing to mutate Sanity dataset "production". Set FORCE_PROD_MUTATION=true or pass --confirm-production to proceed.',
    );
  }

  return { projectId, dataset, token };
}
