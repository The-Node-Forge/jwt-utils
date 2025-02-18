<div align="center">

# JWT Utils

## Lightweight JWT Authentication for Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![NPM Version](https://img.shields.io/npm/v/@the-node-forge/jwt-utils)](https://www.npmjs.com/package/@the-node-forge/jwt-utils)
[![Build Status](https://img.shields.io/github/actions/workflow/status/the-node-forge/jwt-utils/ci.yaml?branch=main)](https://github.com/The-Node-Forge/jwt-utils/actions)

[Live Documentation](https://the-node-forge.github.io/jwt-utils/)

</div>

**A fast, lightweight Node.js JWT library for generating, verifying, and managing
JSON Web Tokens (JWTs). Supports authentication and token-based authorization for
APIs built with Express, Fastify, Koa, Hapi, NestJS, and Next.js. Ideal for securing
web applications, handling user authentication, and implementing role-based access
control (RBAC).**

---

**JWT Utils** is a fast, lightweight, and framework-agnostic Node.js library for
generating, verifying, and managing JSON Web Tokens (JWTs). It simplifies
authentication and token-based authorization for web applications and APIs.

## **🚀 Features**

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
- ✅ Generate and verify **JWTs** easily
- ✅ Support for **Fastify, Koa, and Express** middleware
- ✅ Framework-agnostic core utilities
- ✅ Lightweight and **dependency-free**
- ✅ Built-in **security best practices**

---

## **📦 Installation**

```sh
npm install @the-node-forge/jwt-utils
```

or

```sh
yarn add @the-node-forge/jwt-utils
```

---

## **🔧 Usage**

### **Generating Access & Refresh Tokens**

### **1⃣ Generate a Token**

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
const token = generateToken({ id: 'user123', role: 'admin' });

console.log(token);
```

### **Verifying Tokens**

### **2⃣ Verify a Token**

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
const decoded = verifyToken(token);

if (decoded) { console.log('Token is valid', decoded); } else { console.log('Invalid
token'); }

```

### ** Koa Middleware Example**

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

app.use(globalAuthHandler);

app.use(async (ctx) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized' };
    return;
  }
  ctx.body = { message: 'Protected', user: ctx.state.user };
});

app.listen(3000, () => console.log('Koa server running on port 3000'));
```

### ** Fastify Middleware Example**

```ts
import Fastify from 'fastify';
import authenticateToken from '@the-node-forge/jwt-utils/middleware/fastify';

const app = Fastify();

app.addHook('onRequest', authenticateToken);

app.get('/protected', async (req, reply) => {
  if (!req.user) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  reply.send({ message: 'Protected', user: req.user });
});

app.listen({ port: 3000 }, () => console.log('Fastify server running on port 3000'));
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

## **🔒 Security Best Practices**

- Always use **secure, long, randomly generated** secret keys in production.
- Store **tokens in HTTP-only cookies** instead of local storage when possible.
- Implement **refresh tokens** for long-term authentication.

---

## **🌍 License**

This project is licensed under the **MIT License**.

---

## **🤝 Contributing**

Want to suggest a feature? Open an
**[issue](https://github.com/the-node-forge/jwt-utils/issues)** or **contribute**!

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

---

## **🌟 Support & Links**

- **NPM Package**:
  [@the-node-forge/jwt-utils](https://www.npmjs.com/package/@the-node-forge/jwt-utils)
- **GitHub Repo**:
  [The Node Forge / JWT Utils](https://github.com/the-node-forge/jwt-utils)
- **Issues & Feature Requests**:
  [Open an Issue](https://github.com/the-node-forge/jwt-utils/issues)
