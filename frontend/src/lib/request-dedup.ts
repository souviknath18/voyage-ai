/**
 * Deduplicates simultaneous API requests.
 *
 * Does not cache completed responses.
 * New requests after completion always fetch fresh data.
 */

const pendingRequests = new Map<string, Promise<unknown>>();

export function dedupeRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const existing = pendingRequests.get(key);

  if (existing) {
    console.log("[Request Dedup] REUSED:", key);
    return existing as Promise<T>;
  }

  console.log("[Request Dedup] NEW:", key);

  const request = Promise.resolve()
    .then(fetcher)
    .finally(() => {
      if (pendingRequests.get(key) === request) {
        pendingRequests.delete(key);
      }
    });

  pendingRequests.set(key, request);

  return request;
}