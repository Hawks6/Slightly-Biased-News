import groq from "@/lib/groq";
import { cleanText, truncateWords } from "@/lib/utils/text";

const ALLOWED_FRAMING = [
  "Conflict", "Economic", "Human Interest", "Moral",
  "Responsibility", "Policy", "Leadership",
];

const ALLOWED_TONES = [
  "Abrasive", "Sensationalist", "Opinionated",
  "Neutral", "Measured", "Optimistic",
];

const ALLOWED_BIAS = ["left", "center-left", "center", "center-right", "right"];

const NEUTRAL_FRAMING = { label: "Neutral", confidence: 1.0, reasoning: "Classification unavailable." };
const NEUTRAL_VALENCE = { valence: 0, intensity: 2, chargedLanguage: [], toneLabel: "Neutral" };
const NEUTRAL_BIAS = { label: "center", reason: "Classification unavailable — defaulting to neutral." };

function normalizeValence(raw) {
  const valence = typeof raw.valence === "number"
    ? Math.max(-1, Math.min(1, raw.valence)) : 0;
  const intensity = typeof raw.intensity === "number"
    ? Math.max(0, Math.min(10, Math.round(raw.intensity))) : 2;

  let toneLabel = raw.toneLabel || raw.tone_label || raw.tone || "Neutral";
  if (!ALLOWED_TONES.includes(toneLabel)) {
    const match = ALLOWED_TONES.find(t => t.toLowerCase() === String(toneLabel).toLowerCase());
    toneLabel = match || "Neutral";
  }

  let chargedLanguage = raw.chargedLanguage || raw.charged_language || raw.loaded_words || [];
  if (!Array.isArray(chargedLanguage)) chargedLanguage = [];
  chargedLanguage = chargedLanguage.filter(w => typeof w === "string" && w.trim().length > 0).slice(0, 10);

  return { valence, intensity, toneLabel, chargedLanguage };
}

/**
 * Combined framing + valence + content bias analysis in a single Groq call.
 * @param {Array} articles - Normalized articles
 * @returns {Promise<Array>} - Articles enriched with `.framing` AND `.valence` metadata
 */
export async function classifyArticles(articles) {
  if (!articles || articles.length === 0) return articles;

  if (!process.env.GROQ_API_KEY) {
    console.warn("[Combined Classifier] Missing GROQ_API_KEY, applying neutral defaults.");
    return articles.map(a => ({
      ...a,
      framing: { ...NEUTRAL_FRAMING, reasoning: "Skipped — no API key." },
      valence: { ...NEUTRAL_VALENCE },
      detectedBias: { ...NEUTRAL_BIAS },
    }));
  }

  try {
    const snippets = articles.map(a => ({
      id: a.id,
      title: a.title,
      text: truncateWords(cleanText(a.content || a.description || ""), 300),
    }));

    const systemPrompt = `You are a media bias and linguistics expert. For each article, provide THREE analyses:

**A) Framing Lens** — classify into exactly ONE of:
Conflict, Economic, Human Interest, Moral, Responsibility, Policy, Leadership.

**B) Emotional Valence** — measure the emotional temperature:
- valence (-1.0 to 1.0): negative ↔ positive sentiment
- intensity (0-10): emotional intensity level
- toneLabel: exactly ONE of: Abrasive, Sensationalist, Opinionated, Neutral, Measured, Optimistic
- chargedLanguage: array of loaded words/phrases found in the text

**C) Content Bias** — determine the political lean based ONLY on the article's language, logic, and framing. Do NOT consider the source's reputation. Analyze:
- Lexical choices (e.g., "tax relief" vs "tax cuts", "undocumented" vs "illegal")
- Presupposition and assumed truths
- Which side's arguments get more space or more favorable framing
- Emotional loading toward one political direction
- label: exactly ONE of: left, center-left, center, center-right, right
- reason: one sentence explaining your reasoning
- If uncertain, default to "center".

Return ONLY a JSON object:
{
  "results": {
    "<article_id>": {
      "framing": { "label": "<one of 7>", "confidence": 0.85, "reasoning": "..." },
      "valence": { "valence": 0.3, "intensity": 5, "toneLabel": "Measured", "chargedLanguage": ["word1"] },
      "bias": { "label": "<one of 5>", "reason": "..." }
    }
  }
}

Rules:
- Include ALL article IDs.
- "label" for framing must be exactly one of the 7 framing lenses.
- "toneLabel" must be exactly one of the 6 tone labels.
- "label" for bias must be exactly one of: left, center-left, center, center-right, right.`;

    const userPrompt = `Articles:\n${JSON.stringify(snippets, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const raw = chatCompletion.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty response from Groq");

    const parsed = JSON.parse(raw);
    const resultsMap = parsed.results || parsed.analysis || parsed;

    let classMap;
    if (Array.isArray(resultsMap)) {
      classMap = new Map(resultsMap.map(r => [r.articleId || r.id, r]));
    } else {
      classMap = new Map(Object.entries(resultsMap));
    }

    return articles.map(article => {
      const result = classMap.get(article.id);

      if (result) {
        const framingData = result.framing || {};
        const valenceData = result.valence || result;
        const biasData = result.bias || {};

        return {
          ...article,
          framing: ALLOWED_FRAMING.includes(framingData.label)
            ? { label: framingData.label, confidence: framingData.confidence || 0.7, reasoning: framingData.reasoning || "" }
            : { ...NEUTRAL_FRAMING },
          valence: normalizeValence(valenceData),
          detectedBias: {
            label: ALLOWED_BIAS.includes(biasData.label) ? biasData.label : "center",
            reason: biasData.reason || "Bias classification unavailable.",
          },
        };
      }

      return {
        ...article,
        framing: { ...NEUTRAL_FRAMING },
        valence: { ...NEUTRAL_VALENCE },
        detectedBias: { ...NEUTRAL_BIAS },
      };
    });

  } catch (error) {
    console.error("[Combined Classifier] Groq analysis failed:", error.message);
    return articles.map(a => ({
      ...a,
      framing: { ...NEUTRAL_FRAMING },
      valence: { ...NEUTRAL_VALENCE },
      detectedBias: { ...NEUTRAL_BIAS },
    }));
  }
}
