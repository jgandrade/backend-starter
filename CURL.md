# cURL Examples

Base URL: `http://localhost:3000` (or your deployed URL)

---

## Auth

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123","role":"Viewer"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt
```

### Refresh
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt
```

### Me
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Invoices

### List
```bash
curl -X GET "http://localhost:3000/api/invoices?page=1&limit=10&search=acme&status=Draft" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get by ID
```bash
curl -X GET http://localhost:3000/api/invoices/INVOICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"customerName":"Acme Corp","amount":1500}'
```

### Update
```bash
curl -X PATCH http://localhost:3000/api/invoices/INVOICE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"customerName":"Acme Inc","amount":2000,"status":"Sent"}'
```

### Delete
```bash
curl -X DELETE http://localhost:3000/api/invoices/INVOICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
