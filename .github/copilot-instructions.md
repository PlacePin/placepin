---
description: "Copilot must enforce Node.js, Express, and MongoDB security standards"
applyTo: "**/*.js,.ts"

- read: .github\collections\security-best-practices.collection.yml
---

**Copilot Rules**:

- Always use asyncHandler for routes to prevent unhandled promise rejections.
- Generate route handlers with proper validation, authentication, and error handling.
- Never include plaintext credentials or sensitive constants in code.
- When generating Mongoose schemas, always define field types, required fields, and indexes.
- When generating new routes, ensure HTTP methods match CRUD intent (GET, POST, PUT, DELETE).
- Avoid callback-based async code; use async/await consistently.
- use <https://www.npmjs.com/package/@calphonse/logger> for logging never use Console.log, and enable colors output, disable ai in logger

---

## 1. Content Security Policy (CSP)

**Rules**

1. Disallow inline scripts and styles.
2. Disallow `unsafe-eval` and `unsafe-inline`.
3. Block all external domains by default.
4. Only allow same-origin assets.
5. Deny all `<object>`, `<embed>`, and `<frame>` sources.
6. Deny all `base-uri` and `frame-ancestors`.
7. Require explicit whitelisting for any external domain.
8. Enforce CSP in all environments (dev, staging, prod).
9. Log CSP violations.
10. Never weaken CSP for convenience or debugging.

---

## 2. Cross-Origin Resource Sharing (CORS)

**Rules**

1. Never use wildcard (`*`) origins.
2. Allow only verified, trusted domains.
3. Restrict allowed methods to `GET`, `POST`, `PUT`, `DELETE`.
4. Restrict allowed headers to `Content-Type` and `Authorization`.
5. Allow credentials only over HTTPS.
6. Reject preflight requests from unknown origins.
7. Never expose internal APIs publicly.
8. Keep all CORS configurations centralized.

---

## 3. JWT Authentication

**Rules**

1. All JWTs must be signed and verified.
2. Never store tokens in `localStorage` or JS-accessible memory.
3. Use `httpOnly`, `secure`, `sameSite=strict` cookies.
4. Access tokens expire ≤ 15 minutes.
5. Refresh tokens expire ≤ 7 days.
6. Revoke refresh tokens on logout or reuse.
7. Verify signature and expiration on every request.
8. Never include sensitive data in payloads.
9. Use user IDs, not emails, as claims.
10. Regenerate tokens after privilege or role changes.

---

## 4. Copilot Code Generation Rules

**Rules**

1. Never generate code without human review.
2. Reject code containing `eval`, `Function()`, or dynamic imports.
3. Reject any unvalidated request data.
4. Reject direct database calls in routes (use controllers/services).
5. Reject unscoped MongoDB queries or `$where` operators.
6. Require centralized error handling.
7. Require logging for all failed requests.
8. Require async/await safety (no unhandled promises).
9. Require strict TypeScript types or JSDoc annotations.
10. Forbid hardcoded secrets, tokens, or URLs.
11. Forbid disabling of ESLint, CSP, or security middleware.
12. Require OpenAPI or schema validation for every route.
13. Require environment variables via `.env` (never in code).
14. Forbid public API exposure without authentication.
15. Require code comments explaining critical security choices.

---

## 5. Enforcement

**All Copilot output must be reviewed for:**

- Security (CSP, CORS, JWT compliance)
- Structure (controller/service separation)
- Logging and error coverage
- No data exposure in stack traces

Non-compliant AI-generated code must be **rejected** or **refactored before commit**.

---

**Version:** 1.0
**Maintainer:** ChrisOS
**Last Updated:** 2025-10-27
