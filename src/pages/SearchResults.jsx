import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import { Loader2, Search, AlertCircle, RefreshCw } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearchResults = useCallback(async () => {
    if (!query.trim()) {
      setMovies([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const data = await searchMovies(query, 1);
      setMovies(data.results);
    } catch (err) {
      console.error('Failed to search movies:', err);
      setError(
        err?.response?.data?.status_message ||
          'Failed to perform search. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Search className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          {query ? (
            <>
              Search Results for <span className="text-red-400">&quot;{query}&quot;</span>
            </>
          ) : (
            'Search Movies'
          )}
        </h1>
      </div>

      {!query && (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-lg font-medium">Search for movies by title</p>
          <p className="text-sm text-slate-500">
            Use the search bar in the top navigation to search the movie catalog.
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-base font-medium">Searching catalog...</span>
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
            <h2 className="text-lg font-semibold">Search Failed</h2>
          </div>
          <p className="text-sm text-slate-300">{error}</p>
          <button
            onClick={fetchSearchResults}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {!loading && !error && hasSearched && movies.length === 0 && (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <p className="text-lg font-medium">
            No movies found for &quot;{query}&quot;
          </p>
          <p className="text-sm text-slate-500">
            Try checking for spelling errors or searching for a different movie title.
          </p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}
    </div>
  );
}
