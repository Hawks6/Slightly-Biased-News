# Redis Caching Architecture

## Overview

Redis is implemented as a caching layer to reduce API calls to external news providers and expensive AI operations. The cache is optional and gracefully degrades when Redis is unavailable.

## Why Redis?

1. **Reduces API Rate Limits** - NewsAPI and GNews have strict rate limits (100-100 requests/day)
2. **Improves Response Time** - Cached responses return in <50ms vs 5-10s for AI processing
3. **Reduces AI Costs** - Groq API bills per token; caching eliminates duplicate summarizations
4. **Better UX** - Instant responses for repeated queries

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Next.js    │────▶│   Redis     │
│   Browser   │     │   API       │     │   Cache     │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  External   │
                    │   APIs      │
                    │ (NewsAPI,   │
                    │  Groq AI)   │
                    └─────────────┘
```

## Cache Strategy

| Cache Key | TTL | Rationale |
|-----------|-----|-----------|
| `news:{topic}` | 15 min | News is time-sensitive but API limits are tight |
| `events:{topic}` | 60 min | Clustering depends on news, same freshness needs |
| `analyze:{hash}` | 60 min | AI summaries are expensive, content is stable |
| `bias:data` | 24 hours | Source bias data rarely changes |

## Key Design Decisions

### 1. Graceful Degradation
- If `REDIS_URL` is not set, caching is disabled entirely
- No errors thrown, just null returns from cache operations
- App functions normally without Redis

### 2. Hash-Based Query Keys
```javascript
// Instead of caching on "climate change" directly
// We hash to handle variations like "Climate Change", "CLIMATE CHANGE", etc.
hashQuery("climate change") === hashQuery("CLIMATE CHANGE")
```

### 3. Lazy Connection
- Redis client connects only when first accessed
- No connection at module load time
- Connection errors are caught and logged

### 4. JSON Serialization
- All cached data stored as JSON strings
- Simple, debuggable, works with any Redis client

## File Structure

```
src/lib/redis/
├── client.js      # Connection management, singleton pattern
├── cache.js        # Cache operations (get, set, invalidate)
└── index.js        # Public exports
```

## API Endpoints

### Cache Invalidation
```
POST /api/cache
Body: { "target": "news" | "events" | "analyze" | "all" }

GET /api/cache  # Check if Redis is configured
```

### Cache Headers
All cached responses include `cached: true/false` to help frontend debugging.

## Usage in Routes

### Example: News Route
```javascript
import { CACHE_KEYS, CACHE_TTL, cacheGet, cacheSet } from "@/lib/redis";

// Check cache first
const cached = await cacheGet(CACHE_KEYS.news(topic));
if (cached) return Response.json({ ...cached, cached: true });

// ... fetch and process ...

// Store in cache
await cacheSet(CACHE_KEYS.news(topic), data, CACHE_TTL.NEWS);
return Response.json({ ...data, cached: false });
```

## Future Enhancements

### 1. Cache Warming (Background Jobs)
```javascript
// Pre-fetch and cache popular topics every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  const topics = ["world", "politics", "tech", "climate"];
  for (const topic of topics) {
    await prefetchAndCache(topic);
  }
});
```

### 2. Stale-While-Revalidate
```javascript
// Return stale data immediately, refresh in background
const stale = await cacheGet(key);
if (stale) {
  refreshInBackground(key); // Non-blocking
  return stale;
}
```

### 3. Cache Tags
```javascript
// Invalidate by tag (e.g., all "climate" related caches)
await redisClient.sAdd(`tag:topic:${topic}`, key);
await redisClient.invalidate("tag:topic:climate");
```

### 4. Redis Cluster / Sentinel
- Production would use Redis Cluster for HA
- Sentinel for automatic failover

## Monitoring

### Key Metrics to Track
- Cache hit rate: `INFO stats | grep keyspace_hits`
- Memory usage: `INFO memory | grep used_memory_human`
- Connection count: `INFO clients | grep connected_clients`

### Redis Commands for Debugging
```bash
# List all keys
KEYS *

# Check specific key TTL
TTL news:world

# Monitor real-time commands
MONITOR

# Memory analysis
DEBUG OBJECT news:world
```

## Local Development

### Docker Setup
```bash
docker run -d -p 6379:6379 redis:latest
```

### Connect via CLI
```bash
redis-cli
> PING
PONG
```

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `REDIS_URL` | No | `redis://localhost:6379` |

## Dependencies

```bash
npm install ioredis
```

## Performance Impact

| Scenario | Without Cache | With Cache |
|----------|---------------|------------|
| Repeated query | 5-10s (AI) | <50ms |
| Same topic, different user | 3-5s (API) | <50ms |
| Cache miss | 5-10s (full) | 5-10s (full) |

**Expected improvement**: 50-100x faster for cached responses.
