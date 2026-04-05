import Redis from "ioredis";

let redis = null;

export function getRedisClient() {
  if (redis) return redis;
  
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.warn("[Redis] REDIS_URL not set. Caching disabled.");
    return null;
  }
  
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });
    
    redis.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });
    
    redis.on("connect", () => {
      console.log("[Redis] Connected successfully");
    });
    
    return redis;
  } catch (err) {
    console.error("[Redis] Failed to create client:", err.message);
    return null;
  }
}

export async function closeRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

export function isRedisAvailable() {
  return getRedisClient() !== null;
}
