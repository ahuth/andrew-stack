import {test, expect} from '@playwright/test';

test('can signup', async ({page}) => {
  await page.goto('/');
  await page.getByRole('link', {name: 'Sign up'}).click();
  await page.getByLabel('Email address').fill('me@me.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', {name: 'Create Account'}).click();

  await expect(page.getByRole('link', {name: 'View notes'})).toBeVisible();
});
