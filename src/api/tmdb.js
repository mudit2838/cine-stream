import axios from 'axios';

const TMDB_BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || 'https://api.tmdb.org/3';
const TMDB_FALLBACK_BASE_URL = 'https://api.themoviedb.org/3';
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
  timeout: 8000,
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

// Interceptor to fallback if primary domain experiences network/DNS failure
tmdbClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (config && !config._retry) {
      config._retry = true;
      const currentBase = config.baseURL || TMDB_BASE_URL;
      config.baseURL =
        currentBase === TMDB_BASE_URL ? TMDB_FALLBACK_BASE_URL : TMDB_BASE_URL;
      return tmdbClient(config);
    }
    return Promise.reject(error);
  }
);

export async function getPopularMovies(page = 1, options = {}) {
  const response = await tmdbClient.get('/movie/popular', {
    params: { page },
    ...options,
  });
  return {
    results: response.data.results || [],
    totalPages: response.data.total_pages || 1,
    page: response.data.page || page,
  };
}

export async function searchMovies(query, page = 1, options = {}) {
  if (!query || !query.trim()) {
    return { results: [], totalPages: 0, page: 1 };
  }
  const response = await tmdbClient.get('/search/movie', {
    params: { query: query.trim(), page },
    ...options,
  });
  return {
    results: response.data.results || [],
    totalPages: response.data.total_pages || 1,
    page: response.data.page || page,
  };
}

