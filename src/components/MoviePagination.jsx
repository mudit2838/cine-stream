'use client';
import { useState, useRef, useCallback } from 'react';
import MovieGrid from './MovieGrid';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
export default function MoviePagination({
  totalPages,
  query = '',
  initialIds = [],
}) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const seenIds = useRef(new Set(initialIds));
  const load = useCallback(async () => {
    if (busy.current || page >= totalPages) return;
    busy.current = true;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        ...(query ? { q: query } : {}),
      });
      const response = await fetch(`/api/movies?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMovies((prev) => {
        const ids = new Set([...seenIds.current, ...prev.map((m) => m.id)]);
        return [...prev, ...data.results.filter((m) => !ids.has(m.id))];
      });
      setPage(data.page);
    } catch {
      setError('Unable to load more movies. Please retry.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, [page, totalPages, query]);
  const sentinel = useInfiniteScroll(load, {
    hasMore: page < totalPages && !error,
    isLoading: loading,
  });
  return (
    <div className="space-y-6">
      {movies.length > 0 && <MovieGrid movies={movies} />}
      {page < totalPages && (
        <div ref={sentinel} className="text-center py-6 space-y-3">
          {error && (
            <p role="alert" className="text-red-400">
              {error}
            </p>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-5 py-2 rounded-lg"
          >
            {loading
              ? 'Loading...'
              : error
                ? 'Retry loading movies'
                : 'Load more movies'}
          </button>
        </div>
      )}
    </div>
  );
}
