---
title: Changelog
description: A detailed changelog.
sidebar_position: 5
---

### Unreleased

#### Security Fixes

- **Koa Middleware:** `authenticateToken` and `authenticateRefreshToken` no longer
  silently skip authentication for every path except a hardcoded `/protected` and
  `/refresh`. Previously, mounting the middleware on any other route (e.g. `/admin`)
  or a trailing-slash variant (`/protected/`) let unauthenticated requests through.
  The middleware now authenticates every request it handles. **Behavior change:** if
  you relied on `app.use(authenticateToken(...))` letting other paths through, mount
  it per route instead (see the Koa example in the README).
- **NestJS Guard:** The guard no longer picks refresh-token verification when the
  request URL merely contains `/refresh` (e.g. `/admin?next=/refresh`), which let a
  refresh token authenticate against access-guarded routes. Token type is now
  explicit: `new AuthenticateToken(accessSecret, refreshSecret, true)` accepts
  refresh tokens (for refresh routes), the default accepts access tokens only.
  **Behavior change:** refresh routes must now pass `true` as the third argument.
- **Core:** `generateTokens` now throws if `accessSecret` and `refreshSecret` are
  identical, since a refresh token would otherwise also verify as an access token.
- **Core:** `generateTokens` only accepts `HS256`, `HS384` or `HS512` for
  `options.algorithm` (previously any `jsonwebtoken` algorithm, including `none`, was
  passed through), and `verifyToken` / `verifyRefreshToken` pin `algorithms` to the
  same set instead of relying on library defaults. **Behavior change:** callers
  passing a non-HMAC algorithm or identical secrets now get an error at token
  generation time.

### v1.1.1 - 2026-06-12

#### Security Fixes

- **Fastify:** Updated from `v4.29.1` to `v5.8.5` to address multiple security
  vulnerabilities:
  - Fixed DoS via unbounded memory allocation in sendWebStream (Low severity)
  - Fixed Content-Type header tab character validation bypass (High severity -
    CVE-2026-25223)
  - Fixed request.protocol and request.host spoofing via X-Forwarded headers
    (Moderate severity - CVE-2026-3635)
  - **Reference:**
    [Fastify Security Advisories](https://github.com/fastify/fastify/security/advisories)

- **fast-uri:** Resolved path traversal and host confusion vulnerabilities in
  transitive dependencies:
  - Fixed path traversal via percent-encoded dot segments (High severity -
    CVE-2026-6321)
  - Fixed host confusion via percent-encoded authority delimiters (High severity)
  - **Reference:**
    [fast-uri Security Advisories](https://github.com/fastify/fast-uri/security/advisories)

- **Next.js:** Updated from `v15.1.7` to `v16.2.9` for latest security patches

#### Bug Fixes

- **Hapi Middleware:** Fixed TypeScript compatibility issue with `authorization`
  header type (`string | string[]`)
- **NestJS Middleware:** Fixed constructor parameters not being properly referenced
  in `canActivate` method
- **TypeScript:** Added `isolatedModules: true` to `tsconfig.json` for better module
  compatibility
- **Documentation:** Updated typedoc from `v0.27.6` to `v0.28.0` for compatibility

#### Improvements

- Updated ESLint configuration to ignore underscore-prefixed unused parameters
- Improved test configuration with better ts-jest setup
- All 74 tests passing

### v1.0.0 - 2025-03-07

- Initial release

### v1.0.1 - 2025-05-30

- **Security:** Patched a schema validation bypass vulnerability in Fastify by
  upgrading from `v4.29.0` to `v4.29.1`.
  - **Issue:** Non-standard `Content-Type` headers (e.g., `Application/Json`,
    `application/json;`) could bypass validation when using `schema.body.content`.
  - **Resolution:** Validation is now enforced with normalized `Content-Type` headers
    after upgrading Fastify.
  - **CVE:** _Pending Assignment_
  - **Reference:**
    [fastify/fastify GitHub Release v4.29.1](https://github.com/fastify/fastify/releases/tag/v4.29.1)
