import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    env: {
      NODE_OPTIONS: '--import ./tests/mock-upstream.mjs',
      TMDB_API_KEY: 'test-only-not-a-secret',
      GEMINI_API_KEY: '',
      VITE_GEMINI_API_KEY: '',
      VITE_AI_API_KEY: '',
    },
  },
});
