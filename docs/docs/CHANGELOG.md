---
title: Changelog
description: A detailed changelog.
sidebar_position: 5
---

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
