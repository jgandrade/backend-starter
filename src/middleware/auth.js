import { verify } from '../config/jwt.js';

const REFRESH_COOKIE = 'refreshToken';

export function getAuthHeader(req) {
  return req.headers?.authorization ?? null;
}

export function getRefreshTokenFromCookie(req) {
  const cookie = req.headers?.cookie ?? '';
  const match = cookie.match(new RegExp(`${REFRESH_COOKIE}=([^;]+)`));
  return match ? match[1].trim() : null;
}

export async function getAuthUser(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.slice(7);
    const payload = await verify(token);
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth() {
  return async (req, res, next) => {
    const payload = await getAuthUser(getAuthHeader(req));
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.auth = payload;
    next();
  };
}

export function requireRole(roles, options = {}) {
  const roleList = Array.isArray(roles) ? roles : [roles];
  const message = options.message ?? 'Forbidden: insufficient permissions';
  return async (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { findById } = await import('../models/User.js');
    const user = findById(req.auth.id);
    if (!user || !roleList.includes(user.role)) {
      return res.status(403).json({ error: message });
    }
    req.user = user;
    next();
  };
}
