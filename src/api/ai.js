import { GoogleGenAI } from '@google/genai';

const apiKey =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_AI_API_KEY)) ||
  (typeof process !== 'undefined' && (process.env.VITE_GEMINI_API_KEY || process.env.VITE_AI_API_KEY)) ||
  '';




const ai = new GoogleGenAI({
  apiKey: apiKey,
});

export async function getMoodMatchTitle(moodInput) {
  if (!moodInput || !moodInput.trim()) {
    throw new Error('Mood input cannot be empty');
  }

  const promptText = `Suggest ONE popular movie title based on this mood: "${moodInput.trim()}". Return ONLY the exact movie title as a single line of plain text without quotes, punctuation, or explanations.`;

  const models = [
    'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
  ];

  let rawTitle = '';
  let lastErr = null;

  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptText,
      });
      rawTitle = response.text || '';
      if (rawTitle) break;
    } catch (err) {
      lastErr = err;
    }
  }

  if (!rawTitle && lastErr) {
    throw lastErr;
  }

  const sanitized = rawTitle
    .replace(/[`"'«»]/g, '')
    .replace(/^movie:\s*/i, '')
    .replace(/^title:\s*/i, '')
    .replace(/\n.*/s, '')
    .trim();

  if (!sanitized) {
    throw new Error('Could not parse movie title from AI response');
  }

  return sanitized;
}


