import { SectionHeading } from "@/components/ui/SectionHeading";

const shipLog = [
  { name: "Hills Tour and Travels", kind: "Tourism" },
  { name: "Homestay Samaj", kind: "Homestays" },
  { name: "Lamahata High School", kind: "Education" },
  { name: "Bishwakarma Samaj", kind: "Community" },
  { name: "AI for Students", kind: "AI" },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 overflow-hidden py-24 md:py-36">
      <div className="container-x grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <figure className="reveal relative mx-auto w-full max-w-sm">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-ember/10 blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#0a1428,#1a2a4d_55%,#2a2440_75%,#050b18)]">
            {/* Swap for a portrait: public/about/upesh.webp */}
            <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <defs>
                <radialGradient id="about-sun" cx="0.7" cy="0.62" r="0.45">
                  <stop offset="0" stopColor="#ffb37f" stopOpacity="0.55" />
                  <stop offset="0.5" stopColor="#ff8a3d" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="500" fill="url(#about-sun)" />
              <path d="M0 330 L70 280 L120 300 L210 205 L250 235 L300 190 L400 270 L400 500 L0 500Z" fill="#22355f" />
              <path d="M210 205 L232 224 L218 226 L206 216 L196 222Z M300 190 L322 208 L308 206 L298 214 L290 202Z" fill="#f4f7fb" opacity="0.85" />
              <path d="M0 380 L90 330 L150 352 L240 300 L320 340 L400 310 L400 500 L0 500Z" fill="#101d38" />
              <path d="M0 430 L110 400 L200 420 L300 392 L400 420 L400 500 L0 500Z" fill="#050b18" />
            </svg>
            <div className="absolute inset-x-0 top-0 p-8">
              <span className="font-display text-7xl leading-none text-snow" aria-hidden="true">
                UB
              </span>
              <span className="mt-3 block h-px w-12 bg-ember" aria-hidden="true" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-haze">Founder</p>
              <p className="mt-1 font-display text-2xl text-snow">Upesh Bishwakarma</p>
            </div>
          </div>
          <figcaption className="sr-only">Upesh Bishwakarma, founder of GorkhayAI</figcaption>
        </figure>

        <div>
          <SectionHeading
            id="about-title"
            eyebrow="About"
            title={
              <>
                Built in Darjeeling, <span className="italic text-mist">for the hills.</span>
              </>
            }
          />
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-mist">
            <p>
              GorkhayAI is run by Upesh Bishwakarma, a self-taught AI builder from Lamahatta, Darjeeling. Upesh builds
              practical infrastructure for remote communities: websites, homestay systems, tourism platforms and AI
              tools that work for the people who live and host here.
            </p>
            <p>
              Every project starts from understanding people, not templates. That is how we work with hotels and
              homestays too. We build the system, stay with you every month, and train your team to use it.
            </p>
          </div>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-haze">Also built in the hills</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shipLog.map((p) => (
                <li key={p.name} className="rounded-full border border-white/10 px-3.5 py-1.5 text-sm text-mist">
                  {p.name} <span className="text-haze">· {p.kind}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {[
              ["Based in", "Lamahatta"],
              ["Focus", "Hotels & homestays"],
              ["Support", "Monthly"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-[0.18em] text-haze">{k}</dt>
                <dd className="mt-2 font-semibold text-snow">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
