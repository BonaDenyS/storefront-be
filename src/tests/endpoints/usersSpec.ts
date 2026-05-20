import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user';

const request = supertest(app);
const store = new UserStore();

describe('User Endpoints', () => {
  let token: string;
  let userId: number;

  it('POST /users - creates a new user and returns JWT', async () => {
    const res = await request.post('/users').send({
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane.smith@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
    userId = res.body.user.id;
  });

  it('POST /users/authenticate - authenticates a user and returns JWT', async () => {
    const res = await request.post('/users/authenticate').send({
      email: 'jane.smith@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /users/authenticate - returns 401 for wrong credentials', async () => {
    const res = await request.post('/users/authenticate').send({
      email: 'jane.smith@test.com',
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  it('GET /users - returns list of users with valid token', async () => {
    const res = await request.get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('GET /users - returns 401 without token', async () => {
    const res = await request.get('/users');
    expect(res.status).toBe(401);
  });

  it('GET /users/:id - returns correct user with valid token', async () => {
    const res = await request
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toEqual('jane.smith@test.com');
  });

  it('GET /users/:id - returns 401 without token', async () => {
    const res = await request.get(`/users/${userId}`);
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await store.delete(userId);
  });
});
