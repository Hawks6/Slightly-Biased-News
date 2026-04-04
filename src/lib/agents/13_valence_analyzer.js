import Groq from "groq-sdk";
import { z } from "zod";

/**
 * Agent 13: Valence Analyzer
 * Measures the "Emotional Temperature" of news reporting using Groq AI.
 */

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "dummy_key_avoid_init_error" 
});

const ValenceSchema = z.object({
  analysis: z.array(z.object({
    articleId: z.string().describe("The ID of the article"),
    valence: z.number().min(-1).max(1).describe("Sentiment charge (-1.0 to 1.0)"),
    intensity: z.number().min(0).max(10).describe("Emotional intensity (0-10)"),
    chargedLanguage: z.array(z.string()).describe("List of emotionally loaded words or phrases"),
    toneLabel: z.enum(["Abrasive", "Sensationalist", "Opinionated", "Neutral", "Measured", "Optimistic"]).describe("Qualitative tone label")
  }))
});

/**
 * Analyze the emotional valence and tone of a set of articles.
 * @param {Array} articles - Normalized articles with titles and descriptions.
 * @returns {Promise<Array>} - Articles enriched with valence metadata.
 */
export async function analyzeValence(articles) {
  if (!articles || articles.length === 0) return articles;
  if (!process.env.GROQ_API_KEY) {
    console.warn("[Valence Analyzer] Missing GROQ_API_KEY, skipping valence analysis.");
    return articles;
  }

  try {
    const articleInputs = articles.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description
    }));

    const systemPrompt = `
      You are a linguistic expert specializing in Sentiment Analysis and Tone Detection. 
      Analyze the provided news articles and quantify their "Emotional Temperature":

      1. **Valence (-1.0 to 1.0):** 
         - -1.0: Highly negative, cynical, or bleak.
         -  0.0: Purely neutral, factual, or balanced.
         -  1.0: Highly positive, optimistic, or celebratory.

      2. **Intensity (0 to 10):**
         - 0-2: Calm, detached, clinical.
         - 3-5: Moderate, uses some adjectives.
         - 6-8: Opinionated, uses charged language.
         - 9-10: Sensationalist, inflammatory, or highly emotive.

      3. **Charged Language:**
         - Identify specific "loaded" words or phrases used to sway the reader's emotions (e.g., "slammed", "disaster", "triumph").

      OUTPUT FORMAT:
      Return ONLY a JSON object with an "analysis" array.
    `;

    const userPrompt = `Articles to Analyze:\n${JSON.stringify(articleInputs, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    const parsed = ValenceSchema.parse(result);

    // Map results back to articles
    const analysisMap = new Map(parsed.analysis.map(res => [res.articleId, res]));

    return articles.map(article => ({
      ...article,
      valence: analysisMap.get(article.id) || { valence: 0, intensity: 2, chargedLanguage: [], toneLabel: "Neutral" }
    }));

  } catch (error) {
    console.error("[Valence Analyzer] Groq analysis failed:", error.message);
    return articles;
  }
}
