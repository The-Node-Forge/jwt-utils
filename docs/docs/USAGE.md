---
title: Usage
description: Basic example and configuration.
sidebar_position: 3
---

## Basic Example

### Generating Access and Refresh Tokens

```ts
import { generateTokens } from '@the-node-forge/jwt-utils';

const accessSecret = 'your-access-secret';
const refreshSecret = 'your-refresh-secret';

const { accessToken, refreshToken } = generateTokens(
  { id: '12345', role: 'admin' },
  accessSecret,
  refreshSecret,
);

console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
```

### Verifying a JWT

```ts
import { verifyToken } from '@the-node-forge/jwt-utils';

const token = 'your_jwt_token_here';
const secret = 'your-access-secret';
const decoded = verifyToken(token, secret);

if (decoded) {
  console.log('Token is valid:', decoded);
} else {
  console.log('Invalid or expired token');
}
```

### Verifying a Refresh Token

```ts
import { verifyRefreshToken } from '@the-node-forge/jwt-utils';

const refreshToken = 'your_refresh_jwt_token_here';
const refreshSecret = 'your-refresh-secret';
const decoded = verifyRefreshToken(refreshToken, refreshSecret);

if (decoded) {
  console.log('Refresh token is valid:', decoded);
} else {
  console.log('Invalid or expired refresh token');
}
```

---

## Configuration

JWT expiration can be configured in seconds, minutes, hours, or days:

```json
{
  "accessExpiresIn": "15m",
  "refreshExpiresIn": "7d"
}
```

For detailed API usage, see the [API Reference](./API_REFERENCE.md).
