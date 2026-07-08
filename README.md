# Conduit API Test Automation
API test automation for the Conduit (RealWorld) API using Playwright and TypeScript. Covers user auth, articles endpoints with CRUD test coverage. Uses a reusable authentication mechanism to avoid repeating signup/login boilerplate.

## Functionality Tested
- **Signup** — success case
- **Login** - success case
- **Articles** - create, get, update, and delete, create without auth and token

## Tech Stack

- Playwright
- TypeScript
- Node.js

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run a specific file:
```bash
npx playwright test api-tests/auth.spec.ts
```