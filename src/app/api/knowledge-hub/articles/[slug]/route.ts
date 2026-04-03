import { NextRequest, NextResponse } from "next/server";
import { loadKnowledgeBase } from "@/lib/knowledge-base";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const articles = loadKnowledgeBase();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
}
