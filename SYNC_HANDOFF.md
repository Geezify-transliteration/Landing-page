# Sync & personalization — landing page handoff

**Last updated:** May 2026  
**Stack:** React + Vite, JWT auth, localStorage cache, `/v1/sync/*`.

---

## Current status

| Area | Status |
|------|--------|
| JWT auth (register/login/logout) | **Done** |
| Local `UserPreferredStore` | **Done** — `geezify_preferred_entries_v1` |
| Sync coordinator (single pipeline) | **Done** — no root `shared/` package |
| Push on candidate accept | **Done** — enqueue + `flushNow()` |
| Pull on login / bootstrap | **Done** |
| Logout clears local sync | **Done** |
| UI shows sync errors / personalized flag | **Done** (paragraph transliterator) |
| Direct duplicate push path | **Removed** (`push-preference.ts` deleted) |

---

## Architecture (client)

```
User picks candidate
  → UserPreferredStore.setPreferred (pendingSync=true)
  → landingProfileCache.enqueueChange(preference.accepted)
  → GeezifySyncCoordinator.flushNow()
  → POST /v1/sync/changes
  → markSynced only if server accepted

Login / mount
  → syncBootstrap(): pull → enqueue pending → pushPending → markSynced
```

**Server rerank:** Landing displays `candidates` from `POST /v1/transliterate` as returned (order is server-side when logged in). Local store is for offline hints and cross-device merge after pull.

---

## Key files

| Path | Role |
|------|------|
| [`src/lib/cache/user-preferred-store.ts`](src/lib/cache/user-preferred-store.ts) | Local prefs, merge pull, LRU trim |
| [`src/lib/cache/landing-profile-cache.ts`](src/lib/cache/landing-profile-cache.ts) | Queue, cursor, mirror, `applyPull` |
| [`src/lib/sync/coordinator.ts`](src/lib/sync/coordinator.ts) | Push/pull, mutex, stable `client_change_id` |
| [`src/lib/sync/index.ts`](src/lib/sync/index.ts) | Public API: `recordPreferenceAccepted`, `syncBootstrap`, etc. |
| [`src/lib/sync/preference-sync.ts`](src/lib/sync/preference-sync.ts) | Enqueue pending prefs (deduped) |
| [`src/lib/sync/http-transport.ts`](src/lib/sync/http-transport.ts) | HTTP to backend |
| [`src/lib/auth.ts`](src/lib/auth.ts) | Tokens, login |
| [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx) | Auth + bootstrap on login |

---

## Env

```env
VITE_API_BASE_URL=
VITE_BACKEND_PROXY_TARGET=http://127.0.0.1:8000
```

Dev proxy forwards API to backend. Production: set `VITE_API_BASE_URL` to your API origin.

---

## Tests

```powershell
cd Landing-page
npm run test
```

Covers `user-preferred-store` and `landing-profile-cache`.

---

## Known gaps / next work

- [ ] Token refresh on 401 during sync (auth has refresh for `/me`, sync does not yet)
- [ ] `has_more` pagination on pull (backend returns full snapshot today)
- [ ] Settings patch UI wired to `recordSettingsPatch` if product needs synced `top_k` from landing only
- [ ] E2E test against real API + Neon (optional)

---

## Backend dependency

Requires backend with **Postgres sync store** and JWT auth. See [`../backend/SYNC_HANDOFF.md`](../backend/SYNC_HANDOFF.md) and [`../backend/db/NEON_SETUP.md`](../backend/db/NEON_SETUP.md).
