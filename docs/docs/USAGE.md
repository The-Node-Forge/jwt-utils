---
title: Usage
description: Basic example and config.
sidebar_position: 3
---

## Basic Example

### Generating a JWT

```ts
import { generateToken } from '@the-node-forge/jwt-utils';

const token = generateToken({ id: '12345', role: 'admin' }, '1h');
console.log('Generated Token:', token);
```

### Verifying a JWT

```ts
import { verifyToken } from '@the-node-forge/jwt-utils';

const token = 'your_jwt_token_here';
const decoded = verifyToken(token);

if (decoded) {
  console.log('Token is valid:', decoded);
} else {
  console.log('Invalid or expired token');
}
```

---

## Configuration

```json
{
  "expiresIn": "1h"
}
```

For API details, see [API Reference](./API_REFERENCE.md).
