import { getRedisClient } from "./client";
import { memCacheGet, memCacheSet, memCacheDelete, memCacheClear } from "./memcache";

export const CACHE_TTL = {
  NEWS: 60 * 15,
  SUMMARY: 60 * 60,
  EVENTS: 60 * 60,
  BIAS_DATA: 60 * 60 * 24,
};

export const CACHE_KEYS = {
  news: (topic) => `news:${topic.toLowerCase()}`,
  analyze: (query) => `analyze:${hashQuery(query)}`,
  events: (topic) => `events:${topic.toLowerCase()}`,
  summary: (query) => `summary:${hashQuery(query)}`,
  biasData: () => "bias:data",
};

function hashQuery(query) {
  const str = query.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function cacheGet(key) {
  // Try Redis first
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.warn(`[Cache] Redis get failed for ${key}:`, err.message);
    }
  }
  
  // Fallback to in-memory cache
  return memCacheGet(key);
}

export async function cacheSet(key, value, ttlSeconds) {
  // Always write to in-memory cache
  memCacheSet(key, value, ttlSeconds);

  // Also write to Redis if available
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[Cache] Redis set failed for ${key}:`, err.message);
    }
  }
  
  return true; // In-memory cache succeeded
}

export async function cacheDelete(key) {
  memCacheDelete(key);
  
  const redis = getRedisClient();
  if (!redis) return true;
  
  try {
    await redis.del(key);
    return true;
  } catch (err) {
    console.warn(`[Cache] Delete failed for ${key}:`, err.message);
    return false;
  }
}

export async function cacheInvalidatePattern(pattern) {
  // Clear all in-memory cache on pattern invalidation
  memCacheClear();

  const redis = getRedisClient();
  if (!redis) return true;
  
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] Invalidated ${keys.length} keys matching ${pattern}`);
    }
    return true;
  } catch (err) {
    console.warn(`[Cache] Invalidate pattern failed (${pattern}):`, err.message);
    return false;
  }
}

export async function invalidateAllNews() {
  return cacheInvalidatePattern("news:*");
}

export async function invalidateAllAnalyze() {
  return cacheInvalidatePattern("analyze:*");
}

export async function invalidateAllEvents() {
  return cacheInvalidatePattern("events:*");
}

export async function invalidateAll() {
  const patterns = ["news:*", "analyze:*", "events:*", "summary:*"];
  for (const pattern of patterns) {
    await cacheInvalidatePattern(pattern);
  }
}
