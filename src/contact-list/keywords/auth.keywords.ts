import type { LoginPage } from "../pages/login.page";
import type { ContactListPage } from "../pages/contact-list.page";
import type { SignUpPage } from "../pages/sign-up.page";
import type { TestUserData } from "../models/test-user";

export class AuthenticationKeywords {
  constructor(
    private readonly loginPage: LoginPage,
    private readonly signUpPage: SignUpPage,
    private readonly contactListPage: ContactListPage,
  ) {}

  async loginAs(email: string, password: string): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.login(email, password);
  }

  async registerUser(user: TestUserData): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.openSignUp();
    await this.signUpPage.waitForLoaded();
    await this.signUpPage.fillRegistrationForm(user);
    await this.signUpPage.submit();
    await this.contactListPage.waitForLoaded();
  }
}
