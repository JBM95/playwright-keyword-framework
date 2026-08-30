import { expect, type Locator, type Page } from '@playwright/test';
import type { ContactData } from '../models/contact';

export class ContactListPage {
  readonly contactListHeading: Locator;
  private readonly addContactButton: Locator;

  constructor(private readonly page: Page) {
    this.contactListHeading = page.getByRole('heading', {
      name: 'Contact List',
      exact: true
    });
    this.addContactButton = page.getByRole('button', {
      name: 'Add a New Contact'
    });
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/contactList/);
    await expect(this.contactListHeading).toBeVisible();
  }

  async navigate(): Promise<void> {
    await this.page.goto('/contactList');
    await this.waitForLoaded();
  }

  async openAddContact(): Promise<void> {
    await this.addContactButton.click();
  }

  async openContact(contact: ContactData): Promise<void> {
    await this.contactCell(contact).click();
  }

  contactCell(contact: ContactData): Locator {
    return this.page.getByRole('cell', {
      name: `${contact.firstName} ${contact.lastName}`,
      exact: true
    });
  }
}
