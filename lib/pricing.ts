import type { Interest, PropertyType } from "./leadOptions";

/**
 * Starting prices approved by Upesh on 9 Nov 2026. Every figure is before
 * 18% GST. Cards show the lowest "from" price. The contact-form estimate
 * uses the property type from step 1. The package itself is quoted on the call.
 */

export type Price = {
  /** Paid once (or per session for training). */
  upfront: number;
  /** Paid every month, if any. */
  monthly?: number;
  /** Short label shown after the upfront price. */
  unit: string;
};

/** Website tiers. Restaurants share the homestay price. */
const website = {
  homestay: { upfront: 9999, unit: "one-time" },
  hotel: { upfront: 14999, unit: "one-time" },
  agency: { upfront: 19999, unit: "one-time" },
} as const satisfies Record<string, Price>;

/** Booking-bot tiers. There is no separate restaurant or travel-agency bot price. */
const bot = {
  homestay: { upfront: 4999, monthly: 2499, unit: "setup" },
  hotel: { upfront: 7999, monthly: 3999, unit: "setup" },
} as const satisfies Record<string, Price>;

/** Website upkeep. The card also shows full management beside this. */
const upkeep: Price = { upfront: 0, monthly: 999, unit: "per month" };
const fullManagement: Price = { upfront: 0, monthly: 5999, unit: "per month" };
const training: Price = { upfront: 2999, unit: "per session" };

/**
 * Homestay, restaurant and "something else" use the lowest published tier.
 * Hotel and resort use the hotel tier. Travel agencies have their own
 * website price; their bot estimate stays on the lowest bot tier because
 * no travel-agency bot price was set.
 */
function botTier(property: PropertyType | null): keyof typeof bot {
  return property === "hotel" || property === "resort" ? "hotel" : "homestay";
}

function websiteTier(property: PropertyType | null): keyof typeof website {
  switch (property) {
    case "hotel":
    case "resort":
      return "hotel";
    case "travel_agency":
      return "agency";
    default:
      return "homestay";
  }
}

/** Price used for one service, given the property type already chosen. */
export function priceFor(service: Interest, property: PropertyType | null = null): Price {
  switch (service) {
    case "Website":
      return website[websiteTier(property)];
    case "AI Booking Bot":
      return bot[botTier(property)];
    case "Monthly Management":
      return upkeep;
    case "Training":
      return training;
  }
}

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** The headline number for a price. */
export function startingPrice(p: Price) {
  return p.upfront > 0 ? formatINR(p.upfront) : formatINR(p.monthly ?? 0);
}

/** Lowest from-price, which is what a service card shows. */
export function cardPrice(service: Interest): Price {
  return priceFor(service);
}

/** Second line under a card price, when setup and a monthly fee both apply. */
export function cardMonthlyLine(service: Interest): string | null {
  const p = cardPrice(service);
  return p.upfront > 0 && p.monthly ? `then from ${formatINR(p.monthly)}/month` : null;
}

/** Makes the other published tiers visible without a second price stamp. */
export function cardRange(service: Interest): string | null {
  switch (service) {
    case "Website":
      return `Homestays and restaurants from ${formatINR(website.homestay.upfront)}. Hotels from ${formatINR(website.hotel.upfront)}. Travel agencies from ${formatINR(website.agency.upfront)}.`;
    case "AI Booking Bot":
      return `Homestays from ${formatINR(bot.homestay.upfront)} + ${formatINR(bot.homestay.monthly)}/month. Hotels from ${formatINR(bot.hotel.upfront)} + ${formatINR(bot.hotel.monthly)}/month.`;
    case "Monthly Management":
      return `Full management (hosting, Google Business Profile, leads and payments) from ${formatINR(fullManagement.monthly ?? 0)}/month.`;
    default:
      return null;
  }
}

/** Short "from" line on a service option in the form. */
export function optionPrice(service: Interest, property: PropertyType | null): string {
  const p = priceFor(service, property);
  const head = `from ${startingPrice(p)} ${p.unit}`;
  if (service === "Monthly Management") {
    return `${head} · full management from ${formatINR(fullManagement.monthly ?? 0)}/mo`;
  }
  if (p.upfront > 0 && p.monthly) return `${head} + ${formatINR(p.monthly)}/mo`;
  return head;
}

/** Adds up a selection into an upfront total and a monthly total. */
export function estimate(selected: readonly Interest[], property: PropertyType | null = null) {
  return selected.reduce(
    (acc, s) => {
      const p = priceFor(s, property);
      return { upfront: acc.upfront + p.upfront, monthly: acc.monthly + (p.monthly ?? 0) };
    },
    { upfront: 0, monthly: 0 },
  );
}
