import { defineConfig, devices } from '@playwright/test';
import { contactListConfig } from './src/contact-list/config/contact-list.config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: contactListConfig.baseUrl,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'
      }
    }
  ]
});
