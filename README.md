# TDH Motors — Developer README

Next.js 16 + Sanity v5 + Supabase dealer site with embedded CMS and leads dashboard.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS v4 |
| CMS / Inventory | Sanity v5 + next-sanity v12 (embedded Studio at `/studio`) |
| Database / Auth | Supabase (Postgres + Supabase Auth) — Phase 3+ |
| Deployment | Vercel (Phase 5) |

---

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in real values
cp .env.example .env

# 3. Start the dev server
npm run dev          # → http://localhost:3000

# 4. (Optional) Open the embedded Sanity Studio
# Navigate to http://localhost:3000/studio
# You must be a member of the Sanity project to log in.
# If you see "Not authorised", go to sanity.io/manage → Members and add your account.

# 5. (Optional) Seed Sanity with the 7 demo cars
npm run seed
```

### Required env vars

See [.env.example](.env.example) for the full list. The essentials for local dev:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=     # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=            # Editor token — used only by npm run seed
```

---

## npm scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Next.js dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run studio` | Standalone Sanity Studio (separate from Next, useful for schema work) |
| `npm run seed` | One-shot: seeds 7 demo cars into Sanity (fetches Unsplash images, uploads as assets, uses `createOrReplace` so it's safe to re-run) |
| `npm run lint` | ESLint |

---

## Project phases

### Phase 1 — Sanity inventory CMS `DONE`

Client can add, edit, and mark cars as sold/reserved without touching code.

- Sanity project wired up (`sanity.config.ts`, `sanity/schemas/car.ts`)
- Embedded Studio at `/studio` (route group keeps it separate from site chrome)
- `src/lib/cars.ts` refactored to async Sanity fetchers with ISR (`revalidate: 60`, cache tag `car`)
- `src/sanity/` — client, image URL builder, GROQ queries
- Inventory page, car detail page, and homepage featured cars all read from Sanity
- Seed script migrates the 7 original hardcoded cars as Sanity documents
- `.env.example` documents all required keys

**Note on status badges:** Changing a car's status in Studio updates the detail page within 60 seconds (ISR revalidation). On-demand revalidation via webhook is Phase 5.

---

### Phase 2 — Marketing content in Sanity `TODO`

Client edits contact details, services copy, homepage, and Who We Are without a deploy.

- Add singleton schemas: `siteSettings`, `homePage`, `servicesPage`, `whoWeArePage`
- Replace hardcoded content in `src/app/page.tsx`, `src/app/services/page.tsx`, `src/app/who-we-are/page.tsx`, `src/app/contact/page.tsx`
- Pull footer contact details and site metadata from `siteSettings`

---

### Phase 3 — Supabase enquiry capture `TODO`

Contact form persists leads to a database.

- `supabase/migrations/0001_init.sql` — `enquiries` table, RLS, policies
- `src/app/api/enquiries/route.ts` — POST handler with zod validation, service-role insert
- Wire `src/components/contact-form.tsx` to the API route
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

### Phase 4 — Protected `/admin` leads dashboard `TODO`

Dealer staff log in to view and update enquiries. Separate from Sanity login.

- `src/proxy.ts` (Next 16 — **not** `middleware.ts`) — protect `/admin/*` routes
- `/admin/login`, `/admin` leads list with status workflow
- Supabase Auth (`@supabase/ssr`) — `cookies()` is async in Next 16, must `await` it
- Invite client as Supabase Auth user; document credentials securely

---

### Phase 5 — Production polish `TODO`

- Sanity revalidate webhook → `POST /api/revalidate` for instant cache busting on publish
- Vercel: set all env vars in project settings (never commit `.env`)
- Add client as Sanity project member so they can use `/studio` after deploy
- Privacy/Terms pages (footer links exist, routes missing)
- Optional: Resend email alert on new enquiry

---

## Key conventions (Next.js 16)

These differ from older Next.js and will cause bugs if ignored:

- **`params` is a Promise** — always `const { slug } = await params` in page components
- **`cookies()` is async** — `const cookieStore = await cookies()` in server utilities
- **`middleware.ts` is renamed to `proxy.ts`** — do not create `middleware.ts`
- **`PageProps<'/route/[slug]'>`** is available globally for typed dynamic params

---

## Architecture diagram

```
Dealer staff
  ├── /studio  →  Sanity Studio  →  Sanity Content Lake
  └── /admin   →  Leads dashboard  →  Supabase Postgres

Site visitor
  ├── Public pages  →  Next.js (reads from Sanity CDN via ISR)
  └── Contact form  →  POST /api/enquiries  →  Supabase Postgres
```
