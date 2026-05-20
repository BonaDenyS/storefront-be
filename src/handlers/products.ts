import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
import verifyToken from '../middleware/verifyToken';

const store = new ProductStore();

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.query.category) {
      const products = await store.byCategory(req.query.category as string);
      res.json(products);
      return;
    }
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await store.show(parseInt(req.params.id));
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, category } = req.body;
    if (!name || price === undefined) {
      res.status(400).json({ error: 'Name and price are required' });
      return;
    }
    const product = await store.create({ name, price, category });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await store.update(parseInt(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await store.delete(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const productRoutes = (app: express.Application): void => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyToken, create);
  app.put('/products/:id', verifyToken, update);
  app.delete('/products/:id', verifyToken, destroy);
};

export default productRoutes;
