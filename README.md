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
npm run test:api      # API tests only
npm run test:headed   # run with a visible browser
npm run test:ui       # open Playwright UI mode
npm run report        # open the latest HTML report
```

## Intended architecture

```text
tests/
  e2e/        Browser test specifications
  api/        API test specifications
src/
  pages/      Page Objects (to be added)
  keywords/   Business/domain keyword layer (to be added)
  api/        API clients (to be added)
  fixtures/   Shared Playwright fixtures
  data/       Test data
  models/     TypeScript domain models
  utils/      Shared utilities
```

The Playwright configuration supplies the Contact List application through `baseURL`, so tests and future Page Objects can use relative paths rather than duplicating the URL.
