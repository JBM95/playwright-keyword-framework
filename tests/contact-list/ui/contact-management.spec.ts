import { expect } from "@playwright/test";
import type { ContactData } from "../../../src/contact-list/models/contact";
import type { ContactResponse } from "../../../src/contact-list/models/contact-response";
import { createContact } from "../data/contact.factory";
import { test } from "../fixtures/contact-list.fixture";

test("adds a contact and displays saved details", async ({
  contactDetailsPage,
  contactKeywords,
  contactListPage,
  contactsApi,
}) => {
  // Arrange
  const contact = createContact();

  try {
    // Act
    await contactListPage.navigate();
    await contactKeywords.addContact(contact);

    // Assert: the contact appears in the list
    await expect(contactListPage.contactCell(contact)).toBeVisible();

    // Act: open the saved contact
    await contactKeywords.openContact(contact);

    // Assert: the saved details are displayed
    for (const [field, value] of Object.entries(contact) as [
      keyof ContactData,
      string,
    ][]) {
      await expect(contactDetailsPage.contactField(field)).toHaveText(value);
    }
  } finally {
    // Cleanup: find the UI-created contact and delete it through the API
    const contactsResponse = await contactsApi.getContacts();

    expect
      .soft(
        contactsResponse.status(),
        `Failed to list contacts to clean up ${contact.email}`,
      )
      .toBe(200);

    if (contactsResponse.ok()) {
      const contacts = (await contactsResponse.json()) as ContactResponse[];
      const createdContact = contacts.find(
        (savedContact) => savedContact.email === contact.email,
      );

      if (createdContact) {
        const deleteResponse = await contactsApi.deleteContact(
          createdContact._id,
        );

        expect
          .soft(
            deleteResponse.status(),
            `Failed to clean up contact ${createdContact._id}`,
          )
          .toBe(200);
      }
    }
  }
});

test("edits an existing contact", async ({
  contactDetailsPage,
  contactKeywords,
  contactListPage,
  contactsApi,
}) => {
  // Arrange
  const contact = createContact();
  const updatedContact = createContact({
    firstName: "Updated",
    lastName: "Updated Contact",
    city: "Johannesburg",
  });
  let contactId: string | undefined;

  try {
    // Arrange: create the contact to edit through the API
    const createResponse = await contactsApi.createContact(contact);

    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    // Act
    await contactListPage.navigate();
    await contactKeywords.updateContact(contact, updatedContact);

    // Assert
    for (const [field, value] of Object.entries(updatedContact) as [
      keyof ContactData,
      string,
    ][]) {
      await expect(contactDetailsPage.contactField(field)).toHaveText(value);
    }
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

test("deletes an existing contact", async ({
  contactKeywords,
  contactListPage,
  contactsApi,
}) => {
  // Arrange
  const contact = createContact();
  let contactId: string | undefined;
  let deletionCompleted = false;

  try {
    // Arrange: create the contact to delete through the API
    const createResponse = await contactsApi.createContact(contact);

    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    // Act
    await contactListPage.navigate();
    await contactKeywords.deleteContact(contact);
    deletionCompleted = true;

    // Assert
    await expect(contactListPage.contactCell(contact)).toBeHidden();
  } finally {
    // Cleanup: only needed when the UI delete steps did not run
    if (contactId && !deletionCompleted) {
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
