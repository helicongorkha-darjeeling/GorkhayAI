"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useCan3D";

const steps = [
  {
    title: "Guest enquiry",
    body: "A guest picks dates and leaves a phone number on mainalihospitality.com.",
    icon: (
      <path d="M4 6h16v10H8l-4 4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    title: "Supabase",
    body: "The lead lands in a secure leads table, tagged with how far the guest got.",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </g>
    ),
  },
  {
    title: "Front-desk sheet",
    body: "Reception sees it in their sheet, calls back, and ticks it off.",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 10h16M4 15h16M10 4v16" />
      </g>
    ),
  },
];

const stages = ["details", "rooms", "review", "payment", "booked"];

export function LeadFlow() {
  const reduce = useReducedMotion();

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <p className="text-sm font-semibold text-snow">How an enquiry travels</p>
      <ol className="relative mt-6 grid gap-6 md:grid-cols-3 md:gap-4">
        {/* Connector with a travelling pulse */}
        <div aria-hidden="true" className="absolute left-6 top-6 h-[calc(100%-3rem)] w-px bg-navy-600 md:left-[16%] md:right-[16%] md:top-6 md:h-px md:w-auto">
          {!reduce && (
            <motion.span
              className="absolute block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_18px_4px_rgba(255,138,61,0.55)]"
              initial={false}
              animate={{ left: ["0%", "100%"], top: ["0%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            />
          )}
        </div>
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
            <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-navy-800 text-ember">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                {step.icon}
              </svg>
            </span>
            <div>
              <p className="text-xs text-haze">Step {i + 1}</p>
              <h3 className="mt-1 font-semibold text-snow">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mist">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-haze">Lead stages tracked</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {stages.map((s) => (
            <li key={s} className="rounded-full border border-white/10 px-3 py-1 text-sm capitalize text-mist">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
