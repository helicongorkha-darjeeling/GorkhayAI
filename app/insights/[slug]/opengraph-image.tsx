import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/og/OgCard";
import { getPost, getPosts } from "@/lib/content";

export const alt = "GorkhayAI insight";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return new ImageResponse(
    <OgCard eyebrow={post?.category ?? "Insights"} title={post?.title ?? "GorkhayAI Insights"} />,
    size,
  );
}
