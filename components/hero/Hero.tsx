"use client";

import dynamic from "next/dynamic";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { heroStore } from "@/lib/heroStore";
import { detect3DSupport } from "@/lib/useCan3D";
import { site } from "@/lib/site";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const posterAlt =
  "Low-poly Kanchenjunga range at dawn, snow peaks catching first light above misty Darjeeling hills";

/** Static dawn poster: the LCP image, and the full fallback when 3D is off. */
function Poster() {
  const common = { alt: posterAlt, sizes: "100vw", quality: 80 } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/hero/poster-desktop.webp", width: 1920, height: 1080 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/hero/poster-mobile.webp", width: 828, height: 1472 });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source media="(max-width: 767px)" srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img {...rest} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const [use3D, setUse3D] = useState(false);
  const [ready, setReady] = useState(false);

  // Load the WebGL scene only on capable devices, and only once the page is
  // interactive so it never competes with the first paint.
  useEffect(() => {
    if (!detect3DSupport()) return;
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      cleanup();
      setUse3D(true);
    };
    const events = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    // Touch devices wait for the first touch or scroll; desktops also start
    // on their own once the main thread has been idle for a while.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const timer = coarse ? undefined : window.setTimeout(start, 4500);
    const cleanup = () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
    };
    return cleanup;
  }, []);

  useEffect(() => {
    if (!use3D) return;
    const onMove = (e: PointerEvent) => {
      heroStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      heroStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [use3D]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          heroStore.scroll = self.progress;
        },
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-night pb-20 pt-28 md:items-center md:pb-0"
    >
      <Poster />
      {use3D && (
        <div className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroCanvas onReady={() => setReady(true)} />
        </div>
      )}

      {/* Legibility scrims */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/50" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-night/80 via-night/20 to-transparent md:w-2/3" />

      <div data-hero-copy className="container-x relative z-10">
        <p className="hero-reveal eyebrow">
          AI studio · Darjeeling, India
        </p>
        <h1 id="hero-title" className="hero-rise h-display mt-5 max-w-3xl text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          AI that brings guests to <span className="italic text-ember">your door.</span>
        </h1>
        <p className="hero-reveal mt-6 [animation-delay:150ms] max-w-xl text-lg leading-relaxed text-mist md:text-xl">
          Websites, booking bots and lead systems for hotels and homestays.
        </p>
        <div className="hero-reveal mt-9 [animation-delay:250ms] flex flex-col gap-3 sm:flex-row">
          <a href={site.caseStudyUrl} target="_blank" rel="noopener" className="btn btn-primary">
            See a live hotel site
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 11L11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Link href="/#contact" className="btn btn-ghost">
            Book a call
          </Link>
        </div>
      </div>

      <a
        href="#work"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-haze hover:text-snow md:flex"
      >
        Scroll
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-mist to-transparent" aria-hidden="true" />
      </a>
    </section>
  );
}
