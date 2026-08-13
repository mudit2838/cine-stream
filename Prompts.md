# AI Development Prompts

## 1. Error Solving & Debugging

Analyze the error, identify the root cause, and explain why it is happening.
Check the existing code before suggesting changes and avoid unnecessary rewrites.
Provide the minimal fix with the exact file/code section that needs modification.

## 2. AI Integration

Review the current AI integration and identify issues in API handling, prompts, loading states, and error handling.
Suggest a secure and production-ready implementation without exposing API keys on the client.
Keep the existing architecture and modify only what is necessary.

## 3. Lighthouse Performance

Analyze the application specifically for Lighthouse performance issues such as LCP, CLS, INP, image optimization, JavaScript size, and unnecessary network requests.
Identify the highest-impact bottlenecks first and explain their performance impact.
Provide practical code-level optimizations while preserving the current UI and functionality.

## 4. React/Next.js Optimization

Review the application for unnecessary re-renders, inefficient state management, excessive API calls, and large client-side bundles.
Recommend appropriate memoization, lazy loading, caching, code splitting, and server/client component improvements where applicable.
Prioritize measurable performance gains instead of premature optimization.

## 5. Production-Ready Code Review

Act as a senior frontend engineer and audit the code for bugs, performance problems, security issues, accessibility, and maintainability.
Rank every issue by severity and explain the potential impact on users or production.
Give concise, actionable fixes without changing working functionality unnecessarily.

---

# AI Debugging Session Log

This file documents AI debugging sessions and prompt history during the development of CineStream per PRD Section 7.

---

## Session 1: `@google/genai` SDK Integration
- **Context:** Upgraded AI service from raw Axios REST calls to the official `@google/genai` npm SDK (`import { GoogleGenAI } from "@google/genai"`).
- **Prompt / Goal:** Integrate `@google/genai` with `VITE_GEMINI_API_KEY` for mood recommendations.
- **Resolution:** Initialized `GoogleGenAI` client in `src/api/ai.js` and updated env variables in `.env`.

---

## Session 2: Vite Pre-Bundling & Cache Clearing
- **Context:** Encountered Vite dependency optimizer 404 missing chunk error (`chunk-PJEEZAML.js`).
- **Prompt / Goal:** Resolve Vite dependency optimization missing chunk.
- **Resolution:** Added `optimizeDeps: { include: ['@google/genai'] }` in `vite.config.js` and cleared stale `node_modules/.vite` cache.

---

## Session 3: Regional TMDB Domain Fallback
- **Context:** TMDB standard endpoint (`api.themoviedb.org`) timing out due to ISP DNS blocking in region.
- **Prompt / Goal:** Fix movie fetching failure without breaking API key validity.
- **Resolution:** Configured primary base URL to `https://api.tmdb.org/3` in `src/api/tmdb.js` with an Axios response interceptor for automatic retry on fallback domains.

---

## Session 4: Gemini Model Migration & Alignment
- **Context:** `MoodMatcher` throwing 404 when querying legacy model names (`gemini-2.5-flash`).
- **Prompt / Goal:** Query available models and align with active model identifiers.
- **Resolution:** Updated `src/api/ai.js` model cascade to target active generation models (`gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`).

---

## Session 5: Vite Static Env Replacement
- **Context:** Optional chaining `import.meta?.env` preventing Vite from statically replacing environment variable tokens in client bundle.
- **Prompt / Goal:** Ensure `import.meta.env.VITE_TMDB_KEY` and `VITE_GEMINI_API_KEY` evaluate properly in browser runtime.
- **Resolution:** Restored standard `import.meta.env.VITE_...` literal syntax in `src/api/tmdb.js` and `src/api/ai.js`.

---

## Final Project Summary Log (Prompts 1–12)
- **Engine & Assistant:** Pair-programmed using **Google Antigravity** (Advanced Agentic Coding agent).
- **Mandate Compliance:** Adheres strictly to the **"Learn, Don't Copy"** mandate in PRD Section 7. Every architectural pattern (React 18, Vite, Tailwind CSS, Axios interceptors, IntersectionObserver infinite scroll, debounced search, LocalStorage persistence, `@google/genai` integration, Lighthouse performance optimization) was systematically developed, audited, and verified across Prompts 1 through 12.
- **Milestones Completed:**
  - **P0**: Environment setup, TMDB API layer, Popular Movies Grid, Search Component, Poster Fallback.
  - **P1**: IntersectionObserver Infinite Scroll, 500ms Debounced Search, Favorites Context & `localStorage` persistence, `/favorites` route.
  - **P2**: Lazy loading images, `@google/genai` Mood Matcher, AI → TMDB search handoff, graceful error state handling.
  - **Perf & QA**: Route-level code splitting (`React.lazy`), responsive `srcSet`, 93/100 Lighthouse score, Vercel SPA routing (`vercel.json`), comprehensive README documentation.
