import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/og/OgCard";

export const alt = "GorkhayAI: AI that brings guests to your door";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="AI studio · Darjeeling"
        title="AI that brings guests to your door."
        subtitle="Websites, booking bots and lead systems for hotels and homestays."
      />
    ),
    size,
  );
}
