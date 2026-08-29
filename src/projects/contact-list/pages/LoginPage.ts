import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailField = page.getByPlaceholder('Email');
    this.passwordField = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.locator('#error');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    const populatedErrorMessage = this.errorMessage.filter({ hasText: /\S/ });
    return populatedErrorMessage.innerText();
  }
}
