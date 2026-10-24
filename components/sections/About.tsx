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
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 py-24 md:py-36">
      <div className="container-x grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <figure className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_60%_10%,#ffb37f33,transparent_55%),linear-gradient(180deg,#1a2a4d,#050b18)]">
            {/* Swap for a portrait: public/about/upesh.webp */}
            <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d="M0 380 L90 300 L140 330 L230 240 L280 280 L400 200 L400 500 L0 500Z" fill="#0a1428" />
              <path d="M230 240 L250 258 L238 262 L226 252Z M400 200 L380 214 L392 218Z" fill="#f4f7fb" opacity="0.7" />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-8xl text-snow/90" aria-hidden="true">
              UB
            </span>
          </div>
          <figcaption className="mt-4 text-center text-sm text-haze">Upesh Bishwakarma, founder</figcaption>
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
