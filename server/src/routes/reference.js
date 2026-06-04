const router = require('express').Router();
const prisma = require('../db');

// Date de referință: species, breeds, services, statuses
router.get('/species', async (req, res, next) => {
  try { res.json(await prisma.species.findMany({ include: { breeds: true } })); }
  catch (err) { next(err); }
});

router.get('/services', async (req, res, next) => {
  try { res.json(await prisma.service.findMany({ include: { category: true } })); }
  catch (err) { next(err); }
});

router.get('/categories', async (req, res, next) => {
  try { res.json(await prisma.serviceCategory.findMany()); }
  catch (err) { next(err); }
});

router.get('/statuses', async (req, res, next) => {
  try { res.json(await prisma.appointmentStatus.findMany()); }
  catch (err) { next(err); }
});

router.get('/roles', async (req, res, next) => {
  try { res.json(await prisma.role.findMany()); }
  catch (err) { next(err); }
});

module.exports = router;
