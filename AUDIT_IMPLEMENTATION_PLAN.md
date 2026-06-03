# TDH Motors Robustness Implementation Plan

## Priority Fix Plan

## Execution Strategy Notes

- Prefer Supabase Auth `app_metadata.role === "admin"` for admin authorization if roles are already stored there or can be added cleanly. Avoid creating an `admin_users` table unless metadata roles are unavailable, because metadata keeps the role inside the signed session/JWT and avoids an extra lookup on every protected layout or server action.
- Execute the Sanity mutation guard work before frontend/admin fixes. This protects production content before any local testing or accidental script execution.
- When implementing the CMS XSS fix, include the exact URL validation test cases from this document in the same pass as the utility/component changes.

### 1. Admin Authorization Privilege Escalation

- Add a single server-side `requireAdmin()` helper and replace current "any authenticated Supabase user" checks in admin layouts and actions.
- Enforce admin authorization through one explicit source of truth, preferably either:
  - Supabase `app_metadata.role === "admin"` if roles are already stored there.
  - a Supabase `admin_users` table only if metadata roles are not available.
- Apply this guard before all service-role operations, including admin layouts, user management actions, and admin server actions.
- Ensure unauthenticated and non-admin authenticated users are rejected before privileged data is fetched or mutated.

### 2. CMS-Driven XSS

- Add strict frontend validation for CMS-provided hrefs.
- Allow only:
  - internal paths beginning with `/`
  - hash anchors beginning with `#`
  - absolute `http:` and `https:` URLs
  - `mailto:` and `tel:` links
- Render unsafe CMS links as inert text or omit the href entirely.
- Tighten Sanity CTA schema validation so Studio editors cannot save unsafe protocols or broad relative URL values.
- Keep runtime validation even after schema validation, because imports and scripts can bypass Studio rules.

### 3. Production Sanity Mutation Guards

- Remove hard-coded production project and dataset values from mutation scripts.
- Read Sanity project ID and dataset from environment variables.
- Block writes to `production` unless an explicit override is provided.
- Replace aggressive content overwrite behavior in seed scripts with safer defaults.
- Stop automatic deletion of `drafts.*` documents.

### 4. API And Form Robustness

- Wrap enquiry `request.json()` parsing so malformed JSON returns `400` instead of a server error.
- Add bounded, trimmed Zod validation for enquiry payload fields.
- Add a timeout to outbound Brevo email requests.
- Ensure contact form submissions recover from stalled network requests.
- Add visible error handling for password reset and auth callback failures.

### 5. Sanity Fetch And Data Normalization

- Fix `safeSanityFetch` so it forwards supported Sanity and Next options instead of silently dropping values.
- Align the wrapper type signature with the real Sanity client and Next cache options.
- Harden car and merch normalization so missing draft fields, null numbers, and empty arrays cannot crash pages.
- Keep schema validation as a first line of defense, but ensure runtime data normalization remains defensive.

### 6. Client-Side State Handling

- Clamp or reset modal and gallery indexes when live CMS data changes.
- Ensure body scroll locks are always released when a modal closes or its backing item disappears.
- Wrap client-triggered server actions in local error state where they currently throw without recovery.
- Guard `localStorage` usage in `ThemeToggle`.
- Fix unknown enquiry status badge fallback styling.

### 7. Presentation And Configuration Cleanup

- Add visible error and retry behavior for `InventoryNavigator` Sanity listener failures.
- Normalize `previewOrigin` in `sanity.config.ts` to avoid malformed draft-mode URLs from trailing slashes.
- Consider environment-gating `visionTool` if production Studio access is broader than intended.
- Add package scripts for consistent verification, including `typecheck`.

## Public Interfaces And Helpers

- Add a server-side admin authorization helper, for example `requireAdmin()`.
- Add shared CMS URL helpers, for example:
  - `isSafeCmsHref(value: string): boolean`
  - `normalizeCmsHref(value?: string): string | null`
- Update `safeSanityFetch` option types to match the supported Sanity and Next cache APIs.
- Add script safety flags or environment overrides:
  - `FORCE_PROD_MUTATION=true`
  - optionally `--confirm-production`
  - optionally `--force-overwrite`
  - optionally `--delete-drafts`
  - optionally `--fill-empty`

## Test Plan

- Unit-test CMS URL validation against safe and unsafe hrefs:
  - `/contact`
  - `#section`
  - `https://example.com`
  - `mailto:test@example.com`
  - `tel:+441234567890`
  - `javascript:alert(1)`
  - `data:text/html,...`
  - protocol-relative URLs if rejected.
- Unit-test car normalization with missing draft fields:
  - missing `highlights`
  - missing images
  - null numeric fields
  - empty or malformed Sanity references.
- API-test the enquiry route:
  - malformed JSON returns `400`
  - oversized strings return `400`
  - whitespace-only required fields return `400`
  - Brevo timeout does not leave the request hanging.
- Authorization-test admin access:
  - unauthenticated users are denied
  - authenticated non-admin users are denied
  - explicit admins are allowed.
- Script-test Sanity mutation guards with a mocked client:
  - production requires explicit confirmation
  - seed does not overwrite curated fields by default
  - drafts are not deleted by default
  - merch ID migration patches every referencing document
  - backfills handle missing and empty arrays deterministically.
- Manually verify:
  - Studio Presentation inventory loads, edits, deletes with confirmation, and recovers from listener failure
  - contact form recovers after a simulated network stall
  - draft-mode and cache revalidation behavior still work after `safeSanityFetch` changes.

## Assumptions

- Admin access should be restricted to an explicit admin role or allowlist, not any authenticated Supabase user.
- CMS schema validation is helpful but not sufficient; runtime guards remain required.
- Seed and migration scripts should default to non-destructive behavior.
- Production Sanity mutations should require explicit confirmation.
- Fixes should be implemented incrementally in priority order, with tests added alongside each group.
- This plan is documentation-only; no source-code fixes are included in this file.

## Ready-To-Use Implementation Prompts

### Prompt 1: Admin Authorization Privilege Escalation

We need to fix the Admin Authorization Privilege Escalation.

Target files:

- `src/app/admin/(protected)/layout.tsx`
- `src/app/admin/(protected)/users/actions.ts`
- `src/app/admin/actions.ts`

Modify these files so that after invoking `supabase.auth.getUser()`, the code queries the `admin_users` table (or checks user app_metadata if roles are stored there) to confirm the logged-in user explicitly has an `admin` role. If they do not, reject the server action immediately or trigger a redirect to `/admin/login` within the layout. Show me the structural changes before applying them.

### Prompt 2: CMS-Driven XSS

We need to close the CMS-driven XSS vulnerability.

Target files:

- `src/components/cta-link.tsx`
- `sanity/schemas/_ctaLink.ts`

1. In the frontend component (`cta-link.tsx`), rewrite the path evaluation. Explicitly match safe internal paths starting with `/` or `#`, and valid external protocols: `http:`, `https:`, `mailto:`, `tel:`. If a link contains `javascript:` or other unapproved protocols, fall back to rendering a safe `<span>` or drop the href entirely.
2. In the Sanity schema (`_ctaLink.ts`), replace `allowRelative: true` with a custom validation rule that ensures editors can only input valid web protocols or strict relative paths.

### Prompt 3: Production Sanity Dataset Protection

We need to protect our production Sanity datasets from accidental local execution.

Target files:

- `sanity.config.ts`
- `scripts/seed-content.mjs`
- `scripts/backfill-homepage-lists.mjs`
- `scripts/fix-merch-ids.mjs`

1. Update the scripts to read the target project ID and dataset dynamically from environment variables.
2. Add a strict guard: if the dataset evaluates to `production`, throw an explicit error and halt execution immediately.
3. Require a specific CLI flag or environment variable override, for example `FORCE_PROD_MUTATION=true`, before allowing any write, patch, or deletion command to execute against production.
4. Modify `seed-content.mjs` to use `setIfMissing` instead of an aggressive `.set()` that overwrites existing data, and remove the automatic deletion of `drafts.*` documents.
