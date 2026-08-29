import { expect, test } from '@playwright/test';
import { AuthenticationKeywords } from '../../../src/contact-list/keywords/auth.keywords';
import { LoginPage } from '../../../src/contact-list/pages/login.page';

test('shows an error when credentials are invalid', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const authenticationKeywords = new AuthenticationKeywords(loginPage);

  await authenticationKeywords.loginAs(
    'invalid.user@example.test',
    'not-a-real-password'
  );

  const loginFailureMessage =
    await authenticationKeywords.getLoginFailureMessage();

  expect(loginFailureMessage).toBe('Incorrect username or password');
});
