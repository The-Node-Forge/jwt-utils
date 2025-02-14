---
title: API Reference
description: API parameters, returns, examples.
sidebar_position: 4
---

## `generateToken(payload, expiresIn)`

Generates a signed JWT with a custom payload and optional expiration time.

### **Parameters:**

| Parameter   | Type                | Description                                                                |
| ----------- | ------------------- | -------------------------------------------------------------------------- |
| `payload`   | `object`            | The data to include in the JWT payload.                                    |
| `expiresIn` | `string` (optional) | Token expiration time (e.g., `'1h'`, `'30m'`, `'7d'`). Defaults to `'1h'`. |

### **Returns:**

- `string` – The generated JWT token.

### **Examples:**

```ts
import { generateToken } from '@the-node-forge/jwt-utils';

const token = generateToken({ id: '12345', role: 'admin' }, '1h');
console.log('Generated Token:', token);
```

---

## `verifyToken(token)`

Verifies and decodes a JWT, returning the payload if valid.

### **Parameters:**

| Parameter | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `token`   | `string` | The JWT to verify and decode. |

### **Returns:**

- `object | null` – The decoded payload if valid, otherwise `null`.

### **Examples:**

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

## `authenticateToken(req, res, next)` (Express Middleware)

Middleware function to authenticate JWTs in Express.js applications.

### **Usage:**

```ts
import express from 'express';
import { authenticateToken } from '@the-node-forge/jwt-utils/middleware/express';

const app = express();
app.use(authenticateToken);

app.get('/protected', (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## `authenticateToken(req, reply, done)` (Fastify Middleware)

Middleware function to authenticate JWTs in Fastify applications.

### **Usage:**

```ts
import Fastify from 'fastify';
import { authenticateToken } from '@the-node-forge/jwt-utils/middleware/fastify';

const app = Fastify();
app.addHook('onRequest', authenticateToken);

app.get('/protected', async (req, reply) => {
  return { message: 'Protected route', user: req.user };
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## `globalAuthHandler(ctx, next)` (Koa Middleware)

Middleware function to authenticate JWTs in Koa applications.

### **Usage:**

```ts
import Koa from 'koa';
import { globalAuthHandler } from '@the-node-forge/jwt-utils/middleware/koa';

const app = new Koa();
app.use(globalAuthHandler);

app.use(async (ctx) => {
  if (ctx.path === '/protected') {
    ctx.body = { message: 'Protected route', user: ctx.state.user };
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
