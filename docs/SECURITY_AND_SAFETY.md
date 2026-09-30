# MediSearch Security and Safety

## Implemented application controls

- Helmet security headers.
- CORS origin allowlist with credential support.
- HttpOnly JWT cookie sessions.
- Password hashing with bcrypt.
- Request validation with express-validator.
- MongoDB operator sanitization.
- Global and endpoint-specific rate limits.
- JSON, URL-encoded, and image upload size limits.
- Centralized error handling.
- Cache field allowlisting before MongoDB persistence.
- Guest and authenticated access boundaries.

## Medical safety boundary

MediSearch provides general educational information only. It must not be used to diagnose a condition, prescribe a medicine, replace a clinician, or make an emergency-care decision.

Users should confirm medicine names, dosage, interactions, pregnancy or allergy concerns, and treatment decisions with a qualified doctor or pharmacist.

Emergency symptoms such as breathing difficulty, severe allergic reaction, loss of consciousness, suspected overdose, or severe worsening symptoms require immediate professional or emergency assistance.

## Privacy expectations

- Do not commit real patient data or prescription images.
- Do not log raw prompts, patient names, or uploaded image contents.
- Use synthetic data for local testing and screenshots.
- Configure production cookies and CORS for the actual frontend/backend domains.
- Add CSRF protection before using cross-site cookie deployment in production.
- Define image retention and deletion behavior before storing OCR documents.
- Use a long random JWT secret and rotate it when required.

## Current limitations

The current version is not clinically validated and does not yet provide retrieval-backed citations, deterministic drug-interaction verification, OCR confidence scores, or formal medical-answer evaluation. These limitations must remain visible in product copy and deployment documentation.

## Deployment checklist

- Use NODE_ENV=production.
- Use secure cookies and the correct COOKIE_SAME_SITE setting.
- Set a strict CLIENT_URL allowlist.
- Keep API keys and database credentials in the deployment secret manager.
- Restrict MongoDB network access.
- Monitor rate-limit events and provider failures.
- Run npm run ci before release.
- Review npm audit findings before production deployment.
