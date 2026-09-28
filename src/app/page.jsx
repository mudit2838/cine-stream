import { Flame } from 'lucide-react';
import { getPopularMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/MovieGrid';
import MoviePagination from '@/components/MoviePagination';
import MoodMatcher from '@/components/MoodMatcher';
import ServiceError from '@/components/ServiceError';
export const dynamic = 'force-dynamic';
export default async function Page() {
  let data;
  try {
    data = await getPopularMovies();
  } catch {
    /* Display a recoverable error instead of an empty catalogue. */
  }
  return (
    <div className="space-y-10">
      <MoodMatcher />
      <section className="space-y-6">
        <h1 className="flex items-center gap-2 border-b border-slate-800 pb-4 text-2xl sm:text-3xl font-bold">
          <Flame className="text-red-500" />
          Popular Movies
        </h1>
        {data ? (
          <>
            <MovieGrid movies={data.results} />
            <MoviePagination
              totalPages={data.totalPages}
              initialIds={data.results.map((movie) => movie.id)}
            />
          </>
        ) : (
          <ServiceError />
        )}
      </section>
    </div>
  );
}
