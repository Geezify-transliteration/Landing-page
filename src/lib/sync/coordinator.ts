import type { AuthProvider, DeviceIdentity, LocalProfileCache, SyncCoordinator, SyncTransport } from "@/lib/sync/interfaces";
import type { ClientKind, LocalChange, SyncChange } from "@/lib/sync/types";

import { changeFingerprint } from "@/lib/sync/change-fingerprint";
import { normalizeLatin } from "@/lib/cache/user-preferred-store";

export type PushResult = {
  syncedPreferences: string[];
};

export class GeezifySyncCoordinator implements SyncCoordinator {
  private pushTimer: ReturnType<typeof setTimeout> | undefined;
  private pushInFlight: Promise<PushResult> | null = null;
  private readonly stableChangeIds = new Map<string, string>();
  private readonly clientKind: ClientKind;
  private readonly auth: AuthProvider;
  private readonly cache: LocalProfileCache;
  private readonly transport: SyncTransport;
  private readonly device: DeviceIdentity;
  private readonly debounceMs: number;

  constructor(
    clientKind: ClientKind,
    auth: AuthProvider,
    cache: LocalProfileCache,
    transport: SyncTransport,
    device: DeviceIdentity,
    debounceMs = 3000,
  ) {
    this.clientKind = clientKind;
    this.auth = auth;
    this.cache = cache;
    this.transport = transport;
    this.device = device;
    this.debounceMs = debounceMs;
  }

  async bootstrap(): Promise<void> {
    const token = await this.auth.getAccessToken();
    if (!token) return;
    await this.pull();
    await this.pushPending();
  }

  async pushPending(): Promise<PushResult> {
    return this.runPush();
  }

  /** Immediate push (cancels debounced push). Use after user accepts a preference. */
  async flushNow(): Promise<PushResult> {
    if (this.pushTimer) {
      clearTimeout(this.pushTimer);
      this.pushTimer = undefined;
    }
    return this.runPush();
  }

  async pull(remoteCursor?: number): Promise<void> {
    const token = await this.auth.getAccessToken();
    if (!token) return;

    const cursor = remoteCursor ?? (await this.cache.getCursor());
    const deviceId = await this.device.getDeviceId();
    const response = await this.transport.pull(cursor, token, deviceId);
    await this.cache.applyPull(response);
    await this.cache.setCursor(response.cursor);
    await this.cache.setSyncStatus({
      lastSyncAt: new Date().toISOString(),
      lastError: null,
      cursor: response.cursor,
    });
  }

  onLocalChange(change: LocalChange): void {
    void this.cache.enqueueChange(change).then(() => this.schedulePush());
  }

  async eraseAll(): Promise<void> {
    const token = await this.auth.getAccessToken();
    if (token) await this.transport.erase(token);
    this.stableChangeIds.clear();
    await this.cache.clearAll();
  }

  private schedulePush(): void {
    if (this.pushTimer) clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => {
      void this.runPush().catch(() => undefined);
    }, this.debounceMs);
  }

  private runPush(): Promise<PushResult> {
    if (this.pushInFlight) {
      return this.pushInFlight;
    }
    this.pushInFlight = this.doPush().finally(() => {
      this.pushInFlight = null;
    });
    return this.pushInFlight;
  }

  private async doPush(): Promise<PushResult> {
    const token = await this.auth.getAccessToken();
    if (!token) return { syncedPreferences: [] };

    const queue = await this.cache.drainQueue();
    if (queue.length === 0) return { syncedPreferences: [] };

    const deviceId = await this.device.getDeviceId();
    const changes = queue.map((item) => this.toSyncChange(item, deviceId));

    try {
      const result = await this.transport.push(changes, token, deviceId);
      const rejectedIds = new Set(result.rejected.map((r) => r.client_change_id));
      const failed: LocalChange[] = [];
      const syncedPreferences: string[] = [];

      queue.forEach((item, index) => {
        const changeId = changes[index]?.client_change_id;
        if (!changeId || rejectedIds.has(changeId)) {
          failed.push(item);
          return;
        }
        const fp = changeFingerprint(item);
        this.stableChangeIds.delete(fp);
        if (item.type === "preference.accepted") {
          syncedPreferences.push(normalizeLatin(item.latin));
        }
      });

      if (failed.length) await this.cache.requeue(failed);

      await this.cache.setCursor(result.cursor);
      await this.cache.setSyncStatus({
        lastSyncAt: new Date().toISOString(),
        lastError: null,
        cursor: result.cursor,
      });

      return { syncedPreferences };
    } catch (err) {
      await this.cache.requeue(queue);
      await this.cache.setSyncStatus({
        lastError: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  private stableChangeId(change: LocalChange): string {
    const fp = changeFingerprint(change);
    let id = this.stableChangeIds.get(fp);
    if (!id) {
      id = crypto.randomUUID();
      this.stableChangeIds.set(fp, id);
    }
    return id;
  }

  private toSyncChange(change: LocalChange, deviceId: string): SyncChange {
    const base = {
      client_kind: this.clientKind,
      device_id: deviceId,
      client_change_id: this.stableChangeId(change),
      occurred_at: new Date().toISOString(),
    };

    switch (change.type) {
      case "preference.accepted":
        return {
          ...base,
          change_type: "preference.accepted",
          payload: {
            latin: normalizeLatin(change.latin),
            geez: change.geez,
            count_delta: 1,
          },
        };
      case "dictionary.upsert":
        return {
          ...base,
          change_type: "dictionary.upsert",
          payload: {
            entry_id: change.entryId,
            latin: change.latin,
            geez: change.geez,
            note: change.note ?? null,
          },
        };
      case "dictionary.delete":
        return {
          ...base,
          change_type: "dictionary.delete",
          payload: { entry_id: change.entryId },
        };
      case "settings.patch":
        return {
          ...base,
          change_type: "settings.patch",
          payload: { scope: change.scope, fields: change.fields },
        };
    }
  }
}
