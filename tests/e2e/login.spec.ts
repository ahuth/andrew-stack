import {test, expect} from '@playwright/test';
import {login} from './helpers';

test('can log in and out', async ({page}) => {
  // Start logged out.
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Log in'})).toBeVisible();

  // Login and find yourself on the logged in page.
  await login(page);
  await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();

  // Log back out.
  await page.getByRole('button', {name: 'Logout'}).click();
  await expect(page.getByRole('link', {name: 'Log in'})).toBeVisible();
});
