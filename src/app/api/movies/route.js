import { getPopularMovies, searchMovies } from '@/lib/tmdb';
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('page') || 1);
  const query = params.get('q')?.trim();
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    page > 500 ||
    (query && query.length > 200)
  )
    return Response.json({ error: 'Invalid page or query.' }, { status: 400 });
  try {
    return Response.json(
      query ? await searchMovies(query, page) : await getPopularMovies(page)
    );
  } catch {
    return Response.json(
      { error: 'Unable to load movies. Please try again.' },
      { status: 503 }
    );
  }
}
