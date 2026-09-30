# MediSearch Documentation

This directory documents the current application that is shipped in the repository. Internal planning and day-by-day implementation notes are intentionally kept out of the public project documentation.

## Start here

1. [Architecture](ARCHITECTURE.md) — current frontend, backend, data, AI, cache, and request flows.
2. [AI system](AI_SYSTEM.md) — current provider behavior, prompts, caching, OCR, languages, and limitations.
3. [API reference](API.md) — available endpoints, authentication behavior, and request examples.
4. [Development guide](DEVELOPMENT.md) — local setup, environment variables, scripts, tests, and repository layout.
5. [Security and safety](SECURITY_AND_SAFETY.md) — implemented controls, medical boundaries, privacy, and deployment considerations.

## Documentation standards

- Document shipped behavior, not unimplemented roadmap features.
- Keep claims measurable and traceable to code, tests, or runtime behavior.
- Keep medical limitations and uncertainty explicit.
- Never commit API keys, credentials, patient information, prescription images, or raw sensitive prompts.
- Use relative links that work from the GitHub repository.
- Update the relevant document when an implementation behavior changes.
