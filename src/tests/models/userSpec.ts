import { UserStore, User } from '../../models/user';

const store = new UserStore();

describe('User Model', () => {
  let createdUserId: number;

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@test.com',
      password: 'password123',
    });
    createdUserId = result.id as number;
    expect(result.firstname).toEqual('John');
    expect(result.lastname).toEqual('Doe');
    expect(result.email).toEqual('john.doe@test.com');
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(createdUserId);
    expect(result.id).toEqual(createdUserId);
    expect(result.firstname).toEqual('John');
  });

  it('authenticate method should return the user with correct credentials', async () => {
    const result = await store.authenticate('john.doe@test.com', 'password123');
    expect(result).not.toBeNull();
    expect(result?.email).toEqual('john.doe@test.com');
  });

  it('authenticate method should return null with wrong password', async () => {
    const result = await store.authenticate('john.doe@test.com', 'wrongpassword');
    expect(result).toBeNull();
  });

  it('delete method should remove the user', async () => {
    const result = await store.delete(createdUserId);
    expect(result.id).toEqual(createdUserId);
  });
});
