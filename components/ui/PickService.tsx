"use client";

import type { Interest } from "@/lib/leadOptions";

export const PICK_SERVICE_EVENT = "gorkhay:pick-service";

/** Jumps to the contact form with this service already ticked. Works as a plain link without JS. */
export function PickService({ service, className, children }: { service: Interest; className?: string; children: React.ReactNode }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent<Interest>(PICK_SERVICE_EVENT, { detail: service }))}
    >
      {children}
    </a>
  );
}
