/**
 * In-Memory Cache with TTL
 * Fallback when Redis is unavailable. Simple Map-based cache with automatic expiration.
 * Max 100 entries to prevent memory leaks.
 */

const MAX_ENTRIES = 100;
const store = new Map(); // key → { value, expiresAt }

export function memCacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

export function memCacheSet(key, value, ttlSeconds) {
  // Evict oldest entries if at capacity
  if (store.size >= MAX_ENTRIES) {
    const firstKey = store.keys().next().value;
    store.delete(firstKey);
  }

  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function memCacheDelete(key) {
  store.delete(key);
}

export function memCacheClear() {
  store.clear();
}
