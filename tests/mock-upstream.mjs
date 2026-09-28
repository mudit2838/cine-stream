// Test-process-only fixtures. Never imported by application code.
const originalFetch = globalThis.fetch;
const movie = (id) => ({
  id,
  title: `Fixture Movie ${id}`,
  overview: 'A deterministic movie overview for server rendering verification.',
  poster_path: null,
  release_date: '2026-01-15',
  vote_average: 8.2,
  runtime: 123,
  genres: [{ id: 1, name: 'Adventure' }],
});
globalThis.fetch = async (input, options) => {
  const url = new URL(
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url
  );
  if (url.hostname === 'api.themoviedb.org') {
    const page = Number(url.searchParams.get('page') || 1);
    if (url.searchParams.get('query') === 'upstream-failure')
      return Response.json({}, { status: 503 });
    if (url.pathname === '/3/movie/999999')
      return Response.json({}, { status: 404 });
    if (/^\/3\/movie\/\d+$/.test(url.pathname))
      return Response.json(movie(Number(url.pathname.split('/').pop())));
    const results =
      url.searchParams.get('query') === 'nothing-found'
        ? []
        : Array.from({ length: 18 }, (_, i) => movie((page - 1) * 18 + i + 1));
    return Response.json({ results, page, total_pages: 2 });
  }
  return originalFetch(input, options);
};
