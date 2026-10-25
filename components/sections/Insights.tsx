import Link from "next/link";
import { getPosts } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "./PostCard";

export async function Insights() {
  const posts = (await getPosts()).slice(0, 6);

  return (
    <section id="insights" aria-labelledby="insights-title" className="band scroll-mt-20 py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="insights-title"
            eyebrow="Insights"
            title="Notes from the front desk"
            intro="Practical guides and honest tool reviews for hotel and homestay owners."
          />
          <Link href="/insights" className="btn btn-ghost self-start md:self-auto">
            All insights
          </Link>
        </div>
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug} className="reveal">
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
