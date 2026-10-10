# Code quality and tests

Use Node.js 24 and run `npm ci`. Husky installs the local Git hooks automatically. Hosting and CI installs skip hook installation.

## Before committing

Run `npm run check` to check ESLint (zero warnings), Prettier, TypeScript, and the isolated API unit tests, including endpoint failover. Run `npm run format` to apply formatting, or `npm run lint:fix` for automatic lint fixes.

The pre-commit hook runs lint-staged first, then the full `check` command. It formats staged files and stops the commit when a check fails. No database credentials or running server are needed for these unit tests. The production build and browser tests run separately because they need the configured app environment.

## Before deploying

1. Configure `.env.local` following [POSTGRES_SETUP.md](POSTGRES_SETUP.md). Use a dedicated test database when available.
2. Run `npm run db:check`.
3. Run `npm run check` and `npm run build`.
4. Run `npm run test:e2e`. Playwright starts the production build on port 3002 and sets its auth origin to that port. Keep port 3002 free.

Browser coverage includes mobile/tablet/desktop layouts, home anchor navigation, Bengali price sorting and refresh, unknown routes, protected-route redirects, failed and interrupted logins, signup, password login, profile updates, session persistence, product details, logout, and Google/GitHub callback generation.

The auth browser test creates one uniquely named disposable account and deletes that exact email in its cleanup. It does not complete interactive Google or GitHub consent, which must be checked manually with your own provider account. Traces and screenshots are disabled to keep login credentials out of test artifacts.

On Windows, the tests use installed Chrome when available. Elsewhere, install the test browser with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to your Chrome executable.

## Dependency audit

The current dependency audit reports a high-severity `braces <=3.0.3` stack-exhaustion advisory through Next.js's ESLint tooling. At setup time, the registry's latest braces version is 3.0.3, so there is no patched release to install. These packages are development-only; `npm audit --omit=dev` checks production dependencies separately. Do not use the suggested forced ESLint-config downgrade, which mismatches this project's Next.js 16 configuration. Recheck `npm audit` when a compatible fix becomes available.
