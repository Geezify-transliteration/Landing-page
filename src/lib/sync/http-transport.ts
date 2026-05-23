import type { MergeResult, SyncChange, SyncPullResponse } from "@/lib/sync/types";
import type { SyncTransport } from "@/lib/sync/interfaces";

export class HttpSyncTransport implements SyncTransport {
  private readonly apiBaseUrl: string;
  private readonly clientHeader: string;

  constructor(apiBaseUrl: string, clientHeader: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.clientHeader = clientHeader;
  }

  private headers(token: string, deviceId: string): HeadersInit {
    return {
      Authorization: `Bearer ${token}`,
      "X-Geezify-Device-Id": deviceId,
      "X-Geezify-Client": this.clientHeader,
      "Content-Type": "application/json",
    };
  }

  async pull(cursor: number, token: string, deviceId: string): Promise<SyncPullResponse> {
    const res = await fetch(`${this.apiBaseUrl}/v1/sync/state?cursor=${cursor}`, {
      headers: this.headers(token, deviceId),
    });
    if (!res.ok) throw new Error(`sync pull ${res.status}`);
    return (await res.json()) as SyncPullResponse;
  }

  async push(changes: SyncChange[], token: string, deviceId: string): Promise<MergeResult> {
    const res = await fetch(`${this.apiBaseUrl}/v1/sync/changes`, {
      method: "POST",
      headers: this.headers(token, deviceId),
      body: JSON.stringify({ changes }),
    });
    if (!res.ok) throw new Error(`sync push ${res.status}`);
    return (await res.json()) as MergeResult;
  }

  async erase(token: string): Promise<void> {
    const res = await fetch(`${this.apiBaseUrl}/v1/sync/data`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "X-Geezify-Client": this.clientHeader },
    });
    if (!res.ok && res.status !== 204) throw new Error(`sync erase ${res.status}`);
  }
}
