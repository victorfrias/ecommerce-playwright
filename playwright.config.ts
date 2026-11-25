import { defineConfig, devices } from '@playwright/test'

const desktopChrome = {
  ...devices['Desktop Chrome'],
  locale: 'en-US',
  timezoneId: 'America/New_York',
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      use: desktopChrome,
    },
    {
      name: 'regression',
      grep: /@regression/,
      use: desktopChrome,
    },
    {
      name: 'checkout',
      grep: /@checkout/,
      use: desktopChrome,
    },
  ],
})
