import type {Page} from '@playwright/test';

export async function login(
  page: Page,
  username = 'jane@example.com',
  password = 'password',
) {
  await page.goto('/');
  await page.getByRole('button', {name: 'Sign in'}).click();
  await page.getByLabel('Email address', {exact: true}).fill(username);
  await page.keyboard.press('Enter');
  await page.getByLabel('Password', {exact: true}).fill(password);
  await page.keyboard.press('Enter');
}
