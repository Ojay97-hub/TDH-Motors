/**
 * Populates all singleton CMS documents with the default content that is
 * currently hardcoded as fallbacks in the Next.js pages.
 *
 * Safe to re-run — uses createOrReplace so it is fully idempotent.
 * Also removes any stale drafts so the Studio shows clean published content.
 *
 * Usage:
 *   node scripts/seed-content.mjs
 *   (SANITY_API_WRITE_TOKEN must be set in env or .env)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env manually (no dotenv dependency required)
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env");
try {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trim();
  }
} catch { /* .env optional */ }

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Error: SANITY_API_WRITE_TOKEN is not set. Add it to your .env file.");
  process.exit(1);
}

const client = createClient({
  projectId: "sk5os0jg",
  dataset: "production",
  apiVersion: "2025-05-20",
  token,
  useCdn: false,
});

// ─── Document payloads ───────────────────────────────────────────────────────

const HOME_PAGE = {
  _id: "homePage",
  _type: "homePage",
  heroLine1: "Performance Cars,",
  heroLine2: "Hand-Picked.",
  heroSubheading:
    "Sourced for enthusiasts, by enthusiasts — every car on our forecourt selected on its own merit.",
  aboutHeading: "A proper passion for cars.",
  aboutPara1:
    "The Dog House is a small, family-run dealership tucked away in the Chilterns. We started it because buying a performance car should feel as good as driving one.",
  aboutPara2:
    "Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. No high-pressure sales floor, no commission targets — just an honest conversation and cars we're genuinely proud of.",
  aboutPara3: "Come and see us by appointment. We'll put the kettle on.",
  valueProps: [
    { _key: "vp1", title: "Curated Selection", text: "Every car personally inspected and approved." },
    { _key: "vp2", title: "Bespoke Sourcing", text: "Can't find what you want? We'll find it for you." },
    { _key: "vp3", title: "Full Servicing", text: "In-house preparation and ongoing care." },
    { _key: "vp4", title: "Trusted Trade-Ins", text: "Fair, transparent valuations on your current car." },
  ],
  servicesStrip: [
    { _key: "sales",    title: "Sales",        text: "Curated stock plus dedicated bespoke sourcing for cars we don't yet have." },
    { _key: "px",       title: "Part-Exchange", text: "Honest, market-aware valuations on whatever you're driving today." },
    { _key: "finance",  title: "Finance",       text: "Flexible HP and PCP through our trusted finance partners." },
    { _key: "workshop", title: "Workshop",      text: "Servicing, MOT preparation, and detailing — in-house." },
  ],
  ctaHeading: "By Appointment, In the Chilterns.",
  ctaBody:
    "Our showroom is open by appointment, allowing us to give every visitor the time and attention they deserve. Get in touch to arrange a viewing.",
  findUsHeading: "Better yet, see us in person.",
  findUsBody:
    "Viewing is by appointment only — give us a call or drop us a line and we'll get the kettle on.",
};

const SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  phone: "+44 (0) 1000 000 000",
  email: "hello@tdhmotors.co.uk",
  addressLine1: "Aylesbury, Buckinghamshire",
  addressLine2: "Exact address shared on booking",
  mapPlusCode: "P5WG+RV Aylesbury",
  mapRegion: "Buckinghamshire, UK",
  hoursLabel: "Monday – Saturday",
  hoursDetail: "09:00 – 17:00 (by appointment)",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=P5WG%2BRV+Aylesbury%2C+UK&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=P5WG%2BRV+Aylesbury%2C+UK",
};

const SERVICES_PAGE = {
  _id: "servicesPage",
  _type: "servicesPage",
  intro:
    "We're more than a showroom. From the moment we source a car to the day you drive it home — and every service after — we're here to look after you.",
  services: [
    {
      _key: "s1",
      title: "Curated Sales",
      body: "Every car in our inventory is hand-picked by our team and personally inspected before listing. We only sell cars we'd happily own ourselves.",
    },
    {
      _key: "s2",
      title: "Bespoke Sourcing",
      body: "Looking for something specific? Let us know your dream spec and we'll use our network to find it. From discreet investment-grade cars to one-off configurations.",
    },
    {
      _key: "s3",
      title: "Part-Exchange",
      body: "Whether you're upgrading or downsizing, we offer fair, transparent valuations on any car you'd like to trade. No surprises, no haggling.",
    },
    {
      _key: "s4",
      title: "Finance",
      body: "Flexible HP and PCP arrangements through our trusted partners. We'll help you structure a deal that works for you, with no obligation.",
    },
    {
      _key: "s5",
      title: "Servicing & MOT",
      body: "Our in-house workshop handles preparation, servicing, and MOT for every car we sell — and for our customers, long after they drive away.",
    },
    {
      _key: "s6",
      title: "Detailing",
      body: "Full machine polish, paint protection, and ceramic coating from experienced detailers. Every car we sell is presented at its absolute best.",
    },
  ],
  ctaHeading: "Looking for something specific?",
  ctaBody:
    "Tell us what you'd like to drive next and we'll start the search. No obligation, no pressure — just an honest conversation.",
};

const WHO_WE_ARE_PAGE = {
  _id: "whoWeArePage",
  _type: "whoWeArePage",
  heroHeading: "Built on a passion for performance.",
  introParagraph:
    "TDH Motors is a small, family-run dealership based in the Chilterns — with one principle that drives everything we do.",
  para1:
    "Buying a performance car should feel as good as driving one. Too often, it doesn't. Pushy sales tactics, opaque pricing, and tired stock have made the experience something to endure rather than enjoy.",
  para2:
    "We started TDH Motors to do things differently. Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. We sell cars we'd be proud to own — and we'd rather have fewer of the right ones than a full forecourt of the wrong ones.",
  para3:
    "We're a long way from a corporate showroom. There's no high-pressure sales floor, no commission targets, and no need to rush. We invite our customers to come and see us by appointment, take their time, ask questions, and only move forward when it feels right.",
  principles: [
    {
      _key: "p1",
      title: "Passion First",
      body: "We sell cars because we love them. That passion shapes which cars make it onto our forecourt — and how we look after them once they're here.",
    },
    {
      _key: "p2",
      title: "Total Transparency",
      body: "Honest descriptions, full history files, and fair pricing. What you see is what you get — and what you don't see, we'll happily show you.",
    },
    {
      _key: "p3",
      title: "Long-Term Relationships",
      body: "Our best customers are repeat customers. We're not interested in a one-off sale — we want to be the dealer you call for your next car, and the one after that.",
    },
  ],
  ctaHeading: "Come and Visit Us.",
  ctaBody:
    "The best way to understand how we work is to come and meet us. Book an appointment and we'll put the kettle on.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsert(doc) {
  const name = doc._type;
  // Find existing published doc with this type
  const existingId = await client.fetch(`*[_type == $type][0]._id`, { type: name });

  if (existingId && existingId !== doc._id) {
    // Existing doc has a different auto-generated ID — patch it in place
    const fields = { ...doc };
    delete fields._id;
    delete fields._type;
    await client.patch(existingId).set(fields).commit();
    console.log(`  patched  ${name}  (${existingId})`);
    // Also delete any drafts for this doc
    await discardDraft(existingId);
  } else {
    await client.createOrReplace(doc);
    console.log(`  written  ${name}  (${doc._id})`);
    await discardDraft(doc._id);
  }
}

async function discardDraft(publishedId) {
  const draftId = `drafts.${publishedId}`;
  try {
    await client.delete(draftId);
    console.log(`  removed draft  ${draftId}`);
  } catch {
    // Draft didn't exist — fine
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log("Seeding CMS content…\n");
for (const doc of [HOME_PAGE, SITE_SETTINGS, SERVICES_PAGE, WHO_WE_ARE_PAGE]) {
  await upsert(doc);
}
console.log("\nDone.");
