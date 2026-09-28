'use client';
import { useState } from 'react';
import MovieCard from './MovieCard';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function MoodMatcher() {
  const [moodInput, setMoodInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [matchedMovie, setMatchedMovie] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = moodInput.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError(null);
      setMatchedMovie(null);

      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: trimmed }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Recommendation unavailable.');
      setSuggestedTitle(data.title);
      if (data.movie) setMatchedMovie(data.movie);
      else setError('No movie found for that mood. Try another description.');
    } catch (err) {
      setError(err.message || 'Recommendation unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMoodInput('');
    setMatchedMovie(null);
    setSuggestedTitle('');
    setError(null);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-500 font-semibold text-sm">
            <Sparkles className="w-4 h-4 fill-red-500" />
            <span>AI MOOD MATCHER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            What are you in the mood for?
          </h2>
          <p className="text-sm text-slate-400">
            Describe your current mood or vibe to get a personalized movie
            suggestion.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            maxLength={300}
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder='e.g., "sad but want an action movie" or "nostalgic 90s comedy"'
            aria-label="Describe your movie mood"
            className="min-w-0 flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/80 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !moodInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors shadow-md shrink-0 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find Recommendation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && !loading && (
        <div className="mt-6 p-4 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center justify-between gap-4 text-sm text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-lg text-xs font-medium transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {matchedMovie && !loading && (
        <div className="mt-6 space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
              <span className="text-xs uppercase tracking-wider px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full font-semibold border border-red-500/30">
                Top AI Match
              </span>
              {suggestedTitle && (
                <span className="text-slate-400">
                  for &quot;{suggestedTitle}&quot;
                </span>
              )}
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded"
            >
              Clear Result
            </button>
          </div>

          <div className="max-w-xs mx-auto sm:mx-0">
            <MovieCard movie={matchedMovie} />
          </div>
        </div>
      )}
    </div>
  );
}
