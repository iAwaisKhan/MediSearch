# MediSearch AI System

## Current provider behavior

Medicine search and comparison use a provider fallback sequence:

1. LLM7 is attempted when LLM7_API_KEY is configured.
2. Gemini is used when LLM7 is unavailable or fails.
3. Gemini mock mode is used when GEMINI_API_KEY is missing or contains mock.

Provider failures are logged and surfaced through the centralized API error flow when no usable fallback is available.

## Response format

The current prompts request JSON-shaped medicine objects and comparison arrays. Gemini requests JSON response MIME type. The backend parses the provider response, checks the expected high-level shape in controller logic, and stores an allowlisted subset in cache.

The current response fields include medicine name, generic name, category, purpose, dosage, usage instructions, suitability, side effects, precautions, interactions, storage, warnings, and generic-brand information.

## Caching

- Memory cache default lifetime: 5 minutes.
- MongoDB cache default lifetime: 24 hours, configurable with CACHE_TTL_SECONDS.
- Cache key format: normalized language plus normalized medicine name.
- Cached results are returned with their cache source so the frontend can distinguish fresh and cached responses.

## OCR

The OCR endpoint accepts one image with a 5 MB limit. The upload is kept in memory for the request and is restricted to image MIME types.

Gemini vision mode is used when a real Gemini key is configured. The model classifies the image as a prescription or medicine box and returns structured medicine fields. Mock mode returns synthetic data for local development.

The current OCR implementation does not yet provide field-level confidence, a correction workflow, persistent scan history, or a labeled extraction-quality benchmark.

## Language support

The API accepts English or Hindi through the lang query parameter. Medicine and brand names remain in English while descriptive fields are requested in the selected language.

## Current limitations

The current application is an AI-assisted information interface, not a clinically validated decision-support system.

- Responses are not grounded in a verified medical knowledge base.
- Responses do not currently include claim-level citations.
- Prices, manufacturers, and generic-brand fields should not be treated as authoritative without independent verification.
- The general LLM response is not a substitute for a deterministic interaction database.
- Mock mode proves UI and integration behavior but does not measure model quality.

All medical output must be confirmed with a qualified doctor or pharmacist.
