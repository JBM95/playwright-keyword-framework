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
  const contact = createContact();

  try {
    await contactListPage.navigate();
    await contactKeywords.addContact(contact);

    await expect(contactListPage.contactCell(contact)).toBeVisible();

    await contactKeywords.openContact(contact);

    for (const [field, value] of Object.entries(contact) as [
      keyof ContactData,
      string,
    ][]) {
      await expect(contactDetailsPage.contactField(field)).toHaveText(value);
    }
  } finally {
    const contactsResponse = await contactsApi.getContacts();

    if (contactsResponse.ok()) {
      const contacts = (await contactsResponse.json()) as ContactResponse[];
      const createdContact = contacts.find(
        (savedContact) => savedContact.email === contact.email,
      );

      if (createdContact) {
        await contactsApi.deleteContact(createdContact._id);
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
  const contact = createContact();
  const updatedContact = createContact({
    firstName: "Updated",
    lastName: "Updated Contact",
    city: "Johannesburg",
  });
  let contactId: string | undefined;

  try {
    const createResponse = await contactsApi.createContact(contact);

    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    await contactListPage.navigate();
    await contactKeywords.updateContact(contact, updatedContact);

    for (const [field, value] of Object.entries(updatedContact) as [
      keyof ContactData,
      string,
    ][]) {
      await expect(contactDetailsPage.contactField(field)).toHaveText(value);
    }
  } finally {
    if (contactId) {
      await contactsApi.deleteContact(contactId);
    }
  }
});

test("deletes an existing contact", async ({
  contactKeywords,
  contactListPage,
  contactsApi,
}) => {
  const contact = createContact();
  let contactId: string | undefined;
  let deletionCompleted = false;

  try {
    const createResponse = await contactsApi.createContact(contact);

    expect(createResponse.status()).toBe(201);

    const createdContact = (await createResponse.json()) as ContactResponse;
    contactId = createdContact._id;

    await contactListPage.navigate();
    await contactKeywords.deleteContact(contact);
    deletionCompleted = true;

    await expect(contactListPage.contactCell(contact)).toBeHidden();
  } finally {
    if (contactId && !deletionCompleted) {
      await contactsApi.deleteContact(contactId);
    }
  }
});
