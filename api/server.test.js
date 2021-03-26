const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

const andy = {
  username: 'andy',
  password: '1234'
}

const ana = {
  username: 'ana',
  password: '1234',
};

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

describe('Server Tests', () => {
  it('Check Environment', () => {
    expect(process.env.NODE_ENV).toBe('testing');
  });
  it('API status code', async () => {
    const statusCode = 200;
    const res = await request(server).get('/');
    expect(res.status).toBe(statusCode);
  });
});

describe('API Endpoints', () => {

  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('users').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('testing /register', () => {
    it('shows 201 on successful user creation', async () => {
      const res = await request(server).post('/api/auth/register').send(andy);
      expect(res.status).toBe(201);
    });
    it('responds with new user', async () => {
      const res = await request(server).post('/api/auth/register').send(ana);
      expect(res.body.username).toBe(ana.username);
    });
  });

  describe('testing /login', () => {
    it('responds with 200 on successful login', async () => {
      await request(server).post('/api/auth/register').send(andy);
      const res = await request(server).post('/api/auth/login').send(andy);
      expect(res.status).toBe(200);
    });
    it('shows successful login message', async () => {
      await request(server).post('/api/auth/register').send(ana);
      const res = await request(server).post('/api/auth/login').send(ana);
      expect(res.body.message).toContain('welcome, ana');
    });
  });

  describe('testing /jokes', () => {
    it('recieves 200 on successful response', async () => {
      await request(server).post('/api/auth/register').send(andy);
      let res = await request(server).post('/api/auth/login').send(andy);
      const userToken = res.body.token;
      res = await request(server)
        .get('/api/jokes')
        .set({ Authorization: userToken });
      expect(res.status).toBe(200);
    });
    it('receives 401 with invalid token', async () => {
      const userToken = 666;
      const res = await request(server)
        .get('/api/jokes')
        .set({ Authorization: userToken });
      expect(res.status).toBe(401);
    });
  });
});