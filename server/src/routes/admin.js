const router = require('express').Router();
const prisma = require('../db');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('admin'));

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, phone: true, createdAt: true,
        role: { select: { id: true, name: true } },
        suspicion: { select: { reason: true, flaggedAt: true, resolved: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err) { next(err); }
});

// GET /api/admin/logs
router.get('/logs', async (req, res, next) => {
  try {
    const { userId, limit = 100, offset = 0 } = req.query;
    const where = userId ? { userId: parseInt(userId) } : {};
    const logs = await prisma.actionLog.findMany({
      where,
      include: { user: { select: { name: true, email: true, role: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });
    res.json(logs);
  } catch (err) { next(err); }
});

// GET /api/admin/suspicious
router.get('/suspicious', async (req, res, next) => {
  try {
    const list = await prisma.suspiciousUser.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: { select: { name: true } } } }
      },
      orderBy: { flaggedAt: 'desc' }
    });
    res.json(list);
  } catch (err) { next(err); }
});

// PUT /api/admin/suspicious/:userId/resolve
router.put('/suspicious/:userId/resolve', async (req, res, next) => {
  try {
    const updated = await prisma.suspiciousUser.update({
      where: { userId: parseInt(req.params.userId) },
      data: { resolved: true, resolvedAt: new Date() }
    });
    res.json(updated);
  } catch (err) { next(err); }
});

// GET /api/admin/permissions
router.get('/permissions', async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } } }
    });
    res.json(roles);
  } catch (err) { next(err); }
});

module.exports = router;
