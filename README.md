<div align="center">

# JWT Utils – Lightweight JWT Authentication for Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![NPM Version](https://img.shields.io/npm/v/@the-node-forge/jwt-utils)](https://www.npmjs.com/package/@the-node-forge/jwt-utils)
[![Build Status](https://img.shields.io/github/actions/workflow/status/the-node-forge/jwt-utils/ci.yaml?branch=main)](https://github.com/The-Node-Forge/jwt-utils/actions)

[Live Documentation](https://the-node-forge.github.io/jwt-utils/)

</div>

**JWT Utils** is a fast, lightweight, and framework-agnostic Node.js library for
generating, verifying, and managing JSON Web Tokens (JWTs). It simplifies
authentication and token-based authorization for web applications and APIs.

## **🚀 Features**

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

### **1⃣ Generate a Token**

```ts
import { generateToken } from '@the-node-forge/jwt-utils';

const token = generateToken({ id: 'user123', role: 'admin' });

console.log(token);
```

### **2⃣ Verify a Token**

```ts
import { verifyToken } from '@the-node-forge/jwt-utils';

const decoded = verifyToken(token);

if (decoded) {
  console.log('Token is valid', decoded);
} else {
  console.log('Invalid token');
}
```

### **3⃣ Koa Middleware Example**

```ts
import Koa from 'koa';
import { globalAuthHandler } from '@the-node-forge/jwt-utils/middleware/koa';

const app = new Koa();

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

### **4⃣ Fastify Middleware Example**

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

---

## **🔒 Security Best Practices**

- Always use **secure, long, randomly generated** secret keys in production.
- Store **tokens in HTTP-only cookies** instead of local storage when possible.
- Implement **refresh tokens** for long-term authentication.

---

## **🛠️ Roadmap & Future Features**

📌 **Planned Updates:**

- ✅ Add support for **Express.js middleware**
- 🔜 Role-based access control (RBAC) middleware
- 🔜 Refresh token implementation

Want to suggest a feature? Open an
**[issue](https://github.com/the-node-forge/jwt-utils/issues)** or **contribute**!

---

## **🌍 License**

This project is licensed under the **MIT License**.

---

## **🤝 Contributing**

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
