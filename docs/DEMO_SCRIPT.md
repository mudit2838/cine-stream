# Sprint 09 demo guide — Track A (under 3 minutes)

Use the real deployed application with configured TMDB credentials. Do not present test fixtures as live data.

**0:00–0:20 — Introduction**
“Hi, I am Mudit Kumar. This is Sprint 09, Track A. I migrated my CineStream React/Vite SPA to Next.js 15 using the App Router.” Show the home page.

**0:20–0:55 — UI and retained behavior**
Search for a movie, open its details, save it with the heart button, open Favorites and reload to show persistence. Show mobile responsiveness briefly.

**0:55–1:35 — Server/client boundary**
Open `src/app/page.jsx`: point to the async component and awaited `getPopularMovies()`. Explain: “Initial movies are fetched on the server and rendered into HTML. I do not fetch the initial list in useEffect.” Open `MoviePagination.jsx`, `SearchBar.jsx` and `HeartButton.jsx`: “These use client components handle browser state, inputs and events. Later pages use a server route so credentials remain private.”

**1:35–2:15 — Dynamic route and SEO**
Open `/movie/<a-real-id>` and `src/app/movie/[id]/page.jsx`. Show `generateMetadata`, then DevTools Elements > head to show the movie-specific title and description. Explain the awaited params, server-only TMDB helper, and request-level deduplication.

**2:15–2:40 — Deployment and verification**
Show Vercel URL, GitHub changes and successful lint/build/test results. Explain that local automated tests use controlled upstream fixtures, while the demonstrated deployment uses TMDB.

**2:40–2:55 — Wrap up**
Show `Prompts.md` and state that Track A's mandatory, priority and advanced features have been implemented. Mention any actual outstanding deployment or credential issue honestly.

Record your own explanation. This file is a script, not a completed video or portal submission.
