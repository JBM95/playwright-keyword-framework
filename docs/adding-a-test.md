# Adding a Test

Use this guide when adding or extending automation. The existing edit-contact scenario is the reference example because it shows test data, API setup, UI behaviour, keywords, page objects, assertions, and cleanup in one flow.

## Worked example: edit an existing contact

Requirement:

> An authenticated user can edit an existing contact and see the updated information.

The behaviour under test is the **UI edit**, not contact creation. The scenario therefore uses the API for the prerequisite and cleanup while keeping the behaviour itself in the browser.

```text
create test data
    ↓
API create prerequisite
    ↓
UI edit through keyword/page objects
    ↓
UI assert updated values
    ↓
API cleanup in finally
```

### 1. Generate scenario data

Use the typed factory in `tests/contact-list/data/contact.factory.ts`:

```ts
const contact = createContact();

const updatedContact = createContact({
  firstName: "Updated",
  lastName: "Updated Contact",
  city: "Johannesburg",
});
```

Factories should create complete valid data, allow focused overrides, and generate unique persisted values where needed.

### 2. Create the prerequisite through the API

The fixture provides `contactsApi`:

```ts
const createResponse = await contactsApi.createContact(contact);
expect(createResponse.status()).toBe(201);

const createdContact = (await createResponse.json()) as ContactResponse;
contactId = createdContact._id;
```

Keep the returned ID so the scenario can clean up its own data.

### 3. Perform the behaviour through the UI

The test calls the domain action:

```ts
await contactListPage.navigate();
await contactKeywords.updateContact(contact, updatedContact);
```

`ContactManagementKeywords.updateContact()` coordinates the relevant page objects:

```text
ContactListPage
→ ContactDetailsPage
→ EditContactPage
→ ContactDetailsPage
```

Locators and browser mechanics stay in those page objects. The keyword describes the meaningful product action.

### 4. Assert the visible result in the spec

The page object exposes the observable field, while the test decides what value proves the scenario:

```ts
await expect(contactDetailsPage.contactField(field)).toHaveText(value);
```

Final scenario assertions belong in the spec.

### 5. Clean up persisted data

Use `finally` so cleanup still runs after a failed assertion:

```ts
finally {
  if (contactId) {
    await contactsApi.deleteContact(contactId);
  }
}
```

The complete path is:

```text
contact-management.spec.ts
    ├── contact.factory.ts
    ├── contacts.client.ts       # prerequisite + cleanup
    ├── contact.keywords.ts      # domain action
    ├── contact-list.page.ts
    ├── contact-details.page.ts
    └── edit-contact.page.ts
```

## Adding other UI behaviour

Follow this order:

1. Name the behaviour clearly in the spec.
2. Decide which layer should establish prerequisite state.
3. Add or update page-object mechanics if the browser interaction is new.
4. Add a keyword only when several interactions form a meaningful reusable product action.
5. Keep the final assertion in the spec.
6. Clean persisted data where practical.

Example rule:

```text
Testing contact creation → create through UI
Testing contact editing  → API may create prerequisite, edit through UI
```

## Adding a page object

Add one when an automated behaviour genuinely needs a meaningful screen.

Keep all locators in the page object and use this preference order:

```text
role + accessible name
→ label
→ placeholder
→ stable visible text
→ stable ID/test ID
→ scoped CSS
→ XPath only when no safer practical option exists
```

Do not create pages simply because the application contains another route.

## Adding a keyword

A keyword should describe product language such as:

```ts
loginAs();
registerUser();
updateContact();
deleteContact();
```

Low-level actions such as `clickButton()` or `fillTextBox()` belong in page objects, not the keyword layer.

Keywords should not contain locators, hidden HTTP setup, or final scenario assertions.

## Adding an API endpoint or API test

HTTP mechanics belong in `src/contact-list/api/`. Extend the existing domain client when the endpoint belongs there.

For contact CRUD, clients return Playwright `APIResponse` so the test can visibly assert status, body, and persisted state.

A good persisted API scenario checks more than whether a request completed. For example:

```text
create prerequisite
→ PUT update
→ assert response
→ GET same contact
→ assert persisted values
→ cleanup
```

API specs live under `tests/contact-list/api/`.

## Adding or changing an environment

Use product configuration rather than editing page objects or API clients.

The current Contact List product supports:

```text
CONTACT_LIST_BASE_URL
CONTACT_LIST_TEST_USER_EMAIL
CONTACT_LIST_TEST_USER_PASSWORD
```

Do not hard-code environment-specific URLs or credentials throughout the implementation.

## Adding another product

Add it alongside Contact List:

```text
src/new-product/
├── api/
├── config/
├── keywords/
├── models/
└── pages/

tests/new-product/
├── api/
├── data/
├── fixtures/
├── setup/
└── ui/
```

Give the product its own configuration, pages, keywords, API clients, factories, fixture, tests, authentication strategy, and Playwright project settings.

Existing `src/contact-list/` and `tests/contact-list/` code should not need to change.

Do not extract new shared base classes just because two implementations look similar. Extract only when real cross-product duplication creates a maintenance problem.
