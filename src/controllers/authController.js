import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import * as User from '../models/User.js';
import { signAccessToken, signRefreshToken, verify } from '../config/jwt.js';
import { ROLE_PERMISSIONS } from '../types/index.js';
import { getRefreshTokenFromCookie } from '../middleware/auth.js';

const REFRESH_COOKIE = 'refreshToken';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function authResponseHeaders(refreshToken) {
  return {
    'Set-Cookie': `${REFRESH_COOKIE}=${refreshToken}; HttpOnly; Path=/api; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`,
  };
}

function toAuthUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: ROLE_PERMISSIONS[user.role],
    createdAt: user.createdAt,
  };
}

function toJwtPayload(user) {
  return { id: user.id, email: user.email };
}

export async function signup(req, res) {
  const { email, password, role = 'Viewer' } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must contain at least 8 characters' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (await User.findByEmail(email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const passwordHashed = bcrypt.hashSync(password, 8);
  const now = dayjs().valueOf();
  const user = await User.create({ email, passwordHashed, role, createdAt: now });
  const jwtPayload = toJwtPayload(user);
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(jwtPayload),
    signRefreshToken(jwtPayload),
  ]);
  res.set(authResponseHeaders(refreshToken));
  res.status(201).json({ token: accessToken, user: toAuthUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await User.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHashed)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const jwtPayload = toJwtPayload(user);
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(jwtPayload),
    signRefreshToken(jwtPayload),
  ]);
  res.set(authResponseHeaders(refreshToken));
  res.json({ token: accessToken, user: toAuthUser(user) });
}

export async function refresh(req, res) {
  const refreshToken = getRefreshTokenFromCookie(req);
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  try {
    const payload = await verify(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const jwtPayload = toJwtPayload(user);
    const [newAccessToken, newRefreshToken] = await Promise.all([
      signAccessToken(jwtPayload),
      signRefreshToken(jwtPayload),
    ]);
    res.set(authResponseHeaders(newRefreshToken));
    res.json({ token: newAccessToken, user: toAuthUser(user) });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}

export async function me(req, res) {
  const user = await User.findById(req.auth.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(toAuthUser(user));
}
