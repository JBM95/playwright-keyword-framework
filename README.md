# Playwright Keyword Framework

[![Playwright](https://github.com/JBM95/playwright-keyword-framework/actions/workflows/playwright.yml/badge.svg?branch=master)](https://github.com/JBM95/playwright-keyword-framework/actions/workflows/playwright.yml)

A **keyword-driven Playwright and TypeScript automation framework, demonstrated against the Thinking Tester Contact List application**.

The repository is designed as a small, portable automation foundation that can be handed over to junior automation testers. The Contact List application is the demonstration consumer: product-specific pages, keywords, API clients, configuration, fixtures, and tests are isolated under `src/contact-list/` and `tests/contact-list/` rather than treated as universal framework behaviour.

## What it demonstrates

- Playwright Test with TypeScript.
- Keyword-driven UI automation without Cucumber/Gherkin or a custom keyword interpreter.
- Page Object Model with a deliberate locator policy.
- Real UI registration, valid login, invalid login, and contact create/edit/delete journeys.
- Authenticated REST API CRUD against persisted Contact List data.
- Typed scenario-owned test-data factories and practical API-assisted setup/cleanup.
- Reusable UI authentication state for non-login tests, while authentication scenarios explicitly start signed out.
- Product-scoped configuration and concurrency constraints so another product can be added alongside Contact List.
- GitHub Actions CI with secret-backed trusted-branch E2E execution and a published Playwright HTML report.

## Architecture

```text
UI
Test Spec → Domain Keywords → Page Objects → Playwright → Browser / Application

API
Test Spec → Domain API Client → APIRequestContext → Persisted REST API

Configuration
playwright.config.ts → Product Projects → Product Config → Environment / Secrets
```

`playwright.config.ts` is the composition root. Generic execution concerns such as retries, reporting, screenshots, traces, and CI safeguards remain global. Contact List concerns such as `baseURL`, storage state, setup dependency, test discovery, and `workers: 1` are scoped to the Contact List Playwright projects.

`workers: 1` is a Contact List demonstration constraint caused by the shared external test account; it is not a framework-wide concurrency rule.

## Documentation

**New to the framework? Start with the [handover guide](docs/README.md).** It links to the short guides for getting started, adding a test, and troubleshooting.

For the technical reasoning behind the architecture, portability seam, locator policy, authentication strategy, CI security model, and deliberate exclusions, see [`docs/design.md`](docs/design.md). The editable architecture source is [`docs/architecture.drawio`](docs/architecture.drawio).

## Repository structure

```text
src/
└── contact-list/
    ├── api/
    ├── config/
    ├── keywords/
    ├── models/
    └── pages/

tests/
└── contact-list/
    ├── api/
    ├── data/
    ├── fixtures/
    ├── setup/
    └── ui/

docs/
├── README.md
├── getting-started.md
├── adding-a-test.md
├── troubleshooting.md
├── architecture.drawio
├── design.md
└── images/
    └── architecture.svg
```

## Prerequisites

- Node.js 24 recommended to match CI.
- npm.

## Installation

Clone the repository, then install the locked dependencies and Chromium:

```bash
npm ci
npx playwright install chromium
```

On Linux environments that also need browser system dependencies:

```bash
npx playwright install --with-deps chromium
```

## Environment setup

Create a local `.env` file from `.env.example` and provide the dedicated Contact List automation account:

```text
CONTACT_LIST_TEST_USER_EMAIL=
CONTACT_LIST_TEST_USER_PASSWORD=
```

An optional product URL override is also supported:

```text
CONTACT_LIST_BASE_URL=https://thinking-tester-contact-list.herokuapp.com/
```

If `CONTACT_LIST_BASE_URL` is not set, the Thinking Tester Contact List URL is used by default.

Never commit `.env`, bearer tokens, or generated browser authentication state. The setup project writes authenticated browser state to `playwright/.auth/user.json`; that directory is ignored by Git.

## Running tests

```bash
npm test                      # full Contact List suite
npm run test:contact-list:ui  # Contact List UI specs
npm run typecheck             # TypeScript validation
npm run lint                  # ESLint code-quality rules
npm run lint:fix              # fix ESLint issues where safe
npm run format                # apply Prettier formatting
npm run format:check          # check Prettier formatting
npm run test:headed           # run with a visible browser
npm run test:ui               # Playwright UI mode
npm run report                # open the latest HTML report
```

TypeScript provides type safety, ESLint checks code quality, and Prettier keeps formatting consistent.

The current suite covers:

- UI registration, valid login, and invalid login;
- UI contact create, edit, and delete behaviour;
- API contact create/read, update, and delete behaviour;
- API rejection of unauthenticated requests and of invalid contact data;
- UI authentication setup used by non-login browser tests.

## Authentication

Authentication is intentionally separated into three concerns:

1. Authentication behaviour tests use the browser and explicitly start with empty storage state.
2. `contact-list-setup` logs in through the real UI and saves runtime-only storage state for non-login UI scenarios.
3. API clients authenticate independently through the REST login endpoint and use bearer tokens only at runtime.

This prevents shared setup from replacing the actual login tests and avoids coupling API authentication to browser state.

## CI and reporting

GitHub Actions runs on pushes and pull requests targeting `master`.

- Pull requests run dependency installation, type checking, linting, and format checking without repository secrets.
- Trusted pushes to `master` additionally install Chromium, run the full Playwright suite, and upload the HTML report.
- Contact List credentials are supplied through GitHub Actions Secrets only to the Playwright test step.
- GitHub Actions are pinned to immutable commit SHAs, repository token permissions are read-only, checkout credentials are not persisted, and the job has a 20-minute timeout.
- Playwright uses the built-in HTML reporter, screenshot-on-failure, trace-on-first-retry, and CI retries.

Verified CI evidence:

- [Green GitHub Actions run #5](https://github.com/JBM95/playwright-keyword-framework/actions/runs/33308629603)
- [Playwright HTML report artifact](https://github.com/JBM95/playwright-keyword-framework/actions/runs/33308629603/artifacts/9731281164)

## Extending the framework

A new product should be added alongside Contact List, for example:

```text
src/new-product/
tests/new-product/
```

The new product owns its own configuration, models, pages, keywords, API clients, fixtures, data, tests, authentication strategy, and Playwright project settings. Existing Contact List implementation should not need to change.

Shared framework code should be extracted only when two or more real products duplicate the same product-agnostic capability and extraction clearly reduces maintenance or onboarding cost.

See the [handover guide](docs/README.md) for practical extension guidance and [`docs/design.md`](docs/design.md) for the detailed design rationale.
