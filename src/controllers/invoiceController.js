import dayjs from 'dayjs';
import * as Invoice from '../models/Invoice.js';
import { VALID_STATUSES, STATUS_ORDER } from '../types/index.js';

const VALID_TRANSITIONS = {
  Draft: ['Sent'],
  Sent: ['Paid'],
  Paid: [],
};

function getQueryParam(params, key, fallback) {
  const val = params[key];
  if (val == null) return fallback;
  return Array.isArray(val) ? val[0] ?? fallback : val;
}

export async function list(req, res) {
  const page = Math.max(1, parseInt(getQueryParam(req.query, 'page', '1'), 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(getQueryParam(req.query, 'limit', '10'), 10) || 10));
  const search = (getQueryParam(req.query, 'search', '') || '').toLowerCase().trim();
  const statusFilter = getQueryParam(req.query, 'status', '');

  let invoices = await Invoice.findAll();

  if (search) {
    invoices = invoices.filter((inv) =>
      inv.customerName.toLowerCase().includes(search)
    );
  }
  if (statusFilter) {
    invoices = invoices.filter((inv) => inv.status === statusFilter);
  }

  invoices = [...invoices].sort((a, b) => {
    const statusDiff = (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0);
    if (statusDiff !== 0) return statusDiff;
    return b.createdAt - a.createdAt;
  });

  const totalCount = invoices.length;
  const start = (page - 1) * limit;
  const items = invoices.slice(start, start + limit).map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerName: inv.customerName,
    amount: inv.amount,
    status: inv.status,
    createdAt: inv.createdAt,
  }));

  res.json({ items, totalCount, page, limit });
}

export async function getById(req, res) {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  res.json({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    amount: invoice.amount,
    status: invoice.status,
    createdAt: invoice.createdAt,
  });
}

export async function create(req, res) {
  const { customerName, amount } = req.body ?? {};
  if (!customerName || amount == null) {
    return res.status(400).json({ error: 'Customer name and amount are required' });
  }
  if (isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Amount must be a number' });
  }
  const count = await Invoice.count();
  const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;
  const now = dayjs().valueOf();
  const invoice = await Invoice.create({
    invoiceNumber,
    customerName: String(customerName).trim(),
    amount: Number(amount),
    status: 'Draft',
    createdAt: now,
  });
  res.status(201).json({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    amount: invoice.amount,
    status: invoice.status,
    createdAt: invoice.createdAt,
  });
}

export async function update(req, res) {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  const body = req.body ?? {};
  const updates = {};
  if (body.customerName != null) updates.customerName = String(body.customerName).trim();
  if (body.amount != null) {
    const amt = Number(body.amount);
    if (isNaN(amt)) return res.status(400).json({ error: 'Amount must be a number' });
    updates.amount = amt;
  }
  if (body.status != null) {
    const newStatus = body.status;
    if (!VALID_STATUSES.includes(newStatus)) {
      return res.status(400).json({ error: `Invalid status: ${newStatus}` });
    }
    const current = invoice.status;
    if (!VALID_TRANSITIONS[current]?.includes(newStatus)) {
      return res
        .status(400)
        .json({ error: `Invalid status transition: ${current} -> ${newStatus}` });
    }
    updates.status = newStatus;
  }
  const updated = await Invoice.update(req.params.id, updates);
  res.json({
    id: updated.id,
    invoiceNumber: updated.invoiceNumber,
    customerName: updated.customerName,
    amount: updated.amount,
    status: updated.status,
    createdAt: updated.createdAt,
  });
}

export async function remove(req, res) {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  await Invoice.remove(req.params.id);
  res.status(204).send();
}
