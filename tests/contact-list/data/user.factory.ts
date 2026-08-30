import type { TestUserData } from '../../../src/contact-list/models/test-user';

let userSequence = 0;

export function createTestUser(
  overrides: Partial<TestUserData> = {}
): TestUserData {
  const uniqueSuffix = `${Date.now().toString(36)}-${userSequence++}`;

  return {
    firstName: 'Test',
    lastName: 'User',
    email: `test-user-${uniqueSuffix}@example.test`,
    password: 'Password123!',
    ...overrides
  };
}
