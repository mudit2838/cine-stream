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




## Sprint 09 — Track A migration (2026-09-28)

### Actual user input
1. User supplied the Sprint 09 two-track brief (Next.js 15/App Router/SSR/SEO for Track A; Express API for Track B).
2. User supplied `https://github.com/mudit2838/cine-stream`.
3. User requested: “sprint 9 complete kro”.

### Assistance performed
Codex inspected the existing repository and implemented the Next.js migration, preserving the original UI and features. Assistance includes server/client separation, dynamic movie routes and metadata, server-only TMDB/Gemini access, favorites hydration fixes, API validation, configuration, documentation and browser tests. This log records AI implementation assistance transparently; it does not claim the code was written unaided.

### Key decisions
- Proceed with Track A based on the CineStream repository and completion request; the user's actual Offer Letter was not inspected.
- Run create-next-app@latest, then explicitly target Next.js 15.5.26 for the sprint requirement.
- Fetch initial popular movies directly from an async Server Component; browser fetches are for subsequent interactions.
- Keep test fixtures confined to the test process. Never substitute them for real movie data in deployment.
- Preserve earlier Sprint 08 prompt log entries as historical records.
