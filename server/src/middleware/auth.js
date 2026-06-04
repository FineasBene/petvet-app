const jwt = require('jsonwebtoken');
const prisma = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'petvet-jwt-secret-2024';
const JWT_EXPIRY = '30m';

function generateToken(user) {
  const roleName = user.role?.name || user.role;
  // Include permissions in token for different permission schemes per role
  const permissions = (user.role?.permissions || [])
    .map(rp => rp.permission?.name || rp)
    .filter(p => typeof p === 'string');
  return jwt.sign(
    { id: user.id, email: user.email, role: roleName, permissions },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

async function loadUser(req, res, next) {
  req.user = null;

  // 1. Verifică JWT din headerul Authorization
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });
      if (req.user) return next();
    } catch {
      // JWT invalid sau expirat — încearcă sesiunea
    }
  }

  // 2. Fallback la sesiune
  if (req.session?.userId) {
    try {
      req.user = await prisma.user.findUnique({
        where: { id: req.session.userId },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });
    } catch {}
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Neautentificat' });
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Neautentificat' });
    if (!roles.includes(req.user.role.name)) return res.status(403).json({ error: 'Acces interzis' });
    next();
  };
}

module.exports = { loadUser, requireAuth, requireRole, generateToken, JWT_SECRET };
