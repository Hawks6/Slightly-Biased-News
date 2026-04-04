# Bias Detection Research Notes

## Current Approaches (2026)

### 1. Static Source Database (Current Implementation)
- **Pros**: Fast, consistent, no API costs
- **Cons**: Can't classify unknown sources, no article-level analysis
- **Sources**: AllSides Media, Ad Fontes Media

### 2. LLM-as-Judge
- **Pros**: Flexible, explainable, handles edge cases
- **Cons**: Expensive, variable results, position bias
- **Best Practice**: Use chain-of-thought prompting, calibrate with known sources
- **References**:
  - FairJudge (2026) - Adaptive debiased LLM-as-judge
  - LLM-as-Judge pitfalls (Vadim's blog, 2026)

### 3. Fine-tuned Transformer Models
- **Pros**: Fast after training, consistent
- **Cons**: Needs training data, less flexible
- **Datasets**:
  - BABE (Bias Annotations By Experts) - ~3000 annotated articles
  - BiasScan (HuggingFace) - Multi-task bias dataset
  - Navigating News Narratives (ArXiv 2312.00168)
- **Models**:
  - DeBERTa-v3-base fine-tuned on BABE
  - ModernBERT for classification
  - RoBERTa political bias variants

### 4. Embedding + Clustering
- **Pros**: No training needed, semantic similarity
- **Cons**: Needs good embedding model, clustering quality varies
- **Embeddings**:
  - all-MiniLM-L6 (384 dims, fast)
  - sentence-transformers (multiple sizes)

## Hybrid Approaches (Recommended)

### Approach A: Cascade Classifier
```
Source DB → Embedding Match → LLM Fallback
   ↓              ↓               ↓
 95% hit     4% hit         1% hit
```

### Approach B: Ensemble
```
Article → [Source DB, Embedding, LLM] → Weighted vote
```

## Free Tier Options

| Service | Limit | Best For |
|---------|-------|----------|
| Groq | 14k tok/min, 30 req/min | LLM-as-Judge, explanations |
| HuggingFace Inference | 30k/mo | Embeddings |
| Replicate | 100 pred/min | Model inference |
| Modal | 2hr free GPU | Fine-tuning |

## Key Research Papers

1. **The Media Bias Detector** (ArXiv 2509.25649, 2025)
   - Framework for annotating and analyzing news at scale
   
2. **IndiTag** (ArXiv 2403.13446)
   - Fine-grained bias indicators system

3. **To Bias or Not to Bias** (ArXiv 2505.13010)
   - News bias detection with bias-detector

4. **MA-RAG** (ArXiv 2505.20096)
   - Multi-Agent RAG via collaborative CoT

## Architecture Decision

Chosen: **Cascade Classifier (Approach A)**
- Source DB for known sources (fast, accurate)
- Embeddings for unknown sources (semantic match)
- LLM fallback for edge cases (explanations)

Rationale:
- 95% of news from known sources (mainstream media)
- Unknown sources → embed → match to known cluster
- LLM only when confidence is low (cost savings)
- All on free tier

## Implementation Notes

### Embedding Strategy
- Use `sentence-transformers/all-MiniLM-L6-v2` via HuggingFace API
- 384-dimension vectors
- Index known source articles for similarity search

### LLM Prompting Best Practices
1. System prompt: Clear role definition + classification guide
2. Output schema: JSON with confidence score
3. Few-shot examples: Include 2-3 examples per class
4. Calibration: Use known sources to validate output

### Vector Store
- pgvector (PostgreSQL extension) for simplicity
- IVFFlat index for fast approximate search
- Cosine similarity for matching

## Monitoring & Evaluation

### Metrics
- Classification confidence distribution
- Source DB hit rate
- LLM fallback rate
- Accuracy vs AllSides ground truth

### Calibration
- Monthly re-validation against AllSides ratings
- Track bias drift per source over time
