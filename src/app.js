import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import invoiceRoutes from './routes/invoices.js';
import { runSeeds } from './seeds/index.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

runSeeds();

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);

export default app;
