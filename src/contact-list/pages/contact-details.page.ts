import { expect, type Locator, type Page } from '@playwright/test';
import type { ContactData } from '../models/contact';

export class ContactDetailsPage {
  private readonly contactDetailsHeading: Locator;
  private readonly editContactButton: Locator;
  private readonly deleteContactButton: Locator;
  private readonly returnToContactListButton: Locator;
  private readonly contactFields: Record<keyof ContactData, Locator>;

  constructor(private readonly page: Page) {
    this.contactDetailsHeading = page.getByRole('heading', {
      name: 'Contact Details',
      exact: true
    });
    this.editContactButton = page.getByRole('button', { name: 'Edit Contact' });
    this.deleteContactButton = page.getByRole('button', {
      name: 'Delete Contact'
    });
    this.returnToContactListButton = page.getByRole('button', {
      name: 'Return to Contact List'
    });
    this.contactFields = {
      firstName: page.locator('#firstName'),
      lastName: page.locator('#lastName'),
      birthdate: page.locator('#birthdate'),
      email: page.locator('#email'),
      phone: page.locator('#phone'),
      street1: page.locator('#street1'),
      street2: page.locator('#street2'),
      city: page.locator('#city'),
      stateProvince: page.locator('#stateProvince'),
      postalCode: page.locator('#postalCode'),
      country: page.locator('#country')
    };
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.contactDetailsHeading).toBeVisible();
  }

  contactField(field: keyof ContactData): Locator {
    return this.contactFields[field];
  }

  async enterEditMode(): Promise<void> {
    await this.editContactButton.click();
  }

  async deleteContact(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.deleteContactButton.click();
  }

  async returnToContactList(): Promise<void> {
    await this.returnToContactListButton.click();
  }
}
