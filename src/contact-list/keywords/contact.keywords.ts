import type { ContactData } from '../models/contact';
import type { AddContactPage } from '../pages/add-contact.page';
import type { ContactDetailsPage } from '../pages/contact-details.page';
import type { ContactListPage } from '../pages/contact-list.page';
import type { EditContactPage } from '../pages/edit-contact.page';

export class ContactManagementKeywords {
  constructor(
    private readonly contactListPage: ContactListPage,
    private readonly addContactPage: AddContactPage,
    private readonly contactDetailsPage: ContactDetailsPage,
    private readonly editContactPage: EditContactPage
  ) {}

  async addContact(contact: ContactData): Promise<void> {
    await this.contactListPage.openAddContact();
    await this.addContactPage.waitForLoaded();
    await this.addContactPage.fillContact(contact);
    await this.addContactPage.submit();
    await this.contactListPage.waitForLoaded();
  }

  async openContact(contact: ContactData): Promise<void> {
    await this.contactListPage.openContact(contact);
    await this.contactDetailsPage.waitForLoaded();
  }

  async updateContact(
    existingContact: ContactData,
    updatedContact: ContactData
  ): Promise<void> {
    await this.openContact(existingContact);
    await this.contactDetailsPage.enterEditMode();
    await this.editContactPage.waitForLoaded();
    await this.editContactPage.fillContact(updatedContact);
    await this.editContactPage.submit();
    await this.contactDetailsPage.waitForLoaded();
  }

  async deleteContact(contact: ContactData): Promise<void> {
    await this.openContact(contact);
    await this.contactDetailsPage.deleteContact();
    await this.contactListPage.waitForLoaded();
  }

  async returnToContactList(): Promise<void> {
    await this.contactDetailsPage.returnToContactList();
    await this.contactListPage.waitForLoaded();
  }

  async isContactPresent(contact: ContactData): Promise<boolean> {
    return this.contactListPage.isContactPresent(contact);
  }

  async isContactDetailsDisplayed(contact: ContactData): Promise<boolean> {
    return this.contactDetailsPage.isDisplaying(contact);
  }
}
