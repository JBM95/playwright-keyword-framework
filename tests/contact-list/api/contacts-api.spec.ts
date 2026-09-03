import { expect } from "@playwright/test";
import { type ContactData } from "../../../src/contact-list/models/contact";
import { type ContactResponse } from "../../../src/contact-list/models/contact-response";
import { type ValidationErrorResponse } from "../../../src/contact-list/models/validation-error";
import { createContact } from "../data/contact.factory";
import { test } from "../fixtures/contact-list.fixture";

test("creates and retrieves a persisted contact", async ({ contactsApi }) => {
  // Arrange
  const contact = createContact();
  let contactId: string | undefined;

  try {
    // Act
    const createResponse = await contactsApi.createContact(contact);

    // Assert: the create response, then the persisted contact
    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    expect(contactId).toBeTruthy();
    // The spread is required: toMatchObject needs an index-signature type,
    // which the ContactData interface does not provide on its own.
    expect(createdContact).toMatchObject({ ...contact });

    const getResponse = await contactsApi.getContact(contactId);

    expect(getResponse.status()).toBe(200);

    const persistedContact = (await getResponse.json()) as ContactResponse;

    expect(persistedContact).toMatchObject({ ...contact });
  } finally {
    // Cleanup
    if (contactId) {
      const deleteResponse = await contactsApi.deleteContact(contactId);

      expect
        .soft(
          deleteResponse.status(),
          `Failed to clean up contact ${contactId}`,
        )
        .toBe(200);
    }
  }
});

test("updates a persisted contact", async ({ contactsApi }) => {
  // Arrange
  const contact = createContact();
  const updatedContact: ContactData = createContact({
    firstName: "Updated",
    lastName: "Updated Contact",
    city: "Johannesburg",
  });
  let contactId: string | undefined;

  try {
    // Arrange: create the contact to update
    const createResponse = await contactsApi.createContact(contact);

    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    // Act
    const updateResponse = await contactsApi.updateContact(
      contactId,
      updatedContact,
    );

    // Assert: the update response, then the persisted values
    expect(updateResponse.status()).toBe(200);

    const returnedContact = (await updateResponse.json()) as ContactResponse;

    expect(returnedContact).toMatchObject({ ...updatedContact });

    const getResponse = await contactsApi.getContact(contactId);

    expect(getResponse.status()).toBe(200);

    const persistedContact = (await getResponse.json()) as ContactResponse;

    expect(persistedContact).toMatchObject({ ...updatedContact });
  } finally {
    // Cleanup
    if (contactId) {
      const deleteResponse = await contactsApi.deleteContact(contactId);

      expect
        .soft(
          deleteResponse.status(),
          `Failed to clean up contact ${contactId}`,
        )
        .toBe(200);
    }
  }
});

test("deletes a persisted contact", async ({ contactsApi }) => {
  // Arrange
  const contact = createContact();
  let contactId: string | undefined;
  let contactDeleted = false;

  try {
    // Arrange: create the contact to delete
    const createResponse = await contactsApi.createContact(contact);

    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    // Act
    const deleteResponse = await contactsApi.deleteContact(contactId);
    contactDeleted = deleteResponse.ok();

    // Assert: the delete response, then that the contact is gone
    expect(deleteResponse.status()).toBe(200);
    expect(await deleteResponse.text()).toBe("Contact deleted");

    const getResponse = await contactsApi.getContact(contactId);

    expect(getResponse.status()).toBe(404);
  } finally {
    // Cleanup: only needed when the delete request did not succeed
    if (contactId && !contactDeleted) {
      const cleanupResponse = await contactsApi.deleteContact(contactId);

      expect
        .soft(
          cleanupResponse.status(),
          `Failed to clean up contact ${contactId}`,
        )
        .toBe(200);
    }
  }
});

test("rejects an unauthenticated contacts request", async ({
  unauthenticatedContactsApi,
}) => {
  // Act
  const response = await unauthenticatedContactsApi.getContacts();

  // Assert
  expect(response.status()).toBe(401);

  const body = (await response.json()) as { error: string };

  expect(body.error).toBe("Please authenticate.");
});

test("rejects a contact with an invalid email address", async ({
  contactsApi,
}) => {
  // Arrange
  const contact = createContact({ email: "not-an-email" });

  // Act
  const response = await contactsApi.createContact(contact);

  // Assert: nothing is persisted, so this scenario needs no cleanup
  expect(response.status()).toBe(400);

  const body = (await response.json()) as ValidationErrorResponse;

  expect(body.errors.email.message).toBe("Email is invalid");
});
