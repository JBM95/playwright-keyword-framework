import { test as base } from "@playwright/test";
import { AuthApiClient } from "../../../src/contact-list/api/auth.client";
import { ContactsApiClient } from "../../../src/contact-list/api/contacts.client";
import { contactListConfig } from "../../../src/contact-list/config/contact-list.config";
import { AuthenticationKeywords } from "../../../src/contact-list/keywords/auth.keywords";
import { ContactManagementKeywords } from "../../../src/contact-list/keywords/contact.keywords";
import { AddContactPage } from "../../../src/contact-list/pages/add-contact.page";
import { ContactDetailsPage } from "../../../src/contact-list/pages/contact-details.page";
import { ContactListPage } from "../../../src/contact-list/pages/contact-list.page";
import { EditContactPage } from "../../../src/contact-list/pages/edit-contact.page";
import { LoginPage } from "../../../src/contact-list/pages/login.page";
import { SignUpPage } from "../../../src/contact-list/pages/sign-up.page";

type ContactListFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  authenticationKeywords: AuthenticationKeywords;
  contactListPage: ContactListPage;
  contactDetailsPage: ContactDetailsPage;
  contactKeywords: ContactManagementKeywords;
  authApi: AuthApiClient;
  contactsApi: ContactsApiClient;
  unauthenticatedContactsApi: ContactsApiClient;
};

export const test = base.extend<ContactListFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  authenticationKeywords: async (
    { loginPage, signUpPage, contactListPage },
    use,
  ) => {
    await use(
      new AuthenticationKeywords(loginPage, signUpPage, contactListPage),
    );
  },
  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },
  contactDetailsPage: async ({ page }, use) => {
    await use(new ContactDetailsPage(page));
  },
  contactKeywords: async (
    { page, contactListPage, contactDetailsPage },
    use,
  ) => {
    const addContactPage = new AddContactPage(page);
    const editContactPage = new EditContactPage(page);

    await use(
      new ContactManagementKeywords(
        contactListPage,
        addContactPage,
        contactDetailsPage,
        editContactPage,
      ),
    );
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApiClient(request));
  },
  contactsApi: async ({ request, authApi }, use) => {
    const { email, password } = contactListConfig.testUser;
    const token = await authApi.login(email, password);

    await use(new ContactsApiClient(request, token));
  },
  // Built without a token so scenarios can prove the API refuses
  // unauthenticated requests.
  unauthenticatedContactsApi: async ({ request }, use) => {
    await use(new ContactsApiClient(request));
  },
});
