import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { initSchema } from '../config/database.js';
import * as User from '../models/User.js';
import * as Invoice from '../models/Invoice.js';

export async function runSeeds() {
  await initSchema();

  const now = dayjs().valueOf();

  if (!(await User.findByEmail('admin@example.com'))) {
    await User.create({
      email: 'admin@example.com',
      passwordHashed: bcrypt.hashSync('password123', 8),
      role: 'Admin',
      createdAt: now,
    });
  }

  if (!(await User.findByEmail('accountant@example.com'))) {
    await User.create({
      email: 'accountant@example.com',
      passwordHashed: bcrypt.hashSync('password123', 8),
      role: 'Accountant',
      createdAt: now,
    });
  }

  if (!(await User.findByEmail('viewer@example.com'))) {
    await User.create({
      email: 'viewer@example.com',
      passwordHashed: bcrypt.hashSync('password123', 8),
      role: 'Viewer',
      createdAt: now,
    });
  }

  if ((await Invoice.count()) === 0) {
    await Invoice.create({
      invoiceNumber: 'INV-00001',
      customerName: 'Acme Corp',
      amount: 1500,
      status: 'Paid',
      createdAt: now - 86400000 * 3,
    });
    await Invoice.create({
      invoiceNumber: 'INV-00002',
      customerName: 'Beta Inc',
      amount: 2300,
      status: 'Sent',
      createdAt: now - 86400000 * 2,
    });
    await Invoice.create({
      invoiceNumber: 'INV-00003',
      customerName: 'Gamma LLC',
      amount: 800,
      status: 'Draft',
      createdAt: now - 86400000,
    });
  }
}
