<div align="center">

# JWT Utils

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Documentation](https://the-node-forge.github.io/jwt-utils/)

</div>

**A fast, lightweight Node.js JWT library for generating, verifying, and managing
JSON Web Tokens (JWTs). Supports authentication and token-based authorization for
APIs built with Express, Fastify, Koa, Hapi, NestJS, and Next.js. Ideal for securing
web applications, handling user authentication, and implementing role-based access
control (RBAC).**

---

## ✨ Features

- ✅ **Generate JWTs** – Create signed JWTs with custom payloads and expiration
  times.
- ✅ **Verify JWTs** – Securely decode and verify tokens.
- ✅ **Access & Refresh Tokens** – Implement authentication with refresh token
  support.
- ✅ **Framework-Agnostic Middleware** – Works with Express, Fastify, Koa, Hapi,
  NestJS, and Next.js.
- ✅ **RBAC Middleware** – Control access based on user roles.
- ✅ **TypeScript Support** – Fully typed for safer development.
- ✅ **Lightweight & Secure** – Uses `jsonwebtoken` with best security practices.

---

## 📚 Installation

```sh
npm install @the-node-forge/jwt-utils
```

or using Yarn:

```sh
yarn add @the-node-forge/jwt-utils
```

---

## 🎯 **Basic Usage**

### **Generating Access & Refresh Tokens**

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
```

### **Verifying Tokens**

```ts
import { verifyToken, verifyRefreshToken } from '@the-node-forge/jwt-utils';

const decodedAccess = verifyToken(accessToken, accessSecret);
const decodedRefresh = verifyRefreshToken(refreshToken, refreshSecret);

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
const accessSecret = 'your-access-secret';
const refreshSecret = 'your-refresh-secret';

app.use(authenticateToken(accessSecret));

app.get('/protected', (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

app.get('/refresh', authenticateRefreshToken(refreshSecret), (req, res) => {
  res.json({ message: 'Refresh Token Valid', user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Fastify Middleware**

```ts
import Fastify from 'fastify';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/fastify';

const app = Fastify();
const accessSecret = 'your-access-secret';
const refreshSecret = 'your-refresh-secret';

app.addHook('onRequest', authenticateToken(accessSecret));
app.get('/protected', async (req, reply) => {
  return { message: 'Protected route', user: req.user };
});

app.addHook('onRequest', authenticateRefreshToken(refreshSecret));
app.get('/refresh', async (req, reply) => {
  return { message: 'Refresh Token Valid', user: req.user };
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Koa Middleware**

```ts
import Koa from 'koa';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/koa';

const app = new Koa();
const accessSecret = 'your-access-secret';
const refreshSecret = 'your-refresh-secret';

app.use(authenticateToken(accessSecret));
app.use(authenticateRefreshToken(refreshSecret));

app.use(async (ctx) => {
  if (ctx.path === '/protected') {
    ctx.body = { message: 'Protected route', user: ctx.state.user };
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Hapi Middleware**

```ts
import Hapi from '@hapi/hapi';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '@the-node-forge/jwt-utils/middleware/hapi';

const server = Hapi.server();
const accessSecret = 'your-access-secret';
const refreshSecret = 'your-refresh-secret';

server.route({
  method: 'GET',
  path: '/protected',
  options: { pre: [{ method: authenticateToken(accessSecret) }] },
  handler: (request, h) => {
    return { message: 'Protected route', user: request.app.user };
  },
});

server.start().then(() => console.log('Server running on port 3000'));
```

---

## 🛡 **Role-Based Access Control (RBAC)**

```ts
import { authorizeRoles } from '@the-node-forge/jwt-utils/middleware/rbac';

app.get('/admin', authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin', user: req.user });
});
```

---

## 👑 **Contributing**

Contributions are welcome! Please submit
[issues](https://github.com/The-Node-Forge/jwt-utils/issues) or
[pull requests](https://github.com/The-Node-Forge/jwt-utils/pulls).

---

### ⭐ Support

If you find this package useful, please **give it a ⭐ on**
[GitHub](https://github.com/The-Node-Forge/jwt-utils 'GitHub Repository')

---

### 🔗 **Links**

- 📚 [NPM Package](https://www.npmjs.com/package/@the-node-forge/jwt-utils)
- 🏠 [The Node Forge](https://github.com/The-Node-Forge)
