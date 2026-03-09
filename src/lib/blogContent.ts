import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BlogPreviewArticle } from "@/lib/types";

const BLOG_CONTENT_DIRECTORY = join(process.cwd(), "content", "blog");

type Frontmatter = Record<string, string>;

function parseMdx(source: string): { frontmatter: Frontmatter; body: string } {
  const frontmatterMatch = source.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/
  );

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: source };
  }

  const frontmatter: Frontmatter = {};
  const rawFrontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key) continue;

    const value = line.slice(separatorIndex + 1).trim();
    frontmatter[key] = value.replace(/^["']/, "").replace(/["']$/, "");
  }

  return { frontmatter, body };
}

function deriveDescription(body: string): string {
  const candidateParagraph = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .find(
      (paragraph) =>
        paragraph.length > 0 &&
        !paragraph.startsWith("#") &&
        !paragraph.startsWith("```") &&
        !paragraph.startsWith("![")
    );

  if (!candidateParagraph) {
    return "Read the full article for details.";
  }

  const cleaned = candidateParagraph.replace(/\s+/g, " ");
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
}

function sourceFromUrl(url?: string): string {
  if (!url) return "Blog";

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    if (hostname === "jananadiw.com") return "Blog";
    if (hostname === "medium.com") return "Medium";
    return hostname;
  } catch {
    return "External";
  }
}

function toEpoch(date: string): number {
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normalizeTitle(slug: string): string {
  return slug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export async function getBlogPreviewArticles(): Promise<BlogPreviewArticle[]> {
  let fileNames: string[] = [];

  try {
    fileNames = await readdir(BLOG_CONTENT_DIRECTORY);
  } catch {
    return [];
  }

  const mdxFileNames = fileNames.filter((name) => name.endsWith(".mdx"));

  const articles = await Promise.all(
    mdxFileNames.map(async (fileName) => {
      const filePath = join(BLOG_CONTENT_DIRECTORY, fileName);
      const source = await readFile(filePath, "utf-8");
      const { frontmatter, body } = parseMdx(source);
      const id = fileName.replace(/\.mdx$/, "");
      const externalUrl = frontmatter.externalUrl;

      return {
        id,
        title: frontmatter.title || normalizeTitle(id),
        publishedAt: frontmatter.date || "1970-01-01",
        description: frontmatter.description || deriveDescription(body),
        source: sourceFromUrl(externalUrl),
        externalUrl: externalUrl || undefined,
        mdxContent: externalUrl ? undefined : body.trim(),
      } satisfies BlogPreviewArticle;
    })
  );

  return articles.sort(
    (articleA, articleB) =>
      toEpoch(articleB.publishedAt) - toEpoch(articleA.publishedAt)
  );
}
