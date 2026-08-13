const request = require('supertest');
const app = require('../server');
describe('Auth', () => {
  it('registers a user', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'Test', email: 't@example.com', password: '123456' });
    expect([200,302]).toContain(res.statusCode);
  }, 10000);
});
