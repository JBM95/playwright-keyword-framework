import { mkdir } from 'node:fs/promises';
import { test as setup } from '@playwright/test';
import { contactListConfig } from '../../../src/contact-list/config/contact-list.config';
import { AuthenticationKeywords } from '../../../src/contact-list/keywords/auth.keywords';
import { ContactListPage } from '../../../src/contact-list/pages/contact-list.page';
import { LoginPage } from '../../../src/contact-list/pages/login.page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as the Contact List test user', async ({ page }) => {
  const { email, password } = contactListConfig.testUser;

  const loginPage = new LoginPage(page);
  const authenticationKeywords = new AuthenticationKeywords(loginPage);
  const contactListPage = new ContactListPage(page);

  await authenticationKeywords.loginAs(email, password);
  await contactListPage.waitForLoaded();

  await mkdir('playwright/.auth', { recursive: true });
  await page.context().storageState({ path: authFile });
});
