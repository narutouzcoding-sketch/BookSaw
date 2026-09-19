import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3344',
    channel: 'msedge',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 10000,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'python -m http.server 3344',
    url: 'http://localhost:3344/index.html',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
