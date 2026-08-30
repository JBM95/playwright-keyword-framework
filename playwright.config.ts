import { defineConfig, devices } from '@playwright/test';
import { contactListConfig } from './src/contact-list/config/contact-list.config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'contact-list-setup',
      testDir: './tests/contact-list/setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: contactListConfig.baseUrl
      }
    },
    {
      name: 'contact-list-chromium',
      testDir: './tests/contact-list',
      testIgnore: /[\\/]setup[\\/]/,
      dependencies: ['contact-list-setup'],
      // The Contact List demo uses one shared account, whose API rejects concurrent logins.
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: contactListConfig.baseUrl,
        storageState: 'playwright/.auth/user.json'
      }
    }
  ]
});
