/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' },
    ],
  },
  // Keep dynamic metadata in the head for every user agent (including the demo).
  htmlLimitedBots: /.*/,
};
export default nextConfig;
