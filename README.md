# MediSearch 💊

> An industry-ready, AI-powered medicine information and cross-comparison platform built on the TypeScript-MERN stack.

MediSearch securely connects users with critical pharmaceutical information. By utilizing generative AI alongside a robust two-tier caching system, it provides instant, accurate medicine details, generic alternatives, and intelligent drug comparisons in multiple languages.

---

## System Architechture 

<img width="2246" height="2116" alt="MediSearch System Architecture" src="https://github.com/user-attachments/assets/dabe4db9-1837-41dc-90dd-561be02e729f" />

--- 

## ✨ Features

- **AI-Powered Search:** Get comprehensive drug insights (uses, side effects, interactions) powered by LLM7 & Gemini.
- **Smart Comparison:** Cross-compare multiple medicines for safety and efficacy.
- **Two-Tier Caching:** L1 (In-memory) and L2 (MongoDB) caching for lightning-fast, cost-effective repeat queries.
- **Bilingual Support:** Full descriptive outputs in both English and Hindi.
- **Secure Authentication:** JWT-based user authentication with bcrypt password hashing.
- **User History:** Track and manage previous medication searches.

## 🛠 Tech Stack

**Client**
- React 18 (Vite)
- TypeScript
- Tailwind CSS
- React Router v6 & Axios

**Server**
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- Google GenAI SDK & LLM7

**Security & Ops**
- Helmet, Express Rate Limit, XSS-Clean, Mongo Sanitize
- Custom Error Handling Pipeline
- Winston & Morgan Logging

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or Atlas)
- Gemini API Key / LLM7 API Key

### Installation

1. **Clone & Install Dependencies**
   The project uses a monorepo-style package setup. Install all dependencies from the root:
   ```bash
   git clone https://github.com/your-username/medisearch.git
   cd medisearch
   npm run install:all
   ```

2. **Environment Configuration**
   Create a `.env` file in the `backend/` directory:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5174

   # Database
   MONGODB_URI=mongodb://127.0.0.1:27017/medisearch

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7

   # AI Providers
   GEMINI_API_KEY=your_gemini_key
   LLM7_API_KEY=your_llm7_key

   # Caching
   CACHE_TTL_SECONDS=3600
   ```

3. **Run the Application**
   Start the backend and frontend development servers.

   *Start Backend (Terminal 1):*
   ```bash
   npm run backend
   ```
   
   *Start Frontend (Terminal 2):*
   ```bash
   npm run frontend
   ```

The application will be available at `http://localhost:5174`.

## 📁 Architecture Overview

```text
medisearch/
├── backend/
│   ├── config/         # DB and Env validation
│   ├── controllers/    # Route logic implementations
│   ├── middleware/     # Auth, error handling, rate limiting
│   ├── models/         # Mongoose schemas (User, History, Cache)
│   ├── routes/         # Express API routing
│   ├── services/       # Core business logic (AI & Caching setup)
│   ├── tests/          # Jest unit/health tests
│   └── server.ts       # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI variants (Medicine, History, Layout)
│   │   ├── context/    # React context (Auth, Language)
│   │   ├── pages/      # Route pages (Home, Search, Compare, Auth)
│   │   ├── services/   # Axios API intercepts
│   │   └── main.tsx    # React DOM root
│   ├── tailwind.config.js
│   └── vite.config.js
└── package.json        # Root workspace scripts
```

---
*Built with 💙 using the T-MERN Stack.*
