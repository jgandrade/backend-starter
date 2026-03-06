import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import * as User from '../models/User.js';
import * as Invoice from '../models/Invoice.js';

export function runSeeds() {
  const now = dayjs().valueOf();

  if (!User.findByEmail('admin@example.com')) {
    User.create({
      email: 'admin@example.com',
      passwordHashed: bcrypt.hashSync('password123', 8),
      role: 'Admin',
      createdAt: now,
    });
  }

  if (!User.findByEmail('accountant@example.com')) {
    User.create({
      email: 'accountant@example.com',
      passwordHashed: bcrypt.hashSync('password123', 8),
      role: 'Accountant',
      createdAt: now,
    });
  }

  if (!User.findByEmail('viewer@example.com')) {
    User.create({
      email: 'viewer@example.com',
      passwordHashed: bcrypt.hashSync('password123', 8),
      role: 'Viewer',
      createdAt: now,
    });
  }

  if (Invoice.count() === 0) {
    Invoice.create({
      invoiceNumber: 'INV-00001',
      customerName: 'Acme Corp',
      amount: 1500,
      status: 'Paid',
      createdAt: now - 86400000 * 3,
    });
    Invoice.create({
      invoiceNumber: 'INV-00002',
      customerName: 'Beta Inc',
      amount: 2300,
      status: 'Sent',
      createdAt: now - 86400000 * 2,
    });
    Invoice.create({
      invoiceNumber: 'INV-00003',
      customerName: 'Gamma LLC',
      amount: 800,
      status: 'Draft',
      createdAt: now - 86400000,
    });
  }
}
