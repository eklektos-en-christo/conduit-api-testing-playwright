# Conduit API Test Automation
API test automation for the Conduit (RealWorld) API using Playwright and TypeScript. Covers user auth, articles endpoints with CRUD test coverage. Uses a reusable authentication mechanism to avoid repeating signup/login boilerplate.

## Functionality Tested
- **Auth**
*Signup* — success case with real assertions
*Login* - success case, verified via getAuthToken() helper

## Tech Stack

- Playwright
- TypeScript
- Node.js