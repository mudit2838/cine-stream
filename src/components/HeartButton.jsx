import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export default function HeartButton({ movie, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = movie && movie.id ? isFavorite(movie.id) : false;

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (movie && movie.id) {
      toggleFavorite(movie);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none ${
        isFav
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
          : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900/80'
      } ${className}`}
    >
      <Heart
        className={`w-5 h-5 transition-transform active:scale-125 ${
          isFav ? 'fill-red-500 text-red-500' : ''
        }`}
      />
    </button>
  );
}
