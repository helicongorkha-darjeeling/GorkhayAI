import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/content";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-night/60 p-6 transition-colors hover:border-ember/50 md:p-7">
      <div className="flex items-center gap-3 text-xs">
        <span className={`rounded-full px-2.5 py-1 font-semibold ${post.category === "Tool review" ? "bg-ember/15 text-ember-soft" : "bg-white/8 text-mist"}`}>
          {post.category}
        </span>
        <span className="text-haze">{post.readingMinutes} min read</span>
      </div>
      <h3 className="mt-5 font-display text-2xl leading-snug">
        <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0 after:rounded-3xl">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-mist">{post.description}</p>
      <p className="mt-auto flex items-center justify-between pt-6 text-sm text-haze">
        <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
        <span aria-hidden="true" className="text-ember transition-transform group-hover:translate-x-1">
          →
        </span>
      </p>
    </article>
  );
}
