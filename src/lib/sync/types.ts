export type ClientKind =
  | "extension"
  | "landing"
  | "word"
  | "libreoffice"
  | "android_keyboard"
  | "ios_keyboard"
  | "flutter";

export type ChangeType =
  | "preference.accepted"
  | "dictionary.upsert"
  | "dictionary.delete"
  | "settings.patch";

export interface SyncChange {
  client_kind: ClientKind;
  device_id: string;
  client_change_id: string;
  occurred_at: string;
  change_type: ChangeType;
  payload: Record<string, unknown>;
}

export interface SyncPullResponse {
  cursor: number;
  has_more: boolean;
  personalization: {
    upserts: Array<{
      latin_norm: string;
      geez: string;
      count: number;
      last_accepted_at: string;
      last_device_id?: string | null;
    }>;
    deletes: Array<[string, string]>;
  };
  custom_dictionary: {
    upserts: Array<{
      entry_id: string;
      latin_norm: string;
      geez: string;
      note?: string | null;
      created_at: string;
      updated_at: string;
      deleted: boolean;
    }>;
    tombstones: string[];
  };
  settings: {
    common: Record<string, unknown>;
    clients: Record<string, Record<string, unknown>>;
    meta: Record<string, Record<string, { updated_at: string; device_id: string }>>;
  };
}

export interface MergeResult {
  cursor: number;
  accepted: string[];
  rejected: Array<{ client_change_id: string; reason: string }>;
}

export interface SyncStatus {
  cursor: number;
  personalization_enabled: boolean;
  lastSyncAt: string | null;
  lastError: string | null;
}

export type LocalChange =
  | { type: "preference.accepted"; latin: string; geez: string }
  | {
      type: "dictionary.upsert";
      entryId: string;
      latin: string;
      geez: string;
      note?: string;
    }
  | { type: "dictionary.delete"; entryId: string }
  | { type: "settings.patch"; scope: string; fields: Record<string, unknown> };

export interface ProfileMirror {
  cursor: number;
  settingsCommon: Record<string, unknown>;
  settingsClients: Record<string, Record<string, unknown>>;
  dictionary: Array<{
    entry_id: string;
    latin_norm: string;
    geez: string;
    note?: string | null;
  }>;
}
