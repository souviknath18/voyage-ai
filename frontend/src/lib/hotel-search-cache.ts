/**
 * VoyageAI - Hotel Search Cache
 *
 * Features:
 * - 2-minute in-memory caching
 * - Prevents duplicate simultaneous API requests
 * - Automatically refreshes expired results
 * - Does not cache failed requests
 * - Supports manual cache invalidation
 *
 * Note: This cache is for displaying hotel search results.
 * Hotel prices and availability must be revalidated before booking.
 */

const HOTEL_CACHE_TTL = 2 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const hotelCache = new Map<string, CacheEntry<unknown>>();

const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Fetch hotel results from cache or API.
 */
export async function cachedHotelSearch<T>(
  tripId: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cacheKey = `hotels:${tripId}`;

  // 1. Check existing cache
  const cached = hotelCache.get(cacheKey);

  if (cached) {
    if (Date.now() < cached.expiresAt) {
      console.log("[Hotels Cache] HIT:", tripId);
      return cached.data as T;
    }

    hotelCache.delete(cacheKey);
  }

  // 2. Deduplicate simultaneous requests
  const pending = pendingRequests.get(cacheKey);

  if (pending) {
    console.log("[Hotels Cache] REQUEST DEDUPLICATED:", tripId);
    return pending as Promise<T>;
  }

  // 3. Fetch fresh results
  console.log("[Hotels Cache] MISS:", tripId);

  const request = fetcher()
    .then((data) => {
      // 4. Cache successful response
      hotelCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + HOTEL_CACHE_TTL,
      });

      return data;
    })
    .finally(() => {
      if (pendingRequests.get(cacheKey) === request) {
        pendingRequests.delete(cacheKey);
      }
    });

  pendingRequests.set(cacheKey, request);

  return request;
}

/**
 * Remove cached results for a trip.
 */
export function invalidateHotelSearch(
  tripId: string,
): void {
  hotelCache.delete(`hotels:${tripId}`);

  console.log("[Hotels Cache] INVALIDATED:", tripId);
}

/**
 * Clear all hotel search results.
 * Useful when logging out or switching accounts.
 */
export function clearHotelSearchCache(): void {
  hotelCache.clear();

  console.log("[Hotels Cache] CLEARED");
}