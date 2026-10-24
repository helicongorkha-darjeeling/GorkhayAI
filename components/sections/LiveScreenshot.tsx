"use client";

import Image from "next/image";
import { useState } from "react";

const target = "https://www.mainalihospitality.com";
// Fresh screenshot of the live site, cached by the image optimiser.
const screenshotUrl =
  "https://api.microlink.io/?" +
  new URLSearchParams({
    url: target,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    "viewport.width": "1440",
    "viewport.height": "900",
    waitForTimeout: "1500",
  }).toString();

/** Live screenshot of the Hotel Teesta site, with a drawn fallback if the service is down. */
export function LiveScreenshot() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[16/10] flex-col justify-end bg-[radial-gradient(ellipse_at_70%_20%,#3b4c74,#101d38_60%)] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-mist">Hotel Teesta · Darjeeling</p>
        <p className="mt-3 font-display text-5xl text-snow">Welcome.</p>
        <p className="mt-2 text-sm text-mist">Stay your way · Eat in · Go further</p>
      </div>
    );
  }

  return (
    <Image
      src={screenshotUrl}
      alt="Live screenshot of the Hotel Teesta website at mainalihospitality.com"
      width={1440}
      height={900}
      sizes="(min-width: 1024px) 640px, 100vw"
      className="aspect-[16/10] h-auto w-full object-cover object-top"
      onError={() => setFailed(true)}
    />
  );
}
