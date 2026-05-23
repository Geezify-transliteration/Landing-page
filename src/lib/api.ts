import { getAccessToken, refreshAccessToken } from "@/lib/auth";
import type {
  ApiError,
  ModelsListResponse,
  TransliterateRequest,
  TransliterateResponse,
} from "@/lib/types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const toApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};

const parseApiError = async (response: Response): Promise<ApiError> => {
  let code = "REQUEST_FAILED";
  let message = "Something went wrong while contacting the transliteration service.";

  try {
    const payload = await response.json();
    const detail = payload?.detail ?? payload;

    if (typeof detail === "string") {
      message = detail;
    } else if (detail && typeof detail === "object") {
      code = String(detail.code || code);
      message = String(detail.message || message);
    }
  } catch {
    // Fall back to the default message when the backend does not return JSON.
  }

  return {
    status: response.status,
    code,
    message,
  };
};

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Geezify-Client": "landing/1.0.0",
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return { ...headers, ...(extra as Record<string, string>) };
}

async function fetchJson<T>(path: string, init?: RequestInit, retryOnUnauthorized = true): Promise<T> {
  const response = await fetch(toApiUrl(path), {
    headers: buildHeaders(init?.headers),
    ...init,
  });

  if (response.status === 401 && retryOnUnauthorized && getAccessToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetchJson<T>(path, init, false);
    }
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json() as Promise<T>;
}

export const api = {
  listModels: () => fetchJson<ModelsListResponse>("/v1/models"),
  transliterate: (payload: TransliterateRequest) =>
    fetchJson<TransliterateResponse>("/v1/transliterate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
