import { describe, expect, it, beforeEach } from "vitest";

import { UserPreferredStore, normalizeLatin } from "@/lib/cache/user-preferred-store";
import { PREFERRED_ENTRIES_KEY } from "@/lib/cache/storage-keys";

describe("normalizeLatin", () => {
  it("lowercases and strips non-latin letters", () => {
    expect(normalizeLatin("SeLaM!")).toBe("selam");
  });
});

describe("UserPreferredStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("marks pending and clears after markSynced", () => {
    const store = new UserPreferredStore();
    store.setPreferred("selam", "ሰላም", true);
    expect(store.entriesPendingSync()).toHaveLength(1);
    store.markSynced(["selam"]);
    expect(store.entriesPendingSync()).toHaveLength(0);
    expect(store.getPreferredGeEz("selam")).toBe("ሰላም");
  });

  it("enforces max entries with LRU trim", () => {
    const store = new UserPreferredStore();
    for (let i = 0; i < 505; i++) {
      store.setPreferred(`word${i}`, `ጤ${i}`, false);
    }
    expect(store.allEntries().length).toBeLessThanOrEqual(500);
    expect(localStorage.getItem(PREFERRED_ENTRIES_KEY)).toBeTruthy();
  });
});
