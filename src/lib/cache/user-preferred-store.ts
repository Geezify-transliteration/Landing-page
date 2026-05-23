import type { SyncPullResponse } from "@/lib/sync/types";

import { PREFERRED_ENTRIES_KEY } from "@/lib/cache/storage-keys";

export interface PreferredEntry {
  latin: string;
  geez: string;
  updatedAtMs: number;
  pendingSync: boolean;
}

const MAX_ENTRIES = 500;

/** Align with backend merge.normalize_latin */
export function normalizeLatin(value: string): string {
  const lowered = (value || "").toLowerCase();
  const cleaned = [...lowered]
    .map((ch) => (/[a-z ]/.test(ch) ? ch : " "))
    .join("");
  const collapsed = cleaned.split(/\s+/).filter(Boolean).join(" ");
  return collapsed.replace(/\s/g, "") || collapsed.trim();
}

export class UserPreferredStore {
  private memory = new Map<string, PreferredEntry>();

  constructor() {
    this.loadFromDisk();
  }

  getPreferredGeEz(latin: string): string | null {
    return this.getEntry(latin)?.geez ?? null;
  }

  getEntry(latin: string): PreferredEntry | null {
    const key = normalizeLatin(latin);
    if (!key) return null;
    return this.memory.get(key) ?? null;
  }

  setPreferred(latin: string, geez: string, markPendingSync = true): void {
    const key = normalizeLatin(latin);
    const value = geez.trim();
    if (!key || !value) return;

    this.memory.delete(key);
    this.memory.set(key, {
      latin: key,
      geez: value,
      updatedAtMs: Date.now(),
      pendingSync: markPendingSync,
    });

    this.trimIfNeeded();
    this.persist();
  }

  remove(latin: string): void {
    const key = normalizeLatin(latin);
    if (!key) return;
    this.memory.delete(key);
    this.persist();
  }

  allEntries(): PreferredEntry[] {
    return [...this.memory.values()];
  }

  entriesPendingSync(): PreferredEntry[] {
    return this.allEntries().filter((entry) => entry.pendingSync);
  }

  markSynced(latinKeys: string[]): void {
    let changed = false;
    for (const raw of latinKeys) {
      const key = normalizeLatin(raw);
      const entry = this.memory.get(key);
      if (!entry?.pendingSync) continue;
      this.memory.set(key, { ...entry, pendingSync: false });
      changed = true;
    }
    if (changed) this.persist();
  }

  upsertFromServer(latin: string, geez: string, updatedAtMs = Date.now()): void {
    const key = normalizeLatin(latin);
    const value = geez.trim();
    if (!key || !value) return;

    const existing = this.memory.get(key);
    if (existing?.pendingSync) return;
    if (existing?.geez === value && !existing.pendingSync) return;

    this.memory.set(key, {
      latin: key,
      geez: value,
      updatedAtMs,
      pendingSync: false,
    });
    this.trimIfNeeded();
    this.persist();
  }

  mergePullResponse(response: SyncPullResponse): void {
    const bestByLatin = new Map<string, { geez: string; count: number }>();

    for (const record of response.personalization?.upserts ?? []) {
      if (!record.latin_norm || !record.geez) continue;
      const existing = bestByLatin.get(record.latin_norm);
      if (!existing || record.count > existing.count) {
        bestByLatin.set(record.latin_norm, { geez: record.geez, count: record.count });
      }
    }

    bestByLatin.forEach((pair, latin) => {
      this.upsertFromServer(latin, pair.geez);
    });

    for (const entry of response.custom_dictionary?.upserts ?? []) {
      if (entry.deleted) continue;
      this.upsertFromServer(entry.latin_norm, entry.geez);
    }

    for (const tombstone of response.custom_dictionary?.tombstones ?? []) {
      if (tombstone) this.remove(tombstone);
    }
  }

  clear(): void {
    this.memory.clear();
    localStorage.removeItem(PREFERRED_ENTRIES_KEY);
  }

  private trimIfNeeded(): void {
    while (this.memory.size > MAX_ENTRIES) {
      let oldestKey: string | undefined;
      let oldestMs = Infinity;
      for (const [key, entry] of this.memory) {
        if (entry.updatedAtMs < oldestMs) {
          oldestMs = entry.updatedAtMs;
          oldestKey = key;
        }
      }
      if (!oldestKey) break;
      this.memory.delete(oldestKey);
    }
  }

  private loadFromDisk(): void {
    try {
      const raw = localStorage.getItem(PREFERRED_ENTRIES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, PreferredEntry>;
      this.memory = new Map(Object.entries(parsed));
    } catch {
      this.memory.clear();
    }
  }

  private persist(): void {
    const payload = Object.fromEntries(this.memory);
    localStorage.setItem(PREFERRED_ENTRIES_KEY, JSON.stringify(payload));
  }
}

let singleton: UserPreferredStore | null = null;

export function getUserPreferredStore(): UserPreferredStore {
  if (!singleton) singleton = new UserPreferredStore();
  return singleton;
}
