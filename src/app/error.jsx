'use client';
export default function ErrorPage({ reset }) {
  return (
    <div role="alert" className="py-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">Unable to load this page</h1>
      <p className="text-slate-400">
        The movie service may be temporarily unavailable.
      </p>
      <button onClick={reset} className="rounded-lg bg-red-600 px-5 py-2">
        Try again
      </button>
    </div>
  );
}
