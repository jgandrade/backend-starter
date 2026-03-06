import { sql } from '../config/database.js';
import { randomUUID } from 'crypto';

export async function findByEmail(email) {
  const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows[0] ?? null;
}

export async function findById(id) {
  const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function create({ email, passwordHashed, role = 'Viewer', createdAt }) {
  const id = randomUUID();
  await sql`
    INSERT INTO users (id, email, "passwordHashed", role, "createdAt")
    VALUES (${id}, ${email}, ${passwordHashed}, ${role}, ${createdAt})
  `;
  return await findById(id);
}
