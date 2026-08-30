import { test as base } from '@playwright/test';
import { AuthenticationKeywords } from '../../../src/contact-list/keywords/auth.keywords';
import { ContactManagementKeywords } from '../../../src/contact-list/keywords/contact.keywords';
import { AddContactPage } from '../../../src/contact-list/pages/add-contact.page';
import { ContactDetailsPage } from '../../../src/contact-list/pages/contact-details.page';
import { ContactListPage } from '../../../src/contact-list/pages/contact-list.page';
import { EditContactPage } from '../../../src/contact-list/pages/edit-contact.page';
import { LoginPage } from '../../../src/contact-list/pages/login.page';

type ContactListFixtures = {
  loginPage: LoginPage;
  authenticationKeywords: AuthenticationKeywords;
  contactListPage: ContactListPage;
  contactDetailsPage: ContactDetailsPage;
  contactKeywords: ContactManagementKeywords;
};

export const test = base.extend<ContactListFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authenticationKeywords: async ({ loginPage }, use) => {
    await use(new AuthenticationKeywords(loginPage));
  },
  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },
  contactDetailsPage: async ({ page }, use) => {
    await use(new ContactDetailsPage(page));
  },
  contactKeywords: async (
    { page, contactListPage, contactDetailsPage },
    use
  ) => {
    const addContactPage = new AddContactPage(page);
    const editContactPage = new EditContactPage(page);

    await use(
      new ContactManagementKeywords(
        contactListPage,
        addContactPage,
        contactDetailsPage,
        editContactPage
      )
    );
  }
});
