import MovieCard from './MovieCard';

export default function MovieGrid({ movies = [] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="text-lg font-medium">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id || movie.title}
          movie={movie}
          isPriority={index < 6}
        />
      ))}
    </div>
  );
}

