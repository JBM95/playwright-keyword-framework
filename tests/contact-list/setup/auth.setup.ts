import { mkdir } from 'node:fs/promises';
import { test as setup } from '@playwright/test';
import { AuthenticationKeywords } from '../../../src/contact-list/keywords/auth.keywords';
import { ContactListPage } from '../../../src/contact-list/pages/contact-list.page';
import { environment } from '../../../src/framework/config/environment';
import { LoginPage } from '../../../src/contact-list/pages/login.page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as the Contact List test user', async ({ page }) => {
  const { email, password } = environment.contactListTestUser;

  if (!email || !password) {
    const missingCredentials = [
      !email && 'CONTACT_LIST_TEST_USER_EMAIL',
      !password && 'CONTACT_LIST_TEST_USER_PASSWORD'
    ].filter(Boolean);

    throw new Error(
      `Contact List authentication setup is missing: ${missingCredentials.join(', ')}. Define the required environment variable(s) before running Playwright.`
    );
  }

  const loginPage = new LoginPage(page);
  const authenticationKeywords = new AuthenticationKeywords(loginPage);
  const contactListPage = new ContactListPage(page);

  await authenticationKeywords.loginAs(email, password);
  await contactListPage.waitForLoaded();

  await mkdir('playwright/.auth', { recursive: true });
  await page.context().storageState({ path: authFile });
});
