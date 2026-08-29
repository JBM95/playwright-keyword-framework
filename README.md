# Playwright Keyword Framework

This repository is the foundation for a TypeScript and Playwright Test automation framework for the Thinking Tester Contact List application. It will use a TypeScript business/domain keyword layer called from Playwright test specs; it does not use Cucumber, Gherkin, external keyword files, or a custom keyword interpreter.

## Prerequisites

- Node.js 20 LTS or later
- npm

## Installation

```bash
npm install
npx playwright install chromium
```

## Running tests

```bash
npm test              # all tests
npm run test:e2e      # E2E tests only
npm run test:headed   # run with a visible browser
npm run test:ui       # open Playwright UI mode
npm run report        # open the latest HTML report
```

## Architecture

```text
src/
  framework/
    config/
      environment.ts
  contact-list/
    pages/
      login.page.ts
    keywords/
      auth.keywords.ts
tests/
  contact-list/
    ui/
      authentication.spec.ts
```

The test spec calls business/domain keywords, which use page objects to interact with Playwright.

The Contact List base URL is read from `CONTACT_LIST_BASE_URL` when set. Otherwise, the default is `https://thinking-tester-contact-list.herokuapp.com/`. Page objects use relative paths through Playwright's `baseURL`.
