// Break-glass: grant admin access to a user without needing to be logged in.
//
//   npm run grant-admin -- someone@example.com
//   npm run grant-admin -- someone@example.com "TempPass123"   (creates them if new)
//
// Uses the service-role key from .env, so it works even when nobody can sign in.
// Admin access on TDH Motors is driven solely by app_metadata.role === "admin".

import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3]; // optional — only used when creating a new user

if (!email) {
  console.error("Usage: npm run grant-admin -- <email> [password-to-create-if-new]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with: node --env-file=.env ..."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function findUserByEmail(targetEmail) {
  // listUsers is paginated (50/page by default); walk pages until found or done.
  for (let page = 1; page < 100; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (match) return match;
    if (data.users.length < 200) return null; // last page reached
  }
  return null;
}

const existing = await findUserByEmail(email);

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, {
    app_metadata: { role: "admin" },
  });
  if (error) {
    console.error(`Failed to grant admin to ${email}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✅ Granted admin to existing user ${email} (${existing.id}).`);
  process.exit(0);
}

// Not found — create them only if a password was supplied.
if (!password) {
  console.error(
    `No user found for ${email}. To create one, pass a password:\n` +
      `   npm run grant-admin -- ${email} "TempPass123"\n` +
      `(They can change it later from /admin once signed in.)`
  );
  process.exit(1);
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // no confirmation email needed — they can log in immediately
  app_metadata: { role: "admin" },
});
if (error) {
  console.error(`Failed to create admin ${email}: ${error.message}`);
  process.exit(1);
}
console.log(
  `✅ Created admin user ${email} (${data.user.id}). They can log in now with the password you set.`
);
process.exit(0);
