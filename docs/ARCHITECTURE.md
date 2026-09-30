# MediSearch Architecture

## Product scope

MediSearch is a full-stack medicine information application. It supports medicine search, side-by-side comparison, bilingual responses, prescription/package image OCR, authentication, search history, and response caching.

The product provides general educational information. It is not a diagnostic, prescribing, or emergency-care system.

## System overview

~~~text
React + TypeScript + Vite + Tailwind
                |
        Axios API client
                |
Express API + validation + security middleware
                |
  Controllers -> services -> Mongoose models
       |             |             |
       |             |             +-- MongoDB users, history, and cache
       |             +---------------- AI providers and cache service
       +------------------------------ Auth, medicine, OCR, history routes
~~~

## Frontend

The frontend is a React and TypeScript single-page application built with Vite and styled with Tailwind CSS.

Main areas:

- Pages for home, search, compare, history, login, registration, profile, and not-found states.
- Reusable medicine cards, compare cards, search controls, OCR upload, history list, and UI state components.
- AuthContext for session state and LangContext for English/Hindi preferences.
- Axios service with credentialed requests and centralized unauthorized handling.

## Backend

The backend is an Express and TypeScript API.

Middleware currently provides:

- Helmet security headers.
- CORS with an allowlist.
- JSON and URL-encoded body limits.
- Cookie parsing.
- MongoDB operator sanitization.
- Compression and request logging.
- Global, authentication, medicine, and OCR rate limits.
- Centralized validation and error handling.

Routes are grouped by capability:

- Auth: registration, login, logout, current user, profile, and password changes.
- Medicine: search and comparison.
- OCR: image upload and medicine/prescription extraction.
- History: authenticated search history, statistics, and deletion.

## Data layer

MongoDB stores users, search history, and cached medicine responses. Mongoose models define validation, indexes, timestamps, and cache expiration.

Medicine responses use two cache layers:

1. NodeCache memory cache for fast repeated requests.
2. MongoDB cache for persistence across backend process restarts.

Cached AI fields are allowlisted before persistence, and cache keys normalize medicine names and language.

## AI request flow

~~~text
User query
   -> request validation
   -> cache lookup
   -> LLM7 provider when configured
   -> Gemini fallback
   -> JSON parsing
   -> response allowlist and cache
   -> API response and optional history record
~~~

Gemini mock mode is available when GEMINI_API_KEY is missing or set to mock, allowing local UI and API development without paid model calls.

## Current boundaries

The current shipped application does not yet include a verified medical knowledge base, retrieval-augmented generation, source citations, deterministic interaction checking, field-level OCR confidence, or a production analytics dashboard. These are intentionally described as future engineering work rather than current capabilities.
