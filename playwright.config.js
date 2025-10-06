import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Add extension path for Chrome
        args: [
          `--load-extension=${process.cwd()}/dist/chrome`,
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Add extension path for Firefox
        args: [
          `--load-extension=${process.cwd()}/dist/firefox`
        ]
      },
    },
  ],
});