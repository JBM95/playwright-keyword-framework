# Framework Handover

This is the starting point for the automation team inheriting the framework.

The goal is simple: you should be able to run the suite, understand where code belongs, add a test safely, and diagnose a failure without needing the original author.

![Framework architecture](images/architecture.svg)

## How the framework works

```text
UI
Test Spec → Domain Keyword → Page Object → Playwright → Browser

API
Test Spec → API Client → APIRequestContext → REST API
```

The test spec owns scenario intent and final assertions. Keywords express reusable business actions. Page objects own locators and browser mechanics. API clients own HTTP mechanics.

## Where does my code go?

| I need to... | Put it here |
|---|---|
| Describe a behaviour and assert its outcome | `tests/<product>/ui` or `tests/<product>/api` |
| Add a browser interaction or locator | page object |
| Add a reusable business/domain action | keyword |
| Add an HTTP operation | API client |
| Represent product data | model |
| Generate scenario data | typed factory |
| Wire objects into tests | product fixture |
| Change Contact List configuration | product config |
| Change Playwright execution/reporting/projects | `playwright.config.ts` |
| Add another product | new `src/<product>/` and `tests/<product>/` folders |

## Read these when you need them

1. **[Getting started](getting-started.md)** — install, configure credentials, run locally, understand authentication, and know what CI does.
2. **[Adding a test](adding-a-test.md)** — follow the edit-contact scenario end to end, then use the same rules to add pages, keywords, API endpoints, data, environments, or another product.
3. **[Troubleshooting](troubleshooting.md)** — common failures, reports, screenshots, traces, authentication setup, and the Contact List concurrency constraint.
4. **[Framework design](design.md)** — read this when you need the reasoning behind the architecture and deliberate exclusions.

## Repository map

```text
src/contact-list/
├── api/       # HTTP mechanics
├── config/    # Contact List environment/configuration
├── keywords/  # reusable product actions
├── models/    # product data shapes
└── pages/     # locators and browser mechanics

tests/contact-list/
├── api/       # API behaviour specs
├── data/      # typed test-data factories
├── fixtures/  # Contact List test composition
├── setup/     # reusable UI authentication setup
└── ui/        # UI behaviour specs
```

## Rules to follow when unsure

- If it knows about a locator, it belongs in a page object.
- If it describes a meaningful product action, it probably belongs in a keyword.
- If it talks HTTP, it belongs in an API client.
- Assertions that prove the scenario belong in the test spec.
- Use the layer under test for the behaviour being proved; use faster supporting layers for setup and cleanup only when they do not hide that behaviour.
- Tests must own the state they need and must not depend on another test running first.
- Do not add `waitForTimeout()` to solve normal synchronization problems; wait for meaningful application state.
- Do not add an abstraction until you can explain the real maintenance problem it solves.
- If code understands Contact List product behaviour, it is Contact List code, not framework core.

When extending the framework, follow an existing nearby example before inventing a new pattern.
