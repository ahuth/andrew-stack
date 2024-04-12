import {test, expect} from '@playwright/test';
import {login} from './helpers';

test('can log in and out', async ({page}) => {
  // Start logged out.
  await page.goto('/');
  await expect(page.getByRole('button', {name: 'Sign in'})).toBeVisible();

  // Login and find yourself on the logged in page.
  await login(page);
  await expect(
    page.getByRole('button', {name: 'Open user button'}),
  ).toBeVisible();

  // Log back out.
  await page.getByRole('button', {name: 'Open user button'}).click();
  await page.getByRole('menuitem', {name: 'Sign out'}).click();
  await expect(page.getByRole('button', {name: 'Sign in'})).toBeVisible();
});
