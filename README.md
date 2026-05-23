<div align="center">

# 💊 MediSearch

### AI-Powered Medicine Information & Comparison Platform

[![Node.js](https://img.shields.io/badge/Node.js-≥18.0-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Deployed on Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**MediSearch** is a full-stack, production-grade web application that delivers instant, AI-powered medicine information and side-by-side drug comparisons — with bilingual support (English & Hindi), intelligent two-layer caching, and a dual-provider AI architecture for maximum reliability.

</div>

## Business Problem

Healthcare consumers in India — particularly in Tier 2 and Tier 3 cities — face significant friction when trying to understand prescription medicines: dosage instructions are on physical inserts, generic alternatives require a pharmacist, and drug interaction data requires specialist knowledge. Language is a compounding barrier for non-English speakers.

**MediSearch** eliminates this friction by providing:

- **Instant clinical summaries** for any medicine, synthesised by a senior-pharmacist-level AI prompt
- **Affordable generic alternatives** with real INR pricing and manufacturer names
- **Side-by-side drug comparison** in a single API call
- **Hindi-language responses** in Devanagari script for non-English users
- **Persistent search history** for authenticated users, enabling longitudinal health tracking

The platform is architected for scale: a two-layer caching strategy dramatically reduces AI API costs and response latency on repeated queries, making the product commercially viable as usage grows.

---

## Key Features

| Feature | Description |
|---|---|
| **AI Medicine Search** | Structured clinical data: purpose, dosage, side effects, interactions, storage, warnings |
| **Drug Comparison** | Side-by-side analysis of two medicines in a single optimised AI call |
| **Generic Alternatives** | 3 real Indian generic brands with INR pricing, manufacturer, and savings % |
| **Bilingual Support** | Full English and Hindi (Devanagari) responses via `?lang=hi` |
| **Two-Layer Cache** | L1 in-memory (5 min) + L2 MongoDB (24h) — cache-first for all lookups |
| **Search History** | Per-user query log with response time, cache status, and result tracking |
| **JWT Authentication** | Stateless auth with password-change token invalidation and role-based access |
| **Guest Mode** | Medicine search and compare work without an account; history requires login |
| **Rate Limiting** | Layered limiters: 200/15 min global, 20/15 min auth, 15/min AI endpoints |
| **AI Fallback** | LLM7 primary → Gemini 2.5 Flash fallback; automatic, transparent to the user |
| **Health Endpoint** | `/api/health` with uptime, env, and timestamp — Railway healthcheck target |
| **Mock Mode** | Full dev experience without API keys; auto-activates when key is absent |

---

## System Architecture

<img width="2246" height="2116" alt="MediSearch System Architecture" src="https://github.com/user-attachments/assets/e01e97a6-905c-4615-96cb-616ecda2bc25" />


### Cache Strategy

Every medicine lookup follows this resolution order:

```
Request → L1 (node-cache, 5 min) → L2 (MongoDB, 24h) → AI API → store both layers
```

For the **compare** endpoint, each drug is checked independently against the cache. If both are cached, zero AI calls are made. If one is missing, a single compare prompt fetches both and caches each individually — an efficient single-call strategy over two separate lookups.

---

## Technology Stack

### Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js ≥ 18 | LTS, native `fetch`, ESM support |
| Framework | Express 4.18 | HTTP routing, middleware pipeline |
| Language | TypeScript 5.4 | Type safety, compiled to `dist/` |
| Database | MongoDB Atlas + Mongoose 8 | Document store, schema validation, TTL indexes |
| Auth | jsonwebtoken + bcryptjs | Stateless JWT, bcrypt cost factor 12 |
| AI Primary | LLM7 (`api.llm7.io`) | Free-tier LLM, first in fallback chain |
| AI Fallback | Google Gemini 2.5 Flash | `@google/genai` SDK, JSON MIME mode |
| Cache L1 | node-cache | In-memory, 5 min TTL, zero latency |
| Cache L2 | MedicineCache (Mongoose) | Persistent, 24h TTL via MongoDB `expireAfterSeconds` |
| Validation | express-validator | Query and body schema enforcement |
| Security | Helmet, express-mongo-sanitize | HTTP headers, NoSQL injection prevention |
| Logging | Winston + Morgan | Structured logs, HTTP access log stream |
| Rate Limiting | express-rate-limit | Three independent limiters |
| Deployment | Railway (Nixpacks) | Auto-build, health check, restart policy |

### Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18.2 | Component tree, concurrent rendering |
| Bundler | Vite 8 | Sub-second HMR, optimised production build |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS 3.4 | Utility-first, no runtime CSS |
| Routing | React Router 6 | Client-side routing, protected routes |
| HTTP | Axios 1.6 | Interceptors for auth token injection |
| State | React Context | AuthContext + LangContext |
| Notifications | react-hot-toast | Non-blocking UX feedback |
| Deployment | Vercel | Edge CDN, preview deployments per PR |

---

## Performance Metrics

| Metric | Value |
|---|---|
| Cache hit response time | < 20 ms (L1) / < 80 ms (L2) |
| AI call response time | 1.5 – 4 s (LLM7) / 2 – 6 s (Gemini) |
| Cache TTL — memory | 5 minutes |
| Cache TTL — MongoDB | 24 hours |
| AI cost on cache hit | $0 |
| Global rate limit | 200 req / 15 min |
| AI endpoint rate limit | 15 req / min |
| Auth rate limit | 20 req / 15 min |
| Payload size limit | 10 KB (body parser) |
| bcrypt cost factor | 12 |
| JWT expiry | 7 days |
| Health check timeout | 30 s (Railway) |

---

## Installation & Setup

### Prerequisites

- Node.js ≥ 18.0
- MongoDB Atlas cluster (free tier works)
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MediSearch.git
cd MediSearch
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/medisearch
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

> **Note:** Leave `GEMINI_API_KEY` blank or set it to `mock` to run in mock mode — the API returns realistic stub data with no external calls.

```bash
npm run dev        # ts-node-dev with hot reload
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev        # Vite dev server on :5173
```

### 4. Run tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### 5. Production build

```bash
# Backend
cd backend && npm run build     # tsc → dist/
npm start                       # node dist/server.js

# Frontend
cd frontend && npm run build    # Vite → dist/
npm run preview
```

### Docker (optional)

```bash
# Coming in v1.1 — see Future Enhancements
```

---

## Project Structure

```
MediSearch/
├── backend/
│   ├── config/
│   │   ├── db.ts                  # MongoDB connection with retry logic
│   │   └── envValidator.ts        # Startup env validation (fail-fast)
│   ├── controllers/
│   │   ├── authController.ts      # register, login, logout, getMe, updateProfile
│   │   ├── medicineController.ts  # searchMedicine, compareMedicines
│   │   └── historyController.ts   # getHistory, clearHistory
│   ├── middleware/
│   │   ├── authMiddleware.ts      # protect, optionalAuth, restrictTo
│   │   ├── errorHandler.ts        # Centralised error → JSON response
│   │   └── validators.ts          # express-validator rule sets
│   ├── models/
│   │   ├── User.ts                # Schema, bcrypt hook, JWT methods
│   │   ├── SearchHistory.ts       # Per-user query log, compound index
│   │   └── MedicineCache.ts       # AI response store, TTL index, hitCount
│   ├── services/
│   │   ├── aiService.ts           # LLM7 → Gemini fallback, prompt builders
│   │   └── cacheService.ts        # L1/L2 get/set, cache key normalisation
│   ├── utils/
│   │   ├── AppError.ts            # Typed operational error class
│   │   ├── catchAsync.ts          # Async error wrapper for controllers
│   │   └── logger.ts              # Winston logger (info/warn/error/debug)
│   ├── tests/
│   │   └── health.test.ts         # Jest + Supertest health endpoint
│   ├── server.ts                  # App entry, middleware stack, routes, shutdown
│   ├── railway.toml               # Railway deploy config, healthcheck
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── medicine/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── MedicineCard.tsx
│   │   │   │   └── CompareCard.tsx
│   │   │   ├── history/
│   │   │   │   └── HistoryList.tsx
│   │   │   └── ui/
│   │   │       ├── Spinner.tsx
│   │   │       ├── ProtectedRoute.tsx
│   │   │       ├── PageHeader.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       └── ErrorBox.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # JWT session, login/logout, token validation
│   │   │   └── LangContext.tsx    # en/hi toggle, persisted preference
│   │   ├── hooks/
│   │   │   └── useMedicine.ts     # Search + compare data fetching logic
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Compare.tsx
│   │   │   ├── History.tsx        # Protected
│   │   │   ├── Profile.tsx        # Protected
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   └── api.ts             # Axios instance, auth/medicine/history APIs
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vercel.json
│   ├── tailwind.config.js
│   └── vite.config.js
```

---

## API Reference

### Base URL

| Environment | URL |
|---|---|
| Development | `http://localhost:5000` |
| Production | `https://your-app.railway.app` |

All responses follow the envelope:

```json
{ "status": "success" | "fail" | "error", "data": {}, "message": "..." }
```

---

### Authentication

#### `POST /api/auth/register`

```json
// Request
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "SecurePass1"
}

// Response 201
{
  "status": "success",
  "token": "<jwt>",
  "data": { "user": { "_id": "...", "name": "Priya Sharma", "email": "...", "role": "user" } }
}
```

Password rules: ≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit.

#### `POST /api/auth/login`

```json
// Request
{ "email": "priya@example.com", "password": "SecurePass1" }

// Response 200
{ "status": "success", "token": "<jwt>", "data": { "user": { ... } } }
```

#### `GET /api/auth/me` _(protected)_

Returns current user profile.

#### `PATCH /api/auth/update-profile` _(protected)_

Update `name`, `preferredLang` (`en` | `hi`).

#### `POST /api/auth/logout` _(protected)_

Clears server-side session markers.

---

### Medicine

> Medicine endpoints use `optionalAuth` — guests receive full results; authenticated users also get history logging.

#### `GET /api/medicine/search`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Medicine name (max 120 chars) |
| `lang` | `en` \| `hi` | No | Response language (default: `en`) |

```bash
GET /api/medicine/search?name=Paracetamol&lang=hi
Authorization: Bearer <jwt>   # optional
```

```json
// Response 200
{
  "status": "success",
  "cached": true,
  "cacheSource": "memory",
  "data": {
    "name": "Paracetamol",
    "genericName": "Acetaminophen",
    "category": "Analgesic / Antipyretic",
    "emoji": "🌡️",
    "purpose": "...",
    "howToTake": ["..."],
    "dosage": "500–1000 mg every 4–6 hours",
    "suitableFor": ["Adults", "Children ≥ 2 years", "Pregnant women (with caution)"],
    "notSuitableFor": ["Severe hepatic impairment", "..."],
    "sideEffects": ["..."],
    "precautions": ["..."],
    "interactions": ["..."],
    "storage": "...",
    "warning": "...",
    "generics": [
      { "name": "Crocin", "price": "₹22 / 15 tabs", "manufacturer": "GSK", "savings": 40 }
    ]
  }
}
```

#### `GET /api/medicine/compare`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `a` | string | Yes | First medicine name |
| `b` | string | Yes | Second medicine name |
| `lang` | `en` \| `hi` | No | Response language |

```bash
GET /api/medicine/compare?a=Ibuprofen&b=Paracetamol&lang=en
```

Returns an array of two medicine objects with the same schema as `/search`. If both are cached, zero AI calls are made.

---

### History _(protected)_

#### `GET /api/history`

Returns paginated search history for the authenticated user, sorted newest first.

#### `DELETE /api/history`

Clears all history for the authenticated user.

---

### Health

#### `GET /api/health`

```json
{
  "status": "ok",
  "env": "production",
  "uptime": 3620,
  "ts": "2025-05-23T10:00:00.000Z"
}
```

Used as the Railway healthcheck target (`healthcheckPath = "/api/health"`).

---

## Security Model

| Control | Implementation |
|---|---|
| HTTP security headers | `helmet()` — CSP, HSTS, X-Frame-Options, etc. |
| NoSQL injection | `express-mongo-sanitize` strips `$` and `.` from user input |
| Input validation | `express-validator` on all request parameters |
| Password hashing | bcrypt, cost factor 12 |
| JWT integrity | Signed with `JWT_SECRET`; invalidated on password change via `passwordChangedAt` |
| Rate limiting | Three independent `express-rate-limit` instances |
| Body size limit | 10 KB (prevents large payload attacks) |
| CORS | Allowlist-only; rejects unknown origins |
| Account status | `isActive` flag — deactivated accounts rejected at middleware |

> **Known limitation:** JWT is stored in `localStorage` on the frontend, which is susceptible to XSS. A future version will migrate to `HttpOnly` cookies. See [Future Enhancements](#future-enhancements).

---

## Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | Yes | `development` \| `production` \| `test` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | ≥ 32 char random string |
| `JWT_EXPIRE` | No | JWT expiry (default: `7d`) |
| `GEMINI_API_KEY` | No | Google Gemini key; omit for mock mode |
| `CLIENT_URL` | Yes | Frontend origin for CORS |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL |

---

## Future Enhancements

| Priority | Enhancement | Notes |
|---|---|---|
| 🔴 High | Migrate JWT to `HttpOnly` cookies | Eliminates XSS token theft risk |
| 🔴 High | Input sanitisation before AI prompt injection | Prevent prompt injection attacks |
| 🔴 High | Docker Compose for local dev | One-command full-stack setup |
| 🟡 Medium | Admin dashboard | Cache hit analytics, user stats, endpoint monitoring |
| 🟡 Medium | Refresh token rotation | Silent re-auth without full login |
| 🟡 Medium | Expanded test coverage | Controller, AI service, and cache unit/integration tests |
| 🟡 Medium | LLM7 TLS certificate fix | Remove `rejectUnauthorized: false` when cert is resolved |
| 🟢 Low | PWA / offline support | Cache last search results in Service Worker |
| 🟢 Low | More languages | Tamil, Telugu, Bengali |
| 🟢 Low | Drug interaction checker | Cross-reference two medicines for interactions |
| 🟢 Low | Prescription image upload | OCR + AI to parse and search multiple drugs at once |

---

## Contributing Guidelines

Contributions are welcome. Please follow these steps:

### 1. Fork and branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Commit conventions

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat(medicine): add drug interaction cross-reference endpoint
fix(cache): correct TTL key normalisation for Hindi queries
docs(readme): update API reference for compare endpoint
chore(deps): bump express to 4.19.2
```

### 3. Code standards

- TypeScript strict mode; no `any` without justification
- All new endpoints require `express-validator` rules
- All new async controller functions wrapped in `catchAsync`
- New routes documented in this README under [API Reference](#api-reference)

### 4. Pull request

- Target the `main` branch
- Describe the business problem solved, not just the technical change
- Include before/after response examples for API changes
- Ensure existing tests pass: `npm test`

### 5. Issues

Use the issue tracker for bugs and feature requests. Include: environment, steps to reproduce, expected vs actual behaviour.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Contact

**Maintainer:** Awais Khan 

**Email:** workmail.awaisk@gmail.com

**LinkedIn:** [linkedin.com/in/your-profile](https://linkedin.com/in/awaisxdevs)

**GitHub:** [github.com/your-username](https://github.com/iAwaisKhan)

---

<div align="center">

Built with TypeScript, React, and the belief that medicine information should be accessible to everyone.

⭐ Star this repo if it helped you — it keeps the project visible and maintained.

</div>
