import { describe, expect, it, beforeEach } from "vitest";

import { LandingProfileCache } from "@/lib/cache/landing-profile-cache";
import { getUserPreferredStore } from "@/lib/cache/user-preferred-store";

describe("LandingProfileCache.applyPull", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("merges personalization into UserPreferredStore", async () => {
    const cache = new LandingProfileCache();
    await cache.applyPull({
      cursor: 3,
      has_more: false,
      personalization: {
        upserts: [
          {
            latin_norm: "selam",
            geez: "ሰላም",
            count: 2,
            last_accepted_at: new Date().toISOString(),
          },
        ],
        deletes: [],
      },
      custom_dictionary: { upserts: [], tombstones: [] },
      settings: { common: {}, clients: {}, meta: {} },
    });

    expect(getUserPreferredStore().getPreferredGeEz("selam")).toBe("ሰላም");
    expect(await cache.getCursor()).toBe(3);
    expect((await cache.getMirror()).cursor).toBe(3);
  });
});
