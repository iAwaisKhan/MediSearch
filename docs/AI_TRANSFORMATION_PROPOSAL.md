# MediSearch AI Transformation Proposal

**Objective:** Transform MediSearch into a trustworthy, measurable, production-oriented AI application that demonstrates the skills employers currently value in Applied AI, GenAI, AI Software Engineering, Full-Stack, and Backend roles.

**Working title:** MediSearch — Grounded Multimodal Medicine Intelligence Platform

**Current date:** September 2026

## 1. Executive proposal

MediSearch already has a strong product foundation: React, TypeScript, Express, MongoDB, Gemini/LLM7 integration, OCR, bilingual responses, authentication, history, rate limiting, and two-layer caching.

The next stage should not be a collection of disconnected AI features. It should turn the application into a demonstrable AI engineering system with:

1. Grounded medical answers with citations and freshness metadata.
2. Deterministic safety and interaction checks where factual correctness matters.
3. Multimodal OCR with confidence scores and user verification.
4. Structured outputs validated by shared schemas.
5. An evaluation harness that measures quality, safety, latency, and cost.
6. Production reliability: retries, fallbacks, observability, rate limits, CI/CD, and secure deployment.
7. A polished user experience with accessibility, privacy, and clear medical disclaimers.

This positioning is more valuable than describing the product as a simple chatbot wrapper. It gives the project credible evidence of context engineering, RAG, multimodal AI, evaluation, backend architecture, security, and product delivery.

## 2. Target roles and positioning

### Primary target roles

- Applied AI Engineer
- GenAI / LLM Engineer
- AI Software Engineer
- Full-Stack Engineer with AI experience
- Backend Engineer working on AI products

### Secondary target role

- ML Engineer, after adding a Python-based evaluation/data pipeline and stronger model-quality experimentation

The project should not be positioned as ML research or model training. Its strongest story is building reliable AI systems around foundation models.

Current market signals support this direction: AI and machine learning specialist roles are among the fastest-growing job categories, while AI and big-data skills, networks, and cybersecurity remain high-priority skill areas in the World Economic Forum’s 2025 outlook. GitHub’s 2025 Octoverse also reports TypeScript and Python as leading languages in the AI development ecosystem. [World Economic Forum](https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/2-jobs-outlook/) [GitHub Octoverse](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)

## 3. Product vision

MediSearch should answer one clear user question:

> “Help me understand this medicine using verified information, explain it in my language, and clearly tell me when I need a doctor or pharmacist.”

The product should be an AI-assisted information and triage experience, not an autonomous prescriber. Every response should visibly distinguish:

- Verified facts from generated explanations.
- General education from patient-specific medical advice.
- Current price data from unavailable or unverified price data.
- High-confidence extraction from uncertain OCR fields.

## 4. Target architecture

```text
User request
    |
Input validation + abuse/prompt-injection checks
    |
Intent router
    |-- medicine lookup
    |-- interaction check
    |-- comparison
    |-- OCR / prescription extraction
    |-- follow-up question
    |
Retrieval layer
    |-- verified medicine facts
    |-- interaction dataset
    |-- approved price/brand records
    |
AI orchestration layer
    |-- structured prompt/context
    |-- primary model
    |-- fallback model
    |-- timeout/retry/circuit breaker
    |
Schema validation + safety policy + citation attachment
    |
Cache + telemetry + user response
```

Suggested stack additions:

- Zod for runtime validation and shared response contracts.
- PostgreSQL or MongoDB collections for verified facts and source metadata.
- Vector search using MongoDB Atlas Vector Search, pgvector, or another managed vector store.
- Python evaluation scripts or a small Python/FastAPI evaluation service.
- OpenTelemetry-compatible traces or an LLM observability tool.
- Docker and GitHub Actions for reproducible builds and checks.
- Playwright for browser-level smoke tests.

Use LangChain or LangGraph only where they solve a real orchestration problem. The project should demonstrate architecture and evaluation, not framework collection.

## 5. Priority workstreams

### Workstream A — Trust, safety, and factual grounding

**Priority: P0. Highest impact.**

1. Remove the heuristic “Safety Score.” It is based on the number of warnings and side effects rather than clinical evidence.
2. Replace model-generated generic prices, manufacturers, and savings with verified records or clearly label them as unavailable.
3. Build a source-backed medicine knowledge layer with:
   - generic name
   - drug class
   - approved uses
   - contraindications
   - interactions
   - source URL
   - source publisher
   - last verified date
4. Add retrieval-augmented generation so the model can only summarize retrieved facts.
5. Return citations with claims and display a “Sources and freshness” section.
6. Add refusal rules for diagnosis, personalized dosing, emergency symptoms, and medication changes.
7. Add a prominent emergency disclaimer for overdose, allergy, breathing difficulty, and severe reactions.

**Deliverable:** A user can inspect where an answer came from, when it was verified, and which parts are educational explanations.

### Workstream B — AI orchestration and structured outputs

**Priority: P0.**

1. Create shared Zod schemas for medicine, comparison, OCR, interaction, citation, and error responses.
2. Validate every provider response before returning or caching it.
3. Enforce exact array lengths and medicine identity in compare responses.
4. Add prompt versions, model names, provider names, and response metadata.
5. Add timeouts, bounded retries, exponential backoff, and a circuit breaker.
6. Prevent cache poisoning by allowlisting fields before writing AI output to MongoDB.
7. Add request deduplication so concurrent requests for the same medicine do not trigger duplicate model calls.
8. Replace natural-language follow-up queries with structured intents such as `pregnancy_safety`, `child_use`, `overdose_warning`, and `alternatives`.

**Deliverable:** AI output is predictable, inspectable, versioned, and safe to cache.

### Workstream C — Multimodal OCR that users can trust

**Priority: P0.**

1. Keep medicine-box and prescription extraction as separate schemas.
2. Return field-level confidence scores and uncertainty reasons.
3. Add a review screen where users can correct medicine names, dosage, frequency, and duration before lookup.
4. Redact patient name and other unnecessary PII before sending images to an external provider, or obtain explicit consent.
5. Add an image privacy statement and retention policy.
6. Store OCR scans only when the user chooses to save them.
7. Build a labeled test set of at least 50 representative images.
8. Measure medicine-name exact match and field-level extraction accuracy.

**Deliverable:** OCR becomes a measurable multimodal pipeline rather than an opaque image-to-text demo.

### Workstream D — Deterministic interaction and comparison engine

**Priority: P1.**

1. Add a dedicated interaction endpoint instead of asking the general search endpoint to interpret questions.
2. Use a verified interaction dataset for the decision.
3. Use the LLM only to explain the structured result in plain language and Hindi.
4. Add explicit comparison fields:
   - therapeutic class
   - intended use
   - key differences
   - important contraindications
   - interaction risk
   - whether they are interchangeable
   - when professional advice is required
5. Display “insufficient evidence” instead of guessing.

**Deliverable:** Comparison answers provide real decision support context without pretending that the model is a clinician.

### Workstream E — Evaluation, observability, and measurable quality

**Priority: P0. Major resume differentiator.**

Create an evaluation dataset with golden expected outputs and measure:

- Schema-valid response rate.
- Medicine-identity accuracy.
- Citation coverage.
- Unsupported-claim rate.
- Interaction precision and recall.
- OCR medicine-name exact-match rate.
- Hindi content completeness and language quality.
- P50/P95 latency by cache source and provider.
- Cache-hit ratio.
- Fallback rate.
- Estimated cost per uncached request.
- Error rate by endpoint.

Add dashboards or a documented metrics page. Every model request should include:

```json
{
  "requestId": "...",
  "provider": "gemini",
  "model": "...",
  "promptVersion": "medicine-v3",
  "cacheSource": "mongodb",
  "latencyMs": 412,
  "validationPassed": true,
  "citationCount": 3
}
```

**Deliverable:** The project can prove quality and performance with numbers instead of adjectives.

### Workstream F — Security, privacy, and production readiness

**Priority: P0/P1.**

1. Fix guest authentication flow so a logged-out visitor is not redirected to login by `/auth/me`.
2. Correct cross-site cookie configuration for the Vercel/Railway deployment model.
3. Do not return the JWT in JSON when using an HttpOnly cookie.
4. Add CSRF protection if cookies are configured for cross-site requests.
5. Add prompt-injection and jailbreak tests for medicine names, follow-up intents, OCR text, and retrieved documents.
6. Redact emails, patient names, images, prompts, and sensitive model content from logs.
7. Validate actual image content, not only the MIME type.
8. Upgrade vulnerable dependencies and run `npm audit` in CI.
9. Add readiness health checks that verify MongoDB and AI-provider availability separately from liveness.

**Deliverable:** The project demonstrates security ownership appropriate for an application handling health-related information.

### Workstream G — Engineering quality and user experience

**Priority: P1.**

1. Add Jest TypeScript configuration and meaningful backend tests.
2. Add frontend API-mocking tests for loading, error, cache, auth, OCR, and follow-up flows.
3. Add Playwright smoke tests for guest search, login, compare, OCR review, and history.
4. Enable strict TypeScript mode gradually and remove avoidable `any` usage.
5. Fix bilingual coverage for hardcoded English UI text.
6. Improve keyboard access, focus states, contrast, semantic buttons, and screen-reader labels.
7. Add retry, cancel, and offline states for AI requests.
8. Add saved medicines, shareable result links, printable summaries, and user feedback controls.

**Deliverable:** A recruiter can run the project, see a polished workflow, and verify that it is tested.

## 6. Recommended implementation sequence

### Phase 0 — Stabilize the current product

**Duration:** 2–3 days

- Fix guest redirect.
- Fix cross-site authentication cookies.
- Fix follow-up intent handling.
- Remove the safety score.
- Fix price formatting.
- Update README claims and environment variables.
- Add a working Jest configuration.
- Upgrade dependencies with high-severity advisories.

### Phase 1 — Make AI outputs reliable

**Duration:** 1 week

- Add Zod schemas.
- Add response allowlists.
- Add prompt versions.
- Add provider/model metadata.
- Add retries, timeout handling, and request deduplication.
- Add negative tests for malformed, unsafe, and irrelevant model responses.

### Phase 2 — Add grounded RAG and citations

**Duration:** 1–2 weeks

- Create source ingestion and normalization pipeline.
- Store chunks and metadata.
- Add embeddings and vector retrieval.
- Add source-aware prompts.
- Add citations and freshness display.
- Create a small verified medicine benchmark.

### Phase 3 — Build the evaluation and observability layer

**Duration:** 1 week

- Add the golden dataset.
- Build repeatable evaluation scripts.
- Track quality, latency, cache, cost, and fallback metrics.
- Add a metrics dashboard or static report generated from CI.

### Phase 4 — Upgrade OCR and interaction intelligence

**Duration:** 1–2 weeks

- Add confidence and review UI.
- Add privacy controls.
- Add deterministic interaction checks.
- Add structured comparison insights.
- Add Hindi evaluation cases.

### Phase 5 — Production and portfolio packaging

**Duration:** 3–5 days

- Dockerize the app.
- Add GitHub Actions for install, typecheck, lint, tests, build, and audit.
- Add Playwright smoke test.
- Add live demo and seeded demo mode.
- Record a 60–90 second walkthrough.
- Add architecture, evaluation, security, and tradeoff documentation.

## 7. Success criteria

The transformation is complete when:

- 95%+ of evaluation responses pass the output schema.
- 100% of displayed factual claims have a source or are explicitly marked as generated explanation.
- No unverified medicine price is presented as a fact.
- OCR reports confidence and supports user correction.
- Guest search works without login.
- Authenticated flows work on the actual deployed frontend/backend domains.
- Backend and frontend tests pass in CI.
- The project has measured P95 latency, cache-hit rate, fallback rate, and AI cost.
- The README contains no placeholder links or unsupported claims.
- A recruiter can open the demo, inspect the architecture, and reproduce the evaluation.

## 8. Resume evidence to collect

Do not write “production-grade,” “clinical-grade,” or “highly accurate” without proof. Collect these numbers during implementation:

- Number of medicine records and sources.
- Number of evaluation cases.
- Schema-valid response percentage.
- OCR exact-match and field-level accuracy.
- P95 cached and uncached latency.
- Cache-hit percentage.
- AI fallback percentage.
- Cost reduction from caching.
- Test count and coverage.
- Deployment uptime, if the application has real users.

### Target resume bullets after completion

- Built a grounded multimodal medicine intelligence platform using React, TypeScript, Node.js, MongoDB, Gemini, vector retrieval, and structured LLM workflows.
- Designed a citation-aware RAG pipeline that restricted generated explanations to retrieved medicine facts and exposed source freshness to users.
- Developed an evaluation harness over `[N]` labeled medicine and OCR cases, achieving `[X]%` schema validity and `[Y]%` medicine-name extraction accuracy.
- Reduced uncached model traffic by `[X]%` and improved repeat-query P95 latency to `[Y]` ms using request deduplication and two-layer caching.
- Implemented provider fallback, retries, timeouts, prompt-version tracking, and AI observability across model, latency, validation, and cost dimensions.
- Built a confidence-aware prescription OCR review flow with user correction, PII controls, and deterministic interaction checks.

## 9. Final recommendation

The highest-return strategy is to build depth, not breadth. One grounded, evaluated, privacy-aware medicine AI product will create a stronger hiring signal than adding several superficial agents or extra model providers.

The final story should be:

> “I built and measured a reliable multimodal AI system for a sensitive domain. I handled retrieval, structured generation, evaluation, safety, privacy, performance, and deployment.”

That story is relevant to current Applied AI and AI Software Engineering roles and gives recruiters concrete evidence to discuss in an interview.
