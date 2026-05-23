import type { LocalChange } from "@/lib/sync/types";

import { normalizeLatin } from "@/lib/cache/user-preferred-store";

/** Stable key for deduping queue entries and idempotent client_change_id. */
export function changeFingerprint(change: LocalChange): string {
  switch (change.type) {
    case "preference.accepted":
      return `preference:${normalizeLatin(change.latin)}:${change.geez.trim()}`;
    case "dictionary.upsert":
      return `dict.upsert:${change.entryId}`;
    case "dictionary.delete":
      return `dict.delete:${change.entryId}`;
    case "settings.patch":
      return `settings:${change.scope}:${JSON.stringify(change.fields)}`;
  }
}
