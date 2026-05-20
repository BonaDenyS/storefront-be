# Storefront Backend

A RESTful API for a shopping application built with Node.js, Express, TypeScript, and PostgreSQL.

## Ports

- **Backend API**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_TEST_DB=storefront_test
ENV=dev
BCRYPT_PASSWORD=your-secret-password
SALT_ROUNDS=10
TOKEN_SECRET=your-jwt-secret-token
```

## Setup & Installation

### 1. Install dependencies

```bash
yarn install
```

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This creates:
- `storefront_db` — development database
- `storefront_test` — test database (via `init-db.sql`)

### 3. Run database migrations

```bash
yarn migrate:up
```

### 4. Start the development server

```bash
yarn watch
```

The server will start on **port 3000** and restart automatically on code changes.

## Running Tests

```bash
yarn test
```

Tests use `storefront_test` database. Migrations are applied automatically before tests run.

## API Overview

See [REQUIREMENTS.md](REQUIREMENTS.md) for the full list of endpoints and database schema.

### Authentication

- `POST /users` — creates a user and returns a JWT
- `POST /users/authenticate` — authenticate with email/password, returns JWT

Include the token in protected requests:

```
Authorization: Bearer <token>
```

## Scripts

| Command            | Description                             |
|--------------------|-----------------------------------------|
| `yarn watch`       | Start dev server with auto-reload       |
| `yarn build`       | Compile TypeScript                      |
| `yarn test`        | Run test suite                          |
| `yarn migrate:up`  | Apply all pending migrations            |
| `yarn migrate:down`| Roll back the last migration            |
| `yarn migrate:reset`| Roll back all migrations               |
