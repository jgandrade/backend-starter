import { sql } from '@vercel/postgres';

export { sql };

export async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      "passwordHashed" TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Viewer',
      "createdAt" BIGINT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      "invoiceNumber" TEXT NOT NULL,
      "customerName" TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Draft',
      "createdAt" BIGINT NOT NULL
    )
  `;
}
