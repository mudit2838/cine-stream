import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import SearchBar from './components/SearchBar';
import { Film, Search, Heart, Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Favorites = lazy(() => import('./pages/Favorites'));

const PageFallback = () => (
  <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    <span className="text-base font-medium">Loading...</span>
  </div>
);

export default function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              <NavLink
                to="/"
                aria-label="CineStream Home"
                className="flex items-center gap-2 text-xl font-bold text-red-500 hover:text-red-400 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded-md px-1"
              >
                <Film className="w-6 h-6" />
                <span className="hidden sm:inline">CineStream</span>
              </NavLink>

              <div className="flex-1 max-w-md mx-2">
                <SearchBar />
              </div>

              <nav className="flex items-center gap-1 sm:gap-4 shrink-0">
                <NavLink
                  to="/"
                  end
                  aria-label="Home"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <span>Home</span>
                </NavLink>

                <NavLink
                  to="/search"
                  aria-label="Search movies"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </NavLink>

                <NavLink
                  to="/favorites"
                  aria-label="Favorite movies"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </NavLink>
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

