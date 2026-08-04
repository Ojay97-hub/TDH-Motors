import type { Metadata } from "next";
import { createDataAttribute } from "next-sanity";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import {
  DEFAULT_DETAILING_PACKAGES,
  toPackageOptions,
  type DetailingPackage,
} from "@/lib/detailing-packages";
import { safeSanityFetch } from "@/sanity/client";
import {
  contactPageQuery,
  detailingPackageOptionsQuery,
  siteSettingsQuery,
} from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a viewing or enquire about any car in our inventory.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string; type?: string; package?: string }>;
}) {
  // `package` is a reserved word in strict mode, so it can't be destructured
  // under its own name.
  const [{ car, type: enquiryType, package: packageParam }, settings, cms, cmsPackages] =
    await Promise.all([
      searchParams,
      safeSanityFetch(siteSettingsQuery, {}, { next: { revalidate: 60, tags: ["siteSettings"] } }),
      safeSanityFetch(contactPageQuery, {}, { next: { revalidate: 60, tags: ["contactPage"] } }),
      safeSanityFetch<DetailingPackage[]>(
        detailingPackageOptionsQuery,
        {},
        { next: { revalidate: 60, tags: ["detailingPage"] } },
      ),
    ]);

  // Mirrors the detailing page's fallback so both surfaces always offer the
  // same tiers, even before an editor has populated Sanity.
  const packageOptions = toPackageOptions(
    cmsPackages?.length ? cmsPackages : DEFAULT_DETAILING_PACKAGES,
  );

  const eyebrow = cms?.eyebrow ?? "Get In Touch";
  const heading = cms?.heading ?? "Contact Us";
  const intro =
    cms?.intro ??
    "Drop us a line below, or come and see us. Viewings are by appointment so we can give you our undivided attention.";
  const sidebarHeading = cms?.sidebarHeading ?? "Visit Us";
  const responseEyebrow = cms?.responseEyebrow ?? "Response Time";
  const responseBody =
    cms?.responseBody ??
    "We typically respond to all enquiries within one working day. For urgent queries, please give us a call.";
  const phone = settings?.phone ?? "+44 (0) 1000 000 000";
  const email = settings?.email ?? "hello@tdhmotors.co.uk";
  const addressLine1 = settings?.addressLine1 ?? "Aylesbury, Buckinghamshire";
  const addressLine2 = settings?.addressLine2 ?? "Exact address shared on booking";
  const hoursLabel = settings?.hoursLabel ?? "Monday – Saturday";
  const hoursDetail = settings?.hoursDetail ?? "09:00 – 17:00 (by appointment)";
  const settingsAttr = (path: string) =>
    createDataAttribute({
      baseUrl: "/studio",
      id: "siteSettings",
      type: "siteSettings",
      path,
    }).toString();

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{eyebrow}</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">{heading}</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          {intro}
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm
              prefilledCar={car}
              prefilledType={enquiryType}
              prefilledPackage={packageParam}
              packages={packageOptions}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="bg-bg-elevated border border-border p-8">
              <h2 className="font-display text-2xl tracking-wide mb-8">{sidebarHeading}</h2>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Address</div>
                    <div className="text-text" data-sanity={settingsAttr("addressLine1")}>{addressLine1}</div>
                    <div className="text-text-muted text-sm" data-sanity={settingsAttr("addressLine2")}>{addressLine2}</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Phone</div>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="text-text hover:text-brand-light transition-colors"
                      data-sanity={settingsAttr("phone")}
                    >
                      {phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Email</div>
                    <a
                      href={`mailto:${email}`}
                      className="text-text hover:text-brand-light transition-colors"
                      data-sanity={settingsAttr("email")}
                    >
                      {email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Hours</div>
                    <div className="text-text" data-sanity={settingsAttr("hoursLabel")}>{hoursLabel}</div>
                    <div className="text-text-muted text-sm" data-sanity={settingsAttr("hoursDetail")}>{hoursDetail}</div>
                  </div>
                </li>
              </ul>

              <div className="mt-10 pt-6 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-3">{responseEyebrow}</div>
                <p className="text-text-muted text-sm leading-relaxed">
                  {responseBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
