 # Tasks: Backend security & hardening

## Relevant Files

- `backend/server.ts` - Entry point; configure security middleware (helmet, CORS whitelist, rate limiting), central logger, and global error handler.
- `backend/config/mongoDatabase.ts` - Database connection; validate env vars on startup and replace console logs with structured logger.
- `backend/middleware/authenticateToken.ts` - JWT verification middleware; improve error handling, expiration responses, and avoid direct use of `process.env` inside the function.
- `backend/utils/jwt.ts` - JWT helpers; add try/catch, consistent helpers for signing and verifying access/refresh tokens with configurable expiries.
- `backend/controllers/auth/loginController.ts` - Login flow; shorten access token lifetime, add refresh token handling, remove console logs and add rate-limiting guard.
- `backend/controllers/auth/signupController.ts` - Signup flow; validate inputs, ensure correct Stripe error handling, and shorten token lifetimes.
- `backend/controllers/stripe/webhooks/stripeWebhookController.ts` - Stripe webhook handler; fix Mongo update calls (use $set), add signature verification checks (already present), replace console logs with logger.
- `backend/routes/stripe/webhooks/stripeWebhookRoute.ts` - Uses `express.raw()` correctly; ensure route is mounted before json body parser (server already does this).
- `backend/database/models/Landlord.model.ts` - Mongoose model: add `required`, `select: false` for sensitive fields, indexes for email, and validate schema types (phone as string, etc.).
- `backend/database/models/Tenant.model.ts` - Same hardening as landlord model.
- `backend/routes/auth/authRoutes.ts` - Add validation middleware and wrap controllers with async-handler.
- `package.json` - Add missing runtime/dev dependencies for security & validation (`helmet`, `express-rate-limit`, `express-async-handler`, `zod`/`joi`, `@calphonse/logger`) and update scripts as needed.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `loginController.test.ts` next to `loginController.ts`).
- Use `npx jest [optional/path/to/test/file]` or `npx vitest` according to your test runner configuration to run tests.
- Secrets (DB URI, JWT_SECRET, STRIPE_SECRET) must be read from environment variables. Add a startup validation in `server.ts` or `config/mongoDatabase.ts` to fail-fast with helpful errors and clear messages.

## Tasks

- [ ] 1.0 Harden server security and global middleware
  - [ ] 1.1 Add `helmet()` and a strict Content-Security-Policy in `backend/server.ts`.
  - [ ] 1.2 Replace `app.use(cors())` with a whitelist-based CORS configuration sourced from env (`ALLOWED_ORIGINS`) in `backend/server.ts`.
  - [ ] 1.3 Add `express-rate-limit` and apply stricter limits to auth endpoints in `backend/server.ts` and `backend/routes/auth/authRoutes.ts`.
  - [ ] 1.4 Replace `console.log`/`console.error` usage in `server.ts` and `config/mongoDatabase.ts` with `@calphonse/logger` configured per repo instructions.
  - [ ] 1.5 Add a startup env validation function (required: `MONGO_URI`, `JWT_ACCESS_TOKEN`, `STRIPE_TEST_SECRET_KEY`, `STRIPE_TEST_WEBHOOK_SECRET`) in `backend/server.ts` or `backend/config/mongoDatabase.ts`.

- [ ] 2.0 Strengthen authentication and token lifecycle
  - [ ] 2.1 Shorten access token expiry to a secure default (e.g., 15m) and implement refresh tokens (cookie httpOnly secure) in `backend/controllers/auth/loginController.ts` and `backend/controllers/auth/signupController.ts`.
  - [ ] 2.2 Move JWT signing/verification into `backend/utils/jwt.ts` (create helpers: signAccessToken, signRefreshToken, verifyToken) and use them across middleware and controllers.
  - [ ] 2.3 Harden `authenticateToken.ts`: handle TokenExpiredError (401), JsonWebTokenError(403), and validate presence of secret early; set `req.userId` consistently.
  - [ ] 2.4 Add account lockout or backoff after N failed logins (integrate with rate limiter or a small failure counter in DB / cache).

- [ ] 3.0 Add input validation and sanitize all external inputs
  - [ ] 3.1 Add a validation middleware using `zod` or `joi`. Create schemas for `signup` and `login` requests and attach them in `backend/routes/auth/authRoutes.ts`.
  - [ ] 3.2 Validate and sanitize incoming body fields in other resource routes (invite, properties, settings) — create schemas under `backend/routes/schemas/`.
  - [ ] 3.3 Ensure routes use `express-async-handler` (or a small wrapper) so rejected promises are handled by the global error handler.

- [ ] 4.0 Secure Stripe integration and webhook verification
  - [ ] 4.1 Confirm webhook route uses raw body parsing and is mounted before `express.json()` (already implemented in `backend/server.ts`) — add a unit/integration test to assert this.
  - [ ] 4.2 Fix Mongo update calls in `backend/controllers/stripe/webhooks/stripeWebhookController.ts` to use update operators: e.g., `await Model.updateOne(filter, { $set: { 'subscription.isSubscribed': true } })` to avoid document replacement.
  - [ ] 4.3 Replace `console.log`/`console.error` in webhook handler with structured logger and add alerting/log message levels for unexpected cases.
  - [ ] 4.4 Add idempotency or event deduplication logic (store processed event IDs or use Stripe's recommended approach) to prevent double-processing events.

- [ ] 5.0 Improve logging, error handling, and add tests
  - [ ] 5.1 Add a centralized error handler middleware (logs error with `@calphonse/logger`, returns sanitized message in prod) and wire into `backend/server.ts`.
  - [ ] 5.2 Replace all `console.*` usages in backend files with `@calphonse/logger` configured to enable colors and disable AI flag per repo instructions.
  - [ ] 5.3 Add unit tests for `backend/utils/jwt.ts`, `backend/middleware/authenticateToken.ts`, and `backend/controllers/auth/loginController.ts` (happy path + token expiry + invalid token).
  - [ ] 5.4 Add integration test for Stripe webhook handling (simulate signed event, verify `isSubscribed` flip, assert no document replacement).
  - [ ] 5.5 Add CI job (GitHub Actions) to run lint and tests on PRs.

## File-specific findings & tasks

- `backend/server.ts`
  - Findings: CORS uses `app.use(cors())` with no whitelist. `console.log` used for startup. No `helmet()` or rate-limiting applied. No centralized error handler.
  - Task: Implement 1.1–1.5 above and wire global error handler and logger.

- `backend/config/mongoDatabase.ts`
  - Findings: Uses console logging and immediate process.exit on failure. No connection retry/backoff logic. Env var presence is checked here but logging is console-based.
  - Task: Replace console calls with logger, centralize env checks, optionally add exponential backoff/retry (or document requirement).

- `backend/middleware/authenticateToken.ts`
  - Findings: Directly reads `process.env` inside function, doesn't handle TokenExpiredError specially, returns 400/403/500 in mixed ways. Uses `jwt.verify` and sets `req.userId` from `decoded.userID` but controllers may sign `userID` or `userId` (verify naming consistent).
  - Task: Implement 2.2, 2.3. Use shared `verifyToken` helper, return 401 on expiry, 403 on invalid signature, and use typed `req.userId`.

- `backend/utils/jwt.ts`
  - Findings: `verifyToken` doesn't catch exceptions and will throw. There's duplication of logic between this file and `authenticateToken.ts`.
  - Task: Add safe `verifyToken` with try/catch returning structured result; add `signAccessToken` and `signRefreshToken` helpers.

- `backend/controllers/auth/loginController.ts` & `signupController.ts`
  - Findings: Both issue access tokens with `{ expiresIn: '30d' }` — too long. They use `console.log` on errors. Signup stores Stripe key env var inside controller. No input validation.
  - Task: Implement 2.1 (shorter access tokens + refresh tokens), 3.1 (validation), and replace console logs with logger. Move Stripe key usage to a config helper.

- `backend/controllers/stripe/webhooks/stripeWebhookController.ts`
  - Findings: Correctly verifies signature using Stripe SDK and expects raw body. BUT uses `updateOne(filter, { "subscription.isSubscribed": true })` which will replace the document instead of setting the field. Also uses `console.log` and `console.error`. No deduplication of event processing.
  - Task: Implement 4.2, 4.3, 4.4 above.

- `backend/database/models/*.ts`
  - Findings: Password fields are not marked `select: false`, phoneNumber is Number (consider string), several fields lack `required` flags or validation. Emails are unique but consider indexing and validation at schema level.
  - Task: Add `select:false` to password fields, update phone number to `String` (or validate Number), add required flags to critical fields (email, username), and add indexes where appropriate.

---

If you'd like I can now:

1) Implement the highest-priority fixes (server hardening, helmet + CORS whitelist + logger + global error handler) and open a patch.
2) Implement the critical Stripe webhook fix (replace update calls with $set and add event id dedupe) — low-risk fix we should land quickly.
3) Implement the JWT helper refactor and update `authenticateToken.ts` and controllers to use it.

Choose which to do first (pick 1, 2, or 3) or reply `All` to have me create PR-style patches for each in order of priority.

## PR workflow & naming (required for each parent task)

Each top-level task (1.0 — 5.0) will be implemented in a single, small PR branch so changes are easy to review and revert. Use the following conventions and checks for every PR.

 - Branch naming: use the pattern `pr/{NN}-{short-slug}` where `{NN}` is the two-digit task number.
   - Examples:
     - Task 1.0 -> `pr/01-harden-server`
     - Task 2.0 -> `pr/02-auth-tokens`
     - Task 4.0 -> `pr/04-stripe-webhook`
 - PR title format: use `scope: short description` — e.g. `server: harden security (helmet, CORS, rate-limit)`

### PR body must contain

- Summary of changes
- Files touched
- Acceptance criteria from the task checklist
- How to test locally (commands)
- Rollback plan (one-liner)

Required CI checks before merging:

- Lint & typecheck (npm/yarn scripts: `npm run lint`, `npm run typecheck` or equivalent)
- Unit + integration tests (`npm test` / `npx vitest`) — at least the new/affected tests must pass
- Biome/Markdown/Doc checks if present

Rollback plan (per PR)

- Preferred (safe): Revert the merged PR using GitHub's "Revert" button to automatically create a revert PR.
- Alternative: If the revert must be immediate and you control the repo, run locally:

```pwsh
# revert merge commit (replace <merge-commit> with actual SHA)
git checkout main
git pull origin main
git revert <merge-commit>
git push origin HEAD:pr/revert-<original-branch>
```

- If database migrations or stateful changes are part of the PR, include explicit rollback steps in the PR body (e.g., drop/restore a column, remove a key in Redis). Always test rollback on a staging environment before production.

Per-task PR presets

- Task 1.0 (Harden server)
  - Branch: `pr/01-harden-server`
  - PR title: `server: harden security (helmet, CORS whitelist, rate-limiter, logger)`
  - Quick rollback: revert the merge PR `server: harden security...`

- Task 2.0 (Auth tokens)
  - Branch: `pr/02-auth-tokens`
  - PR title: `auth: implement short-lived access tokens + refresh tokens`
  - Quick rollback: revert the merge PR and invalidate issued refresh tokens by rotating server secret (document in PR).

- Task 3.0 (Validation)
  - Branch: `pr/03-request-validation`
  - PR title: `validation: add request schemas (zod) for auth routes`
  - Quick rollback: revert the merge PR.

- Task 4.0 (Stripe webhook)
  - Branch: `pr/04-stripe-webhook`
  - PR title: `stripe: webhook verification, idempotency, safe DB updates`
  - Quick rollback: revert the merge PR and, if needed, run a one-off script to revert any incorrect DB writes (documented in PR).

- Task 5.0 (Logging & tests)
  - Branch: `pr/05-logging-tests-ci`
  - PR title: `infra: centralized error handler, logger, tests, CI`
  - Quick rollback: revert the merge PR.

If you want, I can start by creating the branch and PR draft for Task 1.0 and implement the code changes there. Which task should I open the PR for first? Reply with the task number (1-5) or `All` to proceed in order.
