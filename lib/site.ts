export const site = {
  name: "GorkhayAI",
  // www is the host that answers. The apex 307s here, so canonical and social URLs use www.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gorkhayai.com").replace(/\/$/, ""),
  title: "GorkhayAI · AI that brings guests to your door",
  description:
    "GorkhayAI is an AI studio from Darjeeling, India. We build websites, AI booking bots and lead systems for hotels and homestays, manage them monthly and train owners to use them.",
  founder: "Upesh Bishwakarma",
  location: "Darjeeling, West Bengal, India",
  // Digits only, with country code, e.g. 919800000000. Set in Vercel env.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "ceo@gorkhayai.com",
  caseStudyUrl: "https://mainalihospitality.com",
} as const;

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#insights", label: "Insights" },
  { href: "/#about", label: "About" },
] as const;

/** Null until NEXT_PUBLIC_WHATSAPP_NUMBER is set. An empty wa.me link is a dead end. */
export function whatsappLink(text = "Hi GorkhayAI, I'd like to talk about my property.") {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
