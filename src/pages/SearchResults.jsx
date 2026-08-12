import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { searchMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { Loader2, Search, AlertCircle, RefreshCw } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setPage(1);
      setTotalPages(1);
      setLoading(false);
      setLoadingMore(false);
      setHasSearched(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function fetchResults() {
      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        const data = await searchMovies(query, 1, { signal: controller.signal });
        setMovies(data.results);
        setPage(1);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError' || err.name === 'AbortError') {
          return;
        }
        console.error('Failed to search movies:', err);
        setError(
          err?.response?.data?.status_message ||
            'Failed to perform search. Please check your network connection.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      controller.abort();
    };
  }, [query]);

  const fetchMoreResults = useCallback(async () => {
    if (loading || loadingMore || page >= totalPages || !query.trim()) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await searchMovies(query, nextPage);

      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNewMovies = data.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...uniqueNewMovies];
      });

      setPage(nextPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch more search results:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, page, totalPages, query]);

  const sentinelRef = useInfiniteScroll(fetchMoreResults, {
    hasMore: page < totalPages,
    isLoading: loading || loadingMore,
  });

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
            onClick={() => window.location.reload()}
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

      {!loading && !error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />

          {page < totalPages && (
            <div ref={sentinelRef} className="h-16 flex items-center justify-center py-4">
              {loadingMore && (
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  <span>Loading more results...</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
