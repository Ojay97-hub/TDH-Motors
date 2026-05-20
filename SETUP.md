# TDH Motors — Setup

End-to-end first-run guide for the **Sanity (content) + Supabase (leads) + Next.js (glue)** admin stack described in [`.cursor/plans/admin_system_plan_26eecce9.plan.md`](.cursor/plans/admin_system_plan_26eecce9.plan.md).

The order below matters — each step assumes the previous one is done.

---

## 0. Prerequisites

- Node 20+ and npm
- A free [Sanity](https://www.sanity.io/) account
- A free [Supabase](https://supabase.com/) account
- (Optional, only for fastest Supabase workflow) the Supabase CLI: `npm i -g supabase`

---

## 1. Install dependencies

The plan adds a few packages on top of what's in [`package.json`](package.json) today:

```bash
npm install zod @supabase/supabase-js @supabase/ssr
npm install -D tsx
```

| Package | Why |
|---------|-----|
| `zod` | Request-body validation in `/api/enquiries` |
| `@supabase/supabase-js` | Service-role client for inserts |
| `@supabase/ssr` | Cookie-based auth client for `/admin` — note Next 16's `cookies()` is async |
| `tsx` | Runs `scripts/seed-sanity.ts` without a separate build step |

`sanity@5.25.1`, `next-sanity@12.4.5`, and `@sanity/image-url` are already installed.

---

## 2. Create the Sanity project

From the repo root:

```bash
npx sanity@latest init --env
```

The wizard will:

1. Ask you to log in (browser opens).
2. Offer to create a new project — pick a name like `tdh-motors`.
3. Use the dataset name `production`.
4. Write `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to `.env.local` automatically.

**Then** create a write token for the seed script:

1. https://www.sanity.io/manage → your project → **API** → **Tokens** → **Add API token**
2. Name: `seed-script`, Permissions: **Editor**
3. Copy the token into `.env.local` as `SANITY_API_WRITE_TOKEN=...`

Add this token's CORS origin too (Project → API → CORS origins): `http://localhost:3000` with credentials enabled, so the embedded `/studio` page can talk to the dataset.

---

## 3. Seed the existing 7 cars

Once the schemas are in place (Phase 1 of the plan):

```bash
npm run seed
```

This reads the array in [`src/lib/cars.ts`](src/lib/cars.ts), uploads each Unsplash image as a Sanity asset, and creates one `car` document per entry. **Run it once.** Re-running creates duplicates unless we add an upsert by slug — easy to add if needed.

After it finishes, visit `http://localhost:3000/studio` to confirm 7 cars are present.

---

## 4. Create the Supabase project

1. Go to https://supabase.com/dashboard → **New project**.
2. Name it `tdh-motors`. Region: closest to your client. Save the database password somewhere safe.
3. Wait ~2 minutes for provisioning.
4. Open **Project Settings → API**. Copy these three values into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...      # public, fine in browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # SECRET — server only, never NEXT_PUBLIC_
```

---

## 5. Apply the database schema

The schema lives in `supabase/migrations/0001_init.sql` (created during Phase 3). Two options:

**Option A — Supabase CLI (preferred for repeatability):**

```bash
supabase login
supabase link --project-ref <your-ref>     # <ref> is in your project URL
supabase db push
```

**Option B — Dashboard SQL editor:**

1. Open the project → **SQL Editor** → **New query**.
2. Paste the contents of `supabase/migrations/0001_init.sql`.
3. Run.

The migration creates `enquiries` and `bookings` tables, enables RLS, and adds policies (deny-by-default; service role bypasses RLS for inserts; authenticated users can read/update).

---

## 6. Create the admin user

Supabase Dashboard → **Authentication → Users → Add user → Create new user**.

- Email: your client's address (or yours during testing)
- Password: set a strong one and share via a password manager

They will sign in at `/admin/login`. There are no public sign-ups.

---

## 7. Run the site

```bash
npm run dev
```

| URL | Who | What |
|-----|-----|------|
| `http://localhost:3000` | Public | Site |
| `http://localhost:3000/studio` | Client (Sanity login) | Edit cars + marketing copy |
| `http://localhost:3000/admin/login` | Client (Supabase login) | View enquiries + bookings |

Submit a test enquiry from the contact form — it should appear in the `/admin` dashboard within seconds.

---

## 8. Deploy (Vercel)

1. `vercel link` and `vercel` from the repo root.
2. In the Vercel dashboard → **Settings → Environment Variables**, set everything from `.env.local` **except `SANITY_API_WRITE_TOKEN`** (that's local-only for the seed script).
3. In Sanity Dashboard → **API → CORS origins**, add your production URL with credentials enabled.
4. In Supabase Dashboard → **Authentication → URL Configuration**, add your production URL to the redirect allow list.

---

## `.env.local` — full list

```
# --- Sanity ---
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=          # optional, for draft preview later
SANITY_API_WRITE_TOKEN=         # LOCAL ONLY — used by `npm run seed`

# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # SECRET — never expose to the browser

# --- App ---
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # used by revalidate webhook
SANITY_REVALIDATE_SECRET=       # any random string; set the same value in the Sanity webhook
```

A copyable `.env.example` with these keys (no values) is added during Phase 1.

---

## Client handoff checklist

When the work is done, send the client:

- [ ] Their Sanity login email + invite link (Project → Members → Invite)
- [ ] Their Supabase login email + the `/admin/login` URL
- [ ] A short Loom or video showing: "Add a car", "Mark a car as sold", "Check a new enquiry", "Mark an enquiry as contacted"
- [ ] A note that secret keys are managed in Vercel — they never need to touch them

---

## Things that are NOT in scope yet (future work)

- Email notification on new enquiry (Resend integration — ~30 lines once the route handler exists)
- Calendar-style booking with preferred date/time validation
- Analytics dashboard (lead conversion, top cars by enquiry count)
- Privacy / Terms pages — footer links exist but routes are missing
