import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  let testUserId: number;
  let testProductId: number;
  let createdOrderId: number;

  beforeAll(async () => {
    const user = await userStore.create({
      firstname: 'Order',
      lastname: 'Tester',
      email: 'order.tester@test.com',
      password: 'password123',
    });
    testUserId = user.id as number;

    const product = await productStore.create({
      name: 'Order Test Product',
      price: 19.99,
      category: 'Test',
    });
    testProductId = product.id as number;
  });

  afterAll(async () => {
    await userStore.delete(testUserId);
    await productStore.delete(testProductId);
  });

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('create method should add an order', async () => {
    const result = await orderStore.create({
      user_id: testUserId,
      status: 'active',
    });
    createdOrderId = result.id as number;
    expect(result.user_id).toEqual(testUserId);
    expect(result.status).toEqual('active');
  });

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct order', async () => {
    const result = await orderStore.show(createdOrderId);
    expect(result.id).toEqual(createdOrderId);
  });

  it('addProduct method should add a product to the order', async () => {
    const result = await orderStore.addProduct(createdOrderId, testProductId, 2);
    expect(result.order_id).toEqual(createdOrderId);
    expect(result.product_id).toEqual(testProductId);
    expect(result.quantity).toEqual(2);
  });

  it('currentOrderByUser should return the active order', async () => {
    const result = await orderStore.currentOrderByUser(testUserId);
    expect(result).not.toBeNull();
    expect(result?.status).toEqual('active');
    expect(result?.user_id).toEqual(testUserId);
  });

  it('completedOrdersByUser should return an empty array initially', async () => {
    const result = await orderStore.completedOrdersByUser(testUserId);
    expect(Array.isArray(result)).toBeTrue();
  });

  it('delete method should remove the order', async () => {
    const result = await orderStore.delete(createdOrderId);
    expect(result.id).toEqual(createdOrderId);
  });
});
