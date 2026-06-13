---
title: Changelog
description: A detailed changelog.
sidebar_position: 5
---

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
