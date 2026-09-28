export function classifyMoodError(error, stage = 'gemini') {
  if (stage === 'tmdb')
    return {
      status: 503,
      code: 'MOVIE_LOOKUP_FAILED',
      message:
        'A recommendation was generated, but movie details are temporarily unavailable. Please retry.',
    };
  const status = Number(error?.status);
  // Inspect only for classification. Never return the raw provider message.
  const message = String(error?.message || '').toLowerCase();
  if (status === 429)
    return {
      status: 429,
      code: 'AI_QUOTA_EXCEEDED',
      message:
        'AI recommendations have reached the provider quota or rate limit. Please try later; the site owner may need to check Gemini quota and billing.',
    };
  if (
    status === 401 ||
    status === 403 ||
    (status === 400 && /api.?key|api_key|permission|leaked/.test(message))
  )
    return {
      status: 503,
      code: 'AI_KEY_REJECTED',
      message:
        'The AI provider rejected the configured key or its permissions. The site owner needs to check the Gemini API key.',
    };
  if (status === 404)
    return {
      status: 503,
      code: 'AI_MODEL_UNAVAILABLE',
      message:
        'The configured AI model is unavailable. The site owner needs to update GEMINI_MODEL.',
    };
  if (/timeout|timed out|abort/.test(message))
    return {
      status: 504,
      code: 'AI_TIMEOUT',
      message: 'The AI service took too long to respond. Please try again.',
    };
  return {
    status: 503,
    code: 'AI_SERVICE_UNAVAILABLE',
    message:
      'AI recommendations are temporarily unavailable. Please try again.',
  };
}
