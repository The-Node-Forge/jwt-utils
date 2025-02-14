<div align="center">

# JWT Utils

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Documentation](https://the-node-forge.github.io/jwt-utils/)

</div>

**JWT Utils is a lightweight, framework-agnostic Node.js package for generating,
verifying, and managing JSON Web Tokens (JWTs). Designed for security and ease of
use, it provides robust JWT authentication support for Express, Fastify, Koa, and
other frameworks. Ideal for developers building secure APIs and authentication
systems.**

---

## ✨ Features

- ✅ **Generate JWTs** – Create signed JWTs with custom payloads and expiration
  times.
- ✅ **Verify JWTs** – Securely decode and verify tokens.
- ✅ **Support for Access & Refresh Tokens** – Implement token-based authentication
  flows.
- ✅ **Flexible Expiration Times** – Configure short- and long-lived tokens.
- ✅ **Framework-Agnostic** – Works with Express, Fastify, Koa, and more.
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

### **Generating a JWT**

```ts
import { generateToken } from '@the-node-forge/jwt-utils';

const token = generateToken({ id: '12345', role: 'admin' }, '1h');
console.log('Generated Token:', token);
```

### **Verifying a JWT**

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

## 📌 **Configuration Options**

| Parameter   | Type                | Description                                                                |
| ----------- | ------------------- | -------------------------------------------------------------------------- |
| `payload`   | `object`            | The data to include in the JWT payload.                                    |
| `expiresIn` | `string` (optional) | Token expiration time (e.g., `'1h'`, `'30m'`, `'7d'`). Defaults to `'1h'`. |

---

## 🚀 **Integration with Web Frameworks**

### **Express Middleware**

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

### **Fastify Middleware**

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

### **Koa Middleware**

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
