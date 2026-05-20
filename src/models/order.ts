import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: 'active' | 'complete';
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type OrderWithProducts = Order & {
  products: Array<{ product_id: number; quantity: number; name: string; price: number }>;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Order> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async create(o: Order): Promise<Order> {
    const conn = await client.connect();
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.user_id, o.status]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async currentOrderByUser(userId: number): Promise<OrderWithProducts | null> {
    const conn = await client.connect();
    try {
      const orderSql =
        'SELECT * FROM orders WHERE user_id=($1) AND status=($2) ORDER BY id DESC LIMIT 1';
      const orderResult = await conn.query(orderSql, [userId, 'active']);
      if (!orderResult.rows.length) return null;

      const order = orderResult.rows[0];
      const productsSql = `
        SELECT op.product_id, op.quantity, p.name, p.price
        FROM order_products op
        JOIN products p ON op.product_id = p.id
        WHERE op.order_id=($1)
      `;
      const productsResult = await conn.query(productsSql, [order.id]);
      return { ...order, products: productsResult.rows };
    } finally {
      conn.release();
    }
  }

  async completedOrdersByUser(userId: number): Promise<Order[]> {
    const conn = await client.connect();
    try {
      const sql =
        'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [userId, 'complete']);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async addProduct(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderProduct> {
    const conn = await client.connect();
    try {
      const checkSql = 'SELECT status FROM orders WHERE id=($1)';
      const checkResult = await conn.query(checkSql, [orderId]);
      if (!checkResult.rows.length) {
        throw new Error(`Order ${orderId} not found`);
      }
      if (checkResult.rows[0].status !== 'active') {
        throw new Error(`Cannot add product to a completed order`);
      }

      const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [orderId, productId, quantity]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async delete(id: number): Promise<Order> {
    const conn = await client.connect();
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }
}
