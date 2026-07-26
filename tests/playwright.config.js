// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'reports/playwright-results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:5173', // adjust to your frontend dev server port (Vite default is 5173)
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Optional: automatically start your frontend + backend before running tests
  // webServer: [
  //   {
  //     command: 'npm run dev --prefix frontend',
  //     url: 'http://localhost:5173',
  //     reuseExistingServer: !process.env.CI,
  //   },
  //   {
  //     command: 'npm start',
  //     url: 'http://localhost:5000',
  //     reuseExistingServer: !process.env.CI,
  //   },
  // ],
});