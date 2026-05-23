# Geezify Landing Page

A standalone React + TypeScript + Vite landing site for the Geezify transliteration project.

## What is included

- A premium purple homepage inspired by modern writing-tool marketing pages
- A dedicated paragraph transliteration workspace
- Real frontend integration with the backend endpoints:
  - `GET /v1/models`
  - `POST /v1/transliterate`
- Local development proxy support for a backend running on `http://127.0.0.1:8000`

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Environment variables

Create a `.env` file from `.env.example` when needed.

```bash
VITE_API_BASE_URL=
VITE_BACKEND_PROXY_TARGET=http://127.0.0.1:8000
```

### Recommended local setup

1. Start the backend from `Final Project/backend`
2. Keep `VITE_API_BASE_URL` empty so the Vite dev server can proxy `/v1/*`
3. Run this app from `Final Project/Landing-page`

If you deploy the frontend separately from the backend, set `VITE_API_BASE_URL` to the backend origin and ensure the backend allows that origin.
