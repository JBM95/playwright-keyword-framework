import { expect } from '@playwright/test';
import { UsersApiClient } from '../../../src/contact-list/api/users.client';
import { contactListConfig } from '../../../src/contact-list/config/contact-list.config';
import { createTestUser } from '../data/user.factory';
import { test } from '../fixtures/contact-list.fixture';

test.use({ storageState: { cookies: [], origins: [] } });

test('registers a new user successfully', async ({
  authApi,
  authenticationKeywords,
  contactListPage,
  request
}) => {
  const user = createTestUser();
  let registrationCompleted = false;

  try {
    await authenticationKeywords.registerUser(user);
    registrationCompleted = true;

    await expect(contactListPage.contactListHeading).toBeVisible();
  } finally {
    if (registrationCompleted) {
      const token = await authApi.login(user.email, user.password);
      const usersApi = new UsersApiClient(request, token);
      const deleteResponse = await usersApi.deleteCurrentUser();

      expect(deleteResponse.status()).toBe(200);
    }
  }
});

test('logs in with valid credentials', async ({
  authenticationKeywords,
  contactListPage
}) => {
  const { email, password } = contactListConfig.testUser;

  await authenticationKeywords.loginAs(email, password);

  await expect(contactListPage.contactListHeading).toBeVisible();
});

test('rejects invalid credentials', async ({
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
