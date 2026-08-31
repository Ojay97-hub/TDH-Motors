import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TDH Motors collects, uses and protects your personal data.",
};

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="pt-8 border-t border-border first:pt-0 first:border-0">
      <h2 className="font-display text-xl tracking-wide mb-3">{heading}</h2>
      <div className="text-text-muted leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Legal</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          This describes exactly what TDH Motors does with your data — nothing more.
        </p>
        <p className="text-text-subtle text-sm mt-4">Last updated 31 August 2026</p>
      </section>

      <section className="container-page pb-24">
        <div className="max-w-3xl space-y-8">
          <Section heading="Who we are">
            <p>
              TDH Motors (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a trading name of The Dog House
              Automotive Solutions Ltd, registered at Front Barn, Hatchmead Farm, Lower Icknield
              Way, Great Kimble, Aylesbury, HP17 9TX. We&apos;re registered with the Information
              Commissioner&apos;s Office as a data controller, registration reference{" "}
              <a
                href="https://ico.org.uk/ESDWebPages/Entry/ZC219720"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:underline"
              >
                ZC219720
              </a>
              .
            </p>
            <p>
              For anything to do with this policy or your data, contact{" "}
              <a href="mailto:tony@tdhmotors.co.uk" className="text-brand-light hover:underline">
                tony@tdhmotors.co.uk
              </a>
              .
            </p>
          </Section>

          <Section heading="What we collect">
            <p>
              When you submit our contact form, we collect your name, email address, and message,
              plus phone number, the car you&apos;re asking about, and the type of enquiry when you
              give them — all of that is optional except your name, email and message.
            </p>
          </Section>

          <Section heading="Why we collect it">
            <p>
              Solely to respond to your enquiry — by email or phone. We don&apos;t use it for
              marketing, and we don&apos;t sell or rent it to anyone.
            </p>
          </Section>

          <Section heading="Where it's stored, and who else sees it">
            <p>
              Your enquiry is stored in our database, hosted by Supabase, and is visible to TDH
              Motors staff who reply to enquiries. Sending you an email — a confirmation when you
              submit, and any reply — is handled by our email provider, Brevo, which processes your
              name and email address to deliver that email. Neither company uses your data for
              anything beyond providing that service to us.
            </p>
            <p>
              If you buy from our merchandise store, that purchase is handled entirely by TikTok
              Shop and covered by TikTok&apos;s own privacy policy — we don&apos;t receive or store
              your payment or delivery details.
            </p>
          </Section>

          <Section heading="How long we keep it">
            <p>
              We keep enquiry records for as long as needed to respond to you and keep a business
              record of the conversation. Ask us at any time and we&apos;ll delete yours.
            </p>
          </Section>

          <Section heading="Cookies">
            <p>
              Browsing the site doesn&apos;t set any tracking, analytics, or advertising cookies.
              The only cookies in use are strictly necessary ones that keep TDH Motors staff signed
              in to the admin dashboard — they&apos;re not set for ordinary visitors.
            </p>
          </Section>

          <Section heading="Your rights">
            <p>
              Under UK GDPR, you can ask us what we hold about you, ask us to correct or delete it,
              or object to how it&apos;s used. Email{" "}
              <a href="mailto:tony@tdhmotors.co.uk" className="text-brand-light hover:underline">
                tony@tdhmotors.co.uk
              </a>{" "}
              and we&apos;ll sort it out. If you&apos;re not satisfied with our response, you can
              complain to the{" "}
              <a
                href="https://ico.org.uk/make-a-complaint/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:underline"
              >
                Information Commissioner&apos;s Office
              </a>
              .
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}
