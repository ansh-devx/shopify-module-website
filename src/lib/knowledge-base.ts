import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

export interface KnowledgeArticle {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  date: string;
  content: string;
}

function parseFrontmatter(raw: string): {
  metadata: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: raw };

  const metadata: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line
        .slice(colonIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      metadata[key] = value;
    }
  }

  return { metadata, content: match[2].trim() };
}

export function loadKnowledgeBase(): KnowledgeArticle[] {
  const dir = path.join(process.cwd(), "knowledge-base");

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { metadata, content } = parseFrontmatter(raw);

    return {
      slug: file.replace(".md", ""),
      title: metadata.title || file.replace(".md", ""),
      author: metadata.author || "Unknown",
      tags: metadata.tags
        ? metadata.tags.split(",").map((t) => t.trim())
        : [],
      date: metadata.date || "",
      content,
    };
  });
}

export function searchKnowledgeBase(
  query: string,
  articles: KnowledgeArticle[],
): KnowledgeArticle[] {
  if (!articles.length) return [];

  const fuse = new Fuse(articles, {
    keys: [
      { name: "title", weight: 3 },
      { name: "tags", weight: 2 },
      { name: "content", weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  });

  const results = fuse.search(query);
  return results.map((r) => r.item);
}
