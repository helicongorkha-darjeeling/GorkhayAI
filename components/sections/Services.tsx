import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";

const services = [
  {
    name: "Website",
    body: "A fast, beautiful site that shows your rooms, views and food, ranks on Google and turns visitors into enquiries.",
    points: ["Mobile-first design", "Room and rate pages", "Google-ready SEO"],
    icon: <path d="M3 5h18v14H3zM3 9h18M7 7h.01" />,
  },
  {
    name: "AI Booking Bot",
    body: "A bot on your site and WhatsApp that answers guest questions day and night and collects booking details.",
    points: ["Answers common guest questions", "Captures name, dates, phone", "Hands off to your staff"],
    icon: <path d="M12 3v3M7 8h10a3 3 0 013 3v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5a3 3 0 013-3zM9 13h.01M15 13h.01" />,
  },
  {
    name: "Monthly Management",
    body: "We keep everything running: updates, seasonal offers, bot tuning and a monthly report on your leads.",
    points: ["Content and rate updates", "Bot and lead monitoring", "Monthly lead report"],
    icon: <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />,
  },
  {
    name: "Training",
    body: "Hands-on sessions so you and your front desk know how to use the lead sheet, the bot and the website.",
    points: ["On-site or video call", "Simple written guides", "Follow-up support"],
    icon: <path d="M2 8l10-5 10 5-10 5zM6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />,
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative scroll-mt-20 overflow-hidden band py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/4 h-[480px] w-[480px] rounded-full bg-ember/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Everything a property needs to win guests online"
          intro="Pick one, or let us run the whole system for you. Every package is set up for your property, not a template."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.name} className="reveal h-full">
              <TiltCard className="h-full rounded-3xl">
                <article className="glass flex h-full flex-col rounded-3xl p-6 transition-colors duration-300 hover:border-ember/40" style={{ transform: "translateZ(30px)" }}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember/12 text-ember">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {s.icon}
                      </svg>
                    </span>
                    <span className="font-display text-3xl text-navy-600" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{s.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.body}</p>
                  <ul className="mb-6 mt-5 space-y-2 text-sm text-mist">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span aria-hidden="true" className="text-ember">·</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto border-t border-white/10 pt-5 text-sm text-haze">
                    Starting from <span className="text-lg font-semibold text-snow">₹____</span>
                  </p>
                </article>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
