import { useEffect, useState, useCallback } from 'react';
import { getPopularMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import { Loader2, AlertCircle, RefreshCw, Flame } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPopularMovies(1);
      setMovies(data.results);
    } catch (err) {
      console.error('Failed to fetch popular movies:', err);
      setError(
        err?.response?.data?.status_message ||
          'Failed to load popular movies. Please check your API key or network connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Flame className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Popular Movies
        </h1>
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-base font-medium">Loading popular movies...</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden animate-pulse flex flex-col aspect-[2/3]"
              >
                <div className="w-full h-full bg-slate-800/50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="my-8 p-6 bg-red-950/40 border border-red-800/50 rounded-xl text-center space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 text-red-400">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Unable to Load Movies</h2>
          </div>
          <p className="text-sm text-slate-300">{error}</p>
          <button
            onClick={fetchMovies}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {!loading && !error && <MovieGrid movies={movies} />}
    </div>
  );
}
