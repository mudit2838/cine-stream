import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyMoodError } from '../src/lib/mood-errors.js';
test('quota and credentials yield actionable errors without exposing provider details', () => {
  assert.equal(classifyMoodError({ status: 429 }).code, 'AI_QUOTA_EXCEEDED');
  assert.equal(classifyMoodError({ status: 403 }).code, 'AI_KEY_REJECTED');
  const badKey = classifyMoodError({
    status: 400,
    message: 'API key invalid: secret-value',
  });
  assert.equal(badKey.code, 'AI_KEY_REJECTED');
  assert.ok(!JSON.stringify(badKey).includes('secret-value'));
});
test('model, timeout and movie lookup are distinguished', () => {
  assert.equal(classifyMoodError({ status: 404 }).code, 'AI_MODEL_UNAVAILABLE');
  assert.equal(classifyMoodError({ message: 'Request timed out' }).status, 504);
  assert.equal(
    classifyMoodError({ status: 429 }, 'tmdb').code,
    'MOVIE_LOOKUP_FAILED'
  );
  assert.equal(
    classifyMoodError({ status: 500 }).code,
    'AI_SERVICE_UNAVAILABLE'
  );
});
