"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm({ prefilledCar }: { prefilledCar?: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to API route / form service (Resend, Formspree, etc.)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-bg-elevated border border-brand p-10 text-center">
        <div className="font-display text-3xl tracking-wide mb-4">Thank you.</div>
        <p className="text-text-muted leading-relaxed">
          We've received your message and will be in touch within one working day.
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
        <div className="flex flex-wrap gap-2">
          {["Viewing", "Part-Exchange", "Bespoke Sourcing", "General"].map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" name="type" value={type} className="peer sr-only" defaultChecked={type === "Viewing"} />
              <span className="inline-block px-4 py-2 text-sm border border-border peer-checked:bg-brand peer-checked:border-brand text-text peer-checked:text-on-brand transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

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

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
      >
        Send Enquiry <Send size={16} />
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
