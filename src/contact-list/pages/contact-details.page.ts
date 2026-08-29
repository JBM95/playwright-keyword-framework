import { expect, type Locator, type Page } from '@playwright/test';
import type { ContactData } from '../models/contact';

export class ContactDetailsPage {
  private readonly contactDetailsHeading: Locator;
  private readonly editContactButton: Locator;
  private readonly deleteContactButton: Locator;
  private readonly returnToContactListButton: Locator;

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
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.contactDetailsHeading).toBeVisible();
  }

  async isDisplaying(contact: ContactData): Promise<boolean> {
    const values = [
      ['First Name:', contact.firstName],
      ['Last Name:', contact.lastName],
      ['Date of Birth:', contact.birthdate],
      ['Email:', contact.email],
      ['Phone:', contact.phone],
      ['Street Address 1:', contact.street1],
      ['Street Address 2:', contact.street2],
      ['City:', contact.city],
      ['State or Province:', contact.stateProvince],
      ['Postal Code:', contact.postalCode],
      ['Country:', contact.country]
    ] as const;

    const detailVisibility = await Promise.all(
      values.map(([label, value]) => this.detailValue(label, value).isVisible())
    );

    return detailVisibility.every(Boolean);
  }

  async enterEditMode(): Promise<void> {
    await this.editContactButton.click();
  }

  async deleteContact(): Promise<void> {
    const dialogPromise = this.page.waitForEvent('dialog');

    await this.deleteContactButton.click();
    await (await dialogPromise).accept();
  }

  async returnToContactList(): Promise<void> {
    await this.returnToContactListButton.click();
  }

  private detailValue(label: string, value: string): Locator {
    return this.page
      .locator('p')
      .filter({ hasText: label })
      .getByText(value, { exact: true });
  }
}
