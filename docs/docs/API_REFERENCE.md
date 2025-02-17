---
title: API Reference
description: API parameters, returns, examples.
sidebar_position: 4
---

## `generateTokens(payload, accessSecret, refreshSecret)`

Generates a signed access and refresh token with a custom payload and required
secrets.

### **Parameters:**

| Parameter       | Type     | Description                                |
| --------------- | -------- | ------------------------------------------ |
| `payload`       | `object` | The data to include in the JWT payload.    |
| `accessSecret`  | `string` | Secret key used to sign the access token.  |
| `refreshSecret` | `string` | Secret key used to sign the refresh token. |

### **Returns:**

- `object` – An object containing `accessToken` and `refreshToken`.

### **Examples:**

```ts
import { generateTokens } from '@the-node-forge/jwt-utils';

const { accessToken, refreshToken } = generateTokens(
  { id: '12345', role: 'admin' },
  'your-access-secret',
  'your-refresh-secret',
);
console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
```

---

## `verifyToken(token, secret)`

Verifies and decodes an access JWT, returning the payload if valid.

### **Parameters:**

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `token`   | `string` | The JWT to verify and decode.        |
| `secret`  | `string` | The secret key used to sign the JWT. |

### **Returns:**

- `object | null` – The decoded payload if valid, otherwise `null`.

### **Examples:**

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

---

## `verifyRefreshToken(token, secret)`

Verifies and decodes a refresh JWT, returning the payload if valid.

### **Parameters:**

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `token`   | `string` | The refresh JWT to verify.                   |
| `secret`  | `string` | The secret key used to sign the refresh JWT. |

### **Returns:**

- `object | null` – The decoded payload if valid, otherwise `null`.

### **Examples:**

```ts
import { verifyRefreshToken } from '@the-node-forge/jwt-utils';

const refreshToken = 'your_refresh_jwt_token_here';
const secret = 'your-refresh-secret';
const decoded = verifyRefreshToken(refreshToken, secret);

if (decoded) {
  console.log('Refresh token is valid:', decoded);
} else {
  console.log('Invalid or expired refresh token');
}
```

---

## Middleware Functions

### Express Middleware: `authenticateToken(accessSecret)`

Middleware function to authenticate JWTs in Express.js applications.

### **Usage:**

```ts
import express from 'express';
import { authenticateToken } from '@the-node-forge/jwt-utils/middleware/express';

const app = express();
app.use(authenticateToken('your-access-secret'));

app.get('/protected', (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Fastify Middleware: `authenticateToken(accessSecret)`

Middleware function to authenticate JWTs in Fastify applications.

### **Usage:**

```ts
import Fastify from 'fastify';
import { authenticateToken } from '@the-node-forge/jwt-utils/middleware/fastify';

const app = Fastify();
app.addHook('onRequest', authenticateToken('your-access-secret'));

app.get('/protected', async (req, reply) => {
  return { message: 'Protected route', user: req.user };
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Koa Middleware: `authenticateToken(accessSecret)`

Middleware function to authenticate JWTs in Koa applications.

### **Usage:**

```ts
import Koa from 'koa';
import { authenticateToken } from '@the-node-forge/jwt-utils/middleware/koa';

const app = new Koa();
app.use(authenticateToken('your-access-secret'));

app.use(async (ctx) => {
  if (ctx.path === '/protected') {
    ctx.body = { message: 'Protected route', user: ctx.state.user };
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Role-Based Access Control (RBAC)

### `authorizeRoles(...allowedRoles)` (Express Middleware)

Middleware function to restrict access based on user roles.

### **Usage:**

```ts
import express from 'express';
import { authorizeRoles } from '@the-node-forge/jwt-utils/middleware/rbac';

const app = express();

app.get('/admin', authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin Access Granted', user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
