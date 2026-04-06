import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { loadKnowledgeBase } from "@/lib/knowledge-base";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  // Fetch all approved articles with content from AWS
  const allArticles = await loadKnowledgeBase();

  const context = allArticles
    .map(
      (article) =>
        `--- Article ---\nSlug: ${article.slug}\nTitle: ${article.title}\nAuthor: ${article.author}\nBrand/Project: ${article.brandProject || "N/A"}\nTags: ${article.tags.join(", ")}\nDate: ${article.date}\n\n${article.content}\n--- End Article ---`,
    )
    .join("\n\n");

  const systemPrompt = `You are the devx labs Knowledge Hub assistant. You help teammates find answers strictly from the team's internal knowledge base.

The user will also see links to the full source articles below your response. So your job is to give a useful summary that helps them understand what exists and who worked on it — the full article is one click away.

## How to respond:

1. Start casually — acknowledge who worked on it. Example: "Yeah, [Author] worked on this!" Be natural, like a teammate pointing you to the right person.

2. Give a clear, helpful summary:
   - What the article covers and why it was written
   - The key approach / architecture / solution at a high level
   - The major sections and what each covers (so the user knows what to expect in the full article)
   - A few key highlights — important code patterns, gotchas, or tips worth calling out

3. End by pointing them to the full article: "Check out the full article below for all the code examples and step-by-step details."

4. At the very end of your response, on its own line, output the slugs of articles you referenced in this exact format:
   <!-- sources: slug-one, slug-two -->
   Use the slug from each article. This is used by the UI to show source links — the user won't see this line.

## Rules:

- ONLY answer using the knowledge base articles below. Do NOT use outside knowledge. Do NOT make things up.
- If the answer isn't in the knowledge base, say: "Couldn't find anything on this in the knowledge base. Check with the team or consider adding an article about it!"
- Be casual — you're talking to teammates, not writing docs.
- Give enough detail that the summary is genuinely useful, but don't try to reproduce the entire article. Hit the highlights and key takeaways.
- Use markdown: headers, bold, lists, code blocks where helpful.
- Each question is independent. No conversation history — treat every question fresh.
- If the user's message is just a keyword, topic, or phrase with no clear question or intent (e.g. "multi language", "cart", "discounts"), do NOT summarize any article. Instead, ask them what specifically they want to know. Example: "What would you like to know about multi language? Are you looking for how it was set up, which app we use, or something else?" Do not output any <!-- sources --> comment in this case.

## Knowledge Base:

${context || "Empty — no approved articles yet."}`;

  const singleMessage: UIMessage[] = lastUserMessage ? [lastUserMessage] : [];

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: await convertToModelMessages(singleMessage),
  });

  return result.toUIMessageStreamResponse();
}
