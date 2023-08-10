import type {Page} from '@playwright/test';

export async function login(
  page: Page,
  username = 'jane@example.com',
  password = 'password',
) {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', {name: 'Log in'}).click();
}
