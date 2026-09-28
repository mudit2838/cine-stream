'use client';
import Link from 'next/link';
import { useFavorites } from '../context/FavoritesContext';
import MovieGrid from '../components/MovieGrid';
import { Heart, ArrowLeft } from 'lucide-react';

export default function Favorites() {
  const { favorites, ready } = useFavorites();

  if (!ready)
    return (
      <p role="status" className="py-12 text-slate-400">
        Loading your favorites...
      </p>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Favorite Movies
          </h1>
        </div>
        {favorites.length > 0 && (
          <span className="text-sm font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            {favorites.length} {favorites.length === 1 ? 'Movie' : 'Movies'}
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="py-20 text-center text-slate-400 space-y-4 max-w-md mx-auto">
          <Heart className="w-16 h-16 text-slate-700 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-200">
            No Favorites Saved Yet
          </h2>
          <p className="text-sm text-slate-400">
            You haven&apos;t favorited any movies yet — go find something to
            watch!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md mt-2 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Popular Movies</span>
          </Link>
        </div>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
}
