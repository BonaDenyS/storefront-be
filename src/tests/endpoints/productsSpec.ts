import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const request = supertest(app);
const userStore = new UserStore();

describe('Product Endpoints', () => {
  let token: string;
  let productId: number;
  let testUserId: number;

  beforeAll(async () => {
    const user = await userStore.create({
      firstname: 'Product',
      lastname: 'Tester',
      email: 'product.tester@test.com',
      password: 'password123',
    });
    testUserId = user.id as number;
    token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
  });

  afterAll(async () => {
    await userStore.delete(testUserId);
  });

  it('GET /products - returns list of products (no auth required)', async () => {
    const res = await request.get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('POST /products - creates a product with valid token', async () => {
    const res = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Endpoint Widget', price: 29.99, category: 'Gadgets' });
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('Endpoint Widget');
    productId = res.body.id;
  });

  it('POST /products - returns 401 without token', async () => {
    const res = await request
      .post('/products')
      .send({ name: 'Unauthorized Widget', price: 5.0 });
    expect(res.status).toBe(401);
  });

  it('GET /products/:id - returns correct product', async () => {
    const res = await request.get(`/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(productId);
    expect(res.body.name).toEqual('Endpoint Widget');
  });

  it('GET /products?category=Gadgets - filters by category', async () => {
    const res = await request.get('/products?category=Gadgets');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    res.body.forEach((p: { category: string }) =>
      expect(p.category).toEqual('Gadgets')
    );
  });

  it('PUT /products/:id - updates a product with valid token', async () => {
    const res = await request
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Endpoint Widget', price: 39.99, category: 'Gadgets' });
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('Updated Endpoint Widget');
  });

  it('DELETE /products/:id - deletes a product with valid token', async () => {
    const res = await request
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(productId);
  });
});
