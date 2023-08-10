import {defineConfig, devices} from '@playwright/test';

const TEST_PORT = 3017;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  // Maximum time one test can run for.
  timeout: 30 * 1000,
  expect: {
    // Maximum time expect() should wait for the condition to be met.
    // For example in `await expect(locator).toHaveText();`
    timeout: 5000,
  },
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Maximum time each action such as `click()` can take. Defaults to 0 (no limit).
    actionTimeout: 0,
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: `http://localhost:${TEST_PORT}`,
    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
    screenshot: {
      // Capture screenshot after each test failure See https://playwright.dev/docs/api/class-testoptions#test-options-screenshot
      mode: 'only-on-failure',
      // Ensure screenshots capture the full browser page. Otherwise, some failing context may be outside visible viewport
      fullPage: true,
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: `PORT=${TEST_PORT} npm run dev`,
    port: TEST_PORT,
    reuseExistingServer: !process.env.CI,
  },
});
