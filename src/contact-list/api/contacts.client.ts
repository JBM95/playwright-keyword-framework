import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { ContactData } from "../models/contact";

export class ContactsApiClient {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly request: APIRequestContext,
    token: string,
  ) {
    this.headers = { Authorization: `Bearer ${token}` };
  }

  async createContact(contact: ContactData): Promise<APIResponse> {
    return this.request.post("/contacts", {
      data: contact,
      headers: this.headers,
    });
  }

  async getContact(contactId: string): Promise<APIResponse> {
    return this.request.get(`/contacts/${contactId}`, {
      headers: this.headers,
    });
  }

  async getContacts(): Promise<APIResponse> {
    return this.request.get("/contacts", { headers: this.headers });
  }

  async updateContact(
    contactId: string,
    contact: ContactData,
  ): Promise<APIResponse> {
    return this.request.put(`/contacts/${contactId}`, {
      data: contact,
      headers: this.headers,
    });
  }

  async deleteContact(contactId: string): Promise<APIResponse> {
    return this.request.delete(`/contacts/${contactId}`, {
      headers: this.headers,
    });
  }
}
