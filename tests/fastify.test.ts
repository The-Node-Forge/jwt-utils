// import Fastify from 'fastify';
// import request from 'supertest';
// import { generateToken } from '../src/jwt';
// import authenticateToken from '../src/middleware/fastify';

// const app = Fastify();
// app.register(authenticateToken);

// app.get('/protected', async (req, reply) => {
//   if (!(req as any).user) return reply.status(401).send({ message: 'Unauthorized' });
//   return { message: 'Protected', user: (req as any).user };
// });

// beforeAll(async () => {
//   await app.ready(); // ✅ Ensures Fastify initializes before tests
// });

// afterAll(async () => {
//   await app.close(); // ✅ Clean up after tests
// });

// describe('Fastify Middleware: authenticateToken', () => {
//   let token: string;

//   beforeAll(() => {
//     token = generateToken({ id: 'test-user', role: 'admin' });
//   });

//   test('✅ Allows access with valid token', async () => {
//     const response = await request(app.server)
//       .get('/protected')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body.user.id).toBe('test-user');
//   });

//   test('❌ Rejects access with missing token', async () => {
//     const response = await request(app.server).get('/protected');
//     expect(response.status).toBe(401);
//   });

//   test('❌ Rejects access with invalid token', async () => {
//     const response = await request(app.server)
//       .get('/protected')
//       .set('Authorization', 'Bearer invalid_token');

//     expect(response.status).toBe(403);
//   });
// });
