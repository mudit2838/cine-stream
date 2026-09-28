import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMovie } from '@/lib/tmdb';
import { getPosterUrl } from '@/lib/posters';
import MoviePoster from '@/components/MoviePoster';
import HeartButton from '@/components/HeartButton';
export const dynamic = 'force-dynamic';
async function findMovie(params) {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) notFound();
  return movie;
}
export async function generateMetadata({ params }) {
  const movie = await findMovie(params);
  const description =
    movie.overview?.slice(0, 160) ||
    `Explore ${movie.title}: release date, rating, genres and more on CineStream.`;
  const images = getPosterUrl(movie.poster_path)
    ? [getPosterUrl(movie.poster_path)]
    : [];
  return {
    title: movie.title,
    description,
    alternates: { canonical: `/movie/${movie.id}` },
    openGraph: { title: movie.title, description, type: 'video.movie', images },
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description,
      images,
    },
  };
}
export default async function Page({ params }) {
  const movie = await findMovie(params);
  return (
    <article className="space-y-6">
      <Link href="/" className="inline-block text-slate-400 hover:text-white">
        ← Back to movies
      </Link>
      <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
        <div className="relative aspect-[2/3] w-full max-w-[280px] mx-auto bg-slate-900 rounded-2xl overflow-hidden">
          <MoviePoster path={movie.poster_path} title={movie.title} priority />
        </div>
        <div className="space-y-6 py-2">
          <div>
            <p className="text-red-400 uppercase tracking-widest text-xs font-semibold mb-3">
              Movie details
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold">{movie.title}</h1>
            {movie.tagline && (
              <p className="mt-3 text-slate-400 italic">{movie.tagline}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="rounded-full bg-slate-800 px-3 py-1 text-xs"
              >
                {g.name}
              </span>
            ))}
          </div>
          <dl className="flex flex-wrap gap-8 text-sm">
            {[
              ['Release date', movie.release_date || 'Unknown'],
              ['Runtime', movie.runtime ? `${movie.runtime} min` : 'Unknown'],
              [
                'Rating',
                movie.vote_average
                  ? `${movie.vote_average.toFixed(1)} / 10`
                  : 'Not rated',
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-slate-500 mb-1">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <section>
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p className="max-w-3xl text-slate-300 leading-relaxed">
              {movie.overview || 'No overview is available yet.'}
            </p>
          </section>
          <div className="flex items-center gap-3">
            <HeartButton
              movie={{
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
              }}
            />
            <span className="text-sm text-slate-400">
              Save to your favorites
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
