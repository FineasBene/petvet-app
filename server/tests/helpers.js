const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedTestDb() {
  // Roles
  const roles = await Promise.all(
    ['admin', 'owner', 'vet'].map(name =>
      prisma.role.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));

  // Species
  const speciesNames = ['Câine', 'Pisică', 'Papagal'];
  const speciesObjs = await Promise.all(
    speciesNames.map(name => prisma.species.upsert({ where: { name }, update: {}, create: { name } }))
  );
  const speciesMap = Object.fromEntries(speciesObjs.map(s => [s.name, s.id]));

  // Breed
  const breed = await prisma.breed.upsert({
    where: { name_speciesId: { name: 'Labrador', speciesId: speciesMap['Câine'] } },
    update: {},
    create: { name: 'Labrador', speciesId: speciesMap['Câine'] }
  });

  // Service category & service
  const catGrooming = await prisma.serviceCategory.upsert({ where: { name: 'grooming' }, update: {}, create: { name: 'grooming' } });
  const catMedical  = await prisma.serviceCategory.upsert({ where: { name: 'medical'  }, update: {}, create: { name: 'medical'  } });
  const svc1 = await prisma.service.upsert({
    where: { name_categoryId: { name: 'Tuns complet', categoryId: catGrooming.id } },
    update: {}, create: { name: 'Tuns complet', categoryId: catGrooming.id }
  });
  const svc2 = await prisma.service.upsert({
    where: { name_categoryId: { name: 'Vaccinare', categoryId: catMedical.id } },
    update: {}, create: { name: 'Vaccinare', categoryId: catMedical.id }
  });

  // Statuses
  const statusNames = ['Confirmată', 'În așteptare', 'Anulată', 'Finalizată'];
  const statusObjs = await Promise.all(
    statusNames.map(name => prisma.appointmentStatus.upsert({ where: { name }, update: {}, create: { name } }))
  );
  const statusMap = Object.fromEntries(statusObjs.map(s => [s.name, s.id]));

  // User
  const user = await prisma.user.upsert({
    where: { email: 'test@petvet.ro' },
    update: {},
    create: { name: 'Test User', email: 'test@petvet.ro', passwordHash: bcrypt.hashSync('test123', 10), roleId: roleMap.owner }
  });

  return { roleMap, speciesMap, breedId: breed.id, svc1, svc2, statusMap, user };
}

async function cleanTestDb() {
  await prisma.appointment.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();
}

module.exports = { prisma, seedTestDb, cleanTestDb };
