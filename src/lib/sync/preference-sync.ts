import { landingProfileCache } from "@/lib/cache/landing-profile-cache";
import { getUserPreferredStore } from "@/lib/cache/user-preferred-store";
import { changeFingerprint } from "@/lib/sync/change-fingerprint";
import type { LocalChange } from "@/lib/sync/types";

/** Enqueue pending store entries (deduped against existing queue). */
export async function enqueuePendingPreferences(): Promise<void> {
  const store = getUserPreferredStore();
  const queue = await landingProfileCache.drainQueue();
  const queued = new Set(queue.map((c) => changeFingerprint(c)));

  const toEnqueue: LocalChange[] = [];
  for (const entry of store.entriesPendingSync()) {
    const change: LocalChange = {
      type: "preference.accepted",
      latin: entry.latin,
      geez: entry.geez,
    };
    const fp = changeFingerprint(change);
    if (queued.has(fp)) continue;
    queued.add(fp);
    toEnqueue.push(change);
  }

  if (toEnqueue.length) {
    await landingProfileCache.requeue([...toEnqueue, ...queue]);
  } else if (queue.length) {
    await landingProfileCache.requeue(queue);
  }
}
