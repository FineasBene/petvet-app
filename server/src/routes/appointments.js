const router = require('express').Router();
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const apptInclude = {
  pet: { select: { id: true, name: true, ownerId: true } },
  service: { include: { category: true } },
  status: true
};

router.use(requireAuth);

async function canAccessAppt(req, apptId) {
  if (req.user.role.name !== 'owner') return true;
  const appt = await prisma.appointment.findUnique({
    where: { id: apptId },
    include: { pet: { select: { ownerId: true } } }
  });
  return appt && appt.pet.ownerId === req.user.id;
}

// GET /api/appointments
router.get('/', async (req, res, next) => {
  try {
    const { petId, statusId, categoryId, dateFrom, dateTo } = req.query;
    const where = {};

    // Owner vede doar programările animalelor sale
    if (req.user.role.name === 'owner') {
      where.pet = { ownerId: req.user.id };
    }

    if (petId)      where.petId    = parseInt(petId);
    if (statusId)   where.statusId = parseInt(statusId);
    if (categoryId) where.service  = { categoryId: parseInt(categoryId) };
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo)   where.date.lte = new Date(dateTo);
    }

    const appts = await prisma.appointment.findMany({ where, include: apptInclude, orderBy: { date: 'desc' } });
    res.json(appts);
  } catch (err) { next(err); }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const appt = await prisma.appointment.findUniqueOrThrow({ where: { id: parseInt(req.params.id) }, include: apptInclude });
    if (req.user.role.name === 'owner' && appt.pet.ownerId !== req.user.id)
      return res.status(403).json({ error: 'Acces interzis' });
    res.json(appt);
  } catch (err) { next(err); }
});

// POST /api/appointments
router.post('/', logAction('CREATE_APPT'), async (req, res, next) => {
  try {
    const { petId, serviceId, date, time, provider, location, statusId, notes } = req.body;
    if (!petId || !serviceId || !date || !time || !provider || !location || !statusId)
      return res.status(400).json({ error: 'Câmpuri obligatorii: petId, serviceId, date, time, provider, location, statusId' });

    // Owner poate programa doar pentru animalele proprii
    if (req.user.role.name === 'owner') {
      const pet = await prisma.pet.findUnique({ where: { id: parseInt(petId) } });
      if (!pet || pet.ownerId !== req.user.id)
        return res.status(403).json({ error: 'Acces interzis' });
    }

    const appt = await prisma.appointment.create({
      data: {
        petId: parseInt(petId), serviceId: parseInt(serviceId),
        date: new Date(date), time, provider, location,
        statusId: parseInt(statusId), notes: notes || null
      },
      include: apptInclude
    });
    res.status(201).json(appt);
  } catch (err) { next(err); }
});

// PUT /api/appointments/:id
router.put('/:id', logAction('UPDATE_APPT'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!(await canAccessAppt(req, id)))
      return res.status(403).json({ error: 'Acces interzis' });

    const { petId, serviceId, date, time, provider, location, statusId, notes } = req.body;
    const data = {};
    if (petId     !== undefined) data.petId     = parseInt(petId);
    if (serviceId !== undefined) data.serviceId = parseInt(serviceId);
    if (date      !== undefined) data.date      = new Date(date);
    if (time      !== undefined) data.time      = time;
    if (provider  !== undefined) data.provider  = provider;
    if (location  !== undefined) data.location  = location;
    if (statusId  !== undefined) data.statusId  = parseInt(statusId);
    if (notes     !== undefined) data.notes     = notes || null;

    const appt = await prisma.appointment.update({ where: { id }, data, include: apptInclude });
    res.json(appt);
  } catch (err) { next(err); }
});

// DELETE /api/appointments/:id
router.delete('/:id', logAction('DELETE_APPT'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!(await canAccessAppt(req, id)))
      return res.status(403).json({ error: 'Acces interzis' });

    await prisma.appointment.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
