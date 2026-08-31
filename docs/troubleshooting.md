# Troubleshooting

Start with the failing test and identify which layer is responsible before changing code.

```text
1. Read the assertion/error.
2. Find the failing test step.
3. Open the HTML report.
4. Check the screenshot.
5. Check the trace when available.
6. Decide whether the problem is test, keyword, page, API, or environment.
7. Fix that layer rather than adding a workaround.
```

## Missing credentials

If you see an error saying Contact List authentication requires environment values, check the root `.env` file for:

```text
CONTACT_LIST_TEST_USER_EMAIL
CONTACT_LIST_TEST_USER_PASSWORD
```

In CI, these values come from GitHub Actions Secrets.

Do not hard-code credentials to get around the error.

## Chromium is not installed

Run:

```bash
npx playwright install chromium
```

On Linux where browser dependencies are also required:

```bash
npx playwright install --with-deps chromium
```

## Authenticated UI tests fail

Authenticated UI tests depend on the `contact-list-setup` project.

Setup logs in through the real UI and writes:

```text
playwright/.auth/user.json
```

If setup fails, investigate it first. Check credentials, Contact List availability, login behaviour, and changed locators.

The generated auth file is runtime state. It can be deleted locally and recreated by the next run. Never commit it.

## A locator stopped working

Inspect the current UI and fix the relevant page object.

Use the locator policy:

```text
role + accessible name
→ label
→ placeholder
→ stable visible text
→ stable ID/test ID
→ scoped CSS
→ XPath only if necessary
```

Do not patch individual specs with duplicate selectors.

## A UI test is flaky because the page changes slowly

Do not add:

```ts
waitForTimeout()
```

Wait for meaningful application state instead: a web-first assertion, expected URL, visible heading, page readiness, or expected element state.

## Test data is left behind

If a scenario creates persisted data, make cleanup resilient with `try/finally` where practical.

For UI scenarios, API cleanup is appropriate when the API operation is supporting cleanup rather than the behaviour under test.

## Tests fail after increasing parallelism

The Contact List demonstration uses one shared external test account. Concurrent authentication for that account has proved unreliable, so `workers: 1` is intentionally scoped to the `contact-list-chromium` project.

This is a Contact List product constraint, not a framework rule. Do not remove it merely to make this demonstration run faster. A different product can choose its own worker policy.

## A pull request did not run browser tests

This is expected.

Pull requests to `master` install dependencies and run TypeScript validation without repository secrets. Secret-backed Playwright E2E tests run only on trusted pushes to `master`.

## The external Contact List application is unavailable

The SUT is an external dependency. Before changing framework code, confirm whether the failure is an automation regression or an environment/application outage.

Do not add sleeps or generic retry wrappers to hide an unavailable system.

## Reading the Playwright report

Open the latest local report with:

```bash
npm run report
```

For CI failures, open the `playwright-report` artifact from the workflow run.

Start with the test title, error, and failed step.

### Screenshot

Screenshots are captured on failure. Use them to see what the browser actually displayed: unexpected page, validation message, missing data, navigation problem, or authentication failure.

### Trace

CI retries failed tests and captures a trace on the first retry. Use the trace to inspect actions, DOM snapshots, network activity, timing, locator behaviour, and console information before changing waits or selectors.

## Still unsure where the fix belongs?

Use this rule:

| Problem | First place to look |
|---|---|
| Wrong scenario expectation | test spec |
| Business flow is wrong | keyword |
| Locator/browser interaction is wrong | page object |
| Request/endpoint/auth header is wrong | API client |
| Generated values are invalid/colliding | factory |
| Credentials/base URL are wrong | product config / environment |
| Object construction is missing | product fixture |
| Project/retry/reporting behaviour is wrong | `playwright.config.ts` |

Fix the narrowest responsible layer and follow an existing nearby example where possible.
