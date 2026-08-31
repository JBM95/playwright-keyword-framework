import { expect, type Locator, type Page } from "@playwright/test";
import type { ContactData } from "../models/contact";

export class EditContactPage {
  private readonly editContactHeading: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly birthdateField: Locator;
  private readonly emailField: Locator;
  private readonly phoneField: Locator;
  private readonly street1Field: Locator;
  private readonly street2Field: Locator;
  private readonly cityField: Locator;
  private readonly stateProvinceField: Locator;
  private readonly postalCodeField: Locator;
  private readonly countryField: Locator;
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.editContactHeading = page.getByRole("heading", {
      name: "Edit Contact",
      exact: true,
    });
    this.firstNameField = page.getByRole("textbox", { name: "First Name:" });
    this.lastNameField = page.getByRole("textbox", { name: "Last Name:" });
    this.birthdateField = page.getByRole("textbox", { name: "Date of Birth:" });
    this.emailField = page.getByRole("textbox", { name: "Email:" });
    this.phoneField = page.getByRole("textbox", { name: "Phone:" });
    this.street1Field = page.getByRole("textbox", {
      name: "Street Address 1:",
    });
    this.street2Field = page.getByRole("textbox", {
      name: "Street Address 2:",
    });
    this.cityField = page.getByRole("textbox", { name: "City:" });
    this.stateProvinceField = page.getByRole("textbox", {
      name: "State or Province:",
    });
    this.postalCodeField = page.getByRole("textbox", { name: "Postal Code:" });
    this.countryField = page.getByRole("textbox", { name: "Country:" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.editContactHeading).toBeVisible();
  }

  async fillContact(contact: ContactData): Promise<void> {
    await this.firstNameField.fill(contact.firstName);
    await this.lastNameField.fill(contact.lastName);
    await this.birthdateField.fill(contact.birthdate);
    await this.emailField.fill(contact.email);
    await this.phoneField.fill(contact.phone);
    await this.street1Field.fill(contact.street1);
    await this.street2Field.fill(contact.street2);
    await this.cityField.fill(contact.city);
    await this.stateProvinceField.fill(contact.stateProvince);
    await this.postalCodeField.fill(contact.postalCode);
    await this.countryField.fill(contact.country);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
