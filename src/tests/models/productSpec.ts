import { ProductStore } from '../../models/product';

const store = new ProductStore();

describe('Product Model', () => {
  let createdProductId: number;

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Test Widget',
      price: 9.99,
      category: 'Electronics',
    });
    createdProductId = result.id as number;
    expect(result.name).toEqual('Test Widget');
    expect(parseFloat(result.price as unknown as string)).toBeCloseTo(9.99);
    expect(result.category).toEqual('Electronics');
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(createdProductId);
    expect(result.id).toEqual(createdProductId);
    expect(result.name).toEqual('Test Widget');
  });

  it('byCategory method should filter by category', async () => {
    const result = await store.byCategory('Electronics');
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => expect(p.category).toEqual('Electronics'));
  });

  it('update method should modify the product', async () => {
    const result = await store.update(createdProductId, {
      name: 'Updated Widget',
      price: 14.99,
      category: 'Electronics',
    });
    expect(result.name).toEqual('Updated Widget');
  });

  it('delete method should remove the product', async () => {
    const result = await store.delete(createdProductId);
    expect(result.id).toEqual(createdProductId);
  });
});
