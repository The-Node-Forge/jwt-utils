"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4008],{9334:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>i,contentTitle:()=>c,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"API_REFERENCE","title":"API Reference","description":"API parameters, returns, examples.","source":"@site/docs/API_REFERENCE.md","sourceDirName":".","slug":"/API_REFERENCE","permalink":"/jwt-utils/docs/API_REFERENCE","draft":false,"unlisted":false,"editUrl":"https://github.com/The-Node-Forge/jwt-utils/tree/main/docs/docs/API_REFERENCE.md","tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"title":"API Reference","description":"API parameters, returns, examples.","sidebar_position":4},"sidebar":"tutorialSidebar","previous":{"title":"Usage","permalink":"/jwt-utils/docs/USAGE"},"next":{"title":"Changelog","permalink":"/jwt-utils/docs/CHANGELOG"}}');var t=s(4848),o=s(8453);const a={title:"API Reference",description:"API parameters, returns, examples.",sidebar_position:4},c=void 0,i={},d=[{value:"<code>generateTokens(payload, accessSecret, refreshSecret)</code>",id:"generatetokenspayload-accesssecret-refreshsecret",level:2},{value:"<strong>Parameters:</strong>",id:"parameters",level:3},{value:"<strong>Returns:</strong>",id:"returns",level:3},{value:"<strong>Examples:</strong>",id:"examples",level:3},{value:"<strong>1\u20e3 Generate a Token (no options)</strong>",id:"1\u20e3-generate-a-token-no-options",level:3},{value:"** Generate a Token (custom options)**",id:"-generate-a-token-custom-options",level:3},{value:"<strong>Verifying Tokens</strong>",id:"verifying-tokens",level:3},{value:"<strong>2\u20e3 Verify a Token</strong>",id:"2\u20e3-verify-a-token",level:3},{value:"\ud83d\ude80 <strong>Integration with Web Frameworks</strong>",id:"-integration-with-web-frameworks",level:2},{value:"<strong>Express Middleware</strong>",id:"express-middleware",level:3},{value:"<strong>Fastify Middleware</strong>",id:"fastify-middleware",level:3},{value:"<strong>Koa Middleware</strong>",id:"koa-middleware",level:3},{value:"<strong>Hapi Middleware</strong>",id:"hapi-middleware",level:3},{value:"\ud83d\udee1 <strong>Role-Based Access Control (RBAC) using express</strong>",id:"-role-based-access-control-rbac-using-express",level:2}];function l(e){const n={code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"generatetokenspayload-accesssecret-refreshsecret",children:(0,t.jsx)(n.code,{children:"generateTokens(payload, accessSecret, refreshSecret)"})}),"\n",(0,t.jsx)(n.p,{children:"Generates a signed access and refresh token with a custom payload and required\nsecrets."}),"\n",(0,t.jsx)(n.h3,{id:"parameters",children:(0,t.jsx)(n.strong,{children:"Parameters:"})}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Parameter"}),(0,t.jsx)(n.th,{children:"Type"}),(0,t.jsx)(n.th,{children:"Description"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"payload"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"object"})}),(0,t.jsx)(n.td,{children:"The data to include in the JWT payload."})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"accessSecret"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"string"})}),(0,t.jsx)(n.td,{children:"Secret key used to sign the access token."})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"refreshSecret"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"string"})}),(0,t.jsx)(n.td,{children:"Secret key used to sign the refresh token."})]})]})]}),"\n",(0,t.jsx)(n.h3,{id:"returns",children:(0,t.jsx)(n.strong,{children:"Returns:"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"object"})," \u2013 An object containing ",(0,t.jsx)(n.code,{children:"accessToken"})," and ",(0,t.jsx)(n.code,{children:"refreshToken"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"examples",children:(0,t.jsx)(n.strong,{children:"Examples:"})}),"\n",(0,t.jsx)(n.h3,{id:"1\u20e3-generate-a-token-no-options",children:(0,t.jsx)(n.strong,{children:"1\u20e3 Generate a Token (no options)"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import { generateTokens } from '@the-node-forge/jwt-utils';\n\nconst accessSecret = 'your-access-secret';\nconst refreshSecret = 'your-refresh-secret';\n\nconst { accessToken, refreshToken } = generateTokens(\n  { id: 'user123', role: 'admin' },\n  accessSecret,\n  refreshSecret,\n);\nconsole.log('Access Token:', accessToken);\nconsole.log('Refresh Token:', refreshToken);\nconst token = generateTokens({ id: 'user123', role: 'admin' });\n\nconsole.log(token);\n"})}),"\n",(0,t.jsx)(n.h3,{id:"-generate-a-token-custom-options",children:"** Generate a Token (custom options)**"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const { accessToken, refreshToken } = generateTokens(\n  { id: 'user123', role: 'admin' },\n  accessSecret,\n  refreshSecret,\n  {\n    accessExpiresIn: '1h', // Custom access token expiry\n    refreshExpiresIn: '7d', // Custom refresh token expiry\n    algorithm: 'HS512', // Stronger algorithm\n    audience: 'my-app',\n    issuer: 'my-auth-service',\n  },\n);\n\nconsole.log('Access Token:', accessToken);\nconsole.log('Refresh Token:', refreshToken);\n"})}),"\n",(0,t.jsx)(n.h3,{id:"verifying-tokens",children:(0,t.jsx)(n.strong,{children:"Verifying Tokens"})}),"\n",(0,t.jsx)(n.h3,{id:"2\u20e3-verify-a-token",children:(0,t.jsx)(n.strong,{children:"2\u20e3 Verify a Token"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import { verifyToken, verifyRefreshToken } from '@the-node-forge/jwt-utils';\n\n// no options\nconst decodedAccess = verifyToken(accessToken, accessSecret);\nconst decodedRefresh = verifyRefreshToken(refreshToken, refreshSecret);\n\n// custom options\nconst decodedAccess = verifyToken(accessToken, accessSecret, {\n  audience: 'my-app',\n  issuer: 'auth-service',\n});\n\nconst decodedRefresh = verifyRefreshToken(refreshToken, refreshSecret, {\n  audience: 'my-app',\n  issuer: 'auth-service',\n});\n\nconsole.log('Decoded Access Token:', decodedAccess);\nconsole.log('Decoded Refresh Token:', decodedRefresh);\n"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsxs)(n.h2,{id:"-integration-with-web-frameworks",children:["\ud83d\ude80 ",(0,t.jsx)(n.strong,{children:"Integration with Web Frameworks"})]}),"\n",(0,t.jsx)(n.h3,{id:"express-middleware",children:(0,t.jsx)(n.strong,{children:"Express Middleware"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import express from 'express';\nimport {\n  authenticateToken,\n  authenticateRefreshToken,\n} from '@the-node-forge/jwt-utils/middleware/express';\n\nconst app = express();\napp.use(express.json());\n\nconst ACCESS_SECRET = 'your-access-secret';\nconst REFRESH_SECRET = 'your-refresh-secret';\n\nconst user = {\n  id: '123',\n  role: 'admin',\n};\n\n// Generate tokens\napp.post('/login', (req, res) => {\n  const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);\n  res.json(tokens);\n});\n\n// Protected route\napp.get('/protected', authenticateToken(ACCESS_SECRET), (req, res) => {\n  res.json({ message: 'Access granted', user: req.user });\n});\n\n// Refresh token route\napp.post('/refresh', authenticateRefreshToken(REFRESH_SECRET), (req, res) => {\n  const { exp, iat, ...userData } = req.user; // token returns exp, iat, id and role. You only want to pass in the users data for a refresh token\n\n  const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);\n  res.json(newTokens);\n});\n"})}),"\n",(0,t.jsx)(n.h3,{id:"fastify-middleware",children:(0,t.jsx)(n.strong,{children:"Fastify Middleware"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import Fastify from 'fastify';\nimport {\n  authenticateToken,\n  authenticateRefreshToken,\n} from '@the-node-forge/jwt-utils/middleware/fastify';\nimport { generateTokens } from '@the-node-forge/jwt-utils';\n\nconst app = Fastify();\n\nconst ACCESS_SECRET = 'your-access-secret';\nconst REFRESH_SECRET = 'your-refresh-secret';\n\nconst user = {\n  id: '123',\n  role: 'admin',\n};\n\n// Generate tokens\napp.post('/login', async (req, reply) => {\n  const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);\n  reply.send(tokens);\n});\n\n// Protected route\napp.get(\n  '/protected',\n  { preHandler: authenticateToken(ACCESS_SECRET) },\n  async (req, reply) => {\n    reply.send({ message: 'Access granted', user: req.user });\n  },\n);\n\n// Refresh token route\napp.post(\n  '/refresh',\n  { preHandler: authenticateRefreshToken(REFRESH_SECRET) },\n  async (req, reply) => {\n    const { exp, iat, ...userData } = req.user; // Strip exp & iat before regenerating tokens\n\n    const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);\n    reply.send(newTokens);\n  },\n);\n"})}),"\n",(0,t.jsx)(n.h3,{id:"koa-middleware",children:(0,t.jsx)(n.strong,{children:"Koa Middleware"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import Koa from 'koa';\nimport Router from '@koa/router';\nimport bodyParser from 'koa-bodyparser';\nimport {\n  authenticateToken,\n  authenticateRefreshToken,\n} from '@the-node-forge/jwt-utils/middleware/koa';\nimport { generateTokens } from '@the-node-forge/jwt-utils';\n\nconst app = new Koa();\nconst router = new Router();\n\nconst ACCESS_SECRET = 'your-access-secret';\nconst REFRESH_SECRET = 'your-refresh-secret';\n\nconst user = {\n  id: '123',\n  role: 'admin',\n};\n\napp.use(bodyParser()); // Parse JSON body\n\n// Generate tokens\nrouter.post('/login', async (ctx) => {\n  const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);\n  ctx.body = tokens;\n});\n\n// Protected route\nrouter.get('/protected', authenticateToken(ACCESS_SECRET), async (ctx) => {\n  ctx.body = { message: 'Access granted', user: ctx.state.user };\n});\n\n// Refresh token route\nrouter.post('/refresh', authenticateRefreshToken(REFRESH_SECRET), async (ctx) => {\n  const { exp, iat, ...userData } = ctx.state.user; // Strip exp & iat before regenerating tokens\n\n  const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);\n  ctx.body = newTokens;\n});\n"})}),"\n",(0,t.jsx)(n.h3,{id:"hapi-middleware",children:(0,t.jsx)(n.strong,{children:"Hapi Middleware"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import Hapi from '@hapi/hapi';\nimport {\n  authenticateToken,\n  authenticateRefreshToken,\n} from '@the-node-forge/jwt-utils/middleware/hapi';\nimport { generateTokens } from '@the-node-forge/jwt-utils';\n\nconst server = Hapi.server({\n  port: 3000,\n  host: 'localhost',\n});\n\nconst ACCESS_SECRET = 'your-access-secret';\nconst REFRESH_SECRET = 'your-refresh-secret';\n\nconst user = {\n  id: '123',\n  role: 'admin',\n};\n\n// Generate tokens\nserver.route({\n  method: 'POST',\n  path: '/login',\n  handler: (request, h) => {\n    const tokens = generateTokens(user, ACCESS_SECRET, REFRESH_SECRET);\n    return h.response(tokens).code(200);\n  },\n});\n\n// Protected route\nserver.route({\n  method: 'GET',\n  path: '/protected',\n  options: { pre: [{ method: authenticateToken(ACCESS_SECRET) }] },\n  handler: (request, h) => {\n    return h.response({ message: 'Access granted', user: request.app.user });\n  },\n});\n\n// Refresh token route\nserver.route({\n  method: 'POST',\n  path: '/refresh',\n  options: { pre: [{ method: authenticateRefreshToken(REFRESH_SECRET) }] },\n  handler: (request, h) => {\n    const { exp, iat, ...userData } = request.app.user; // Strip exp & iat before regenerating tokens\n\n    const newTokens = generateTokens(userData, ACCESS_SECRET, REFRESH_SECRET);\n    return h.response(newTokens).code(200);\n  },\n});\n\n// Start server\nconst start = async () => {\n  await server.start();\n  console.log('Server running on http://localhost:3000');\n};\n\nstart();\n"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsxs)(n.h2,{id:"-role-based-access-control-rbac-using-express",children:["\ud83d\udee1 ",(0,t.jsx)(n.strong,{children:"Role-Based Access Control (RBAC) using express"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import express from 'express';\nimport { authenticateToken } from '@the-node-forge/jwt-utils/middleware/express';\nimport { authorizeRoles } from '@the-node-forge/jwt-utils/middleware/rbac';\n\nconst app = express();\nconst ACCESS_SECRET = 'your-access-secret';\n\n// Admin route (requires authentication + admin role)\napp.get(\n  '/admin',\n  authenticateToken(ACCESS_SECRET), // Ensure user is authenticated\n  authorizeRoles('admin'), // Ensure user has the 'admin' role\n  (req, res) => {\n    res.json({ message: 'Welcome Admin', user: req.user });\n  },\n);\n"})}),"\n",(0,t.jsx)(n.hr,{})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>c});var r=s(6540);const t={},o=r.createContext(t);function a(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);