import axios from 'axios';

const TMDB_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TMDB_BASE_URL) ||
  'https://api.tmdb.org/3';
const TMDB_FALLBACK_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_KEY =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_TMDB_KEY) ||
  (typeof globalThis !== 'undefined' &&
    globalThis.process?.env?.VITE_TMDB_KEY) ||
  '';





export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342';


export function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) {
    return posterPath;
  }
  return `${POSTER_BASE_URL}${posterPath.startsWith('/') ? posterPath : '/' + posterPath}`;
}

export function getPosterSrcSet(posterPath) {
  if (!posterPath || posterPath.startsWith('http')) return null;
  const cleanPath = posterPath.startsWith('/') ? posterPath : '/' + posterPath;
  return `https://image.tmdb.org/t/p/w185${cleanPath} 185w, https://image.tmdb.org/t/p/w342${cleanPath} 342w`;
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

let initialPopularPromise = null;

export async function getPopularMovies(page = 1, options = {}) {
  if (page === 1 && !options?.bypassCache) {
    if (!initialPopularPromise) {
      initialPopularPromise = tmdbClient
        .get('/movie/popular', { params: { page: 1 }, ...options })
        .then((response) => ({
          results: response.data.results || [],
          totalPages: response.data.total_pages || 1,
          page: response.data.page || 1,
        }))
        .catch((err) => {
          initialPopularPromise = null;
          throw err;
        });
    }
    return initialPopularPromise;
  }

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

if (typeof window !== 'undefined') {
  getPopularMovies(1).catch(() => {});
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

