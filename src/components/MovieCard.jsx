import Link from 'next/link';
import { Star } from 'lucide-react';
import HeartButton from './HeartButton';
import MoviePoster from './MoviePoster';
export default function MovieCard({ movie, isPriority = false }) {
  if (!movie) return null;
  const title = movie.title || movie.name || 'Untitled';
  return (
    <article className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:border-slate-600 transition-colors flex flex-col h-full">
      <div className="relative aspect-[2/3] bg-slate-950">
        <Link
          href={`/movie/${movie.id}`}
          aria-label={`View ${title}`}
          className="block absolute inset-0"
        >
          <MoviePoster
            path={movie.poster_path}
            title={title}
            priority={isPriority}
          />
        </Link>
        <div className="absolute top-2 left-2 z-10">
          <HeartButton movie={movie} />
        </div>
        {movie.vote_average > 0 && (
          <span className="absolute top-2 right-2 pointer-events-none flex items-center gap-1 bg-slate-950/90 px-2 py-1 rounded text-xs text-amber-400">
            <Star className="w-3 h-3" />
            {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm line-clamp-1">
          <Link href={`/movie/${movie.id}`} className="hover:text-red-400">
            {title}
          </Link>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {movie.release_date?.slice(0, 4) || 'Release date unknown'}
        </p>
      </div>
    </article>
  );
}
