"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { interests, propertyTypes } from "@/lib/leadOptions";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

const field =
  "mt-2 w-full rounded-xl border border-white/15 bg-night/60 px-4 py-3 text-snow placeholder:text-haze/80 transition-colors focus:border-ember focus:outline-none aria-[invalid=true]:border-red-400";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      property_name: data.get("property_name"),
      property_type: data.get("property_type") || null,
      interest: data.getAll("interest"),
      message: data.get("message"),
      company_website: data.get("company_website"),
    };
    setStatus({ state: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setStatus({ state: "error", message: json.error ?? "Something went wrong" });
        const first = json.fieldErrors && Object.keys(json.fieldErrors)[0];
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }
      form.reset();
      setStatus({ state: "sent" });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again, or message us on WhatsApp." });
    }
  }

  const err = (name: string) =>
    errors[name] ? (
      <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-red-300">
        {errors[name]}
      </p>
    ) : null;
  const a11y = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });

  if (status.state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        className="glass flex min-h-[420px] flex-col items-center justify-center rounded-3xl p-10 text-center"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-ember text-night">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
        <h3 className="mt-6 font-display text-3xl">Thank you. We&apos;ll be in touch.</h3>
        <p className="mt-3 max-w-sm text-mist">We have your message and will get back to you soon.</p>
        <button type="button" className="btn btn-ghost mt-8" onClick={() => setStatus({ state: "idle" })}>
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass rounded-3xl p-6 md:p-8" aria-describedby={`${id}-note`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-name`} className="text-sm font-medium">
            Your name <span className="text-ember">*</span>
          </label>
          <input id={`${id}-name`} name="name" required autoComplete="name" className={field} {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="text-sm font-medium">
            Phone / WhatsApp
          </label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" className={field} {...a11y("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-medium">
            Email
          </label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={field} {...a11y("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={`${id}-property`} className="text-sm font-medium">
            Property name
          </label>
          <input id={`${id}-property`} name="property_name" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-type`} className="text-sm font-medium">
            Property type
          </label>
          <select id={`${id}-type`} name="property_type" defaultValue="" className={field}>
            <option value="">Choose one</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium">I&apos;m interested in</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((i) => (
              <label key={i} className="cursor-pointer">
                <input type="checkbox" name="interest" value={i} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-mist transition-colors peer-checked:border-ember peer-checked:bg-ember/15 peer-checked:text-snow peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
                  {i}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className="text-sm font-medium">
            Anything else?
          </label>
          <textarea id={`${id}-message`} name="message" rows={4} className={field} placeholder="Rooms, current website, what you'd like to improve…" />
        </div>
        {/* Honeypot, hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-hp`}>Company website</label>
          <input id={`${id}-hp`} name="company_website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <AnimatePresence>
        {status.state === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            {status.message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-note`} className="text-xs text-haze">
          Add a phone number or email so we can reply. We never share your details.
        </p>
        <button type="submit" className="btn btn-primary" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
