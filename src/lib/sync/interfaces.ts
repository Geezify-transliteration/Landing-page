import type { LocalChange, MergeResult, ProfileMirror, SyncPullResponse, SyncStatus } from "@/lib/sync/types";

export interface AuthProvider {
  getAccessToken(): Promise<string | null>;
}

export interface DeviceIdentity {
  getDeviceId(): Promise<string>;
}

export interface LocalProfileCache {
  getCursor(): Promise<number>;
  setCursor(cursor: number): Promise<void>;
  getMirror(): Promise<ProfileMirror>;
  applyPull(response: SyncPullResponse): Promise<void>;
  enqueueChange(change: LocalChange): Promise<void>;
  drainQueue(): Promise<LocalChange[]>;
  requeue(changes: LocalChange[]): Promise<void>;
  getSyncStatus(): Promise<SyncStatus>;
  setSyncStatus(patch: Partial<SyncStatus>): Promise<void>;
  clearAll(): Promise<void>;
}

export interface SyncTransport {
  pull(cursor: number, token: string, deviceId: string): Promise<SyncPullResponse>;
  push(changes: import("@/lib/sync/types").SyncChange[], token: string, deviceId: string): Promise<MergeResult>;
  erase(token: string): Promise<void>;
}

export type PushResult = {
  syncedPreferences: string[];
};

export interface SyncCoordinator {
  bootstrap(): Promise<void>;
  pushPending(): Promise<PushResult>;
  pull(remoteCursor?: number): Promise<void>;
  onLocalChange(change: LocalChange): void;
  eraseAll(): Promise<void>;
}
