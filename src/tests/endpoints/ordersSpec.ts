import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Endpoints', () => {
  let token: string;
  let testUserId: number;
  let testProductId: number;
  let orderId: number;

  beforeAll(async () => {
    const user = await userStore.create({
      firstname: 'Order',
      lastname: 'EndpointTester',
      email: 'order.endpoint@test.com',
      password: 'password123',
    });
    testUserId = user.id as number;
    token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);

    const product = await productStore.create({
      name: 'Order EP Product',
      price: 9.99,
      category: 'Test',
    });
    testProductId = product.id as number;
  });

  afterAll(async () => {
    await userStore.delete(testUserId);
    await productStore.delete(testProductId);
  });

  it('POST /orders - creates an order with valid token', async () => {
    const res = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: testUserId, status: 'active' });
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual('active');
    orderId = res.body.id;
  });

  it('POST /orders - returns 401 without token', async () => {
    const res = await request
      .post('/orders')
      .send({ user_id: testUserId, status: 'active' });
    expect(res.status).toBe(401);
  });

  it('GET /orders - returns list of orders with valid token', async () => {
    const res = await request.get('/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('GET /orders/:id - returns correct order with valid token', async () => {
    const res = await request
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(orderId);
  });

  it('POST /orders/:id/products - adds a product to order', async () => {
    const res = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: testProductId, quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.order_id).toEqual(orderId);
    expect(res.body.quantity).toEqual(3);
  });

  it('GET /orders/current/:userId - returns active order for user', async () => {
    const res = await request
      .get(`/orders/current/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual('active');
  });

  it('GET /orders/completed/:userId - returns completed orders for user', async () => {
    const res = await request
      .get(`/orders/completed/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('DELETE /orders/:id - deletes an order with valid token', async () => {
    const res = await request
      .delete(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(orderId);
  });
});
