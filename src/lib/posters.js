export function getPosterUrl(path) {
  return typeof path === 'string' && path.startsWith('/')
    ? `https://image.tmdb.org/t/p/w500${path}`
    : null;
}
