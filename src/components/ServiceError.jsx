import RetryButton from './RetryButton';
export default function ServiceError() {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-800/50 bg-red-950/30 p-8 text-center space-y-3"
    >
      <h2 className="text-xl font-semibold">
        Movies are temporarily unavailable
      </h2>
      <p className="text-slate-400">Please try again shortly.</p>
      <RetryButton />
    </div>
  );
}
