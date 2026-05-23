const ACCESS_TOKEN_KEY = "geezify_access_token";
const REFRESH_TOKEN_KEY = "geezify_refresh_token";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const toApiUrl = (path: string) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path);

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  picture_url: string | null;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthTokens | null): void {
  if (!tokens) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearSession(): void {
  setTokens(null);
}

async function parseAuthError(response: Response): Promise<string> {
  try {
    const payload = await response.json();
    const detail = payload?.detail ?? payload?.message;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg ?? item).join(", ");
    }
  } catch {
    // ignore
  }
  return "Authentication request failed.";
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const response = await fetch(toApiUrl("/v1/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Geezify-Client": "landing/1.0.0" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await parseAuthError(response));
  const tokens = (await response.json()) as AuthTokens;
  setTokens(tokens);
  return tokens;
}

export async function register(
  email: string,
  password: string,
  fullName?: string,
): Promise<AuthUser> {
  const response = await fetch(toApiUrl("/v1/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Geezify-Client": "landing/1.0.0" },
    body: JSON.stringify({ email, password, full_name: fullName || null }),
  });
  if (!response.ok) throw new Error(await parseAuthError(response));
  return (await response.json()) as AuthUser;
}

export async function refreshAccessToken(): Promise<AuthTokens | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(toApiUrl("/v1/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Geezify-Client": "landing/1.0.0" },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!response.ok) {
    clearSession();
    return null;
  }
  const tokens = (await response.json()) as AuthTokens;
  setTokens(tokens);
  return tokens;
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token) return null;

  let response = await fetch(toApiUrl("/v1/auth/me"), {
    headers: { Authorization: `Bearer ${token}`, "X-Geezify-Client": "landing/1.0.0" },
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
    response = await fetch(toApiUrl("/v1/auth/me"), {
      headers: {
        Authorization: `Bearer ${refreshed.access_token}`,
        "X-Geezify-Client": "landing/1.0.0",
      },
    });
  }

  if (!response.ok) return null;
  return (await response.json()) as AuthUser;
}
