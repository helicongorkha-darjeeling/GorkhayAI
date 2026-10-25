"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    name: "Build",
    time: "Weeks 1–3",
    body: "We visit or call, learn how your guests book today, then design and build your website, booking bot and lead sheet around it.",
  },
  {
    name: "Launch",
    time: "Launch day",
    body: "We go live, connect Google, WhatsApp and your lead sheet, and train your team so every enquiry gets a call back.",
  },
  {
    name: "Manage",
    time: "Every month",
    body: "We update content and offers, tune the bot from real guest questions, and send you a simple report on your leads.",
  },
];

// A trekking route from base camp to summit. The three camps mark the steps
// and sit on the ridge line drawn below.
const TRAIL = "M34 292 C 80 286, 112 250, 150 238 S 222 214, 252 176 S 318 120, 352 98 S 392 62, 404 50";
const CAMPS = [
  { x: 34, y: 292 },
  { x: 252, y: 176 },
  { x: 404, y: 50 },
];
const RIDGE_FAR = "M-40 260 L60 210 L110 228 L190 160 L240 186 L330 120 L380 150 L440 110 L500 190 L560 320 L-40 320Z";
const RIDGE = "M-40 320 L-40 310 L60 270 L118 226 L160 246 L262 150 L300 170 L404 40 L452 104 L500 190 L560 320Z";
const SNOW = "M262 150 L282 162 L270 166 L258 158 L250 164Z M404 40 L424 68 L410 64 L400 72 L392 58Z";

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const path = root.current!.querySelector<SVGPathElement>("[data-trail]")!;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const panels = gsap.utils.toArray<HTMLElement>("[data-step]");
        const camps = gsap.utils.toArray<SVGGElement>("[data-camp]");
        // Stack the panels so they can cross-fade; reverted automatically when
        // the media query stops matching (e.g. reduced motion is switched on).
        gsap.set("[data-steps]", { position: "relative", minHeight: 320 });
        gsap.set(panels, { position: "absolute", left: 0, right: 0, top: 0 });
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });
        gsap.set(camps.slice(1), { opacity: 0.25 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.6,
          },
        });
        tl.to(path, { strokeDashoffset: len * 0.45, duration: 1 }, 0)
          .to(panels[0], { autoAlpha: 0, y: -40, duration: 0.4 }, 0.6)
          .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 0.8)
          .to(camps[1], { opacity: 1, duration: 0.2 }, 0.9)
          .to(path, { strokeDashoffset: 0, duration: 1 }, 1.1)
          .to(panels[1], { autoAlpha: 0, y: -40, duration: 0.4 }, 1.7)
          .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 1.9)
          .to(camps[2], { opacity: 1, duration: 0.2 }, 2.0);
      });
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} aria-labelledby="process-title" className="relative scroll-mt-20 bg-night">
      <div data-pin className="flex min-h-[100svh] flex-col justify-center py-24">
        <div className="container-x">
          <SectionHeading id="process-title" eyebrow="How it works" title="Three steps to the summit" />

          <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
            <svg viewBox="0 0 440 320" className="hidden w-full overflow-visible md:block" aria-hidden="true">
              <defs>
                <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#22355f" />
                  <stop offset="1" stopColor="#050b18" />
                </linearGradient>
                <linearGradient id="ridge-far" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#14213f" />
                  <stop offset="1" stopColor="#050b18" />
                </linearGradient>
                <radialGradient id="dawn">
                  <stop offset="0" stopColor="#ff8a3d" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="fade-b" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0.6" stopColor="#fff" />
                  <stop offset="1" stopColor="#000" />
                </linearGradient>
                <mask id="fade" maskUnits="userSpaceOnUse" x="-60" y="-20" width="640" height="340">
                  <rect x="-60" y="-20" width="640" height="340" fill="url(#fade-b)" />
                </mask>
              </defs>
              <circle cx="390" cy="120" r="170" fill="url(#dawn)" />
              <g mask="url(#fade)">
                <path d={RIDGE_FAR} fill="url(#ridge-far)" />
                <path d={RIDGE} fill="url(#ridge)" />
                <path d={SNOW} fill="#f4f7fb" opacity="0.85" />
              </g>
              <path d={TRAIL} fill="none" stroke="#2a3d66" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
              <path data-trail d={TRAIL} fill="none" stroke="#ff8a3d" strokeWidth="3" strokeLinecap="round" />
              {CAMPS.map((c, i) => (
                <g key={i} data-camp transform={`translate(${c.x} ${c.y})`}>
                  <circle r="16" fill="#ff8a3d" opacity="0.12" />
                  <circle r="10" fill="#050b18" stroke="#ff8a3d" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fontSize="10" fill="#f4f7fb" fontWeight="700">
                    {i + 1}
                  </text>
                  <text x={i === 0 ? 0 : -20} y={i === 0 ? 30 : 5} textAnchor={i === 0 ? "start" : "end"} fontSize="13" fontWeight="600" fill="#f4f7fb">
                    {steps[i].name}
                  </text>
                </g>
              ))}
            </svg>

            <ol data-steps className="grid gap-6">
              {steps.map((s, i) => (
                <li key={s.name} data-step className="glass rounded-3xl p-7 md:p-9">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-6xl text-ember md:text-7xl" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold md:text-3xl">{s.name}</h3>
                      <p className="text-sm text-haze">{s.time}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-lg leading-relaxed text-mist">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
