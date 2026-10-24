import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { PostCard } from "@/components/sections/PostCard";

export const metadata: Metadata = {
  title: "Insights",
  description: "Guides and honest tool reviews for hotel and homestay owners, from the GorkhayAI studio in Darjeeling.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const posts = await getPosts();
  return (
    <div className="container-x pb-28 pt-36 md:pt-44">
      <p className="eyebrow">Insights</p>
      <h1 className="h-display mt-4 text-5xl md:text-6xl">Notes from the front desk</h1>
      <p className="mt-5 max-w-2xl text-lg text-mist">
        Practical guides and honest tool reviews for hotel and homestay owners.
      </p>
      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
