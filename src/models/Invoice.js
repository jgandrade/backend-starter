import { sql } from '../config/database.js';
import { randomUUID } from 'crypto';

export async function findAll() {
  const { rows } = await sql`SELECT * FROM invoices`;
  return rows;
}

export async function findById(id) {
  const { rows } = await sql`SELECT * FROM invoices WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function count() {
  const { rows } = await sql`SELECT COUNT(*) as count FROM invoices`;
  return Number(rows[0]?.count ?? 0);
}

export async function create({ invoiceNumber, customerName, amount, status = 'Draft', createdAt }) {
  const id = randomUUID();
  await sql`
    INSERT INTO invoices (id, "invoiceNumber", "customerName", amount, status, "createdAt")
    VALUES (${id}, ${invoiceNumber}, ${customerName}, ${amount}, ${status}, ${createdAt})
  `;
  return await findById(id);
}

export async function update(id, updates) {
  const invoice = await findById(id);
  if (!invoice) return null;
  const { customerName, amount, status } = { ...invoice, ...updates };
  await sql`
    UPDATE invoices
    SET "customerName" = ${customerName}, amount = ${amount}, status = ${status}
    WHERE id = ${id}
  `;
  return await findById(id);
}

export async function remove(id) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
}
