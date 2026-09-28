'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
export default function SearchBar() {
  const params = useSearchParams();
  const urlQuery = params.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const timer = useRef(null);
  const router = useRouter();
  useEffect(() => {
    clearTimeout(timer.current);
    setQuery(urlQuery);
  }, [urlQuery]);
  useEffect(() => () => clearTimeout(timer.current), []);
  function navigate(value) {
    router.replace(
      value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : '/search'
    );
  }
  function change(value) {
    setQuery(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate(value), 500);
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        navigate(query);
      }}
      className="relative"
    >
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
      <input
        name="q"
        type="search"
        maxLength={200}
        value={query}
        onChange={(e) => change(e.target.value)}
        aria-label="Search movies by title"
        placeholder="Search movies..."
        className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            clearTimeout(timer.current);
            setQuery('');
            navigate('');
          }}
          className="absolute right-2 top-2.5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
