const router = require('express').Router();
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const { logAction } = require('../middleware/logger');

const petInclude = {
  species: true,
  breed: true,
  owner: { select: { id: true, name: true, email: true } }
};

router.use(requireAuth);

// Owner vede doar propriile animale; vet/admin vede toate
function ownerFilter(req) {
  const role = req.user.role.name;
  if (role === 'owner') return { ownerId: req.user.id };
  return {};
}

// GET /api/pets
router.get('/', async (req, res, next) => {
  try {
    const { speciesId, vaccinated, ownerId, search } = req.query;
    const where = { ...ownerFilter(req) };
    if (speciesId)  where.speciesId  = parseInt(speciesId);
    // owner nu poate vedea animalele altcuiva
    if (ownerId && req.user.role.name !== 'owner') where.ownerId = parseInt(ownerId);
    if (vaccinated !== undefined) where.vaccinated = vaccinated === 'true';
    if (search)     where.name = { contains: search };

    const pets = await prisma.pet.findMany({ where, include: petInclude, orderBy: { createdAt: 'desc' } });
    res.json(pets);
  } catch (err) { next(err); }
});

// GET /api/pets/:id
router.get('/:id', async (req, res, next) => {
  try {
    const pet = await prisma.pet.findUniqueOrThrow({ where: { id: parseInt(req.params.id) }, include: petInclude });
    if (req.user.role.name === 'owner' && pet.ownerId !== req.user.id)
      return res.status(403).json({ error: 'Acces interzis' });
    res.json(pet);
  } catch (err) { next(err); }
});

// POST /api/pets
router.post('/', logAction('CREATE_PET'), async (req, res, next) => {
  try {
    const { name, speciesId, breedId, age, weight, gender, chipId, notes, vaccinated, lastVetVisit, ownerId } = req.body;
    if (!name || !speciesId || age == null || !weight || !gender || !ownerId)
      return res.status(400).json({ error: 'Câmpuri obligatorii: name, speciesId, age, weight, gender, ownerId' });

    // Owner poate adăuga doar animale proprii
    const effectiveOwnerId = req.user.role.name === 'owner' ? req.user.id : parseInt(ownerId);

    const pet = await prisma.pet.create({
      data: {
        name, speciesId: parseInt(speciesId),
        breedId: breedId ? parseInt(breedId) : null,
        age: parseFloat(age), weight: parseFloat(weight),
        gender, chipId: chipId || null, notes: notes || null,
        vaccinated: vaccinated ?? false,
        lastVetVisit: lastVetVisit ? new Date(lastVetVisit) : null,
        ownerId: effectiveOwnerId,
      },
      include: petInclude
    });
    res.status(201).json(pet);
  } catch (err) { next(err); }
});

// PUT /api/pets/:id
router.put('/:id', logAction('UPDATE_PET'), async (req, res, next) => {
  try {
    const existing = await prisma.pet.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return res.status(404).json({ error: 'Animal negăsit' });
    if (req.user.role.name === 'owner' && existing.ownerId !== req.user.id)
      return res.status(403).json({ error: 'Acces interzis' });

    const { name, speciesId, breedId, age, weight, gender, chipId, notes, vaccinated, lastVetVisit } = req.body;
    const data = {};
    if (name         !== undefined) data.name        = name;
    if (speciesId    !== undefined) data.speciesId   = parseInt(speciesId);
    if (breedId      !== undefined) data.breedId     = breedId ? parseInt(breedId) : null;
    if (age          !== undefined) data.age         = parseFloat(age);
    if (weight       !== undefined) data.weight      = parseFloat(weight);
    if (gender       !== undefined) data.gender      = gender;
    if (chipId       !== undefined) data.chipId      = chipId || null;
    if (notes        !== undefined) data.notes       = notes || null;
    if (vaccinated   !== undefined) data.vaccinated  = vaccinated;
    if (lastVetVisit !== undefined) data.lastVetVisit = lastVetVisit ? new Date(lastVetVisit) : null;

    const pet = await prisma.pet.update({ where: { id: parseInt(req.params.id) }, data, include: petInclude });
    res.json(pet);
  } catch (err) { next(err); }
});

// DELETE /api/pets/:id
router.delete('/:id', logAction('DELETE_PET'), async (req, res, next) => {
  try {
    const existing = await prisma.pet.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return res.status(404).json({ error: 'Animal negăsit' });
    if (req.user.role.name === 'owner' && existing.ownerId !== req.user.id)
      return res.status(403).json({ error: 'Acces interzis' });

    await prisma.pet.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
