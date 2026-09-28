import 'server-only';
import { cache } from 'react';

async function request(path, params = {}) {
  // Legacy names are accepted ONLY on the server to support existing Vercel settings.
  const key = process.env.TMDB_API_KEY || process.env.VITE_TMDB_KEY;
  const token =
    process.env.TMDB_ACCESS_TOKEN || (key?.startsWith('eyJ') ? key : '');
  if (!key && !token) throw new Error('TMDB credentials are not configured.');
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('language', 'en-US');
  for (const [name, value] of Object.entries(params))
    url.searchParams.set(name, String(value));
  if (!token) url.searchParams.set('api_key', key);
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(`Movie service unavailable (${response.status}).`);
  return response.json();
}
const list = (data) => ({
  results: data?.results || [],
  page: data?.page || 1,
  totalPages: Math.min(data?.total_pages || 0, 500),
});
export async function getPopularMovies(page = 1) {
  return list(await request('/movie/popular', { page }));
}
export async function searchMovies(query, page = 1) {
  return list(
    await request('/search/movie', { query, page, include_adult: false })
  );
}
export const getMovie = cache(async (id) =>
  /^\d+$/.test(id) && Number(id) > 0 ? request(`/movie/${id}`) : null
);
