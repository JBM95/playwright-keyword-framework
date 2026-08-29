import type { LoginPage } from '../pages/LoginPage';

export class AuthenticationKeywords {
  constructor(private readonly loginPage: LoginPage) {}

  async loginAs(email: string, password: string): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.login(email, password);
  }

  async getLoginFailureMessage(): Promise<string> {
    return this.loginPage.getErrorMessage();
  }
}
