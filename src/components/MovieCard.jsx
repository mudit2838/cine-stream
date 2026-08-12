import { Star } from 'lucide-react';
import { POSTER_BASE_URL } from '../api/tmdb';

export default function MovieCard({ movie }) {
  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_title || 'Untitled';
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : movie.first_air_date
      ? movie.first_air_date.substring(0, 4)
      : 'N/A';

  const rating =
    typeof movie.vote_average === 'number' && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : 'N/A';

  const posterUrl = movie.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `${POSTER_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-slate-700 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-850 text-slate-500 text-center">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs mt-1">No Poster Available</span>
          </div>
        )}

        {rating !== 'N/A' && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded-md border border-slate-700/50 flex items-center gap-1 text-xs font-semibold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1">
        <h3 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-red-400 transition-colors" title={title}>
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-medium">{releaseYear}</p>
      </div>
    </div>
  );
}
