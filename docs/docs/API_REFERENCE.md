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

### **1⃣ Generate a Token (no options)**

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

### **Verifying Tokens**

### **2⃣ Verify a Token**

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

---

## 🚀 **Integration with Web Frameworks**

### **Express Middleware**

```ts
import express from 'express';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/express';

const app = express();
app.use(express.json());

const ACCESS_SECRET = 'your-access-secret';
const REFRESH_SECRET = 'your-refresh-secret';

const user = {
  id: '123',
  role: 'admin',
};

// Generate tokens
app.post('/login', (req, res) => {
  const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);
  res.json(tokens);
});

// Protected route
app.get('/protected', authenticateToken(ACCESS_SECRET), (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

// Refresh token route
app.post('/refresh', authenticateRefreshToken(REFRESH_SECRET), (req, res) => {
  const { exp, iat, ...userData } = req.user; // token returns exp, iat, id and role. You only want to pass in the users data for a refresh token

  const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);
  res.json(newTokens);
});
```

### **Fastify Middleware**

```ts
import Fastify from 'fastify';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/fastify';
import { generateTokens } from '@the-node-forge/jwt-utils';

const app = Fastify();

const ACCESS_SECRET = 'your-access-secret';
const REFRESH_SECRET = 'your-refresh-secret';

const user = {
  id: '123',
  role: 'admin',
};

// Generate tokens
app.post('/login', async (req, reply) => {
  const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);
  reply.send(tokens);
});

// Protected route
app.get(
  '/protected',
  { preHandler: authenticateToken(ACCESS_SECRET) },
  async (req, reply) => {
    reply.send({ message: 'Access granted', user: req.user });
  },
);

// Refresh token route
app.post(
  '/refresh',
  { preHandler: authenticateRefreshToken(REFRESH_SECRET) },
  async (req, reply) => {
    const { exp, iat, ...userData } = req.user; // Strip exp & iat before regenerating tokens

    const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);
    reply.send(newTokens);
  },
);
```

### **Koa Middleware**

```ts
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/koa';
import { generateTokens } from '@the-node-forge/jwt-utils';

const app = new Koa();
const router = new Router();

const ACCESS_SECRET = 'your-access-secret';
const REFRESH_SECRET = 'your-refresh-secret';

const user = {
  id: '123',
  role: 'admin',
};

app.use(bodyParser()); // Parse JSON body

// Generate tokens
router.post('/login', async (ctx) => {
  const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);
  ctx.body = tokens;
});

// Protected route
router.get('/protected', authenticateToken(ACCESS_SECRET), async (ctx) => {
  ctx.body = { message: 'Access granted', user: ctx.state.user };
});

// Refresh token route
router.post('/refresh', authenticateRefreshToken(REFRESH_SECRET), async (ctx) => {
  const { exp, iat, ...userData } = ctx.state.user; // Strip exp & iat before regenerating tokens

  const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);
  ctx.body = newTokens;
});
```

### **Hapi Middleware**

```ts
import Hapi from '@hapi/hapi';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/hapi';
import { generateTokens } from '@the-node-forge/jwt-utils';

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

const ACCESS_SECRET = 'your-access-secret';
const REFRESH_SECRET = 'your-refresh-secret';

const user = {
  id: '123',
  role: 'admin',
};

// Generate tokens
server.route({
  method: 'POST',
  path: '/login',
  handler: (request, h) => {
    const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);
    return h.response(tokens).code(200);
  },
});

// Protected route
server.route({
  method: 'GET',
  path: '/protected',
  options: { pre: [{ method: authenticateToken(ACCESS_SECRET) }] },
  handler: (request, h) => {
    return h.response({ message: 'Access granted', user: request.app.user });
  },
});

// Refresh token route
server.route({
  method: 'POST',
  path: '/refresh',
  options: { pre: [{ method: authenticateRefreshToken(REFRESH_SECRET) }] },
  handler: (request, h) => {
    const { exp, iat, ...userData } = request.app.user; // Strip exp & iat before regenerating tokens

    const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);
    return h.response(newTokens).code(200);
  },
});

// Start server
const start = async () => {
  await server.start();
  console.log('Server running on http://localhost:3000');
};

start();
```

---

## 🛡 **Role-Based Access Control (RBAC) using express**

```ts
import express from 'express';
import { authenticateToken } from '@the-node-forge/jwt-utils/middleware/express';
import { authorizeRoles } from '@the-node-forge/jwt-utils/middleware/rbac';

const app = express();
const ACCESS_SECRET = 'your-access-secret';

// Admin route (requires authentication + admin role)
app.get(
  '/admin',
  authenticateToken(ACCESS_SECRET), // Ensure user is authenticated
  authorizeRoles('admin'), // Ensure user has the 'admin' role
  (req, res) => {
    res.json({ message: 'Welcome Admin', user: req.user });
  },
);
```

---
