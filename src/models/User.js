import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function findById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function create({ email, passwordHashed, role = 'Viewer', createdAt }) {
  const id = randomUUID();
  db.prepare(
    'INSERT INTO users (id, email, passwordHashed, role, createdAt) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, passwordHashed, role, createdAt);
  return findById(id);
}
