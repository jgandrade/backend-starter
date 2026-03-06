import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export function findAll() {
  return db.prepare('SELECT * FROM invoices').all();
}

export function findById(id) {
  return db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
}

export function count() {
  return db.prepare('SELECT COUNT(*) as count FROM invoices').get().count;
}

export function create({ invoiceNumber, customerName, amount, status = 'Draft', createdAt }) {
  const id = randomUUID();
  db.prepare(
    'INSERT INTO invoices (id, invoiceNumber, customerName, amount, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, invoiceNumber, customerName, amount, status, createdAt);
  return findById(id);
}

export function update(id, updates) {
  const invoice = findById(id);
  if (!invoice) return null;
  const { customerName, amount, status } = { ...invoice, ...updates };
  db.prepare('UPDATE invoices SET customerName = ?, amount = ?, status = ? WHERE id = ?').run(
    customerName,
    amount,
    status,
    id
  );
  return findById(id);
}

export function remove(id) {
  return db.prepare('DELETE FROM invoices WHERE id = ?').run(id);
}
