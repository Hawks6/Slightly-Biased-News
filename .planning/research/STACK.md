# Stack Research: Event Clustering Integration

## Context
Adding Groq-powered event clustering to the existing Next.js news bias analyzer.

## New Dependencies

| Package | Version | Purpose | Confidence |
|---------|---------|---------|------------|
| `groq-sdk` | ^0.3.2 | Official Groq Node.js SDK for API access | High |
| `zod` | ^3.23.0 | Schema validation for Groq JSON outputs | High |

## Rationale
- **Groq SDK vs Fetch:** The official SDK (`groq-sdk`) handles retries, typescript mappings (helpful even in JS for autocomplete), and JSON mode formatting out of the box. 
- **Zod:** Since we're asking an LLM to group articles into structured JSON events, we should validate the output before returning it to the frontend to ensure the schema matches our React components.

## What NOT to use
- **LangChain / LlamaIndex:** Overkill for a single clustering API call. It adds unnecessary dependency weight and abstraction. Stick to the raw `groq-sdk`.
- **Vector databases (Pinecone, Chroma):** We do not need semantic similarity search over millions of articles. We are clustering a realtime feed of ~50 headlines. A single zero-shot prompt to Llama 3.3 70B is sufficient and vastly simpler.
