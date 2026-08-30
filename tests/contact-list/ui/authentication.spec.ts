import { expect } from '@playwright/test';
import { test } from '../fixtures/contact-list.fixture';

test.use({ storageState: { cookies: [], origins: [] } });

test('shows an error when credentials are invalid', async ({
  loginPage,
  authenticationKeywords
}) => {
  await authenticationKeywords.loginAs(
    'invalid.user@example.test',
    'not-a-real-password'
  );

  await expect(loginPage.errorMessage).toHaveText(
    'Incorrect username or password'
  );
});
