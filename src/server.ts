import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.get('/', (_req, res) => {
  res.json({ message: 'Storefront Backend API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
