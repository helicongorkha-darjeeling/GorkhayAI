import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { site } from "@/lib/site";
import { LeadFlow } from "./LeadFlow";
import { LiveScreenshot } from "./LiveScreenshot";

const delivered = [
  "A fast, mobile-first hotel website",
  "Booking enquiry flow that captures every phone number",
  "Leads stored in Supabase, synced to the front desk",
  "Monthly care and staff training",
];

export function Proof() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-20 py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="work-title"
          eyebrow="Proof · Case study"
          title={
            <>
              Hotel Teesta, <span className="italic text-mist">Darjeeling</span>
            </>
          }
          intro="A family-run hotel that wanted fewer missed enquiries. We built the site, wired every enquiry into a lead system, and put it in front of the people who pick up the phone."
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <TiltCard className="rounded-3xl" max={8}>
            <a
              href={site.caseStudyUrl}
              target="_blank"
              rel="noopener"
              className="group block overflow-hidden rounded-3xl border border-white/10 bg-navy-800 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 truncate rounded-full bg-night/70 px-3 py-1 text-xs text-haze">
                  mainalihospitality.com
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-ember">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" /> Live
                </span>
              </div>
              <LiveScreenshot />
              <span className="sr-only">Visit the Hotel Teesta website (opens in a new tab)</span>
            </a>
          </TiltCard>

          <div className="flex flex-col gap-8">
            <ul className="grid gap-3">
              {delivered.map((item) => (
                <li key={item} className="flex items-start gap-3 text-mist">
                  <svg className="mt-1 shrink-0 text-ember" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <LeadFlow />
          </div>
        </div>
      </div>
    </section>
  );
}
