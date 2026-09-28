import { GoogleGenAI } from '@google/genai';
import { searchMovies } from '@/lib/tmdb';
import { classifyMoodError } from '@/lib/mood-errors';
export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: 'Request origin not allowed.' },
      { status: 403 }
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const mood = body?.mood;
  if (typeof mood !== 'string' || !mood.trim() || mood.length > 300)
    return Response.json(
      { error: 'Describe your mood in 1–300 characters.' },
      { status: 400 }
    );
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_AI_API_KEY;
  if (!apiKey)
    return Response.json(
      {
        error:
          'Mood Matcher is not configured yet. Movie browsing is still available.',
      },
      { status: 503 }
    );
  let stage = 'gemini';
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 15000 } });
    const result = await ai.models.generateContent({
      model,
      contents: `Movie mood: ${JSON.stringify(mood.trim())}`,
      config: {
        systemInstruction:
          'Recommend exactly one real movie matching the mood. Return only its title, no commentary.',
        maxOutputTokens: 256,
        ...(model.startsWith('gemini-2.5-flash')
          ? { thinkingConfig: { thinkingBudget: 0 } }
          : {}),
      },
    });
    const title = (result.text || '')
      .replace(/[`"']/g, '')
      .split('\n')[0]
      .trim();
    if (!title) {
      console.warn('Mood Matcher returned no title', {
        model,
        finishReason: result.candidates?.[0]?.finishReason || 'unknown',
      });
      return Response.json(
        {
          error: 'No recommendation was returned. Please try a different mood.',
          code: 'EMPTY_RECOMMENDATION',
        },
        { status: 502 }
      );
    }
    stage = 'tmdb';
    const movies = await searchMovies(title);
    return Response.json({ title, movie: movies.results[0] || null });
  } catch (error) {
    const failure = classifyMoodError(error, stage);
    // Do not log raw provider errors, keys, request bodies or URLs.
    console.error('Mood Matcher request failed', {
      stage,
      model,
      code: failure.code,
      upstreamStatus: Number(error?.status) || null,
    });
    return Response.json(
      { error: failure.message, code: failure.code },
      { status: failure.status }
    );
  }
}
