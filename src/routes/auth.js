import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth, getAuthUser, getAuthHeader } from '../middleware/auth.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.get('/me', async (req, res, next) => {
  const payload = await getAuthUser(getAuthHeader(req));
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.auth = payload;
  next();
}, authController.me);

export default router;
