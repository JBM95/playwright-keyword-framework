const defaultContactListBaseUrl =
  'https://thinking-tester-contact-list.herokuapp.com/';

export const environment = {
  contactListBaseUrl:
    process.env.CONTACT_LIST_BASE_URL ?? defaultContactListBaseUrl
} as const;
