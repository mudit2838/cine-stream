import { Suspense } from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import SearchBar from '@/components/SearchBar';
import Navigation from '@/components/Navigation';
import '../index.css';
export const metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')
  ),
  title: {
    default: 'CineStream — Discover Your Next Movie',
    template: '%s | CineStream',
  },
  description:
    'Discover popular movies, explore movie details, and save your favorites with CineStream.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <FavoritesProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:block focus:p-3"
          >
            Skip to content
          </a>
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
              <Link
                href="/"
                aria-label="CineStream Home"
                className="flex items-center gap-2 text-xl font-bold text-red-500 shrink-0"
              >
                <Film className="w-6 h-6" />
                <span className="hidden sm:inline">CineStream</span>
              </Link>
              <div className="flex-1 min-w-0 max-w-md">
                <Suspense
                  fallback={<div className="h-9 bg-slate-800 rounded-lg" />}
                >
                  <SearchBar />
                </Suspense>
              </div>
              <Navigation />
            </div>
          </header>
          <main
            id="main"
            className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 min-h-[80vh]"
          >
            {children}
          </main>
          <footer className="border-t border-slate-800 p-6 text-center text-xs text-slate-500">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </footer>
        </FavoritesProvider>
      </body>
    </html>
  );
}
