require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker/locale/ro');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const USERS      = 200;
const PETS_EACH  = 3;   // medie per user
const APPTS_EACH = 5;   // medie per pet

async function main() {
  console.log('Incarc date de referinta...');

  const roles    = await prisma.role.findMany();
  const species  = await prisma.species.findMany({ include: { breeds: true } });
  const services = await prisma.service.findMany();
  const statuses = await prisma.appointmentStatus.findMany();

  const ownerRole = roles.find(r => r.name === 'owner');

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const hash = bcrypt.hashSync('faker123', 10);

  console.log(`Creez ${USERS} utilizatori...`);
  const userIds = [];
  for (let i = 0; i < USERS; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'petvet-faker.ro' }),
        phone: '07' + faker.string.numeric(8),
        passwordHash: hash,
        roleId: ownerRole.id,
      }
    });
    userIds.push(user.id);
    if (i % 50 === 0) process.stdout.write(`  ${i}/${USERS}\r`);
  }

  console.log(`\nCreez ~${USERS * PETS_EACH} animale...`);
  const petIds = [];
  for (const userId of userIds) {
    const count = rand(1, PETS_EACH * 2);
    for (let j = 0; j < count; j++) {
      const sp = pick(species);
      const br = sp.breeds.length ? pick(sp.breeds) : null;
      const pet = await prisma.pet.create({
        data: {
          name: faker.person.firstName(),
          speciesId: sp.id,
          breedId: br?.id ?? null,
          age: parseFloat((Math.random() * 15).toFixed(1)),
          weight: parseFloat((Math.random() * 40 + 0.1).toFixed(2)),
          gender: pick(['Mascul', 'Femelă']),
          vaccinated: Math.random() > 0.4,
          ownerId: userId,
        }
      });
      petIds.push(pet.id);
    }
  }

  console.log(`Creez ~${petIds.length * APPTS_EACH} programari...`);
  let apptCount = 0;
  for (const petId of petIds) {
    const count = rand(1, APPTS_EACH * 2);
    for (let k = 0; k < count; k++) {
      const date = faker.date.between({ from: '2024-01-01', to: '2026-12-31' });
      await prisma.appointment.create({
        data: {
          petId,
          serviceId: pick(services).id,
          date,
          time: `${rand(8, 18)}:00`,
          provider: faker.person.fullName(),
          location: faker.location.city() + ' PetVet',
          statusId: pick(statuses).id,
          notes: Math.random() > 0.6 ? faker.lorem.sentence() : null,
        }
      });
      apptCount++;
    }
  }

  const totals = {
    users: await prisma.user.count(),
    pets: await prisma.pet.count(),
    appointments: await prisma.appointment.count(),
  };
  console.log('\nDate generate cu succes:');
  console.log(`  Utilizatori: ${totals.users}`);
  console.log(`  Animale:     ${totals.pets}`);
  console.log(`  Programari:  ${totals.appointments}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
