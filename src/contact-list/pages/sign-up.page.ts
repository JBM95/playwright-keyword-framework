import { expect, type Locator, type Page } from "@playwright/test";
import type { TestUserData } from "../models/test-user";

export class SignUpPage {
  private readonly signUpHeading: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.signUpHeading = page.getByRole("heading", {
      name: "Add User",
      exact: true,
    });
    this.firstNameField = page.getByPlaceholder("First Name");
    this.lastNameField = page.getByPlaceholder("Last Name");
    this.emailField = page.getByPlaceholder("Email");
    this.passwordField = page.locator("#password");
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/\/addUser/);
    await expect(this.signUpHeading).toBeVisible();
  }

  async fillRegistrationForm(user: TestUserData): Promise<void> {
    await this.firstNameField.fill(user.firstName);
    await this.lastNameField.fill(user.lastName);
    await this.emailField.fill(user.email);
    await this.passwordField.fill(user.password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
