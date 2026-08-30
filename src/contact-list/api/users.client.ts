import type { APIRequestContext, APIResponse } from '@playwright/test';

export class UsersApiClient {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly request: APIRequestContext,
    token: string
  ) {
    this.headers = { Authorization: `Bearer ${token}` };
  }

  async deleteCurrentUser(): Promise<APIResponse> {
    return this.request.delete('/users/me', { headers: this.headers });
  }
}
