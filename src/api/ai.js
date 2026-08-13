import axios from 'axios';

const AI_KEY = import.meta.env.VITE_AI_API_KEY || '';

export async function getMoodMatchTitle(moodInput) {
  if (!moodInput || !moodInput.trim()) {
    throw new Error('Mood input cannot be empty');
  }

  const promptText = `Suggest ONE movie based on this mood: ${moodInput.trim()}. Return ONLY the movie title as a plaintext string.`;

  let rawTitle = '';

  if (AI_KEY.startsWith('sk-')) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${AI_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    rawTitle = response.data.choices[0]?.message?.content || '';
  } else {
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash'];
    let lastError = null;

    for (const model of models) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${AI_KEY}`,
          {
            contents: [{ parts: [{ text: promptText }] }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        rawTitle = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (rawTitle) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!rawTitle && lastError) {
      throw lastError;
    }
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
