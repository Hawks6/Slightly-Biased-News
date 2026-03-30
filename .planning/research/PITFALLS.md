# Pitfalls Research: Groq AI Integration

## 1. Rate Limiting on Free Tiers
- **Warning sign:** 429 Too Many Requests errors.
- **Prevention:** Only cluster events when a user explicitly requests a category feed. Ensure API results are cached heavily in Next.js (`export const revalidate = 600`).
- **Phase:** Category Grid Development & API Optimization

## 2. Hallucinating Non-Existent Articles
- **Warning sign:** Groq Llama 3.3 groups articles into "imaginary" clusters that don't match the original IDs/URLs.
- **Prevention:** You MUST supply a strict schema defining the input articles (`[{id: 1, title: '...'}, ...]`) and require Groq to return ONLY those exact IDs in its groups. Enforce this via `groq-sdk` JSON mode and possibly strict prompts.
- **Phase:** API integration

## 3. Discarding Legitimate Distinct Stories
- **Warning sign:** An unrelated tech launch is grouped into the "Apple Antitrust" cluster.
- **Prevention:** Tell the prompt that "One-off" articles shouldn't be clustered unless at least 3 distinct sources are covering them. The rest should either be filtered out or returned as singleton clusters.
- **Phase:** Groq prompt tuning

## 4. Double Fetching
- **Warning sign:** The clustering endpoint `/api/events` fetches from NewsAPI, then clicking the event calls `/api/analyze` which fetches from NewsAPI again causing API exhaustion.
- **Prevention:** Either cache the raw results server-side with Redis/Memory, OR pass the exact raw articles directly in the POST body to `/api/analyze`. Given it's a stateless app, POSTing the clustered articles down the pipeline is much safer.
- **Phase:** Navigation & App State Refactoring
