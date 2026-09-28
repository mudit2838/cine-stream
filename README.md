# CineStream — Sprint 09, Track A

Next.js **15.5.26**, React 19, App Router and Tailwind CSS. Migrates the Sprint 08 Vite application while retaining its dark UI, debounced search, infinite scrolling, favorites and optional AI Mood Matcher.

## Run locally

```bash
npm ci
cp .env.example .env.local
# Configure TMDB_API_KEY or TMDB_ACCESS_TOKEN in .env.local.
npm run dev
```

Visit http://localhost:3000. `npm run build` and `npm start` run the production build.

The setup was initialized with `npx create-next-app@latest` (App Router, JavaScript, src directory). Its latest template targets a newer major, so the migrated project explicitly pins Next.js 15.5.26 to satisfy this sprint. Tailwind 3 is retained from Sprint 08 to preserve the UI.

## Architecture

| Area | Rendering / responsibility |
| --- | --- |
| `src/app/page.jsx` | Async Server Component; fetches initial popular movies directly from TMDB. No initial `useEffect` fetch. |
| `src/app/movie/[id]/page.jsx` | Dynamic SSR movie details; awaits route params; generates title, description, canonical and social metadata. |
| `src/lib/tmdb.js` | Server-only credentials and upstream access, timeout, error handling; React request cache deduplicates movie details/metadata fetches. |
| `MovieGrid` / `MovieCard` | Initial grid rendered through Server Components; small client children handle hearts and poster errors. Shared cards are also usable within client pagination. |
| `MoviePagination` | Client state and IntersectionObserver load later pages through `/api/movies`; manual retry button included. |
| `SearchBar` | Client input, 500 ms debounce and Next navigation; `/search` results fetched on the server. |
| `FavoritesProvider` / `HeartButton` | Client state; reads localStorage after mount and delays writes until loaded to preserve saved favorites. |
| `MoodMatcher` / `/api/mood` | Client form; optional Gemini request and subsequent TMDB lookup occur on the server. |

The layout remains a Server Component and passes server-rendered children through a client provider. `force-dynamic` and `cache: 'no-store'` make home and detail data request-time rendered. `htmlLimitedBots: /.*/` ensures dynamic metadata is in the head for all user agents, trading metadata streaming for predictable head inspection in the sprint demo.

## Environment variables

- `TMDB_API_KEY`: TMDB v3 API key, or `TMDB_ACCESS_TOKEN`: API Read Access Token.
- `GEMINI_API_KEY`: optional; needed for AI Mood Matcher only.
- `GEMINI_MODEL`: optional model ID; default `gemini-2.5-flash`.
- `SITE_URL`: canonical HTTPS deployment URL, e.g. `https://cine-stream-nu-three.vercel.app`.

Legacy `VITE_TMDB_KEY`, `VITE_GEMINI_API_KEY` and `VITE_AI_API_KEY` are accepted **server-side only** for compatibility with existing Vercel settings. Prefer the new names. Never prefix credentials with `NEXT_PUBLIC_`. Missing upstream credentials display an honest unavailable state; fixtures are never used in the application.

## Verification

```bash
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

E2E tests start the production server with a test-process-only upstream interceptor. They verify SSR HTML and metadata, 404s, search/pagination/navigation, favorites persistence, API validation, failure states and mobile overflow. They do **not** prove real TMDB/Gemini credentials work. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium binary.

## Vercel

The repository's `vercel.json` selects Next.js, `npm run build` and `.next`, replacing the former Vite SPA rewrite. Set environment variables for the deployment environment (Preview and/or Production). Check the deployed home page, a movie detail URL and Mood Matcher with real credentials before submitting.

## Submission

Track A — Frontend Architecture. Submit the GitHub repository/branch, verified Vercel URL and a recorded demo no longer than 3 minutes. See `docs/DEMO_SCRIPT.md` for the recording guide and `Prompts.md` for the actual assistance log. The student must record/explain the implementation and submit through their Sprint Portal.
