import groq from "@/lib/groq";
import { cleanText, truncateWords } from "@/lib/utils/text";

/**
 * Agent 12: Framing Detector
 * Identifies the "narrative lens" of news articles using Groq AI.
 */

const ALLOWED_LABELS = [
  "Conflict",
  "Economic",
  "Human Interest",
  "Moral",
  "Responsibility",
  "Policy",
  "Leadership",
];

const NEUTRAL_FRAMING = { label: "Neutral", confidence: 1.0, reasoning: "Classification unavailable." };


/**
 * Detect news framing for a batch of articles via a single Groq call.
 * @param {Array} articles - Normalized articles with titles and content/descriptions.
 * @returns {Promise<Array>} - Articles enriched with `.framing` metadata.
 */
export async function detectFraming(articles) {
  if (!articles || articles.length === 0) return articles;

  // If no API key, return articles with neutral framing on every item
  if (!process.env.GROQ_API_KEY) {
    console.warn("[Framing Detector] Missing GROQ_API_KEY, applying neutral framing.");
    return articles.map(a => ({ ...a, framing: { ...NEUTRAL_FRAMING, reasoning: "Skipped — no API key." } }));
  }

  try {
    // Build batch input: id → first 300 words of content or description
    const snippets = articles.map(a => ({
      id: a.id,
      title: a.title,
      text: truncateWords(cleanText(a.content || a.description || ""), 300),
    }));

    const systemPrompt = `You are a linguistic expert specializing in News Framing Analysis.
Analyze the provided news article snippets and classify each into exactly ONE of these seven "Framing Lenses":

1. **Conflict:** Focus on power struggles, political fights, disagreement, or winners/losers.
2. **Economic:** Focus on financial costs, gains, market impacts, or resource allocation.
3. **Human Interest:** Focus on individual emotional stories, lived experiences, and the human angle.
4. **Moral:** Focus on ethical judgments, religious values, or societal "right vs. wrong."
5. **Responsibility:** Focus on blame, attribution of fault, or who is responsible.
6. **Policy:** Focus on legislation, regulation, governance decisions, or institutional processes.
7. **Leadership:** Focus on the actions, character, or competence of specific leaders or decision-makers.

Return ONLY a JSON object with a "results" object mapping each article ID to its analysis:
{
  "results": {
    "<article_id>": { "label": "<one of the 7 labels>", "confidence": 0.85, "reasoning": "..." },
    ...
  }
}

Rules:
- "label" must be EXACTLY one of: Conflict, Economic, Human Interest, Moral, Responsibility, Policy, Leadership.
- "confidence" is a number from 0.0 to 1.0.
- "reasoning" is a concise 1-sentence explanation.
- Include ALL article IDs in the output.`;

    const userPrompt = `Articles to classify:\n${JSON.stringify(snippets, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const raw = chatCompletion.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty response from Groq");

    const parsed = JSON.parse(raw);
    const resultsMap = parsed.results || parsed.analysis || parsed;

    // Normalize: if the API returned an array instead of object, convert
    let framingMap;
    if (Array.isArray(resultsMap)) {
      framingMap = new Map(resultsMap.map(r => [r.articleId || r.id, r]));
    } else {
      framingMap = new Map(Object.entries(resultsMap));
    }

    return articles.map(article => {
      const result = framingMap.get(article.id);

      if (result && ALLOWED_LABELS.includes(result.label)) {
        return {
          ...article,
          framing: {
            label: result.label,
            confidence: typeof result.confidence === "number" ? result.confidence : 0.7,
            reasoning: result.reasoning || "",
          },
        };
      }

      // Fallback for unrecognized or missing results
      return {
        ...article,
        framing: { ...NEUTRAL_FRAMING },
      };
    });

  } catch (error) {
    console.error("[Framing Detector] Groq analysis failed:", error.message);
    // Graceful degradation: return every article with neutral framing
    return articles.map(a => ({ ...a, framing: { ...NEUTRAL_FRAMING } }));
  }
}
