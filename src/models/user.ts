import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, firstname, lastname, email FROM users';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, firstname, lastname, email FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async create(u: User): Promise<User> {
    const conn = await client.connect();
    try {
      const sql =
        'INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING id, firstname, lastname, email';
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
      const result = await conn.query(sql, [u.firstname, u.lastname, u.email, hash]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE email=($1)';
      const result = await conn.query(sql, [email]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
          return user;
        }
      }
      return null;
    } finally {
      conn.release();
    }
  }

  async update(id: number, u: Partial<User>): Promise<User> {
    const conn = await client.connect();
    try {
      const sql =
        'UPDATE users SET firstname=($1), lastname=($2), email=($3) WHERE id=($4) RETURNING id, firstname, lastname, email';
      const result = await conn.query(sql, [u.firstname, u.lastname, u.email, id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async delete(id: number): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING id, firstname, lastname, email';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }
}
