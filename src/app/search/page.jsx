import { searchMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/MovieGrid';
import MoviePagination from '@/components/MoviePagination';
import ServiceError from '@/components/ServiceError';
export const metadata = {
  title: 'Search Movies',
  robots: { index: false, follow: true },
};
export default async function Page({ searchParams }) {
  const params = await searchParams;
  const query =
    typeof params.q === 'string' ? params.q.trim().slice(0, 200) : '';
  let data;
  if (query) {
    try {
      data = await searchMovies(query);
    } catch {
      /* Recoverable upstream failure. */
    }
  }
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">
        {query ? `Results for “${query}”` : 'Search Movies'}
      </h1>
      {!query ? (
        <p className="text-slate-400">
          Search for a movie using the search bar above.
        </p>
      ) : !data ? (
        <ServiceError />
      ) : (
        <>
          <MovieGrid movies={data.results} />
          <MoviePagination
            key={query}
            query={query}
            totalPages={data.totalPages}
            initialIds={data.results.map((movie) => movie.id)}
          />
        </>
      )}
    </section>
  );
}
