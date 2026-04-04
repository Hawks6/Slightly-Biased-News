# Phase 4: ML-Powered Bias Analyzer

## Goal

Replace the static source-based bias classification with an intelligent, multi-layered bias analyzer that:
- Provides explanations for every bias score
- Classifies unknown sources using semantic embeddings
- Builds historical index for trend analysis
- Operates on Groq's free tier (~$0/month)

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLASSIFICATION PIPELINE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Article Input                                                       │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────┐    Known    ┌──────────────────┐                   │
│  │ Source DB   │───Source?──►│ Return score +   │                   │
│  │ Lookup      │             │ cached explain   │                   │
│  └──────┬──────┘             └──────────────────┘                   │
│         │ No match                                                    │
│         ▼                                                              │
│  ┌─────────────────┐                                                  │
│  │ Embed Article  │  ← HuggingFace Inference API (free tier)         │
│  │ all-MiniLM-L6  │     or sentence-transformers local                │
│  └────────┬────────┘                                                  │
│           │                                                            │
│           ▼                                                            │
│  ┌─────────────────┐                                                  │
│  │ Vector Search  │──► Match known sources → Return score            │
│  │ (pgvector)     │                                                  │
│  └────────┬────────┘                                                  │
│           │ Low confidence (<0.75)                                    │
│           ▼                                                           │
│  ┌─────────────────┐                                                  │
│  │ LLM-as-Judge   │  ← Groq Llama 3.3 70B                            │
│  │ + Explanation  │     Structured output + reasoning                │
│  └─────────────────┘                                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Requirements

### CORE-BIAS-01: Hybrid Classification
- Check source database first (existing ~20 sources)
- Unknown sources → embedding + vector search
- Very low confidence → LLM-as-Judge fallback

### CORE-BIAS-02: Explainable Scores
- Every bias score includes 2-3 sentence explanation
- Detection of framing type (economic, social, security, etc.)
- Loaded language identification with specific phrases

### CORE-BIAS-03: Historical Indexing
- Store article embeddings in PostgreSQL/pgvector
- Enable trend analysis per source
- Track bias drift over time

### CORE-BIAS-04: Free Tier Compliance
- Groq: 14k tokens/min, 30 req/min (free tier)
- HuggingFace: 30k inference calls/month
- All processing under 3 seconds per article

## Data Model

### Table: `bias_sources`
```sql
CREATE TABLE bias_sources (
  id SERIAL PRIMARY KEY,
  source_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  url_pattern VARCHAR(255),
  bias_label VARCHAR(50) NOT NULL,  -- left, center-left, center, center-right, right
  bias_score INTEGER NOT NULL,       -- -30 to +30
  reliability_score INTEGER,         -- 0-100
  ownership_name VARCHAR(255),
  ownership_type VARCHAR(100),
  ownership_country VARCHAR(100),
  embedding_id UUID,
  article_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `article_embeddings`
```sql
CREATE TABLE article_embeddings (
  id SERIAL PRIMARY KEY,
  article_hash VARCHAR(64) UNIQUE NOT NULL,
  source_id INTEGER REFERENCES bias_sources(id),
  external_id VARCHAR(255),
  title TEXT,
  content TEXT,
  embedding VECTOR(384),           -- all-MiniLM-L6 output
  bias_label VARCHAR(50),
  bias_score INTEGER,
  confidence FLOAT,
  explanation TEXT,
  framing_dimensions TEXT[],
  loaded_phrases TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_embedding ON article_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_source ON article_embeddings(source_id);
CREATE INDEX idx_bias_label ON article_embeddings(bias_label);
```

### Table: `classification_cache`
```sql
CREATE TABLE classification_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(128) UNIQUE NOT NULL,
  content_hash VARCHAR(64),
  result_json JSONB NOT NULL,
  hit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

## API Design

### `POST /api/bias/classify`

**Request:**
```json
{
  "article": {
    "title": "Article title",
    "content": "Full article text...",
    "source": {
      "id": "source-id",
      "name": "Source Name"
    },
    "url": "https://..."
  },
  "options": {
    "include_explanation": true,
    "include_framing": true,
    "force_refresh": false
  }
}
```

**Response:**
```json
{
  "bias": {
    "label": "center-left",
    "score": -15,
    "confidence": 0.92,
    "method": "source_db"
  },
  "explanation": "The article presents facts with minimal editorial framing, typical of center-left outlets that prioritize social justice themes.",
  "framing": {
    "dimensions": ["social", "policy"],
    "primary_frame": "social"
  },
  "loaded_language": {
    "detected": true,
    "phrases": ["slammed", "radical"],
    "intensity": 0.3
  },
  "source_info": {
    "id": "the-new-york-times",
    "bias_label": "center-left",
    "bias_score": -15,
    "reliability": 82,
    "ownership": {
      "name": "The New York Times Co.",
      "type": "publicly traded"
    }
  },
  "metadata": {
    "processing_time_ms": 145,
    "cached": false,
    "model": "llama-3.3-70b-versatile"
  }
}
```

### `POST /api/bias/batch`

Classify multiple articles at once (for event clustering).

### `GET /api/bias/source/:sourceId`

Get/update bias info for a specific source.

### `GET /api/bias/trends/:sourceId`

Get bias trend over time for a source.

## Groq Prompt Library

### Bias Classification Prompt
```
System: You are a media bias analyst trained on AllSides and Ad Fontes Media methodologies.
Classify the political leaning of news content on a scale from -30 (extreme left) to +30 (extreme right).

Classification Guide:
- -30 to -20: Left
- -19 to -10: Center-Left
- -9 to +9: Center
- +10 to +19: Center-Right
- +20 to +30: Right

Output valid JSON with this schema:
{
  "bias_score": <integer -30 to 30>,
  "bias_label": "<left|center-left|center|center-right|right>",
  "confidence": <float 0-1>,
  "reasoning": "<2-3 sentence explanation>",
  "framing_dimensions": ["<primary framing type>"],
  "loaded_phrases": ["<detected opinionated phrases>"]
}
```

### Framing Analysis Prompt
```
System: Analyze how this news article frames its story. Identify the primary narrative lens.

Output JSON:
{
  "primary_frame": "<economic|social|security|health|political|cultural>",
  "secondary_frames": ["<array of secondary frames>"],
  "victim_mentioned": "<who is framed as victim if any>",
  "villain_mentioned": "<who is framed as responsible if any>",
  "tone": "<neutral|concerned|alarmist|celebratory|critical>"
}
```

## Implementation Checklist

### Infrastructure (2.1)
- [ ] Set up PostgreSQL database with pgvector extension
- [ ] Create database migration scripts
- [ ] Configure connection pooling (PgBouncer optional)
- [ ] Set up Redis for caching (existing)

### Core Classifier (2.2)
- [ ] Build `src/lib/ml/embeddings.js` - embedding generation
- [ ] Build `src/lib/ml/vector_store.js` - pgvector operations
- [ ] Extend `03_base_intelligence.js` with new pipeline
- [ ] Implement source database sync mechanism

### Explanation Engine (2.3)
- [ ] Build `src/lib/ml/prompts.js` - Groq prompt library
- [ ] Implement LLM-as-Judge fallback
- [ ] Add framing analysis integration
- [ ] Build loaded language detection

### Historical Index (2.4)
- [ ] Backfill existing articles into vector store
- [ ] Build trend analysis endpoint
- [ ] Add bias drift detection
- [ ] Create dashboard visualization

### Integration (2.5)
- [ ] Update `/api/analyze` to use new bias pipeline
- [ ] Update `/api/events` with bias info
- [ ] Update UI components to show explanations
- [ ] Add loading states and error handling

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# HuggingFace (for embeddings - free tier)
HUGGINGFACE_API_KEY=hf_xxxx

# Groq (already configured)
GROQ_API_KEY=gsk_xxxx

# Redis (already configured)
REDIS_URL=redis://localhost:6379
```

## Estimated Costs

| Service | Free Tier | Cost |
|---------|-----------|------|
| Groq | 14k tok/min | $0 |
| HuggingFace | 30k inferences/mo | $0 |
| PostgreSQL | Railway/Render free | $0 |
| Redis | Local | $0 |

**Total: $0/month** for moderate usage (~1000 articles/day)

## File Structure

```
src/
├── lib/
│   ├── ml/
│   │   ├── embeddings.js        # HuggingFace API wrapper
│   │   ├── vector_store.js     # pgvector operations
│   │   ├── prompts.js         # Groq prompt templates
│   │   ├── classifier.js       # Main classification logic
│   │   └── cache.js           # Redis caching layer
│   ├── db/
│   │   ├── schema.sql         # Database schema
│   │   ├── migrations/        # Migration files
│   │   └── client.js          # PostgreSQL client
│   └── agents/
│       └── 03_base_intelligence.js  # Updated
├── app/
│   └── api/
│       └── bias/
│           ├── classify/route.js
│           ├── batch/route.js
│           ├── source/[id]/route.js
│           └── trends/[id]/route.js
└── components/
    └── dashboard/
        └── BiasExplanation.jsx  # New component
```

## Success Criteria

1. **Accuracy**: Bias scores match AllSides ratings for known sources within ±5 points
2. **Coverage**: Unknown sources get classified with >70% confidence
3. **Speed**: Single article classification <3 seconds
4. **Explainability**: Every score has accompanying explanation
5. **Cost**: Monthly API costs remain $0 (free tier)
6. **Integration**: `/api/analyze` and `/api/events` use new pipeline seamlessly
