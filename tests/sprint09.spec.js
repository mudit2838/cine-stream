import { test, expect } from '@playwright/test';

test('server HTML includes movies and dynamic metadata without browser JavaScript', async ({
  request,
}) => {
  const home = await request.get('/');
  expect(home.status()).toBe(200);
  expect(await home.text()).toContain('Fixture Movie 1');
  const detail = await request.get('/movie/1');
  const html = await detail.text();
  const head = html.split('</head>')[0];
  expect(detail.status()).toBe(200);
  expect(head).toContain('<title>Fixture Movie 1 | CineStream</title>');
  expect(head).toContain(
    'name="description" content="A deterministic movie overview'
  );
  expect(html).toContain('123 min');
  expect((await request.get('/movie/not-a-number')).status()).toBe(404);
  expect((await request.get('/movie/999999')).status()).toBe(404);
});

test('favorites persist across reload and navigation without hydration errors', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Add to favorites' }).first().click();
  await page.getByRole('link', { name: 'Favorites', exact: true }).click();
  await expect(page).toHaveURL(/\/favorites$/);
  await expect(
    page.getByRole('heading', { name: 'Favorite Movies', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Fixture Movie 1', exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Fixture Movie 1', exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Remove from favorites' }).click();
  await expect(
    page.getByRole('heading', { name: 'No Favorites Saved Yet' })
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('search, pagination, movie navigation and empty results work', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Search movies by title' }).count();
  await page
    .getByRole('searchbox', { name: 'Search movies by title' })
    .fill('fixture');
  await expect(page).toHaveURL(/search\?q=fixture/);
  await expect(
    page.getByRole('heading', { name: 'Results for “fixture”' })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Load more movies' })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('heading', { name: 'Fixture Movie 19', exact: true })
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'View Fixture Movie 19', exact: true })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Fixture Movie 19'
  );
  await expect(page).toHaveTitle('Fixture Movie 19 | CineStream');
  await page.goto('/search?q=nothing-found');
  await expect(page.getByText('No movies found.')).toBeVisible();
});

test('API validation, upstream errors and optional AI configuration are honest', async ({
  request,
  page,
}) => {
  expect((await request.get('/api/movies?page=-1')).status()).toBe(400);
  expect((await request.get('/api/movies?page=501')).status()).toBe(400);
  expect(
    (await request.post('/api/mood', { data: { mood: '' } })).status()
  ).toBe(400);
  const ai = await request.post('/api/mood', { data: { mood: 'happy' } });
  expect(ai.status()).toBe(503);
  expect((await ai.json()).error).toContain('not configured');
  await page.goto('/search?q=upstream-failure');
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Movies are temporarily unavailable' })
  ).toContainText('Movies are temporarily unavailable');
});

test('mobile page fits viewport and saved invalid JSON does not crash', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() =>
    localStorage.setItem('cinestream_favorites', '{broken')
  );
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Popular Movies' })
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
