import type { ContactData } from './contact';

export interface ContactResponse extends ContactData {
  _id: string;
  owner: string;
  __v: number;
}
