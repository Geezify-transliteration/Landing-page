const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_PROXY_TARGET || "").replace(/\/$/, "");

export function toBackendUrl(path: string): string {
  return BACKEND_BASE_URL ? `${BACKEND_BASE_URL}${path}` : path;
}

