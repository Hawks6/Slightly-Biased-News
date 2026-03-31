import Groq from "groq-sdk";

/**
 * Agent 04: AI Summarizer
 * Uses the same Groq SDK instance as the event clusterer.
 */

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "dummy_key_avoid_init_error" 
});

async function callGroqSummarizer(articles, query) {
  if (!process.env.GROQ_API_KEY) return null;

  const articlesText = articles
    .map((a, i) => `[${i + 1}] ${a.source.name} (${a.bias}): ${a.title}\n${a.content}`)
    .join("\n\n---\n\n");

  const prompt = `You are a neutral editorial analyst for a media bias news platform. Given the following news articles about "${query}", provide a comprehensive analysis:

1. An EXTENDED NEUTRAL SUMMARY (300-400 words) that:
   - Synthesizes all perspectives without favoring any political viewpoint
   - Identifies the core facts all sources agree on
   - Notes key areas of disagreement or different emphasis
   - Provides necessary context readers should know

2. Five KEY TAKEAWAYS as bullet points that:
   - Distill the most important developments
   - Represent the spectrum of coverage
   - Help readers understand what's at stake

3. A NARRATIVE that explains:
   - How different outlets are framing the story
   - What angles are being emphasized or downplayed
   - The broader implications or significance

4. A WHAT TO WATCH statement about future developments.

Articles:
${articlesText}

Respond in JSON format:
{
  "summary": "...",
  "narrative": "...",
  "takeaways": ["...", "...", "...", "...", "..."],
  "watchStatement": "..."
}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const text = chatCompletion.choices?.[0]?.message?.content;
    if (text) {
      return JSON.parse(text);
    }
  } catch (e) {
    console.warn("[Summarizer] Groq API call failed:", e.message);
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

  const leftSources = articles.filter(a => a.bias < -10).slice(0, 2);
  const centerSources = articles.filter(a => a.bias >= -10 && a.bias <= 10).slice(0, 2);
  const rightSources = articles.filter(a => a.bias > 10).slice(0, 2);
  
  const narrative = [];
  if (leftSources.length > 0) {
    narrative.push(`Left-leaning outlets like ${leftSources.map(s => s.source.name).join(", ")} tend to emphasize ` +
      (leftSources[0].content || "").substring(0, 80) + "... ");
  }
  if (centerSources.length > 0) {
    narrative.push(`Center sources such as ${centerSources.map(s => s.source.name).join(", ")} provide more balanced coverage.`);
  }
  if (rightSources.length > 0) {
    narrative.push(`Right-leaning outlets including ${rightSources.map(s => s.source.name).join(", ")} focus on different aspects.`);
  }

  const takeaways = articles.slice(0, 5).map((a) => {
    const textToProcess = a.content || a.description || "";
    const cleanContent = cleanText(textToProcess);
    const sentences = cleanContent.split(/\.(?!\.)\s+/).filter(s => s.length > 30 && !s.includes("http"));
    const firstSentence = sentences.length > 0 ? sentences[0].trim() : cleanContent.substring(0, 100).trim();
    return `${a.source.name}: ${firstSentence}.`;
  });

  return {
    summary: summary.slice(0, 600),
    narrative: narrative.join(" ") || "Coverage varies across the political spectrum, with different outlets emphasizing different aspects of the story.",
    takeaways: takeaways.length > 0 ? takeaways : [
      "Multiple perspectives exist on this topic.",
      "Coverage varies significantly across political leanings.",
      "Different sources emphasize different aspects.",
      "Context and framing influence how stories are told.",
      "Consider consulting primary sources for the most accurate picture.",
    ],
    watchStatement: `Continued developments on "${query}" may shift the current narrative as new information emerges.`,
  };
}

export async function summarizeArticles(articles, query) {
  const aiSummary = await callGroqSummarizer(articles, query);
  if (aiSummary) {
    return { ...aiSummary, method: "ai" };
  }

  return { ...extractiveSummary(articles, query), method: "extractive" };
}
