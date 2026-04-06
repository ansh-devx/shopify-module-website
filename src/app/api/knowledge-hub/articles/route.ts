import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAuth } from "@/lib/auth/apiAuth";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const { title, author, tags, content } = body as {
    title?: string;
    author?: string;
    tags?: string;
    content?: string;
  };

  // Validation
  if (!title?.trim()) {
    return NextResponse.json(
      { success: false, error: "Title is required" },
      { status: 400 },
    );
  }
  if (!author?.trim()) {
    return NextResponse.json(
      { success: false, error: "Author is required" },
      { status: 400 },
    );
  }
  if (!content?.trim()) {
    return NextResponse.json(
      { success: false, error: "Content is required" },
      { status: 400 },
    );
  }

  // Generate slug and ensure uniqueness
  const dir = path.join(process.cwd(), "knowledge-base");
  let slug = slugify(title.trim());
  let filePath = path.join(dir, `${slug}.md`);

  // If slug already exists, append a number
  let counter = 1;
  while (fs.existsSync(filePath)) {
    slug = `${slugify(title.trim())}-${counter}`;
    filePath = path.join(dir, `${slug}.md`);
    counter++;
  }

  // Build markdown file with frontmatter
  const date = new Date().toISOString().split("T")[0];
  const tagsClean = tags?.trim() || "";

  const fileContent = `---
title: ${title.trim()}
author: ${author.trim()}
tags: ${tagsClean}
date: ${date}
---

${content.trim()}
`;

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, fileContent, "utf-8");

  return NextResponse.json({
    success: true,
    slug,
    message: "Article published successfully",
  });
}
