# Getting Started

Use this guide when you are setting up the framework for the first time or need to understand how it runs.

## Prerequisites

Use Node.js 24 where practical so local execution matches CI.

Install dependencies from the repository root:

```bash
npm ci
npx playwright install chromium
```

On Linux environments that also need browser system dependencies:

```bash
npx playwright install --with-deps chromium
```

## Configure the Contact List account

Copy `.env.example` to a local `.env` file and provide the dedicated automation account:

```text
CONTACT_LIST_TEST_USER_EMAIL=
CONTACT_LIST_TEST_USER_PASSWORD=
```

Optional base URL override:

```text
CONTACT_LIST_BASE_URL=https://thinking-tester-contact-list.herokuapp.com/
```

Do not commit `.env`, passwords, bearer tokens, or generated authentication state.

## Run the framework

```bash
npm run typecheck             # TypeScript validation
npm test                      # full configured suite
npm run test:contact-list:ui  # Contact List UI specs
npm run test:headed           # visible browser
npm run test:ui               # Playwright UI mode
npm run report                # open latest HTML report
```

To run one spec directly:

```bash
npx playwright test tests/contact-list/ui/contact-management.spec.ts --project=contact-list-chromium
```

## How authentication works

There are three separate authentication cases.

### Authentication behaviour tests

Registration, valid login, and invalid login use the real browser and explicitly start signed out. Reusable storage state must not bypass the behaviour those scenarios are proving.

### Other authenticated UI tests

The `contact-list-setup` Playwright project logs in through the UI and writes runtime-only state to:

```text
playwright/.auth/user.json
```

The authenticated Contact List project reuses this state for scenarios that are not testing login itself. The file is ignored by Git and can be deleted locally; setup will recreate it on the next run.

### API tests

API clients authenticate independently through the REST login endpoint. The bearer token exists only at runtime and is not stored in `.env` or browser storage state.

## CI behaviour

The GitHub Actions workflow intentionally has two trust levels.

### Pull requests to `master`

```text
checkout → Node setup → npm ci → typecheck
```

Secret-backed browser tests do not run from pull-request-controlled code.

### Trusted pushes to `master`

```text
checkout
→ Node setup
→ npm ci
→ typecheck
→ install Chromium + dependencies
→ npm test
→ upload Playwright HTML report
```

Contact List credentials come from GitHub Actions Secrets and are exposed only to the Playwright test step.

The report is uploaded even if tests fail, while a failing test still fails the workflow.

## Before opening a pull request

Run:

```bash
npm run typecheck
```

and, where credentials and environment access are available:

```bash
npm test
```

Then check that no `.env`, generated auth state, passwords, or bearer tokens are included in the change.
