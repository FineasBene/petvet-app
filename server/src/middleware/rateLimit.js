const prisma = require('../db');

// In-memory request counter: { key -> { count, resetAt } }
const counters = new Map();

const WINDOW_MS  = 60_000; // 1 minut
const MAX_REQ    = 60;     // max 60 cereri/minut per user/IP
const DDOS_REQ   = 200;    // pragul DDoS

function getKey(req) {
  return req.user ? `u:${req.user.id}` : `ip:${(req.ip || '').replace(/^::ffff:/, '')}`;
}

function getCount(key) {
  const now = Date.now();
  const entry = counters.get(key);
  if (!entry || now > entry.resetAt) {
    counters.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return 1;
  }
  entry.count++;
  return entry.count;
}

// Curăță map-ul la fiecare 5 minute
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of counters) {
    if (now > v.resetAt) counters.delete(k);
  }
}, 5 * 60_000);

async function rateLimit(req, res, next) {
  const key = getKey(req);
  const count = getCount(key);

  if (count > DDOS_REQ) {
    return res.status(429).json({ error: 'Prea multe cereri. Blocat temporar.' });
  }

  if (count > MAX_REQ && req.user) {
    flagSuspicious(req.user.id, `Rate limit: ${count} req/min de la IP ${(req.ip||'').replace(/^::ffff:/,'')}`).catch(() => {});
  }

  next();
}

async function flagSuspicious(userId, reason) {
  try {
    await prisma.suspiciousUser.upsert({
      where: { userId },
      update: { reason, flaggedAt: new Date(), resolved: false, resolvedAt: null },
      create: { userId, reason },
    });
  } catch {}
}

module.exports = rateLimit;
