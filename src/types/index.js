export const VALID_STATUSES = ['Draft', 'Sent', 'Paid'];

export const STATUS_ORDER = {
  Draft: 0,
  Sent: 1,
  Paid: 2
};

export const ROLE_PERMISSIONS = {
  Viewer: ['invoices:read'],
  Accountant: ['invoices:read', 'invoices:create', 'invoices:update'],
  Admin: ['invoices:read', 'invoices:create', 'invoices:update', 'invoices:delete']
};
