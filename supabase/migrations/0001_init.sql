create table if not exists enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  car         text,
  type        text not null default 'General',
  message     text not null,
  status      text not null default 'new'
);

alter table enquiries enable row level security;

-- Service role bypasses RLS by default, so no insert policy is needed for the API.
-- This policy lets the admin dashboard (Phase 4) read all rows via service role.
-- Anon users have no access.
create policy "service role full access"
  on enquiries
  as permissive
  for all
  to service_role
  using (true)
  with check (true);
