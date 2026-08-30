import type { APIRequestContext } from '@playwright/test';

interface LoginResponse {
  token: string;
}

export class AuthApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(email: string, password: string): Promise<string> {
    const response = await this.request.post('/users/login', {
      data: { email, password }
    });

    if (!response.ok()) {
      throw new Error(
        `Contact List API login failed: ${response.status()} ${response.statusText()}`
      );
    }

    const { token } = (await response.json()) as LoginResponse;

    if (!token) {
      throw new Error('Contact List API login response did not include a token.');
    }

    return token;
  }
}
