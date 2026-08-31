import type { ContactData } from "../../../src/contact-list/models/contact";

let contactSequence = 0;

export function createContact(
  overrides: Partial<ContactData> = {},
): ContactData {
  const uniqueSuffix = `${Date.now().toString(36)}-${contactSequence++}`;

  return {
    firstName: "Test",
    lastName: `Contact ${uniqueSuffix}`,
    birthdate: "1990-01-01",
    email: `test-contact-${uniqueSuffix}@example.test`,
    phone: "0123456789",
    street1: "1 Test Street",
    street2: "Test Suburb",
    city: "Cape Town",
    stateProvince: "Western Cape",
    postalCode: "8001",
    country: "South Africa",
    ...overrides,
  };
}
