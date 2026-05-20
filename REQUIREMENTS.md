# Storefront Backend — Requirements

## API Routes

### Users

| Method | Route                  | Auth Required | Description                     |
|--------|------------------------|---------------|---------------------------------|
| GET    | /users                 | Yes (JWT)     | List all users                  |
| GET    | /users/:id             | Yes (JWT)     | Get a specific user             |
| POST   | /users                 | No            | Create a new user (returns JWT) |
| POST   | /users/authenticate    | No            | Authenticate and receive JWT    |
| PUT    | /users/:id             | Yes (JWT)     | Update a user                   |
| DELETE | /users/:id             | Yes (JWT)     | Delete a user                   |

### Products

| Method | Route            | Auth Required | Description                        |
|--------|------------------|---------------|------------------------------------|
| GET    | /products        | No            | List all products (filter by ?category=) |
| GET    | /products/:id    | No            | Get a specific product             |
| POST   | /products        | Yes (JWT)     | Create a new product               |
| PUT    | /products/:id    | Yes (JWT)     | Update a product                   |
| DELETE | /products/:id    | Yes (JWT)     | Delete a product                   |

### Orders

| Method | Route                        | Auth Required | Description                           |
|--------|------------------------------|---------------|---------------------------------------|
| GET    | /orders                      | Yes (JWT)     | List all orders                       |
| GET    | /orders/:id                  | Yes (JWT)     | Get a specific order                  |
| POST   | /orders                      | Yes (JWT)     | Create a new order                    |
| GET    | /orders/current/:userId      | Yes (JWT)     | Get active order for a user           |
| GET    | /orders/completed/:userId    | Yes (JWT)     | Get completed orders for a user       |
| POST   | /orders/:id/products         | Yes (JWT)     | Add a product to an order             |
| DELETE | /orders/:id                  | Yes (JWT)     | Delete an order                       |

---

## Database Schema

### users

| Column    | Type         | Constraints              |
|-----------|--------------|--------------------------|
| id        | SERIAL       | PRIMARY KEY              |
| firstname | VARCHAR(100) | NOT NULL                 |
| lastname  | VARCHAR(100) | NOT NULL                 |
| email     | VARCHAR(100) | UNIQUE, NOT NULL         |
| password  | VARCHAR(200) | NOT NULL (bcrypt hashed) |

### products

| Column   | Type          | Constraints |
|----------|---------------|-------------|
| id       | SERIAL        | PRIMARY KEY |
| name     | VARCHAR(100)  | NOT NULL    |
| price    | DECIMAL(10,2) | NOT NULL    |
| category | VARCHAR(100)  |             |

### orders

| Column  | Type                         | Constraints                              |
|---------|------------------------------|------------------------------------------|
| id      | SERIAL                       | PRIMARY KEY                              |
| user_id | INTEGER                      | NOT NULL, REFERENCES users(id)           |
| status  | VARCHAR(10)                  | NOT NULL, CHECK IN ('active', 'complete')|

### order_products

| Column     | Type    | Constraints                         |
|------------|---------|-------------------------------------|
| id         | SERIAL  | PRIMARY KEY                         |
| order_id   | INTEGER | NOT NULL, REFERENCES orders(id)     |
| product_id | INTEGER | NOT NULL, REFERENCES products(id)   |
| quantity   | INTEGER | NOT NULL, CHECK (quantity > 0)      |
