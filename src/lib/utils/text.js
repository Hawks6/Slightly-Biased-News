/**
 * Shared text utilities used across multiple agents.
 */

/**
 * Strip HTML tags and decode common entities from a string.
 */
export function cleanText(html) {
  if (!html) return "";
  let text = String(html).replace(/<[^>]*>?/gm, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/\[\+\d+\s*chars\]/gi, " "); // Strip NewsAPI truncation markers
  return text.replace(/\s\s+/g, " ").trim();
}

/**
 * Truncate text to roughly the first N words.
 */
export function truncateWords(text, maxWords = 300) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}
