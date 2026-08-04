/**
 * Populates singleton CMS documents with the content currently shown on the
 * frontend. Safe to re-run: it creates missing docs and fills missing fields
 * without overwriting curated published content or deleting drafts.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-content.mjs
 *   (SANITY_API_WRITE_TOKEN must be set in env or .env)
 */

import { createClient } from "@sanity/client";
import { getSanityWriteConfig } from "./sanity-write-config.mjs";

const { projectId, dataset, token } = getSanityWriteConfig();

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-05-20",
  token,
  useCdn: false,
});

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
  servicesStrip: [
    { _key: "sales", title: "Curated Sales", text: "Every car hand-picked and personally inspected. We only sell cars we'd happily own ourselves." },
    { _key: "sourcing", title: "Bespoke Sourcing", text: "Looking for something specific? We'll use our network to find it — any spec, any variant." },
    { _key: "px", title: "Part-Exchange", text: "Honest, market-aware valuations on whatever you're driving today." },
    { _key: "detailing", title: "Detailing", text: "Full machine polish, paint protection, and ceramic coating from experienced detailers." },
  ],
  merchEyebrow: "Upcoming Merch",
  merchHeading: "The Dog House Drop",
  merchBody:
    "The new TDH artwork is being turned into a small merch line across hoodies, tees, caps, and garage essentials. Coming soon.",
  merchPrimaryCta: "Preview Merch",
  merchSecondaryCta: "Drop Updates",
  socialEyebrow: "Stay Connected",
  socialHeading: "Check Us Out on Our Socials",
  socialBody: "Follow along for new arrivals, behind-the-scenes content, and everything cars.",
  socialLinks: [
    { _key: "instagram", platform: "Instagram", label: "@thedoghouse_as", url: "https://www.instagram.com/thedoghouse_as", ctaLabel: "Follow" },
    { _key: "tiktok", platform: "TikTok", label: "@thedoghouseas", url: "https://www.tiktok.com/@thedoghouseas", ctaLabel: "Follow" },
    { _key: "facebook", platform: "Facebook", label: "The Dog House AS", url: "https://www.facebook.com/profile.php?id=61584858144187", ctaLabel: "Follow" },
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
  mapRegion: "The Chilterns, Buckinghamshire",
  hoursLabel: "Monday – Saturday",
  hoursDetail: "09:00 – 17:00 (by appointment)",
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
    "TDH Motors is a small, family-run dealership based in the Chilterns — guided by three principles that drive everything we do.",
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
  partnersEyebrow: "Collaboration",
  partnersHeading: "Business Partners",
  partnersBody:
    "We're always interested in exploring partnerships that align with our values. Whether you're a specialist service provider, a fellow enthusiast business, or have a unique opportunity — we'd like to hear from you.",
  partnerOpportunities: [
    "Exclusive service partnerships",
    "Product and supplier collaborations",
    "Event and sponsorship opportunities",
    "Media and content partnerships",
  ],
  partnersCardBody:
    "We work with partners who share our passion for quality, attention to detail, and honest, long-term relationships.",
  partnersCardFootnote:
    "Have an opportunity you think we should know about? Drop us a message and let's have a conversation. We're always open to the right opportunity.",
  partnersCtaLabel: "Get In Touch",
  ctaHeading: "Come and Visit Us.",
  ctaBody:
    "The best way to understand how we work is to come and meet us. Book an appointment and we'll put the kettle on.",
};

const DETAILING_PAGE = {
  _id: "detailingPage",
  _type: "detailingPage",
  eyebrow: "Service",
  heading: "Detailing",
  intro:
    "From ceramic coating protection to full paintwork correction, our professional detailing team — TDH Detailing in partnership with TT Auto detailers — delivers showroom results that last. Every service uses industry-leading Gtechniq products and meticulous preparation.",
  pricingBody:
    "Prices start from £200. Every car is different, so final costing is assessed case by case — get in touch for a tailored quote.",
  packagesEyebrow: "Packages",
  packagesHeading: "Choose Your Detail",
  packagesIntro:
    "Three levels of detail, from a thorough maintenance clean through to full paint correction and ceramic protection. Not sure which you need? Send us a photo and we'll tell you straight.",
  // ⚠️ PLACEHOLDER PRICING — tier prices and durations are unconfirmed. Replace
  // with the detailing team's real figures before this goes in front of customers.
  packages: [
    {
      _key: "silver",
      slug: { _type: "slug", current: "silver" },
      tier: "Tier One",
      name: "Silver",
      tagline: "A thorough interior and exterior clean to refresh and maintain a pristine appearance.",
      price: "From £200",
      duration: "Approx. 3 hours",
      includes: [
        "Wheel, arch and tyre deep clean",
        "Snow foam pre-wash and two-bucket wash",
        "Contactless dry and detail spray",
        "Full interior vacuum and wipe-down",
        "Glass cleaned inside and out, streak-free",
        "Tyre dressing and trim finish",
      ],
      ctaLabel: "Book Silver",
      ctaLink: "/contact",
      longDescription:
        "Our entry-level detail is built around doing the basics properly. Every stage uses pH-neutral products and a scratch-avoiding wash method, so the car comes back genuinely clean without picking up the swirl marks a quick supermarket wash would leave behind. Ideal as regular upkeep between bigger details, or to smarten a car up before it goes on sale.",
      detailSections: [
        {
          _key: "silver-exterior",
          title: "Exterior",
          items: [
            "Wheels rinsed and cleaned with a dedicated wheel cleaner",
            "Arches, tyres and wheel faces agitated with soft brushes",
            "pH-neutral snow foam pre-wash to lift loose grit",
            "Two-bucket contact wash with lamb's wool mitts",
            "Contactless dry with filtered air and plush drying towels",
            "Detail spray for gloss, plus tyre dressing and trim finish",
          ],
        },
        {
          _key: "silver-interior",
          title: "Interior",
          items: [
            "Full vacuum of carpets, mats, seats and boot",
            "All hard surfaces wiped down and dressed",
            "Vents, switchgear and tight areas cleaned with detail brushes",
            "Glass cleaned inside and out for a streak-free finish",
            "Light odour neutralise and interior fragrance",
          ],
        },
      ],
    },
    {
      _key: "gold",
      slug: { _type: "slug", current: "gold" },
      tier: "Tier Two",
      name: "Gold",
      tagline: "Everything in Silver plus decontamination and a single-stage machine polish for real gloss.",
      price: "From £350",
      duration: "Approx. 6 hours",
      featured: true,
      badgeLabel: "Most Popular",
      includes: [
        "Everything in the Silver package",
        "Iron X and Tardis chemical decontamination",
        "Clay bar treatment across all panels",
        "Single-stage machine polish",
        "Gtechniq C2 Liquid Crystal applied",
        "Interior steam clean and fabric protection",
      ],
      ctaLabel: "Book Gold",
      ctaLink: "/contact",
      longDescription:
        "Gold is where the paint starts to properly transform. On top of everything in the Silver package, we chemically and mechanically decontaminate the paintwork, then machine polish to remove light marring and lift gloss. The finish is sealed with Gtechniq C2 Liquid Crystal for months of protection and strong water beading. This is the package most customers land on.",
      detailSections: [
        {
          _key: "gold-paint",
          title: "Everything in Silver, plus",
          items: [
            "Iron X fallout remover to dissolve bonded iron particles",
            "Tardis tar and glue removal on lower panels and arches",
            "Clay bar treatment to leave the paint glass-smooth",
            "Single-stage machine polish to remove light swirls and haze",
            "Gtechniq C2 Liquid Crystal sealant applied by hand",
          ],
        },
        {
          _key: "gold-interior",
          title: "Interior",
          items: [
            "Seat shampoo and extraction on fabric interiors",
            "Steam clean of trim, vents and tight seams",
            "Leather cleaned and conditioned where fitted",
            "Fabric and carpet protection applied",
          ],
        },
      ],
    },
    {
      _key: "platinum",
      slug: { _type: "slug", current: "platinum" },
      tier: "Tier Three",
      name: "Platinum",
      tagline: "Our ultimate detail — multi-stage paint correction finished with Gtechniq ceramic protection.",
      price: "From £600",
      duration: "1–2 days",
      includes: [
        "Everything in the Gold package",
        "1–5 stage machine polish to remove swirls",
        "Panel wipe to strip all oils and fillers",
        "Gtechniq Crystal Serum Light and Exo coating",
        "Wheel Armour and glass coating",
        "Leather, fabric and dash protection",
      ],
      ctaLabel: "Book Platinum",
      ctaLink: "/contact",
      longDescription:
        "The full works. Platinum is a multi-stage paint correction that removes the swirl marks, holograms and fine scratches that dull a finish in direct sunlight, followed by a nano ceramic coating that locks the result in for years rather than months. Paintwork is panel-wiped before coating so nothing is hidden by polishing oils — what you see is the true corrected finish.",
      detailSections: [
        {
          _key: "platinum-correction",
          title: "Paint correction",
          items: [
            "Full decontamination wash, clay and panel prep",
            "Paint depth readings taken before any correction",
            "1–5 stage machine polish depending on condition",
            "Removal of swirl marks, holograms and fine scratches",
            "Panel wipe to strip all oils, fillers and residues",
          ],
        },
        {
          _key: "platinum-protection",
          title: "Protection",
          items: [
            "Gtechniq Crystal Serum Light nano ceramic coating",
            "Gtechniq Exo hydrophobic top layer",
            "Wheel Armour applied to wheel faces and barrels",
            "Glass coating for improved wet-weather visibility",
            "Matt Dash, i Leather and i Fabric interior protection",
          ],
        },
      ],
    },
  ],
  packagesNote:
    "Prices are a guide based on a standard-size car in average condition. Larger vehicles, heavier soiling and severe paint defects are quoted individually — every car is assessed before we commit to a price.",
  socialEyebrow: "Straight From The Socials",
  socialHeading: "See The Work As It Happens",
  socialIntro:
    "Every car that comes through the unit ends up on our Instagram and TikTok. Tap any post to watch the full thing.",
  socialHandles: [
    { _key: "instagram", platform: "Instagram", handle: "@thedoghouse_as", url: "https://www.instagram.com/thedoghouse_as" },
    { _key: "tiktok", platform: "TikTok", handle: "@thedoghouseas", url: "https://www.tiktok.com/@thedoghouseas" },
  ],
  socialCtaLabel: "See More On Instagram",
  socialCtaLink: "https://www.instagram.com/thedoghouse_as",
  services: [
    {
      _key: "new-car-protection",
      title: "New Car Protection",
      tag: "Protection Detailing",
      tagline: "Ceramic coating for lasting defence.",
      description:
        "Using Gtechniq nano ceramic coatings, we create a durable, slick surface that resists dirt, tar, tree sap, and bird droppings. The coating bonds at a nano level, providing multi-year protection with superior water-beading and an unrivalled finish.",
      bullets: [
        "Unrivalled reflection — gloss, depth and clarity",
        "Hydrophobic/water-dirt repelling properties",
        "Easy clean and self-cleaning properties",
        "Weather protection",
        "Anti-micro scratch properties",
        "Temperature resistant: -40°F to 250°F",
      ],
      price: "From £200",
      includes: [
        "Multi-stage decontamination wash",
        "Snow foam, clay bar, Iron X and Tardis treatment",
        "Single-stage machine polish",
        "Gtechniq Crystal Serum Light, Exo and Wheel Armour",
        "Glass coating and trim restorer",
        "Interior: Matt Dash, i Leather, i Fabric",
      ],
    },
    {
      _key: "swirl-correction",
      title: "Swirl Correction",
      tag: "Correction Detailing",
      tagline: "Machine polishing to restore flawless paintwork.",
      description:
        "Machine polishing eliminates unsightly swirl marks and fine scratches from your paintwork — the kind that catch in sunlight and dull an otherwise perfect finish. It's not uncommon for cars straight from the dealership to carry swirling already. We correct it.",
      bullets: [
        "Removes swirl marks, fine scratches and holograms",
        "1–5 stage machine polishing depending on condition",
        "Addresses damage from improper washing, bird mess and tree sap",
        "Restores true gloss and depth to paintwork",
        "Optional ceramic coating package available",
      ],
      price: "From £250",
      includes: [
        "Multi-stage decontamination wash",
        "Wheel clean with Iron X, Tardis and citrus",
        "Arch and panel gap decontamination",
        "Clay bar treatment",
        "1–5 stage machine polish",
        "Panel wipe to remove all oils and waxes",
      ],
    },
    {
      _key: "gloss-enhancement",
      title: "Gloss Enhancement",
      tag: "Enhancement Detailing",
      tagline: "Maximise gloss, depth and reflection.",
      description:
        "Focused on elevating your car's visual impact — increasing gloss, depth and reflection while removing light surface marks. Ideal as a standalone treatment or as part of a regular annual maintenance schedule.",
      bullets: [
        "Removes light scratches and swirl marks",
        "Maximises gloss, depth and reflection",
        "Gtechniq C2 Liquid Crystal finishing spray applied",
        "Available as standalone or annual maintenance",
        "Perfect for cars in good condition needing a refresh",
      ],
      price: "From £200",
      includes: [
        "Multi-stage wash with polymer removal",
        "Wheel clean with Iron X and Tardis",
        "Snow foam and two-bucket wash method",
        "Clay bar treatment",
        "Single-stage machine polish",
        "Gtechniq C2 Liquid Crystal Detailing Spray",
      ],
    },
    {
      _key: "maintenance-valeting",
      title: "Maintenance Valeting",
      tag: "Valeting",
      tagline: "Regular care that protects your investment.",
      description:
        "Monthly to six-weekly valet services using pH-neutral shampoos and scratch-avoiding techniques designed to preserve your paintwork and any ceramic coatings. Professional, sympathetic care without the risk of inflicting micro-scratches.",
      bullets: [
        "pH-neutral shampoos safe for ceramic coatings",
        "Scratch-avoiding two-bucket wash method",
        "Ideal for busy owners who want regular professional upkeep",
        "Maintains the integrity and appearance of ceramic coatings",
        "Scheduled to suit your routine",
      ],
      price: "From £200",
      includes: [
        "Exterior rinse and snow foam pre-wash",
        "Two-bucket wash with lamb's wool mitt",
        "Wheel and arch clean",
        "Contactless dry and detail spray",
        "Window clean",
        "Interior wipe-down and vacuum (on request)",
      ],
    },
  ],
  partnerNote:
    "Our detailing work is carried out by TDH Detailing in partnership with TT Auto detailers.",
  ctaHeading: "Book Your Detail",
  ctaBody:
    "Every job is assessed individually. Get in touch to discuss your car's needs and we'll recommend the right service for you.",
  ctaLabel: "Get In Touch",
};

const CURATED_SALES_PAGE = {
  _id: "curatedSalesPage",
  _type: "curatedSalesPage",
  eyebrow: "Service",
  heading: "Curated Sales",
  intro:
    "Every car in our inventory is hand-picked by our team and personally inspected before listing. We only sell cars we'd happily own ourselves. And we make trading in your current car straightforward.",
  approachHeading: "Our Approach",
  approachItems: [
    { _key: "hand-picked-selection", title: "Hand-Picked Selection", body: "We source performance and specialist cars that meet our exacting standards. Every vehicle is personally inspected before it reaches our inventory." },
    { _key: "fully-prepared", title: "Fully Prepared", body: "Each car receives a complete check, any necessary servicing, and professional detailing in our own workshop before delivery." },
    { _key: "transparent-pricing", title: "Transparent Pricing", body: "No games, no haggling. What you see is what you get — we believe in honest conversations and fair value for both sides." },
  ],
  partExchangeHeading: "Part-Exchange Made Simple",
  partExchangeIntro:
    "Trading in your current car? We offer fair, transparent valuations with no surprises. Here's how it works:",
  partExchangeSteps: [
    { _key: "provide-details", title: "Provide Details", body: "Tell us about your car — make, model, year, mileage, condition." },
    { _key: "we-inspect", title: "We Inspect", body: "Our team inspects your vehicle and provides a competitive valuation." },
    { _key: "trade-upgrade", title: "Trade & Upgrade", body: "Apply the valuation to your next car and drive away happy." },
  ],
  ctaHeading: "Find Your Next Car",
  ctaBody: "Browse our current inventory or tell us what you're looking for. We're here to help.",
  primaryCtaLabel: "View Inventory",
  secondaryCtaLabel: "Get a Valuation",
};

const BESPOKE_SOURCING_PAGE = {
  _id: "bespokeSourcingPage",
  _type: "bespokeSourcingPage",
  eyebrow: "Service",
  heading: "Bespoke Sourcing",
  intro:
    "Looking for something specific? A rare variant, a particular colour, a unique specification, or an investment-grade example? Let us know your dream spec and we'll use our network to find it.",
  processHeading: "How It Works",
  processItems: [
    { _key: "tell-us", title: "Tell Us What You Want", body: "Whether it's a specific model, year range, colour, specification, or something more unique — the more detail, the better." },
    { _key: "search-network", title: "We Search Our Network", body: "We tap into our extensive network of dealers, auction houses, and private contacts to find exactly what you're after." },
    { _key: "inspect-deliver", title: "We Inspect & Deliver", body: "Once we've found your car, we conduct a thorough inspection, handle all the paperwork, and deliver it to you — ready to enjoy." },
  ],
  perfectForHeading: "Perfect For",
  perfectForItems: [
    "Finding a rare colour or limited edition variant",
    "Locating investment-grade examples in perfect condition",
    "Sourcing specific year ranges or generations",
    "Finding cars with unusual specifications or low mileage",
    "One-off builds or bespoke configurations",
  ],
  noteHeading: "No obligation, no timeline pressure.",
  noteBody:
    "We'll search on your behalf with no cost unless we find exactly what you're looking for.",
  ctaHeading: "Let's Find Your Perfect Car",
  ctaBody:
    "Tell us what you're looking for and we'll start the search. No obligation, no pressure — just an honest conversation.",
  ctaLabel: "Start the Search",
};

const STORAGE_PAGE = {
  _id: "storagePage",
  _type: "storagePage",
  eyebrow: "Service",
  heading: "Storage",
  intro:
    "Whether you're a collector with a weekend car, between sales, or simply need a secure home for your vehicle, our secure and climate-controlled storage is the answer. Discretion and security are our highest priority — your car is kept confidential and protected around the clock.",
  pricingBody:
    "Storage starts from £200. Rates depend on the vehicle and length of stay, so final costing is assessed case by case — get in touch for a tailored quote.",
  benefitsHeading: "Why Store With Us?",
  benefits: [
    { _key: "climate-controlled", title: "Climate Controlled", body: "Your vehicle is protected from the elements. Stable temperature and humidity keep paint, interior, and mechanical condition optimal." },
    { _key: "security-first", title: "Security First", body: "Security is our number one priority. 24/7 CCTV monitoring, secure gates, alarmed access, and locked indoor storage mean your car is as safe as it can possibly be during its time with us." },
    { _key: "discreet-confidential", title: "Discreet & Confidential", body: "We keep a low profile. Your vehicle's presence, registration, and ownership details stay strictly confidential — nothing is shared, and the facility address is given only to clients." },
    { _key: "flexible-terms", title: "Flexible Terms", body: "Short or long-term storage to suit your needs. Whether it's seasonal or extended, we offer competitive rates with no long-term lock-in." },
  ],
  includedHeading: "What's Included",
  includedItems: [
    "Climate-controlled storage bay",
    "24/7 CCTV security monitoring",
    "Discreet, fully confidential handling",
    "Regular vehicle check-ins (on request)",
    "Battery trickle charging (available)",
    "Easy access for viewings or collection",
    "Flexible short or long-term rates",
  ],
  includedFootnote:
    "Perfect for collectors, investment vehicles, classic cars, or simply parking your pride and joy somewhere it'll be looked after.",
  ctaHeading: "Ready to Store With Confidence?",
  ctaBody: "Get in touch to discuss your storage needs and receive a competitive quote.",
  ctaLabel: "Get In Touch",
};

const MERCH_PAGE = {
  _id: "merchPage",
  _type: "merchPage",
  eyebrow: "Shop",
  heading: "The Dog House Shop",
  intro:
    "Official TDH apparel and garage essentials, built around the new Dog House artwork. Browse the collection below and check out securely through TikTok Shop.",
  perks: [
    { _key: "secure-checkout", title: "Secure TikTok checkout", detail: "Every order is completed and protected through TikTok Shop." },
    { _key: "tracked-delivery", title: "Tracked delivery", detail: "Shipping and tracking handled end-to-end by TikTok Shop." },
    { _key: "new-drop", title: "New drop incoming", detail: "The first Dog House collection lands soon — follow for the date." },
  ],
  productsLabel: "products",
  collectionLabel: "The Dog House Drop",
  ctaHeading: "Don't Miss the Drop",
  ctaBody:
    "Follow TDH on TikTok for the launch date, new drops, restocks, and behind-the-scenes previews.",
  ctaLabel: "Follow on TikTok",
};

const CONTACT_PAGE = {
  _id: "contactPage",
  _type: "contactPage",
  eyebrow: "Get In Touch",
  heading: "Contact Us",
  intro:
    "Drop us a line below, or come and see us. Viewings are by appointment so we can give you our undivided attention.",
  sidebarHeading: "Visit Us",
  sharedContactDetails: {
    _type: "reference",
    _ref: "siteSettings",
  },
  responseEyebrow: "Response Time",
  responseBody:
    "We typically respond to all enquiries within one working day. For urgent queries, please give us a call.",
};

const INVENTORY_PAGE = {
  _id: "inventoryPage",
  _type: "inventoryPage",
  eyebrow: "Current Stock",
  heading: "Our Inventory",
  intro:
    "Every car listed below is in our care and available for viewing by appointment. Don't see what you're after? We can source it.",
};

const MERCH_PRODUCTS = [
  {
    // IDs must NOT contain a dot: on a public dataset Sanity's anonymous read
    // grant only covers `_id in path("*")` (no-dot IDs), so dotted IDs are
    // omitted (reason: "permission") from token-less published fetches and
    // never reach the live site. See scripts/fix-merch-ids.mjs.
    _id: "merch-tdh-signature-hoodie",
    _type: "merchProduct",
    title: "TDH Signature Hoodie",
    category: "Heavyweight Fleece",
    description: "Charcoal pullover with the gold Dog House mark printed oversized across the chest.",
    priceLabel: "Coming soon",
    tiktokShopUrl: "https://www.tiktok.com/@thedoghouseas",
    status: "coming-soon",
    sortOrder: 10,
  },
  {
    _id: "merch-dog-house-tee",
    _type: "merchProduct",
    title: "Dog House Tee",
    category: "Premium Cotton",
    description: "Clean black tee with the TDH artwork up front and Automotive Solutions branding below.",
    priceLabel: "Coming soon",
    tiktokShopUrl: "https://www.tiktok.com/@thedoghouseas",
    status: "coming-soon",
    sortOrder: 20,
  },
  {
    _id: "merch-workshop-cap",
    _type: "merchProduct",
    title: "Workshop Cap",
    category: "Embroidered Peak",
    description: "Structured six-panel cap with a brushed-gold TDH patch made for show days and handovers.",
    priceLabel: "Coming soon",
    tiktokShopUrl: "https://www.tiktok.com/@thedoghouseas",
    status: "coming-soon",
    sortOrder: 30,
  },
  {
    _id: "merch-garage-mug",
    _type: "merchProduct",
    title: "Garage Mug",
    category: "Ceramic Mug",
    description: "TDH-branded mug for workshop brews, handover coffees, and early starts at the showroom.",
    priceLabel: "Coming soon",
    tiktokShopUrl: "https://www.tiktok.com/@thedoghouseas",
    status: "coming-soon",
    sortOrder: 40,
  },
];

async function upsert(doc) {
  const name = doc._type;
  const fields = { ...doc };
  delete fields._id;
  delete fields._type;

  await client.createIfNotExists(doc);
  await client.patch(doc._id).setIfMissing(fields).commit();
  console.log(`  seeded defaults  ${name}  (${doc._id})`);

  const draftId = `drafts.${doc._id}`;
  const draftExists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id: draftId });
  if (draftExists) {
    await client.patch(draftId).setIfMissing(fields).commit();
    console.log(`  seeded draft defaults  ${name}  (${draftId})`);
  }
}

async function seedInventoryCarReferences() {
  const cars = await client.fetch(
    `*[_type == "car" && !(_id in path("drafts.**"))] | order(year desc, _createdAt desc) {
      _id
    }`,
  );

  if (!cars.length) return;

  const refs = cars.map((car) => ({
    _key: car._id.replace(/[^a-zA-Z0-9_-]/g, "-"),
    _type: "reference",
    _ref: car._id,
  }));

  await client.patch("inventoryPage").setIfMissing({ inventoryCars: refs }).commit();
  console.log(`  seeded inventory car links  inventoryPage  (${refs.length} cars)`);
}

console.log("Seeding CMS content...\n");
for (const doc of [
  HOME_PAGE,
  SITE_SETTINGS,
  SERVICES_PAGE,
  WHO_WE_ARE_PAGE,
  DETAILING_PAGE,
  CURATED_SALES_PAGE,
  BESPOKE_SOURCING_PAGE,
  STORAGE_PAGE,
  MERCH_PAGE,
  CONTACT_PAGE,
  INVENTORY_PAGE,
  ...MERCH_PRODUCTS,
]) {
  await upsert(doc);
}
await seedInventoryCarReferences();
console.log("\nDone.");
