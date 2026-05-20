import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async create(p: Product): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category || null]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async update(id: number, p: Partial<Product>): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql =
        'UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category || null, id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async delete(id: number): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async byCategory(category: string): Promise<Product[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const result = await conn.query(sql, [category]);
      return result.rows;
    } finally {
      conn.release();
    }
  }
}
