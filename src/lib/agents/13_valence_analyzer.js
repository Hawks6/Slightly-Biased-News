import Groq from "groq-sdk";

/**
 * Agent 13: Valence Analyzer
 * Measures the "Emotional Temperature" of news reporting using Groq AI.
 *
 * Produces per-article valence metadata:
 *   valence   (-1.0 … 1.0)  — sentiment polarity
 *   intensity (0 … 10)      — emotional intensity
 *   toneLabel               — qualitative label
 *   chargedLanguage          — array of loaded words/phrases
 *
 * Uses batch JSON calling — one Groq request for all articles —
 * to stay within the <4 s latency budget.
 */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_avoid_init_error",
});

const ALLOWED_TONES = [
  "Abrasive",
  "Sensationalist",
  "Opinionated",
  "Neutral",
  "Measured",
  "Optimistic",
];

const NEUTRAL_VALENCE = {
  valence: 0,
  intensity: 2,
  chargedLanguage: [],
  toneLabel: "Neutral",
};

function cleanText(html) {
  if (!html) return "";
  let text = String(html).replace(/<[^>]*>?/gm, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-zA-Z]+;/g, " ");
  return text.replace(/\s\s+/g, " ").trim();
}

/**
 * Truncate text to roughly the first N words.
 */
function truncateWords(text, maxWords = 300) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

/**
 * Safely normalize a single valence result from the LLM.
 */
function normalizeResult(raw) {
  const valence = typeof raw.valence === "number"
    ? Math.max(-1, Math.min(1, raw.valence))
    : 0;

  const intensity = typeof raw.intensity === "number"
    ? Math.max(0, Math.min(10, Math.round(raw.intensity)))
    : 2;

  let toneLabel = raw.toneLabel || raw.tone_label || raw.tone || "Neutral";
  if (!ALLOWED_TONES.includes(toneLabel)) {
    // Best-effort case-insensitive match
    const match = ALLOWED_TONES.find(
      (t) => t.toLowerCase() === String(toneLabel).toLowerCase()
    );
    toneLabel = match || "Neutral";
  }

  let chargedLanguage = raw.chargedLanguage || raw.charged_language || raw.loaded_words || [];
  if (!Array.isArray(chargedLanguage)) chargedLanguage = [];
  chargedLanguage = chargedLanguage
    .filter((w) => typeof w === "string" && w.trim().length > 0)
    .slice(0, 10);

  return { valence, intensity, toneLabel, chargedLanguage };
}

/**
 * Analyze the emotional valence and tone of a set of articles.
 * @param {Array} articles - Normalized articles with titles and content/descriptions.
 * @returns {Promise<Array>} - Articles enriched with `.valence` metadata.
 */
export async function analyzeValence(articles) {
  if (!articles || articles.length === 0) return articles;

  if (!process.env.GROQ_API_KEY) {
    console.warn("[Valence Analyzer] Missing GROQ_API_KEY, applying neutral valence.");
    return articles.map((a) => ({ ...a, valence: { ...NEUTRAL_VALENCE } }));
  }

  try {
    // Build batch input: id → first 300 words of content or description
    const snippets = articles.map((a) => ({
      id: a.id,
      title: a.title,
      text: truncateWords(cleanText(a.content || a.description || ""), 300),
    }));

    const systemPrompt = `You are a linguistic expert specializing in Sentiment Analysis and Tone Detection.
Analyze the provided news article snippets and quantify their "Emotional Temperature".

For EACH article, provide:

1. **valence** (-1.0 to 1.0):
   - -1.0: Highly negative, cynical, or bleak.
   -  0.0: Purely neutral, factual, or balanced.
   -  1.0: Highly positive, optimistic, or celebratory.

2. **intensity** (0 to 10):
   - 0-2: Calm, detached, clinical.
   - 3-5: Moderate, uses some adjectives.
   - 6-8: Opinionated, uses charged language.
   - 9-10: Sensationalist, inflammatory, or highly emotive.

3. **toneLabel**: Exactly ONE of: Abrasive, Sensationalist, Opinionated, Neutral, Measured, Optimistic.

4. **chargedLanguage**: Array of specific "loaded" words or phrases used to sway reader emotions (e.g., "slammed", "disaster", "triumph").

Return ONLY a JSON object with a "results" object mapping each article ID to its analysis:
{
  "results": {
    "<article_id>": { "valence": 0.3, "intensity": 5, "toneLabel": "Measured", "chargedLanguage": ["word1", "word2"] },
    ...
  }
}

Rules:
- "toneLabel" must be EXACTLY one of: Abrasive, Sensationalist, Opinionated, Neutral, Measured, Optimistic.
- Include ALL article IDs in the output.`;

    const userPrompt = `Articles to analyze:\n${JSON.stringify(snippets, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const raw = chatCompletion.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty response from Groq");

    const parsed = JSON.parse(raw);
    const resultsMap = parsed.results || parsed.analysis || parsed;

    // Normalize: if the API returned an array instead of object, convert
    let valenceMap;
    if (Array.isArray(resultsMap)) {
      valenceMap = new Map(
        resultsMap.map((r) => [r.articleId || r.id || r.article_id, r])
      );
    } else {
      valenceMap = new Map(Object.entries(resultsMap));
    }

    return articles.map((article) => {
      const result = valenceMap.get(article.id);

      if (result) {
        return {
          ...article,
          valence: normalizeResult(result),
        };
      }

      // Fallback for missing results
      return {
        ...article,
        valence: { ...NEUTRAL_VALENCE },
      };
    });
  } catch (error) {
    console.error("[Valence Analyzer] Groq analysis failed:", error.message);
    // Graceful degradation: return every article with neutral valence
    return articles.map((a) => ({ ...a, valence: { ...NEUTRAL_VALENCE } }));
  }
}
