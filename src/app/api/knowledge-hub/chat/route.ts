import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  loadKnowledgeBase,
  searchKnowledgeBase,
} from "@/lib/knowledge-base";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Only use the latest user message — no conversation context
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");
  const query =
    lastUserMessage?.parts?.find(
      (p): p is { type: "text"; text: string } => p.type === "text",
    )?.text || "";

  // Load and search knowledge base
  const allArticles = loadKnowledgeBase();
  const relevantArticles = query
    ? searchKnowledgeBase(query, allArticles)
    : allArticles;

  // Build context from relevant articles
  const context = relevantArticles
    .map(
      (article) =>
        `--- Article ---\nTitle: ${article.title}\nAuthor: ${article.author}\nTags: ${article.tags.join(", ")}\nDate: ${article.date}\n\n${article.content}\n--- End Article ---`,
    )
    .join("\n\n");

  const systemPrompt = `You are the DevX Labs Knowledge Hub assistant. You help teammates find answers strictly from the team's internal knowledge base.

## How to respond:

1. Start casually — acknowledge who worked on it. Example: "Yeah, [Author] built/worked on this at [brand/project]." Be natural, like a teammate pointing you to the right person.

2. Then lay out the answer in detail with clear sections:
   - **The Requirement** — what problem was being solved
   - **The Solution** — how it was implemented, with full technical detail
   - **Key Concepts** — important takeaways, gotchas, or patterns
   - Include all code examples, architecture diagrams, tables from the article.

3. End with the source attribution: "From *[Article Title]* by **[Author Name]**"

## Rules:

- ONLY answer using the knowledge base articles below. Do NOT use outside knowledge. Do NOT make things up.
- If the answer isn't in the knowledge base, say: "Couldn't find anything on this in the knowledge base. Check with the team or consider adding an article about it!"
- Be casual — you're talking to teammates, not writing docs.
- Be detailed — give the full picture from the article, don't summarize too aggressively.
- Use rich markdown: headers, code blocks with language tags, bold, lists, tables.
- Each question is independent. There is no conversation history — treat every question as a fresh query.

## Knowledge Base:

${context || "Empty — no articles yet."}`;

  // Only send the latest user message — stateless, one-shot queries
  const singleMessage: UIMessage[] = lastUserMessage
    ? [lastUserMessage]
    : [];

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: await convertToModelMessages(singleMessage),
  });

  return result.toUIMessageStreamResponse();
}
