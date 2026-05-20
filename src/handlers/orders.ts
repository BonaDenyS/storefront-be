import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
import verifyToken from '../middleware/verifyToken';

const store = new OrderStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(parseInt(req.params.id));
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, status } = req.body;
    if (!user_id || !status) {
      res.status(400).json({ error: 'user_id and status are required' });
      return;
    }
    const order = await store.create({ user_id, status });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const currentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.currentOrderByUser(parseInt(req.params.userId));
    if (!order) {
      res.status(404).json({ error: 'No active order found' });
      return;
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const completedOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.completedOrdersByUser(parseInt(req.params.userId));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      res.status(400).json({ error: 'product_id and quantity are required' });
      return;
    }
    const result = await store.addProduct(orderId, product_id, quantity);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.delete(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', verifyToken, index);
  app.get('/orders/current/:userId', verifyToken, currentOrder);
  app.get('/orders/completed/:userId', verifyToken, completedOrders);
  app.get('/orders/:id', verifyToken, show);
  app.post('/orders', verifyToken, create);
  app.post('/orders/:id/products', verifyToken, addProduct);
  app.delete('/orders/:id', verifyToken, destroy);
};

export default orderRoutes;
