const router = require('express').Router();
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const NodeCache = require('node-cache');

router.use(requireAuth);

// Cache cu TTL de 60 secunde pentru statistici grele
const statsCache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const [totalPets, totalAppts, totalUsers, vaccinatedPets] = await Promise.all([
      prisma.pet.count(),
      prisma.appointment.count(),
      prisma.user.count(),
      prisma.pet.count({ where: { vaccinated: true } }),
    ]);
    res.json({ totalPets, totalAppointments: totalAppts, totalUsers, vaccinatedPets });
  } catch (err) { next(err); }
});

// GET /api/stats/pets-by-species
router.get('/pets-by-species', async (req, res, next) => {
  try {
    const result = await prisma.pet.groupBy({ by: ['speciesId'], _count: { id: true } });
    const species = await prisma.species.findMany();
    const spMap = Object.fromEntries(species.map(s => [s.id, s.name]));
    res.json(result.map(r => ({ species: spMap[r.speciesId], count: r._count.id })));
  } catch (err) { next(err); }
});

// GET /api/stats/appointments-by-status
router.get('/appointments-by-status', async (req, res, next) => {
  try {
    const result = await prisma.appointment.groupBy({ by: ['statusId'], _count: { id: true } });
    const statuses = await prisma.appointmentStatus.findMany();
    const stMap = Object.fromEntries(statuses.map(s => [s.id, s.name]));
    res.json(result.map(r => ({ status: stMap[r.statusId], count: r._count.id })));
  } catch (err) { next(err); }
});

// GET /api/stats/appointments-by-category
router.get('/appointments-by-category', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({ include: { category: true, appointments: true } });
    const catMap = {};
    for (const svc of services) {
      const cat = svc.category.name;
      catMap[cat] = (catMap[cat] || 0) + svc.appointments.length;
    }
    res.json(Object.entries(catMap).map(([category, count]) => ({ category, count })));
  } catch (err) { next(err); }
});

// GET /api/stats/vaccinated
router.get('/vaccinated', async (req, res, next) => {
  try {
    const [vaccinated, notVaccinated] = await Promise.all([
      prisma.pet.count({ where: { vaccinated: true } }),
      prisma.pet.count({ where: { vaccinated: false } }),
    ]);
    res.json({ vaccinated, notVaccinated });
  } catch (err) { next(err); }
});

// ─── GOLD: Statistică many-to-many grea (Species × Services) ─────────────────

// Versiunea NAIVĂ — fără cache (lentă cu date mari, cedează la DDoS)
router.get('/services-by-species', async (req, res, next) => {
  try {
    const start = Date.now();
    const result = await prisma.$queryRaw`
      SELECT
        sp.name        AS species,
        sv.name        AS service,
        sc.name        AS category,
        COUNT(a.id)    AS apptCount
      FROM Species sp
      JOIN Pet      p  ON p.speciesId  = sp.id
      JOIN Appointment a ON a.petId    = p.id
      JOIN Service  sv ON sv.id        = a.serviceId
      JOIN ServiceCategory sc ON sc.id = sv.categoryId
      GROUP BY sp.id, sp.name, sv.id, sv.name, sc.name
      ORDER BY sp.name, apptCount DESC
    `;
    const ms = Date.now() - start;
    res.json({ data: result.map(r => ({ ...r, apptCount: Number(r.apptCount) })), queryMs: ms, cached: false });
  } catch (err) { next(err); }
});

// Versiunea OPTIMIZATĂ — cu cache în memorie (robustă la DDoS)
router.get('/services-by-species/cached', async (req, res, next) => {
  try {
    const CACHE_KEY = 'services_by_species';
    const cached = statsCache.get(CACHE_KEY);
    if (cached) return res.json({ ...cached, cached: true });

    const start = Date.now();
    const result = await prisma.$queryRaw`
      SELECT
        sp.name        AS species,
        sv.name        AS service,
        sc.name        AS category,
        COUNT(a.id)    AS apptCount
      FROM Species sp
      JOIN Pet      p  ON p.speciesId  = sp.id
      JOIN Appointment a ON a.petId    = p.id
      JOIN Service  sv ON sv.id        = a.serviceId
      JOIN ServiceCategory sc ON sc.id = sv.categoryId
      GROUP BY sp.id, sp.name, sv.id, sv.name, sc.name
      ORDER BY sp.name, apptCount DESC
    `;
    const ms = Date.now() - start;
    const payload = { data: result.map(r => ({ ...r, apptCount: Number(r.apptCount) })), queryMs: ms };
    statsCache.set(CACHE_KEY, payload);
    res.json({ ...payload, cached: false });
  } catch (err) { next(err); }
});

// GET /api/stats/cache-info — pentru demo în JMeter
router.get('/cache-info', (req, res) => {
  res.json({ keys: statsCache.keys(), stats: statsCache.getStats() });
});

module.exports = router;
