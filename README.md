# 🎬 CineStream — Media Discovery SPA

CineStream is a modern "Netflix-lite" media discovery single-page application (SPA) built with React 18, Vite, Tailwind CSS, and Google Gemini AI. Users can browse popular movies, perform debounced real-time searches, receive AI-powered mood-based movie recommendations, and manage a persistent favorites list across sessions.

---

## 🚀 Features

- **Popular Movies Grid**: Displays trending movies fetched dynamically from TMDB with title, release year, star rating, and poster fallbacks.
- **Infinite Scroll**: Powered by a native `IntersectionObserver` sentinel that loads page $N+1$ on demand without list overwrites or duplicate network requests.
- **Debounced Search**: 500ms debounced search input prevents API request spam while typing.
- **AI Mood Matcher**: Natural language input translates user mood (e.g. *"sad but want an inspiring action movie"*) into a recommended title using `@google/genai` SDK (`gemini-3.6-flash`), then automatically passes the result to TMDB.
- **Persistent Favorites**: Save/remove movies using the heart button action, backed by a custom `useLocalStorage` hook and React Context API.
- **High-Performance Asset Loading**: Responsive poster images (`w185`/`w342` `srcSet`), `width`/`height` dimensions for 0 Cumulative Layout Shift (CLS), route-level code splitting (`React.lazy` + `Suspense`), and a **93/100 Lighthouse Performance score**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 (Vite SPA) |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios (with regional domain fallback interceptor) |
| **AI Integration** | `@google/genai` SDK (`gemini-3.6-flash`) |
| **State & Storage** | React Context API + `localStorage` |
| **Icons** | `lucide-react` |

---

## 🔑 Required Environment Variables

Create a `.env` file in the root directory (or configure them in your deployment dashboard):

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
VITE_AI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 💻 Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file containing `VITE_TMDB_KEY` and `VITE_GEMINI_API_KEY`.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Test the Production Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Deployment Instructions

### Deploying to Vercel (Recommended)

1. Import your GitHub repository into the [Vercel Dashboard](https://vercel.com/new).
2. Set **Framework Preset** to **Vite**.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. In **Environment Variables**, add:
   - `VITE_TMDB_KEY` = `your_tmdb_api_key`
   - `VITE_AI_API_KEY` = `your_gemini_api_key`
   - `VITE_GEMINI_API_KEY` = `your_gemini_api_key`
6. Click **Deploy**. Vercel will automatically use `vercel.json` for SPA routing rewrites.
