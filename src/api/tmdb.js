import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || '';

export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) {
    return posterPath;
  }
  return `${POSTER_BASE_URL}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_KEY,
  },
  headers: {
    Accept: 'application/json',
    ...(TMDB_KEY.startsWith('eyJ')
      ? { Authorization: `Bearer ${TMDB_KEY}` }
      : {}),
  },
});

export async function getPopularMovies(page = 1) {
  const response = await tmdbClient.get('/movie/popular', {
    params: { page },
  });
  return {
    results: response.data.results || [],
    totalPages: response.data.total_pages || 1,
    page: response.data.page || page,
  };
}

export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) {
    return { results: [], totalPages: 0, page: 1 };
  }
  const response = await tmdbClient.get('/search/movie', {
    params: { query: query.trim(), page },
  });
  return {
    results: response.data.results || [],
    totalPages: response.data.total_pages || 1,
    page: response.data.page || page,
  };
}
