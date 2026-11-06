import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/og/OgCard";

export const alt = "Notes from the front desk · GorkhayAI";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Insights"
        title="Notes from the front desk"
        subtitle="Practical guides and honest tool reviews for hotel and homestay owners."
      />
    ),
    size,
  );
}
