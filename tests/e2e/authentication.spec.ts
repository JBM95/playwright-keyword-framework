import { expect, test } from '@playwright/test';
import { AuthenticationKeywords } from '../../src/projects/contact-list/keywords/AuthenticationKeywords';
import { LoginPage } from '../../src/projects/contact-list/pages/LoginPage';

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
