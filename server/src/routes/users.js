const router = require('express').Router();
const bcrypt = require('bcryptjs');
const prisma = require('../db');
const { logAction } = require('../middleware/logger');

const userSelect = { id: true, name: true, email: true, phone: true, roleId: true, role: true, createdAt: true };

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
    res.json(users);
  } catch (err) { next(err); }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: parseInt(req.params.id) }, select: userSelect });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/users/:id
router.put('/:id', logAction('UPDATE_USER'), async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const data = {};
    if (name     !== undefined) data.name  = name;
    if (phone    !== undefined) data.phone = phone || null;
    if (password !== undefined) {
      if (password.length < 6) return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });
      data.passwordHash = bcrypt.hashSync(password, 10);
    }

    const user = await prisma.user.update({ where: { id: parseInt(req.params.id) }, data, select: userSelect });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE /api/users/:id
router.delete('/:id', logAction('DELETE_USER'), async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
