# MediSearch

MediSearch is a full-stack AI application for exploring medicine information through structured search, side-by-side comparison, bilingual responses, and prescription/packaging image OCR.

> **Medical disclaimer:** MediSearch is for education only. AI output may be incomplete or incorrect. Always confirm medicine, dosage, interactions, and treatment decisions with a qualified doctor or pharmacist.

## What it does

- Generates structured medicine summaries with Gemini, with LLM7 as the primary provider when configured.
- Compares two medicines in one request.
- Extracts medicine names and prescription fields from uploaded images.
- Supports English and Hindi response modes.
- Provides guest search plus authenticated search history.
- Uses in-memory and MongoDB caching to reduce repeated model requests.
- Includes request validation, rate limiting, Helmet security headers, CORS, password hashing, and centralized error handling.

## Architecture

```text
React + Vite + Tailwind
          |
      Axios API client
          |
Express API + validation + rate limiting + auth
          |
MongoDB cache/history  <->  Gemini / LLM7
          |
      OCR image pipeline
```

The AI layer currently uses JSON-mode prompts and provider fallback. Grounded retrieval, source citations, clinical interaction verification, and formal AI evaluation are planned in [the transformation proposal](docs/AI_TRANSFORMATION_PROPOSAL.md).

## Stack

| Area | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, TypeScript |
| Data | MongoDB, Mongoose, NodeCache |
| AI | Google Gemini, LLM7-compatible chat API |
| Security | HttpOnly cookies, bcrypt, Helmet, CORS, rate limiting, validation |
| Quality | ESLint, TypeScript checks, Jest, Vitest, GitHub Actions |

## Quick start

### Requirements

- Node.js 22+
- MongoDB connection string
- Gemini API key for live AI responses (optional in mock mode)

### Install

```bash
npm ci
```

Create local environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

On PowerShell, use `Copy-Item` instead of `cp` if required.

Set at least `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in `backend/.env`. Use `GEMINI_API_KEY=mock` to run without a live Gemini key. `VITE_API_URL` points the frontend to the backend; leave it empty for the Vite `/api` proxy.

Start both applications in separate terminals:

```bash
npm run backend
npm run frontend
```

- Frontend: `http://localhost:5173`
- API health: `http://localhost:5000/api/health`

## Scripts

```bash
npm run typecheck   # TypeScript checks for both workspaces
npm run lint        # ESLint for both workspaces
npm test            # Backend Jest + frontend Vitest
npm run build       # Production builds for both workspaces
npm run ci          # Typecheck, lint, test, and build
```

## API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | No | Liveness check |
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Start a session |
| `POST` | `/api/auth/logout` | No | End a session |
| `GET` | `/api/auth/me` | Yes | Read the current user |
| `GET` | `/api/medicine/search?name=...` | Optional | Search a medicine |
| `GET` | `/api/medicine/compare?a=...&b=...` | Optional | Compare medicines |
| `POST` | `/api/ocr/extract` | Optional | Extract data from an image |
| `GET` | `/api/history` | Yes | Read search history |
| `GET` | `/api/history/stats` | Yes | Read history statistics |
| `DELETE` | `/api/history` | Yes | Clear search history |

## Environment

Backend variables are documented in [backend/.env.example](backend/.env.example). The important values are:

```env
MONGODB_URI=mongodb://localhost:27017/medisearch
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=mock
LLM7_API_KEY=
COOKIE_SAME_SITE=lax
```

For a frontend and API hosted on different sites, cookie configuration must be paired with an appropriate CSRF strategy. Do not commit real secrets.

## Repository layout

```text
backend/
  config/          Database and environment configuration
  controllers/     HTTP request handlers
  middleware/      Auth, validation, and error handling
  models/          User, history, and cache schemas
  routes/          API route definitions
  services/        AI and cache integrations
  tests/           Backend tests
frontend/
  src/components/  Reusable UI components
  src/context/     Auth and language state
  src/hooks/       Data-fetching hooks
  src/pages/       Application routes
  src/services/    API client
docs/              Project transformation proposal
```

## Current limitations and roadmap

The current AI responses are not grounded in a verified medical knowledge base, and generic-brand prices should not be treated as authoritative. The next engineering milestones are:

1. Schema-validated, source-grounded responses with citations.
2. Deterministic interaction checks and safer comparison logic.
3. OCR confidence scores, user correction, and PII controls.
4. AI evaluation, latency/cost telemetry, and model observability.
5. Docker, CI quality gates, and end-to-end browser tests.

## Contributing

Keep changes focused, add or update tests, run `npm run ci`, and document API changes. Use clear commits such as `feat(ocr): add field confidence scores` or `fix(auth): prevent guest session redirect`.

## License

MIT. See [LICENSE](LICENSE).
