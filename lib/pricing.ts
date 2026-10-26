import type { Interest } from "./leadOptions";

/**
 * Starting prices, set against 2026 Indian market rates for small hotels and
 * homestays (freelancers ₹10k–₹1.5L per site, agencies from ₹50k; chatbot
 * platforms ₹1k–₹8k a month; maintenance plans ₹3k–₹20k a month).
 * All prices exclude GST. Change them here and the site updates everywhere.
 */
export type Price = {
  /** Paid once (or per session for training). */
  upfront: number;
  /** Paid every month, if any. */
  monthly?: number;
  /** Short label shown after the upfront price. */
  unit: string;
};

export const pricing: Record<Interest, Price> = {
  Website: { upfront: 24999, unit: "one-time" },
  "AI Booking Bot": { upfront: 14999, monthly: 1999, unit: "setup" },
  "Monthly Management": { upfront: 0, monthly: 4999, unit: "per month" },
  Training: { upfront: 2999, unit: "per session" },
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** The headline number for a service card. */
export function startingPrice(p: Price) {
  return p.upfront > 0 ? formatINR(p.upfront) : formatINR(p.monthly ?? 0);
}

/** Adds up a selection into an upfront total and a monthly total. */
export function estimate(selected: readonly Interest[]) {
  return selected.reduce(
    (acc, s) => ({ upfront: acc.upfront + pricing[s].upfront, monthly: acc.monthly + (pricing[s].monthly ?? 0) }),
    { upfront: 0, monthly: 0 },
  );
}
