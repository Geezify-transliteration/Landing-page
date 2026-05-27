import { afterEach, describe, expect, it, vi } from "vitest";

import { clearSession, getAccessToken, login, refreshAccessToken } from "@/lib/auth";

describe("auth integration", () => {
  afterEach(() => {
    clearSession();
    vi.restoreAllMocks();
  });

  it("stores tokens on successful login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          access_token: "token-a",
          refresh_token: "token-r",
          token_type: "bearer",
        }),
      })),
    );

    await login("u@example.com", "pw");
    expect(getAccessToken()).toBe("token-a");
  });

  it("clears session when refresh fails", async () => {
    localStorage.setItem("geezify_refresh_token", "old-refresh");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
      })),
    );

    const refreshed = await refreshAccessToken();
    expect(refreshed).toBeNull();
    expect(localStorage.getItem("geezify_access_token")).toBeNull();
  });
});
