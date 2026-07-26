# Test Suite

Simple tests for each type. All login-focused where possible.

| Type | Tool | What it checks |
|------|------|----------------|
| **Unit** | Java / JUnit | Login email + password validation |
| **Integration** | Java / RestAssured | Register user, then login |
| **API** | Postman (+ Newman CLI) | `POST /register` then `POST /login` |
| **E2E** | Java / Selenium | Login page loads in browser |
| **E2E** | Playwright / TypeScript | Same login page check |

## Structure

```
tests/
├── java/                         # Unit, integration, Selenium E2E
├── api/postman/                  # Postman collection + environment
└── e2e/playwright/               # Playwright specs (TS/JS migration)
```

## Setup

```bash
cd tests
cp .env.example .env
npm install
npx playwright install chromium
```

## Run

Start the app first:

```bash
cd backend && npm start
cd frontend && npm run dev
```

Then:

```bash
npm run test:unit           # no server needed
npm run test:integration    # needs backend
npm run test:api            # needs backend (Postman via Newman)
npm run test:selenium       # needs frontend + Chrome
npm run test:playwright     # needs frontend
npm test                    # all of the above
```

### Postman GUI

Import `api/postman/Inventory-API.postman_collection.json` and `local.postman_environment.json`, then run the folder.

## URLs

| Variable | Default |
|----------|---------|
| `BASE_URL` | `http://localhost:5000` |
| `FRONTEND_URL` | `http://localhost:5173` |
