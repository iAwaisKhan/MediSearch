# MediSearch Development Guide

## Requirements

- Node.js 22 or later.
- npm 11 or compatible npm for the lockfile.
- MongoDB local instance or MongoDB Atlas connection.
- Gemini API key for live AI responses; mock mode is available for development.

## Local setup

From the repository root:

~~~powershell
npm ci
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
~~~

Set at least MONGODB_URI, JWT_SECRET, and CLIENT_URL in backend/.env. JWT_SECRET must be a long random value. Use GEMINI_API_KEY=mock for local mock mode.

Start the services in separate terminals:

~~~powershell
npm run backend
npm run frontend
~~~

Default addresses:

- Frontend: http://localhost:5173
- API health: http://localhost:5000/api/health

## Scripts

| Command | Purpose |
|---|---|
| npm run typecheck | TypeScript checks for all workspaces. |
| npm run lint | ESLint checks for all workspaces. |
| npm test | Backend Jest and frontend Vitest. |
| npm run build | Production builds for all workspaces. |
| npm run ci | Typecheck, lint, test, and build sequence. |
| npm run backend | Starts the backend development server. |
| npm run frontend | Starts the Vite development server. |

## Testing

Use mock AI mode for deterministic local tests. Do not place real API keys in test fixtures or commit environment files.

The repository currently contains backend endpoint tests, cache tests, health tests, and a frontend render test. Run the complete quality pipeline before opening a pull request.

## Repository layout

~~~text
backend/       Express API, models, services, routes, middleware, and tests
frontend/      React application, pages, components, contexts, and tests
docs/          Product, architecture, API, development, and safety documentation
.github/       Continuous integration workflow
~~~

## Contribution workflow

Keep changes focused, update tests with behavior changes, update the relevant documentation, run npm run ci, and use a clear commit message.

Do not commit backend/.env, frontend/.env, build output, node_modules, credentials, or private medical data.
