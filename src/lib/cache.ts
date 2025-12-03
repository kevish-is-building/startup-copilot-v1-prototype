import { Redis } from '@upstash/redis';
import { UserProfile, PromptCache } from './types/ai';

// Initialize Redis client (will work once env vars are set)
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) return redis;
  
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  }
  
  return null;
}

const CACHE_TTL = 86400; // 24 hours

export async function getCachedRecommendations(
  userProfile: UserProfile
): Promise<PromptCache | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;
    
    const cacheKey = `recommendations:${userProfile.id}`;
    const cached = await client.get(cacheKey);
    
    if (cached && typeof cached === 'object') {
      const cacheData = cached as PromptCache;
      // Check if cache is still valid
      if (cacheData.expiresAt > Date.now()) {
        return cacheData;
      }
    }
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

export async function setCachedRecommendations(
  userProfile: UserProfile,
  cache: PromptCache
): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;
    
    const cacheKey = `recommendations:${userProfile.id}`;
    await client.setex(cacheKey, CACHE_TTL, JSON.stringify(cache));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

export async function invalidateUserCache(userId: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;
    
    await client.del(`recommendations:${userId}`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

export function isRedisCon figured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}
