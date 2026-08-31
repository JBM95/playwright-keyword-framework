import "dotenv/config";

const defaultBaseUrl = "https://thinking-tester-contact-list.herokuapp.com/";

function testUserFromEnvironment() {
  const email = process.env.CONTACT_LIST_TEST_USER_EMAIL;
  const password = process.env.CONTACT_LIST_TEST_USER_PASSWORD;
  const missingCredentials = [
    !email && "CONTACT_LIST_TEST_USER_EMAIL",
    !password && "CONTACT_LIST_TEST_USER_PASSWORD",
  ].filter(Boolean);

  if (!email || !password) {
    throw new Error(
      `Contact List authentication requires: ${missingCredentials.join(", ")}. Add the missing value(s) to .env locally or configure them as CI secrets.`,
    );
  }

  return { email, password };
}

export const contactListConfig = {
  baseUrl: process.env.CONTACT_LIST_BASE_URL ?? defaultBaseUrl,
  get testUser() {
    return testUserFromEnvironment();
  },
} as const;
