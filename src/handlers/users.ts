import express, { Request, Response } from 'express';
import { UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyToken from '../middleware/verifyToken';

dotenv.config();

const store = new UserStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(parseInt(req.params.id));
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    const user = await store.create({ firstname, lastname, email, password });
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await store.authenticate(email, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    res.json({ user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.update(parseInt(req.params.id), req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.delete(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyToken, index);
  app.get('/users/:id', verifyToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.put('/users/:id', verifyToken, update);
  app.delete('/users/:id', verifyToken, destroy);
};

export default userRoutes;
