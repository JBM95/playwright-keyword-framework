import 'dotenv/config';

const defaultContactListBaseUrl =
  'https://thinking-tester-contact-list.herokuapp.com/';

export const environment = {
  contactListBaseUrl:
    process.env.CONTACT_LIST_BASE_URL ?? defaultContactListBaseUrl,
  contactListTestUser: {
    email: process.env.CONTACT_LIST_TEST_USER_EMAIL,
    password: process.env.CONTACT_LIST_TEST_USER_PASSWORD
  }
} as const;
