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
  { id: 'user123', role: 'admin' },
  accessSecret,
  refreshSecret,
);
console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
const token = generateTokens({ id: 'user123', role: 'admin' });

console.log(token);
```

### ** Generate a Token (custom options)**

```ts
const { accessToken, refreshToken } = generateTokens(
  { id: 'user123', role: 'admin' },
  accessSecret,
  refreshSecret,
  {
    accessExpiresIn: '1h', // Custom access token expiry
    refreshExpiresIn: '7d', // Custom refresh token expiry
    algorithm: 'HS512', // Stronger algorithm
    audience: 'my-app',
    issuer: 'my-auth-service',
  },
);

console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
```

### Verifying a JWT

```ts
import { verifyToken, verifyRefreshToken } from '@the-node-forge/jwt-utils';

// no options
const decodedAccess = verifyToken(accessToken, accessSecret);
const decodedRefresh = verifyRefreshToken(refreshToken, refreshSecret);

// custom options
const decodedAccess = verifyToken(accessToken, accessSecret, {
  audience: 'my-app',
  issuer: 'auth-service',
});

const decodedRefresh = verifyRefreshToken(refreshToken, refreshSecret, {
  audience: 'my-app',
  issuer: 'auth-service',
});

console.log('Decoded Access Token:', decodedAccess);
console.log('Decoded Refresh Token:', decodedRefresh);
```

### Verifying a Refresh Token

```ts
import { verifyRefreshToken } from '@the-node-forge/jwt-utils';

const refreshToken = 'your_refresh_jwt_token_here';
const refreshSecret = 'your-refresh-secret';

// no options
const decoded = verifyRefreshToken(refreshToken, refreshSecret);

// custom options
const decoded = verifyRefreshToken(refreshToken, refreshSecret, {
  audience: 'my-app',
  issuer: 'auth-service',
});

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
  "refreshExpiresIn": "1d"
}
```

For detailed API usage, see the [API Reference](./API_REFERENCE.md).
