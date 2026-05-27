import { GeezifySyncCoordinator } from "@/lib/sync/coordinator";
import { HttpSyncTransport } from "@/lib/sync/http-transport";

import { landingProfileCache } from "@/lib/cache/landing-profile-cache";
import { getUserPreferredStore } from "@/lib/cache/user-preferred-store";
import { DEVICE_ID_KEY } from "@/lib/cache/storage-keys";
import { getAccessToken } from "@/lib/auth";
import { enqueuePendingPreferences } from "@/lib/sync/preference-sync";

const CLIENT_HEADER = "landing/1.0.0";

const landingAuth = {
  getAccessToken: async () => getAccessToken(),
};

const landingDevice = {
  getDeviceId: async () => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = `landing-${crypto.randomUUID()}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  },
};

const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const coordinator = new GeezifySyncCoordinator(
  "landing",
  landingAuth,
  landingProfileCache,
  new HttpSyncTransport(apiBase, CLIENT_HEADER),
  landingDevice,
  2500,
);

export function recordPreferenceAccepted(latin: string, geez: string): void {
  const store = getUserPreferredStore();
  store.setPreferred(latin, geez, true);

  if (!getAccessToken()) return;

  void (async () => {
    await landingProfileCache.enqueueChange({
      type: "preference.accepted",
      latin,
      geez,
    });
    const { syncedPreferences } = await coordinator.flushNow();
    if (syncedPreferences.length) {
      store.markSynced(syncedPreferences);
    }
  })().catch(async (err) => {
    await landingProfileCache.setSyncStatus({
      lastError: err instanceof Error ? err.message : String(err),
    });
  });
}

export async function flushPendingPreferences(): Promise<void> {
  await enqueuePendingPreferences();
}

export function recordSettingsPatch(fields: Record<string, unknown>): void {
  coordinator.onLocalChange({ type: "settings.patch", scope: "clients.landing", fields });
}

export async function syncBootstrap(): Promise<void> {
  if (!getAccessToken()) return;
  const store = getUserPreferredStore();
  try {
    await coordinator.pull();
    await enqueuePendingPreferences();
    const { syncedPreferences } = await coordinator.pushPending();
    if (syncedPreferences.length) {
      store.markSynced(syncedPreferences);
    }
  } catch (err) {
    await landingProfileCache.setSyncStatus({
      lastError: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function syncPushNow(): Promise<void> {
  const store = getUserPreferredStore();
  await enqueuePendingPreferences();
  const { syncedPreferences } = await coordinator.pushPending();
  if (syncedPreferences.length) {
    store.markSynced(syncedPreferences);
  }
}

export async function eraseAll(): Promise<void> {
  const token = getAccessToken();
  if (token) {
    await coordinator.eraseAll();
  } else {
    await landingProfileCache.clearAll();
  }
}

export async function clearLocalSyncOnLogout(): Promise<void> {
  await landingProfileCache.clearAll();
}

export async function getSyncStatus() {
  return landingProfileCache.getSyncStatus();
}

export function getPreferredGeEz(latin: string): string | null {
  return getUserPreferredStore().getPreferredGeEz(latin);
}
