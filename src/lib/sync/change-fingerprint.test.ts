import { describe, expect, it } from "vitest";

import { changeFingerprint } from "@/lib/sync/change-fingerprint";

describe("changeFingerprint", () => {
  it("normalizes preference keys", () => {
    const key = changeFingerprint({
      type: "preference.accepted",
      latin: "Se Lam!",
      geez: " ሰላም ",
      clientChangeId: "1",
      occurredAt: new Date().toISOString(),
    } as never);
    expect(key).toBe("preference:selam:ሰላም");
  });

  it("fingerprints dictionary updates", () => {
    const key = changeFingerprint({
      type: "dictionary.upsert",
      entryId: "abc",
      latin: "selam",
      geez: "ሰላም",
      note: "",
      clientChangeId: "2",
      occurredAt: new Date().toISOString(),
    } as never);
    expect(key).toBe("dict.upsert:abc");
  });
});
