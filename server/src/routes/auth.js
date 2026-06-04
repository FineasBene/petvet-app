const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../db');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, roleName = 'owner' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Câmpuri obligatorii: name, email, password' });
    if (password.length < 6) return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });

    // Verifică email duplicat înainte de creare
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email deja înregistrat' });

    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) return res.status(400).json({ error: 'Rol invalid' });

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: { name, email, phone: phone || null, passwordHash, roleId: role.id },
      include: { role: true }
    });

    req.session.userId   = user.id;
    req.session.userName = user.name;
    req.session.userRole = user.role.name;

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role.name, token });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email și parola sunt obligatorii' });

    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      try {
        await prisma.failedLogin.create({
          data: { email, ipAddress: (req.ip || '').replace(/^::ffff:/, '') }
        });
        const hourAgo = new Date(Date.now() - 60 * 60_000);
        const attempts = await prisma.failedLogin.count({ where: { email, attemptAt: { gte: hourAgo } } });
        if (attempts >= 5 && user) {
          await prisma.suspiciousUser.upsert({
            where: { userId: user.id },
            update: { reason: `Brute force: ${attempts} failed logins in 1 hour`, flaggedAt: new Date(), resolved: false, resolvedAt: null },
            create: { userId: user.id, reason: `Brute force: ${attempts} failed logins in 1 hour` }
          });
        }
      } catch {}
      return res.status(401).json({ error: 'Email sau parolă incorectă' });
    }

    req.session.userId   = user.id;
    req.session.userName = user.name;
    req.session.userRole = user.role.name;

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role.name, token });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Neautentificat' });
  const u = req.user;
  res.json({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role.name });
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Neautentificat' });
  const token = generateToken({ id: req.user.id, email: req.user.email, role: req.user.role });
  res.json({ token });
});

// ─── 3-WAY AUTH: Password Recovery ───────────────────────────────────────────

// POST /api/auth/forgot-password — generează token de resetare (Way 3)
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email obligatoriu' });

    const user = await prisma.user.findUnique({ where: { email } });
    // Răspuns identic indiferent dacă emailul există (securitate)
    if (!user) return res.json({ message: 'Dacă emailul există, vei primi instrucțiuni de resetare.' });

    // Invalidează tokenele anterioare
    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60_000); // 1 oră

    await prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });

    // În producție s-ar trimite email; pentru demo returnăm token-ul direct
    res.json({
      message: 'Token de resetare generat.',
      resetToken: token, // DEMO ONLY — în producție se trimite pe email
      expiresAt,
    });
  } catch (err) { next(err); }
});

// POST /api/auth/reset-password — resetează parola cu token-ul primit
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token și parolă nouă sunt obligatorii' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });

    const reset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: { include: { role: true } } }
    });

    if (!reset || reset.used || reset.expiresAt < new Date())
      return res.status(400).json({ error: 'Token invalid sau expirat' });

    await prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash: bcrypt.hashSync(newPassword, 10) }
    });

    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });

    // Autentifică automat după resetare (3rd way authentication)
    const jwtToken = generateToken({ id: reset.user.id, email: reset.user.email, role: reset.user.role });
    req.session.userId   = reset.user.id;
    req.session.userName = reset.user.name;
    req.session.userRole = reset.user.role.name;

    res.json({
      message: 'Parola a fost resetată cu succes.',
      token: jwtToken,
      user: { id: reset.user.id, name: reset.user.name, email: reset.user.email, role: reset.user.role.name }
    });
  } catch (err) { next(err); }
});

module.exports = router;
