import { expect } from "@playwright/test";
import { UsersApiClient } from "../../../src/contact-list/api/users.client";
import { contactListConfig } from "../../../src/contact-list/config/contact-list.config";
import { createTestUser } from "../data/user.factory";
import { test } from "../fixtures/contact-list.fixture";

test.use({ storageState: { cookies: [], origins: [] } });

test("registers a new user successfully", async ({
  authApi,
  authenticationKeywords,
  contactListPage,
  request,
}) => {
  // Arrange
  const user = createTestUser();
  let registrationCompleted = false;

  try {
    // Act
    await authenticationKeywords.registerUser(user);
    registrationCompleted = true;

    // Assert
    await expect(contactListPage.contactListHeading).toBeVisible();
  } finally {
    // Cleanup: authenticate as the new user through the API, then delete it
    if (registrationCompleted) {
      const token = await authApi.login(user.email, user.password);
      const usersApi = new UsersApiClient(request, token);
      const deleteResponse = await usersApi.deleteCurrentUser();

      expect
        .soft(
          deleteResponse.status(),
          `Failed to clean up registered user ${user.email}`,
        )
        .toBe(200);
    }
  }
});

test("logs in with valid credentials", async ({
  authenticationKeywords,
  contactListPage,
}) => {
  // Arrange
  const { email, password } = contactListConfig.testUser;

  // Act
  await authenticationKeywords.loginAs(email, password);

  // Assert
  await expect(contactListPage.contactListHeading).toBeVisible();
});

test("rejects invalid credentials", async ({
  loginPage,
  authenticationKeywords,
  contactListPage,
}) => {
  // Act
  await authenticationKeywords.loginAs(
    "invalid.user@example.test",
    "not-a-real-password",
  );

  // Assert: the error is shown and the user is not signed in
  await expect(loginPage.errorMessage).toHaveText(
    "Incorrect username or password",
  );
  await expect(contactListPage.contactListHeading).toBeHidden();
});
