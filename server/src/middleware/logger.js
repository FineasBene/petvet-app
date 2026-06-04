const prisma = require('../db');

function logAction(action) {
  return async (req, res, next) => {
    if (req.user) {
      const details = { path: req.path };
      if (Object.keys(req.params || {}).length) details.params = req.params;
      try {
        await prisma.actionLog.create({
          data: {
            userId: req.user.id,
            groupId: req.user.role.name,
            action,
            details,
            ipAddress: (req.ip || '').replace(/^::ffff:/, '')
          }
        });
        detectMalicious(req.user.id, action).catch(() => {});
      } catch {}
    }
    next();
  };
}

async function detectMalicious(userId, action) {
  const fiveMin = new Date(Date.now() - 5 * 60_000);

  if (action.startsWith('DELETE')) {
    const count = await prisma.actionLog.count({
      where: { userId, action: { startsWith: 'DELETE' }, createdAt: { gte: fiveMin } }
    });
    if (count >= 5) {
      await flagUser(userId, `Mass deletion detected: ${count} deletes in 5 minutes`);
    }
  }

  if (action === 'CREATE_PET' || action === 'CREATE_APPT') {
    const count = await prisma.actionLog.count({
      where: { userId, action, createdAt: { gte: fiveMin } }
    });
    if (count >= 20) {
      await flagUser(userId, `Rapid resource creation: ${count} creates in 5 minutes`);
    }
  }
}

async function flagUser(userId, reason) {
  await prisma.suspiciousUser.upsert({
    where: { userId },
    update: { reason, flaggedAt: new Date(), resolved: false, resolvedAt: null },
    create: { userId, reason }
  });
}

module.exports = { logAction };
