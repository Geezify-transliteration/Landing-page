import type { LocalProfileCache } from "@/lib/sync/interfaces";
import type { LocalChange, ProfileMirror, SyncPullResponse, SyncStatus } from "@/lib/sync/types";

import { getUserPreferredStore } from "@/lib/cache/user-preferred-store";
import {
  SYNC_CURSOR_KEY,
  SYNC_MIRROR_KEY,
  SYNC_QUEUE_KEY,
  SYNC_STATUS_KEY,
} from "@/lib/cache/storage-keys";

const EMPTY_MIRROR: ProfileMirror = {
  cursor: 0,
  settingsCommon: {},
  settingsClients: {},
  dictionary: [],
};

const DEFAULT_STATUS: SyncStatus = {
  cursor: 0,
  personalization_enabled: true,
  lastSyncAt: null,
  lastError: null,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export class LandingProfileCache implements LocalProfileCache {
  async getCursor(): Promise<number> {
    return Number(localStorage.getItem(SYNC_CURSOR_KEY) || "0");
  }

  async setCursor(cursor: number): Promise<void> {
    localStorage.setItem(SYNC_CURSOR_KEY, String(cursor));
  }

  async getMirror(): Promise<ProfileMirror> {
    return readJson<ProfileMirror>(SYNC_MIRROR_KEY, EMPTY_MIRROR);
  }

  async applyPull(response: SyncPullResponse): Promise<void> {
    const mirror: ProfileMirror = {
      cursor: response.cursor,
      settingsCommon: response.settings?.common ?? {},
      settingsClients: response.settings?.clients ?? {},
      dictionary: (response.custom_dictionary?.upserts ?? [])
        .filter((entry) => !entry.deleted)
        .map((entry) => ({
          entry_id: entry.entry_id,
          latin_norm: entry.latin_norm,
          geez: entry.geez,
          note: entry.note ?? null,
        })),
    };

    await this.setCursor(response.cursor);
    writeJson(SYNC_MIRROR_KEY, mirror);
    getUserPreferredStore().mergePullResponse(response);
  }

  async enqueueChange(change: LocalChange): Promise<void> {
    const queue = readJson<LocalChange[]>(SYNC_QUEUE_KEY, []);
    queue.push(change);
    writeJson(SYNC_QUEUE_KEY, queue);
  }

  async drainQueue(): Promise<LocalChange[]> {
    const queue = readJson<LocalChange[]>(SYNC_QUEUE_KEY, []);
    writeJson(SYNC_QUEUE_KEY, []);
    return queue;
  }

  async requeue(changes: LocalChange[]): Promise<void> {
    const queue = readJson<LocalChange[]>(SYNC_QUEUE_KEY, []);
    writeJson(SYNC_QUEUE_KEY, [...changes, ...queue]);
  }

  async getSyncStatus(): Promise<SyncStatus> {
    return { ...DEFAULT_STATUS, ...readJson<Partial<SyncStatus>>(SYNC_STATUS_KEY, {}) };
  }

  async setSyncStatus(patch: Partial<SyncStatus>): Promise<void> {
    const current = await this.getSyncStatus();
    writeJson(SYNC_STATUS_KEY, { ...current, ...patch });
  }

  async clearAll(): Promise<void> {
    [SYNC_CURSOR_KEY, SYNC_QUEUE_KEY, SYNC_MIRROR_KEY, SYNC_STATUS_KEY].forEach((key) => {
      localStorage.removeItem(key);
    });
    getUserPreferredStore().clear();
  }
}

export const landingProfileCache = new LandingProfileCache();
