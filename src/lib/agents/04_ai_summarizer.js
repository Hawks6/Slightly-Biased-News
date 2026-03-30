/**
 * Agent 04: AI Summarizer
 * Calls the Anthropic Claude API to build a neutral, multi-perspective summary.
 * Falls back to an extractive summarizer if no API key is available.
 */

async function callAnthropicSummarizer(articles, query) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const articlesText = articles
    .map((a, i) => `[${i + 1}] ${a.source.name} (${a.bias}): ${a.title}\n${a.content}`)
    .join("\n\n---\n\n");

  const prompt = `You are a neutral editorial analyst. Given the following news articles about "${query}", write:
1. A single-paragraph NEUTRAL summary (max 150 words) that synthesizes all perspectives without favoring any.
2. Three KEY TAKEAWAYS as bullet points.
3. A one-sentence WHAT TO WATCH statement about future developments.

Articles:
${articlesText}

Respond in JSON format:
{
  "summary": "...",
  "takeaways": ["...", "...", "..."],
  "watchStatement": "..."
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.content?.[0]?.text;
      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }
  } catch (e) {
    console.warn("[Summarizer] Anthropic API call failed:", e.message);
  }

  return null;
}

function cleanText(html) {
  if (!html) return "";
  // Strip HTML tags
  let text = String(html).replace(/<[^>]*>?/gm, " ");
  // Decode common entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-zA-Z]+;/g, " "); // Catch any other entities
  // Remove extra spaces
  return text.replace(/\s\s+/g, " ").trim();
}

function extractiveSummary(articles, query) {
  // Build a summary from the most diverse set of descriptions
  const biasGroups = {};
  articles.forEach((a) => {
    const group = a.bias || "center";
    if (!biasGroups[group]) biasGroups[group] = [];
    biasGroups[group].push(a);
  });

  const selectedSentences = [];
  for (const [bias, group] of Object.entries(biasGroups)) {
    const best = group[0];
    const textToProcess = best?.content || best?.description || "";
    const cleanContent = cleanText(textToProcess);
    
    if (cleanContent) {
      // Split by periods not followed by another period (to avoid ellipses)
      const sentences = cleanContent.split(/\.(?!\.)\s+/).filter((s) => s.length > 40 && !s.includes("http"));
      if (sentences.length > 0) {
        selectedSentences.push(sentences[0].trim() + ".");
      }
    }
  }

  const summary =
    selectedSentences.length > 0
      ? selectedSentences.join(" ")
      : `Multiple sources are reporting on ${query} with varying perspectives and emphasis.`;

  const takeaways = articles.slice(0, 3).map((a) => {
    const textToProcess = a.content || a.description || "";
    const cleanContent = cleanText(textToProcess);
    const sentences = cleanContent.split(/\.(?!\.)\s+/).filter(s => s.length > 30 && !s.includes("http"));
    const firstSentence = sentences.length > 0 ? sentences[0].trim() : cleanContent.substring(0, 100).trim();
    return `${a.source.name}: ${firstSentence}.`;
  });

  return {
    summary: summary.slice(0, 500),
    takeaways: takeaways.length > 0 ? takeaways : [
      "Multiple perspectives exist on this topic.",
      "Coverage varies significantly across political leanings.",
      "Consider consulting primary sources for the most accurate picture.",
    ],
    watchStatement: `Continued developments on "${query}" may shift the current narrative as new information emerges.`,
  };
}

export async function summarizeArticles(articles, query) {
  // Try Anthropic first
  const aiSummary = await callAnthropicSummarizer(articles, query);
  if (aiSummary) {
    return { ...aiSummary, method: "ai" };
  }

  // Extractive fallback
  return { ...extractiveSummary(articles, query), method: "extractive" };
}
