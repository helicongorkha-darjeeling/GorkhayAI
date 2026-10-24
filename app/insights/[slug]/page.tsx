import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPosts } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date.toISOString(),
      authors: [post.author],
      url: `/insights/${post.slug}`,
    },
  };
}

export default async function PostPage(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.category === "Tool review" ? "Review" : "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/insights/${post.slug}`,
    ...(post.category === "Tool review" ? { itemReviewed: { "@type": "SoftwareApplication", name: post.title.replace(/^Tool review:\s*/i, "") } } : {}),
  };

  return (
    <article className="container-x max-w-3xl pb-28 pt-36 md:pt-44">
      <Link href="/insights" className="text-sm text-haze hover:text-snow">
        ← All insights
      </Link>
      <header className="mt-8">
        <p className="eyebrow">{post.category}</p>
        <h1 className="h-display mt-4 text-4xl md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg text-mist">{post.description}</p>
        <p className="mt-6 text-sm text-haze">
          {post.author} · <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
      </header>
      <div className="prose-article mt-12 border-t border-white/10 pt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
      <aside className="glass mt-16 rounded-3xl p-8">
        <h2 className="font-display text-2xl">Want this set up for your property?</h2>
        <p className="mt-2 text-mist">Websites, booking bots and lead systems for hotels and homestays.</p>
        <Link href="/#contact" className="btn btn-primary mt-6">
          Book a call
        </Link>
      </aside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
