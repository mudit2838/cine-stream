import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-4">
      <p className="text-red-400">404</p>
      <h1 className="text-3xl font-bold">Movie or page not found</h1>
      <Link href="/" className="inline-block bg-red-600 px-5 py-2 rounded-lg">
        Browse movies
      </Link>
    </div>
  );
}
