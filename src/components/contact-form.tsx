"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import {
  DETAILING_ENQUIRY_TYPE,
  type DetailingPackageOption,
} from "@/lib/detailing-packages";

// Must stay in sync with the `enquiryTypes` enum in /api/enquiries.
const ENQUIRY_TYPES = [
  "Viewing",
  "Curated Sales",
  DETAILING_ENQUIRY_TYPE,
  "Storage",
  "Bespoke Sourcing",
  "General",
] as const;

const DEFAULT_ENQUIRY_TYPE = "Viewing";

/**
 * Resolves the `?type=` param against the known types so a hand-edited or stale
 * URL can't push an unsupported value into the form (the API would reject it).
 */
function resolveType(requested: string | undefined, hasPackage: boolean) {
  const match = ENQUIRY_TYPES.find(
    (type) => type.toLowerCase() === requested?.trim().toLowerCase(),
  );
  if (match) return match;
  // Arriving with a package but no usable type still clearly means detailing.
  return hasPackage ? DETAILING_ENQUIRY_TYPE : DEFAULT_ENQUIRY_TYPE;
}

export function ContactForm({
  prefilledCar,
  prefilledType,
  prefilledPackage,
  packages = [],
}: {
  prefilledCar?: string;
  prefilledType?: string;
  prefilledPackage?: string;
  packages?: DetailingPackageOption[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Only honour a package slug that actually exists, so a dead link from an old
  // tier leaves the picker blank rather than silently selecting nothing valid.
  const initialPackage =
    packages.find((pkg) => pkg.slug === prefilledPackage?.trim())?.slug ?? "";
  const [type, setType] = useState(() => resolveType(prefilledType, Boolean(initialPackage)));
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);

  const showPackages = type === DETAILING_ENQUIRY_TYPE && packages.length > 0;

  useEffect(() => {
    if (submitted) {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitted]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    // Send the package's display name rather than its slug — it lands in the
    // admin list and the notification email, where "Silver" beats "silver".
    const packageName = showPackages
      ? packages.find((pkg) => pkg.slug === selectedPackage)?.name
      : undefined;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || undefined,
      car: (form.elements.namedItem("car") as HTMLInputElement).value || undefined,
      type,
      package: packageName || undefined,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again or call us directly.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setError("The request timed out. Please try again or call us directly.");
      } else {
        setError("Something went wrong. Please try again or call us directly.");
      }
    } finally {
      window.clearTimeout(timeoutId);
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div ref={successRef} className="bg-bg-elevated border border-brand p-10 text-center">
        <div className="font-display text-3xl tracking-wide mb-4">Thank you.</div>
        <p className="text-text-muted leading-relaxed">
          We&apos;ve received your message and will be in touch within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Your Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Phone" name="phone" type="tel" />
        <Field
          label="Car of Interest"
          name="car"
          defaultValue={prefilledCar?.replace(/-/g, " ")}
          placeholder="e.g. Porsche 911 Carrera S"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
          Enquiry Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-[1fr_1.2fr_1fr_1fr_1.45fr_1fr] gap-2">
          {ENQUIRY_TYPES.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={option}
                checked={type === option}
                onChange={() => setType(option)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 w-full items-center justify-center whitespace-nowrap px-2 py-2 text-center text-sm border border-border peer-checked:bg-brand peer-checked:border-brand text-text peer-checked:text-on-brand transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Package picker. Only meaningful for detailing, so it stays out of the
          way for every other enquiry type. Selection is optional — plenty of
          people won't know which tier they want until we've seen the car. */}
      {showPackages && (
        <div>
          <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
            Package <span className="text-text-subtle normal-case tracking-normal">(optional)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {packages.map((pkg) => (
              <label key={pkg.slug} className="cursor-pointer">
                <input
                  type="radio"
                  name="package"
                  value={pkg.slug}
                  checked={selectedPackage === pkg.slug}
                  onChange={() => setSelectedPackage(pkg.slug)}
                  className="peer sr-only"
                />
                <span className="flex min-h-11 w-full flex-col items-center justify-center gap-0.5 px-3 py-2.5 text-center border border-border peer-checked:bg-brand peer-checked:border-brand text-text peer-checked:text-on-brand transition-colors">
                  <span className="text-sm leading-tight">{pkg.name}</span>
                  {pkg.price && <span className="text-xs opacity-75">{pkg.price}</span>}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-text-subtle mt-2">
            Not sure which you need? Leave it blank and tell us about the car below.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-wider text-text-muted mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="w-full bg-bg border border-border focus:border-brand text-text px-4 py-3 outline-none transition-colors resize-none"
          placeholder="Tell us a bit about what you're looking for..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending..." : <><span>Send Enquiry</span> <Send size={16} /></>}
      </button>

      <p className="text-xs text-text-subtle">
        Your details will only be used to respond to this enquiry. We never share data
        with third parties.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-wider text-text-muted mb-2">
        {label} {required && <span className="text-brand-light">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full bg-bg border border-border focus:border-brand text-text px-4 py-3 outline-none transition-colors"
      />
    </div>
  );
}
