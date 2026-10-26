"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { PICK_SERVICE_EVENT } from "@/components/ui/PickService";
import {
  contactMethods,
  interests,
  propertyTypes,
  roomRanges,
  timelines,
  type Interest,
  type PropertyType,
} from "@/lib/leadOptions";
import { estimate, formatINR, pricing, startingPrice } from "@/lib/pricing";
import { site, whatsappLink } from "@/lib/site";
import { useReducedMotion } from "@/lib/useCan3D";

/* ----------------------------------------------------------------- Data -- */

type Draft = {
  property_type: PropertyType | null;
  rooms: (typeof roomRanges)[number] | null;
  property_name: string;
  interest: Interest[];
  timeline: (typeof timelines)[number] | null;
  name: string;
  phone: string;
  email: string;
  preferred_contact: (typeof contactMethods)[number];
  message: string;
};

const emptyDraft: Draft = {
  property_type: null,
  rooms: null,
  property_name: "",
  interest: [],
  timeline: null,
  name: "",
  phone: "",
  email: "",
  preferred_contact: "WhatsApp",
  message: "",
};

const DRAFT_KEY = "gorkhay-enquiry-draft";

const steps = [
  {
    title: "Tell us about your property",
    hint: "Two taps. It helps us come to the call prepared.",
  },
  {
    title: "What would help most?",
    hint: "Pick as many as you like. Not sure? Skip ahead.",
  },
  {
    title: "Where should we reply?",
    hint: "A phone number or email is enough.",
  },
] as const;

const propertyCards: Record<
  PropertyType,
  { label: string; icon: React.ReactNode }
> = {
  hotel: {
    label: "Hotel",
    icon: (
      <path d="M4 21V5l8-2 8 2v16M9 21v-4h6v4M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M2 21h20" />
    ),
  },
  homestay: {
    label: "Homestay",
    icon: <path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5" />,
  },
  resort: {
    label: "Resort",
    icon: <path d="M2 20l6-9 4 5 3-4 7 8zM16 6a2 2 0 100-4 2 2 0 000 4z" />,
  },
  other: {
    label: "Something else",
    icon: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  },
};

/* --------------------------------------------------------------- Pieces -- */

const input =
  "mt-2 w-full rounded-2xl border border-white/12 bg-night/50 px-4 py-3.5 text-snow placeholder:text-haze/70 transition-[border-color,box-shadow] focus:border-ember focus:shadow-[0_0_0_4px_rgb(255_138_61/0.15)] focus:outline-none aria-[invalid=true]:border-red-400";

function Chip({
  checked,
  type,
  name,
  value,
  onChange,
  children,
}: {
  checked: boolean;
  type: "radio" | "checkbox";
  name: string;
  value: string;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.02] px-4 text-sm text-mist transition-colors hover:border-white/30 peer-checked:border-ember peer-checked:bg-ember/15 peer-checked:text-snow peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
        {children}
      </span>
    </label>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
        on
          ? "border-ember bg-ember text-night"
          : "border-white/20 text-transparent"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path
          d="M2.5 6.3l2.2 2.2 4.8-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function Estimate({ selected }: { selected: Interest[] }) {
  const { upfront, monthly } = estimate(selected);
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl border border-ember/25 bg-ember/[0.07] px-4 py-3"
      aria-live="polite"
    >
      <span className="text-sm text-mist">Estimated starting budget</span>
      <span className="text-right font-semibold text-snow">
        {selected.length === 0 ? (
          <span className="font-normal text-haze">Pick a service</span>
        ) : (
          <>
            {upfront > 0 && formatINR(upfront)}
            {upfront > 0 && monthly > 0 && (
              <span className="text-haze"> + </span>
            )}
            {monthly > 0 && (
              <>
                {formatINR(monthly)}
                <span className="text-sm font-normal text-haze">/month</span>
              </>
            )}
          </>
        )}
      </span>
    </div>
  );
}

/** Plain-text version of the enquiry, for the email and WhatsApp hand-off. */
function summarise(d: Draft) {
  const lines = [
    `Hi GorkhayAI, I'm ${d.name || "interested in working with you"}.`,
    d.property_name || d.property_type
      ? `Property: ${[d.property_name, d.property_type && propertyCards[d.property_type].label].filter(Boolean).join(", ")}${d.rooms ? ` (${d.rooms} rooms)` : ""}`
      : null,
    d.interest.length ? `Interested in: ${d.interest.join(", ")}` : null,
    d.timeline ? `Timeline: ${d.timeline}` : null,
    d.phone ? `Phone: ${d.phone}` : null,
    d.email ? `Email: ${d.email}` : null,
    `Best way to reach me: ${d.preferred_contact}`,
    d.message ? `\n${d.message}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

/* ----------------------------------------------------------------- Form -- */

type Status = "editing" | "sending" | "sent" | "handoff";

export function ContactForm() {
  const id = useId();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("editing");
  const [notice, setNotice] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Restore an unfinished enquiry from this browser tab.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off restore from storage after mount
      if (saved) setDraft({ ...emptyDraft, ...JSON.parse(saved) });
    } catch {
      /* storage unavailable: start fresh */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft]);

  // "Get started" on a service card ticks that service and opens step 2.
  useEffect(() => {
    const onPick = (e: Event) => {
      const service = (e as CustomEvent<Interest>).detail;
      setDraft((d) =>
        d.interest.includes(service)
          ? d
          : { ...d, interest: [...d.interest, service] },
      );
      setStatus("editing");
      setDir(1);
      setStep((s) => (s === 0 ? 1 : s));
    };
    window.addEventListener(PICK_SERVICE_EVENT, onPick);
    return () => window.removeEventListener(PICK_SERVICE_EVENT, onPick);
  }, []);

  // Move focus to the new step's heading so keyboard and screen reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    // On phones a step can start above the fold; bring the top of the card back into view.
    const card = heading.current?.closest("form, [role=status]");
    const top = card?.getBoundingClientRect().top ?? 0;
    if (top < 72) window.scrollBy({ top: top - 88, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [step, status]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key as string])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
  };
  const toggleInterest = (i: Interest) =>
    set(
      "interest",
      draft.interest.includes(i)
        ? draft.interest.filter((x) => x !== i)
        : [...draft.interest, i],
    );

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    setNotice(null);
  };

  function validateContact() {
    const e: Record<string, string> = {};
    if (!draft.name.trim()) e.name = "Please tell us your name";
    if (!draft.phone.trim() && !draft.email.trim())
      e.phone = "Add a phone number or an email so we can reply";
    if (draft.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(draft.phone.trim()))
      e.phone = "Please check your phone number";
    if (
      draft.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
    )
      e.email = "Please check your email";
    if (draft.preferred_contact === "Email" && !draft.email.trim())
      e.email = "Add your email, or pick another way to reach you";
    if (
      draft.preferred_contact !== "Email" &&
      !draft.phone.trim() &&
      draft.email.trim()
    )
      e.phone = `Add your number for ${draft.preferred_contact === "WhatsApp" ? "WhatsApp" : "a call"}, or pick Email`;
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) return go(step + 1);

    const found = validateContact();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("sending");
    const honeypot = (
      e.currentTarget.elements.namedItem(
        "company_website",
      ) as HTMLInputElement | null
    )?.value;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, company_website: honeypot }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("sent");
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        return;
      }
      if (res.status === 422 && json.fieldErrors) {
        setErrors(json.fieldErrors);
        setStatus("editing");
        setNotice(json.error ?? "Please check the form");
        return;
      }
      // Inbox not connected yet, or the server had a problem: hand the
      // enquiry over to email / WhatsApp so it is never lost.
      setStatus("handoff");
    } catch {
      setStatus("handoff");
    }
  }

  const a11y = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });
  const err = (name: string) =>
    errors[name] ? (
      <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-red-300">
        {errors[name]}
      </p>
    ) : null;

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 40 * dir },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 * dir },
      };

  /* ------------------------------------------------------ End screens -- */

  if (status === "sent" || status === "handoff") {
    const sent = status === "sent";
    const text = summarise(draft);
    const mail = `mailto:${site.email}?subject=${encodeURIComponent(
      `Enquiry from ${draft.property_name || draft.name}`,
    )}&body=${encodeURIComponent(text)}`;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative overflow-hidden rounded-[2rem] p-7 md:p-10"
        role="status"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ember/20 blur-3xl"
        />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-ember text-night shadow-[0_12px_40px_-8px_rgb(255_138_61/0.8)]">
          {sent ? (
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4z"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <h3
          ref={heading}
          tabIndex={-1}
          className="relative mt-6 font-display text-3xl outline-none md:text-4xl"
        >
          {sent
            ? `Thank you${draft.name ? `, ${draft.name.split(" ")[0]}` : ""}.`
            : "One last tap to send it."}
        </h3>
        <p className="relative mt-3 max-w-md text-mist">
          {sent
            ? `Your enquiry is with us. Upesh will reach you by ${draft.preferred_contact.toLowerCase()} to set up a call.`
            : "Your enquiry is written and ready. Send it straight to Upesh with one of these buttons."}
        </p>

        <dl className="relative mt-7 grid gap-3 rounded-2xl border border-white/10 bg-night/40 p-5 text-sm sm:grid-cols-2">
          {[
            [
              "Property",
              [
                draft.property_name,
                draft.property_type && propertyCards[draft.property_type].label,
              ]
                .filter(Boolean)
                .join(" · ") || "Not given",
            ],
            ["Rooms", draft.rooms ?? "Not given"],
            ["Interested in", draft.interest.join(", ") || "Not sure yet"],
            ["Timeline", draft.timeline ?? "Not given"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-[0.18em] text-haze">
                {k}
              </dt>
              <dd className="mt-1 text-snow">{v}</dd>
            </div>
          ))}
          {draft.interest.length > 0 && (
            <div className="sm:col-span-2">
              <Estimate selected={draft.interest} />
            </div>
          )}
        </dl>

        <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
          {sent ? (
            <>
              <a
                href={site.caseStudyUrl}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
              >
                See Hotel Teesta while you wait
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setDraft(emptyDraft);
                  setStep(0);
                  setStatus("editing");
                }}
              >
                Send another enquiry
              </button>
            </>
          ) : (
            <>
              <a href={mail} className="btn btn-primary">
                Send by email
              </a>
              {site.whatsapp && (
                <a
                  href={whatsappLink(text)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-ghost"
                >
                  Send on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("editing")}
              >
                Edit details
              </button>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  /* ------------------------------------------------------------ Steps -- */

  const current = steps[step];
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glass relative rounded-[2rem] p-6 md:p-9"
      aria-labelledby={`${id}-title`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
      >
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ember/10 blur-3xl" />
      </div>

      {/* Progress */}
      <div className="relative flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
          Step {step + 1} of {steps.length}
        </p>
        <ol className="flex gap-1.5" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}: ${s.title}${i === step ? " (current)" : ""}`}
                aria-current={i === step ? "step" : undefined}
                className="block py-2 disabled:cursor-default"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${i <= step ? "w-10 bg-ember" : "w-6 bg-white/15"}`}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative overflow-x-clip">
        <AnimatePresence mode="wait" initial={false}>
          <motion.fieldset
            key={step}
            {...slide}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 min-w-0"
          >
            <legend className="sr-only">{current.title}</legend>
            <h3
              id={`${id}-title`}
              ref={heading}
              tabIndex={-1}
              className="font-display text-3xl leading-tight outline-none md:text-4xl"
            >
              {current.title}
            </h3>
            <p className="mt-2 text-mist">{current.hint}</p>

            {step === 0 && (
              <div className="mt-7 space-y-7">
                <div
                  role="radiogroup"
                  aria-label="Property type"
                  className="grid grid-cols-2 gap-3"
                >
                  {propertyTypes.map((t) => {
                    const on = draft.property_type === t;
                    return (
                      <label key={t} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="property_type"
                          value={t}
                          checked={on}
                          onChange={() => set("property_type", t)}
                          className="peer sr-only"
                        />
                        <span className="flex h-full flex-col gap-4 rounded-2xl border border-white/12 bg-white/[0.02] p-4 transition-all hover:border-white/30 peer-checked:border-ember peer-checked:bg-ember/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
                          <span className="flex items-start justify-between">
                            <span
                              className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${on ? "bg-ember text-night" : "bg-ember/12 text-ember"}`}
                            >
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                {propertyCards[t].icon}
                              </svg>
                            </span>
                            <Check on={on} />
                          </span>
                          <span className="font-semibold text-snow">
                            {propertyCards[t].label}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <fieldset>
                  <legend className="text-sm font-medium">
                    How many rooms?
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roomRanges.map((r) => (
                      <Chip
                        key={r}
                        type="radio"
                        name="rooms"
                        value={r}
                        checked={draft.rooms === r}
                        onChange={() => set("rooms", r)}
                      >
                        {r}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor={`${id}-property_name`}
                    className="text-sm font-medium"
                  >
                    Property name{" "}
                    <span className="font-normal text-haze">(optional)</span>
                  </label>
                  <input
                    id={`${id}-property_name`}
                    value={draft.property_name}
                    onChange={(e) => set("property_name", e.target.value)}
                    autoComplete="organization"
                    placeholder="e.g. Hotel Teesta"
                    className={input}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-7 space-y-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  {interests.map((i) => {
                    const on = draft.interest.includes(i);
                    const p = pricing[i];
                    return (
                      <label key={i} className="relative cursor-pointer">
                        <input
                          type="checkbox"
                          name="interest"
                          value={i}
                          checked={on}
                          onChange={() => toggleInterest(i)}
                          className="peer sr-only"
                        />
                        <span className="flex h-full items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.02] p-4 transition-all hover:border-white/30 peer-checked:border-ember peer-checked:bg-ember/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
                          <Check on={on} />
                          <span>
                            <span className="block font-semibold text-snow">
                              {i}
                            </span>
                            <span className="mt-1 block text-sm text-haze">
                              from {startingPrice(p)} {p.unit}
                              {p.upfront > 0 && p.monthly
                                ? ` + ${formatINR(p.monthly)}/mo`
                                : ""}
                            </span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <Estimate selected={draft.interest} />
                <fieldset>
                  <legend className="text-sm font-medium">
                    When would you like to start?
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {timelines.map((t) => (
                      <Chip
                        key={t}
                        type="radio"
                        name="timeline"
                        value={t}
                        checked={draft.timeline === t}
                        onChange={() => set("timeline", t)}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor={`${id}-name`} className="text-sm font-medium">
                    Your name <span className="text-ember">*</span>
                  </label>
                  <input
                    id={`${id}-name`}
                    value={draft.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    required
                    className={input}
                    {...a11y("name")}
                  />
                  {err("name")}
                </div>
                <div>
                  <label
                    htmlFor={`${id}-phone`}
                    className="text-sm font-medium"
                  >
                    Phone / WhatsApp
                  </label>
                  <input
                    id={`${id}-phone`}
                    value={draft.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 98000 00000"
                    className={input}
                    {...a11y("phone")}
                  />
                  {err("phone")}
                </div>
                <div>
                  <label
                    htmlFor={`${id}-email`}
                    className="text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    id={`${id}-email`}
                    value={draft.email}
                    onChange={(e) => set("email", e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@yourhotel.com"
                    className={input}
                    {...a11y("email")}
                  />
                  {err("email")}
                </div>
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium">
                    Best way to reach you
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contactMethods.map((m) => (
                      <Chip
                        key={m}
                        type="radio"
                        name="preferred_contact"
                        value={m}
                        checked={draft.preferred_contact === m}
                        onChange={() => set("preferred_contact", m)}
                      >
                        {m}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`${id}-message`}
                    className="text-sm font-medium"
                  >
                    Anything else?{" "}
                    <span className="font-normal text-haze">(optional)</span>
                  </label>
                  <textarea
                    id={`${id}-message`}
                    value={draft.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={3}
                    placeholder="Your current website, where guests find you, what you'd like to fix…"
                    className={input}
                  />
                </div>
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>
      </div>

      {/* Honeypot, hidden from people and assistive tech */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${id}-hp`}>Company website</label>
        <input
          id={`${id}-hp`}
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {notice && (
        <p
          role="alert"
          className="relative mt-6 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {notice}
        </p>
      )}

      <div className="relative mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="btn btn-ghost"
          >
            <span aria-hidden="true">←</span> Back
          </button>
        ) : (
          <p className="text-xs text-haze">
            Takes about a minute. We never share your details.
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary shrink-0 whitespace-nowrap"
          disabled={status === "sending"}
        >
          {step < steps.length - 1 ? (
            <>
              Continue <span aria-hidden="true">→</span>
            </>
          ) : status === "sending" ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-night/30 border-t-night"
                aria-hidden="true"
              />
              Sending…
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
      </div>
    </form>
  );
}
