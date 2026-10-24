import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

const frontmatter = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  category: z.enum(["Blog", "Tool review"]),
  author: z.string().default("Upesh Bishwakarma"),
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof frontmatter> & { slug: string; readingMinutes: number };
export type Post = PostMeta & { html: string };

async function loadFile(file: string) {
  const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const meta = frontmatter.parse(data);
  const words = content.trim().split(/\s+/).length;
  return {
    meta: { ...meta, slug: file.replace(/\.md$/, ""), readingMinutes: Math.max(1, Math.round(words / 220)) },
    content,
  };
}

/** All published posts, newest first. Files in /content ending in .md. */
export async function getPosts(): Promise<PostMeta[]> {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(files.map(async (f) => (await loadFile(f)).meta));
  return posts.filter((p) => !p.draft).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const { meta, content } = await loadFile(`${slug}.md`);
    if (meta.draft) return null;
    const html = String(
      await remark().use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(rehypeStringify).process(content),
    );
    return { ...meta, html };
  } catch {
    return null;
  }
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
